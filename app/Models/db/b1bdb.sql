-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 18-05-2018 a las 05:18:17
-- Versión del servidor: 10.0.33-MariaDB-0ubuntu0.16.04.1
-- Versión de PHP: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `b1bdb`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`%` PROCEDURE `ProcesarPagoDiario` ()  BEGIN
	
UPDATE `investment_timeline` it
INNER JOIN `investments` i on i.id = it.`investment_id`
SET it.paid  = 1 
WHERE it.`transaction_date` = DATE(NOW()) and i.`investment_state_id` = 2;
INSERT INTO `execute_logs`(`date_time`, `log`) VALUES(NOW(), concat("Release Daily Payment (CRON JOB), AFFECTED: ", ROW_COUNT()));
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `ProcesarPagoDiarioOld` ()  BEGIN
	DECLARE p_diferencia INT DEFAULT 0;
	DECLARE p_investment_id INT;
	DECLARE p_daily_return_amount DECIMAL(19,8);
	DECLARE p_customer_id INT;
	
	
	DECLARE done INT DEFAULT 0;
	DECLARE sum_investment_return DECIMAL(19,8);
	DECLARE p_expected_return_amount DECIMAL(19,8);
	DECLARE logger LONGBLOB;
	DECLARE p_return_code INT;
	DECLARE logid BIGINT;
	
	
	DECLARE cur1 CURSOR FOR SELECT DATEDIFF(NOW(), i.approval_date) diferencia, i.id investment_id, i.daily_return_amount, i.customer_id FROM  `investments` i WHERE i.investment_state_id = 2 AND i.approval_date < NOW() AND 
	DATEDIFF(NOW(), i.approval_date) < i.qty_days_investment AND i.id NOT IN (SELECT `investment_id` FROM `general_ledger` WHERE DATE(`transaction_date`) = DATE(NOW()) AND `concept_id` = 1);
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
	OPEN cur1;
	
	INSERT INTO `execute_logs`(`date_time`, `log`) VALUES(NOW(), "Cliente\tInversión\tDiferencia\tPago Diario\tRes Exec");
	SELECT LAST_INSERT_ID() INTO logid;
	IF DAYOFWEEK(NOW()) IN (2,3,4,5,6,7) THEN
	read_loop: LOOP
	    FETCH cur1 INTO p_diferencia, p_investment_id, p_daily_return_amount, p_customer_id;
		IF done = 1 THEN
		    LEAVE read_loop;
		END IF;
				SELECT makeDailyPayment(p_diferencia, p_investment_id, p_daily_return_amount, p_customer_id) INTO p_return_code;
		
				UPDATE `execute_logs` SET `log` = CONCAT(`log`, "\n", p_customer_id, "\t", p_investment_id, "\t", IFNULL(p_diferencia, "NULL"), "\t", p_daily_return_amount, "\t", p_return_code) WHERE id = logid;
	END LOOP;	END IF;
	CLOSE cur1;	
    END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`%` FUNCTION `existsPayment` (`p_investment_id` INT(11), `p_transaction_date` DATETIME, `p_concept_id` INT(11)) RETURNS TINYINT(1) BEGIN
	
	if (select count(*) from `general_ledger` where `investment_id` = p_investment_id and date(`transaction_date`) = date(p_transaction_date) and concept_id = p_concept_id) > 0 then 
		return true;
	else
		return false;
	end if;
    END$$

CREATE DEFINER=`globekriptobotnd`@`%` FUNCTION `falta` (`p_investment_id` INT) RETURNS INT(11) NO SQL
BEGIN
	DECLARE pagado DECIMAL(19,8);
	DECLARE referidos DECIMAL(19,8);
	DECLARE esperado DECIMAL(19,8);
	
	SELECT SUM(`investment_timeline`.`amount`) into pagado FROM `investment_timeline` WHERE (`investment_timeline`.`investment_id` = p_investment_id AND `investment_timeline`.`paid` = 1);
	SELECT SUM(`investment_referred_payments`.`amount`) into referidos FROM `investment_referred_payments` WHERE (`investment_referred_payments`.`investment_id` = p_investment_id );
	SELECT `expected_return_amount` into esperado FROM `investments` WHERE id = p_investment_id;
	
	IF (esperado = NULL) THEN
    	set esperado=0;
    END IF;
	
	IF (esperado >0 ) THEN
		IF (pagado >0 ) THEN
			IF (referidos >0 ) THEN
				return (esperado - pagado - referidos);
			ELSE
				return (esperado - pagado);
			END IF;
		ELSE
			IF (referidos >0 ) THEN
				return (esperado  - referidos);
			ELSE
				return (esperado);
			END IF;
		END IF;
	ELSE
		return -1;
	END IF;

END$$

CREATE DEFINER=`root`@`%` FUNCTION `getParameter` (`p_key` VARCHAR(140)) RETURNS VARCHAR(2000) CHARSET utf8 BEGIN
	declare v_value varchar(2000);
	
	select `value` into v_value from `settings` where `key` = p_key;
	
	return v_value;
    END$$

CREATE DEFINER=`root`@`%` FUNCTION `makeDailyPayment` (`p_diferencia` DATETIME, `p_investment_id` INT(11), `p_daily_return_amount` DECIMAL(19,8), `p_customer_id` INT(11)) RETURNS INT(1) BEGIN
	
	DECLARE sum_investment_return DECIMAL(19,8);
	DECLARE p_expected_return_amount DECIMAL(19,8);
	
	IF `existsPayment`(p_investment_id, NOW(), 1) =0 THEN
				SELECT SUM(amount) INTO sum_investment_return FROM general_ledger WHERE investment_id = p_investment_id;
		
				SELECT `expected_return_amount` INTO p_expected_return_amount FROM `investments` WHERE id = p_investment_id;
		
				IF sum_investment_return < p_expected_return_amount THEN
			
									IF p_daily_return_amount > (p_expected_return_amount - sum_investment_return) THEN 
								SET p_daily_return_amount = p_expected_return_amount - sum_investment_return;
				
			END IF;
			
						INSERT INTO general_ledger(transaction_date, customer_id, investment_id, amount, concept_id) 
			VALUES (NOW(), p_customer_id, p_investment_id, p_daily_return_amount, 1);
			
			RETURN 1;
		else
			return 3;
		END IF;
		
		
		
	else 
				return 2;
	END IF;
    END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `beneficiary`
--

CREATE TABLE `beneficiary` (
  `id` int(11) NOT NULL,
  `id_beneficiary` varchar(150) DEFAULT NULL,
  `name_beneficiary` varchar(100) NOT NULL,
  `relationship` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `identificacion` varchar(250) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `beneficiary`
--

INSERT INTO `beneficiary` (`id`, `id_beneficiary`, `name_beneficiary`, `relationship`, `user_id`, `identificacion`, `created_at`, `updated_at`) VALUES
(2, NULL, 'Carlos Guaderrama', 'Padre', 310, '561216900', '2018-01-24 13:34:29', '2018-02-14 03:03:33'),
(3, NULL, 'sdf', 'sdfsdf', 310, 'dfsdfsdf', '2018-01-24 13:35:49', '2018-01-24 13:35:49'),
(4, NULL, 'luis', 'dfghdfhgdfhg', 215, 'dfghdfhdfh', '2018-01-30 03:03:52', '2018-01-30 03:03:52'),
(5, NULL, 'veronica lema', 'esposa', 215, '1721067252', '2018-02-09 02:56:46', '2018-02-09 02:56:46'),
(6, NULL, 'sdfsdf', 'fsdfsdfsdf', 310, '123123', '2018-02-14 02:37:46', '2018-02-14 02:37:46'),
(7, NULL, 'leonardo', 'papa', 313, '232421341234', '2018-02-14 05:10:55', '2018-02-14 05:10:55'),
(8, NULL, 'Veronica', 'Esposa', 315, '172106', '2018-02-19 03:00:56', '2018-02-19 03:00:56'),
(9, NULL, 'veronica lema', 'esposita', 316, '1231321231321', '2018-03-27 02:50:51', '2018-03-27 02:50:51'),
(10, NULL, 'Alejandra', 'novia', 319, '1031202310123032', '2018-05-15 04:50:25', '2018-05-15 04:50:25'),
(11, NULL, 'Lucia', 'Madre', 319, '12312313123', '2018-05-15 04:50:46', '2018-05-15 04:50:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clavedepago`
--

CREATE TABLE `clavedepago` (
  `id` int(11) NOT NULL,
  `clave_de_pago` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `clavedepago`
--

INSERT INTO `clavedepago` (`id`, `clave_de_pago`) VALUES
(1, 'clave');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concepts`
--

CREATE TABLE `concepts` (
  `id` int(11) NOT NULL,
  `name` varchar(140) NOT NULL,
  `description` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `concepts`
--

INSERT INTO `concepts` (`id`, `name`, `description`) VALUES
(1, 'Pago Diario por Inversión', NULL),
(2, 'Pago por Referido Nivel 1', NULL),
(3, 'Pago por Referido Nivel 2', NULL),
(4, 'Pago por Referido Nivel 3', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `countries`
--

INSERT INTO `countries` (`id`, `name`) VALUES
(503, 'Afghanistan'),
(504, 'Albania'),
(505, 'Algeria'),
(506, 'American Samoa'),
(507, 'Andorra'),
(508, 'Angola'),
(509, 'Anguilla'),
(510, 'Antarctica'),
(511, 'Antigua and Barbuda'),
(512, 'Argentina'),
(513, 'Armenia'),
(514, 'Aruba'),
(515, 'Australia'),
(516, 'Austria'),
(517, 'Azerbaijan'),
(518, 'Bahamas'),
(519, 'Bahrain'),
(520, 'Bangladesh'),
(521, 'Barbados'),
(522, 'Belarus'),
(523, 'Belgium'),
(524, 'Belize'),
(525, 'Benin'),
(526, 'Bermuda'),
(527, 'Bhutan'),
(528, 'Bolivia'),
(529, 'Bosnia and Herzegovina'),
(530, 'Botswana'),
(531, 'Bouvet Island'),
(532, 'Brazil'),
(533, 'British Indian Ocean Territory'),
(534, 'Brunei Darussalam'),
(535, 'Bulgaria'),
(536, 'Burkina Faso'),
(537, 'Burundi'),
(538, 'Cambodia'),
(539, 'Cameroon'),
(540, 'Canada'),
(541, 'Cape Verde'),
(542, 'Cayman Islands'),
(543, 'Central African Republic'),
(544, 'Chad'),
(545, 'Chile'),
(546, 'China'),
(547, 'Christmas Island'),
(548, 'Cocos (Keeling) Islands'),
(549, 'Colombia'),
(550, 'Comoros'),
(551, 'Congo'),
(552, 'Cook Islands'),
(553, 'Costa Rica'),
(554, 'Croatia (Hrvatska)'),
(555, 'Cuba'),
(556, 'Cyprus'),
(557, 'Czech Republic'),
(558, 'Denmark'),
(559, 'Djibouti'),
(560, 'Dominica'),
(561, 'Dominican Republic'),
(562, 'East Timor'),
(12, 'Ecuador'),
(563, 'Egypt'),
(13, 'El Salvador'),
(564, 'Equatorial Guinea'),
(565, 'Eritrea'),
(566, 'Estonia'),
(567, 'Ethiopia'),
(568, 'Falkland Islands (Malvinas)'),
(569, 'Faroe Islands'),
(570, 'Fiji'),
(571, 'Finland'),
(572, 'France'),
(573, 'France, Metropolitan'),
(574, 'French Guiana'),
(575, 'French Polynesia'),
(576, 'French Southern Territories'),
(577, 'Gabon'),
(578, 'Gambia'),
(579, 'Georgia'),
(580, 'Germany'),
(581, 'Ghana'),
(582, 'Gibraltar'),
(584, 'Greece'),
(585, 'Greenland'),
(586, 'Grenada'),
(587, 'Guadeloupe'),
(588, 'Guam'),
(589, 'Guatemala'),
(583, 'Guernsey'),
(590, 'Guinea'),
(591, 'Guinea-Bissau'),
(592, 'Guyana'),
(593, 'Haiti'),
(594, 'Heard and Mc Donald Islands'),
(595, 'Honduras'),
(596, 'Hong Kong'),
(597, 'Hungary'),
(598, 'Iceland'),
(599, 'India'),
(601, 'Indonesia'),
(602, 'Iran (Islamic Republic of)'),
(603, 'Iraq'),
(604, 'Ireland'),
(600, 'Isle of Man'),
(605, 'Israel'),
(606, 'Italy'),
(607, 'Ivory Coast'),
(609, 'Jamaica'),
(610, 'Japan'),
(608, 'Jersey'),
(611, 'Jordan'),
(612, 'Kazakhstan'),
(613, 'Kenya'),
(614, 'Kiribati'),
(615, 'Korea, Democratic People\'s Republic of'),
(616, 'Korea, Republic of'),
(617, 'Kosovo'),
(618, 'Kuwait'),
(619, 'Kyrgyzstan'),
(620, 'Lao People\'s Democratic Republic'),
(621, 'Latvia'),
(622, 'Lebanon'),
(623, 'Lesotho'),
(624, 'Liberia'),
(625, 'Libyan Arab Jamahiriya'),
(626, 'Liechtenstein'),
(627, 'Lithuania'),
(628, 'Luxembourg'),
(629, 'Macau'),
(630, 'Macedonia'),
(631, 'Madagascar'),
(632, 'Malawi'),
(633, 'Malaysia'),
(634, 'Maldives'),
(635, 'Mali'),
(636, 'Malta'),
(637, 'Marshall Islands'),
(638, 'Martinique'),
(639, 'Mauritania'),
(640, 'Mauritius'),
(641, 'Mayotte'),
(642, 'Mexico'),
(643, 'Micronesia, Federated States of'),
(644, 'Moldova, Republic of'),
(645, 'Monaco'),
(646, 'Mongolia'),
(647, 'Montenegro'),
(648, 'Montserrat'),
(649, 'Morocco'),
(650, 'Mozambique'),
(651, 'Myanmar'),
(652, 'Namibia'),
(653, 'Nauru'),
(654, 'Nepal'),
(655, 'Netherlands'),
(656, 'Netherlands Antilles'),
(657, 'New Caledonia'),
(658, 'New Zealand'),
(659, 'Nicaragua'),
(660, 'Niger'),
(661, 'Nigeria'),
(662, 'Niue'),
(663, 'Norfolk Island'),
(664, 'Northern Mariana Islands'),
(665, 'Norway'),
(666, 'Oman'),
(667, 'Pakistan'),
(668, 'Palau'),
(669, 'Palestine'),
(670, 'Panama'),
(671, 'Papua New Guinea'),
(672, 'Paraguay'),
(673, 'Peru'),
(674, 'Philippines'),
(675, 'Pitcairn'),
(676, 'Poland'),
(677, 'Portugal'),
(678, 'Puerto Rico'),
(679, 'Qatar'),
(680, 'Reunion'),
(681, 'Romania'),
(682, 'Russian Federation'),
(683, 'Rwanda'),
(684, 'Saint Kitts and Nevis'),
(685, 'Saint Lucia'),
(686, 'Saint Vincent and the Grenadines'),
(687, 'Samoa'),
(688, 'San Marino'),
(689, 'Sao Tome and Principe'),
(690, 'Saudi Arabia'),
(691, 'Senegal'),
(692, 'Serbia'),
(693, 'Seychelles'),
(694, 'Sierra Leone'),
(695, 'Singapore'),
(696, 'Slovakia'),
(697, 'Slovenia'),
(698, 'Solomon Islands'),
(699, 'Somalia'),
(700, 'South Africa'),
(701, 'South Georgia South Sandwich Islands'),
(702, 'Spain'),
(703, 'Sri Lanka'),
(704, 'St. Helena'),
(705, 'St. Pierre and Miquelon'),
(706, 'Sudan'),
(707, 'Suriname'),
(708, 'Svalbard and Jan Mayen Islands'),
(709, 'Swaziland'),
(710, 'Sweden'),
(711, 'Switzerland'),
(712, 'Syrian Arab Republic'),
(713, 'Taiwan'),
(714, 'Tajikistan'),
(715, 'Tanzania, United Republic of'),
(716, 'Thailand'),
(717, 'Togo'),
(718, 'Tokelau'),
(719, 'Tonga'),
(720, 'Trinidad and Tobago'),
(721, 'Tunisia'),
(722, 'Turkey'),
(723, 'Turkmenistan'),
(724, 'Turks and Caicos Islands'),
(725, 'Tuvalu'),
(726, 'Uganda'),
(727, 'Ukraine'),
(728, 'United Arab Emirates'),
(729, 'United Kingdom'),
(730, 'United States'),
(731, 'United States minor outlying islands'),
(732, 'Uruguay'),
(733, 'Uzbekistan'),
(734, 'Vanuatu'),
(735, 'Vatican City State'),
(736, 'Venezuela'),
(737, 'Vietnam'),
(738, 'Virgin Islands (British)'),
(739, 'Virgin Islands (U.S.)'),
(740, 'Wallis and Futuna Islands'),
(741, 'Western Sahara'),
(742, 'Yemen'),
(743, 'Zaire'),
(744, 'Zambia'),
(745, 'Zimbabwe');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customers`
--

CREATE TABLE `customers` (
  `user_id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `first_name` varchar(140) NOT NULL,
  `last_name` varchar(140) NOT NULL,
  `city` varchar(140) DEFAULT NULL,
  `country_id` int(11) NOT NULL,
  `phone` varchar(25) DEFAULT NULL,
  `bitcoin_wallet` varchar(250) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `username` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `customers`
--

INSERT INTO `customers` (`user_id`, `cliente_id`, `first_name`, `last_name`, `city`, `country_id`, `phone`, `bitcoin_wallet`, `created_at`, `updated_at`, `username`) VALUES
(215, NULL, 'juan', 'fernando', 'quito', 12, '995850151', '478521365478lkhxdsfc5478521jksasdf', '2017-10-04 12:55:45', '2017-10-04 12:55:45', 'fher'),
(310, NULL, 'carlos', 'guaderrama', 'Miami', 503, '4166069270', NULL, '2018-03-31 01:51:15', '2018-03-30 23:51:15', 'carlos'),
(311, NULL, 'Byron', 'Padilla', 'Quito', 12, '0984241909', 'asfasdfasdfsadfasdfasdf', '2018-01-24 13:45:14', '2018-01-24 13:45:14', 'byron'),
(313, NULL, 'leonardo', 'quintero', 'Seleccione una provincia', 736, '6165456156', '9034fm34omk2039md2kl23', '2018-02-05 15:27:44', '2018-02-05 15:27:44', 'leoquin26'),
(315, NULL, 'PEPITO', 'PAEZ', 'QUITO', 503, '34563465', 'awedfsgsdfgsdfg', '2018-02-19 03:00:25', '2018-02-19 02:00:25', 'jfp'),
(316, NULL, 'fhernandosc', 'añslkdj', 'quito', 503, '1212341234', NULL, '2018-03-27 00:48:32', '2018-03-27 00:48:32', 'jfpasas'),
(318, NULL, 'yaimali', 'blanco', 'Caracas', 503, '04129139033', NULL, '2018-04-03 01:24:20', '2018-04-03 01:24:20', 'yaiblanco'),
(319, NULL, 'Daniel', 'Torres', 'Bolivar', 736, '1231231231', NULL, '2018-05-15 02:45:13', '2018-05-15 02:45:13', 'danielt');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `execute_logs`
--

CREATE TABLE `execute_logs` (
  `id` bigint(20) NOT NULL,
  `date_time` datetime DEFAULT NULL,
  `log` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `general_ledger`
--

CREATE TABLE `general_ledger` (
  `id` bigint(20) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `customer_id` int(11) NOT NULL,
  `investment_id` int(11) NOT NULL,
  `concept_id` int(11) NOT NULL,
  `day` int(2) NOT NULL DEFAULT '0',
  `amount` decimal(19,2) NOT NULL,
  `released` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `investments`
--

CREATE TABLE `investments` (
  `id` int(11) NOT NULL,
  `type_investments` int(1) NOT NULL DEFAULT '1',
  `transaction_date` datetime DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `investment_amount` decimal(19,2) NOT NULL,
  `investment_amount_paid` decimal(19,2) DEFAULT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `expected_return_amount` decimal(19,2) NOT NULL,
  `qty_days_investment` int(11) NOT NULL,
  `daily_return_rate` decimal(19,2) NOT NULL,
  `daily_return_amount` decimal(19,2) NOT NULL,
  `investment_state_id` int(11) NOT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `finish_date` date DEFAULT NULL,
  `reinvest_balance` tinyint(1) DEFAULT '0',
  `default_investment` tinyint(1) NOT NULL DEFAULT '0',
  `investment_amount_btc` decimal(10,8) DEFAULT NULL,
  `return_month_btc` decimal(10,8) DEFAULT NULL,
  `total_return_rate_btc` decimal(10,8) DEFAULT NULL,
  `month_return_amount_btc` decimal(10,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `investments`
--

INSERT INTO `investments` (`id`, `type_investments`, `transaction_date`, `customer_id`, `investment_amount`, `investment_amount_paid`, `imagen`, `expected_return_amount`, `qty_days_investment`, `daily_return_rate`, `daily_return_amount`, `investment_state_id`, `approval_date`, `finish_date`, `reinvest_balance`, `default_investment`, `investment_amount_btc`, `return_month_btc`, `total_return_rate_btc`, `month_return_amount_btc`) VALUES
(2, 1, '2018-02-14 05:26:52', 313, '12.00', NULL, '1518586012.jpg', '4.80', 40, '1.00', '0.12', 2, '2018-02-16 00:35:47', NULL, 0, 1, NULL, NULL, NULL, NULL),
(3, 1, '2018-02-16 01:56:20', 310, '50000.00', NULL, '1518746180.png', '20000.00', 40, '1.00', '500.00', 2, '2018-02-16 00:57:19', NULL, 0, 1, NULL, NULL, NULL, NULL),
(4, 1, '2018-02-19 03:24:28', 315, '50000.00', NULL, '1519010668.png', '20000.00', 40, '1.00', '500.00', 2, '2018-05-15 03:08:04', NULL, 1, 1, NULL, NULL, NULL, NULL),
(5, 1, '2018-03-27 03:02:14', 316, '10000.00', NULL, '1522119734.png', '4000.00', 40, '1.00', '100.00', 1, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL),
(6, 1, '2018-04-03 02:57:23', 316, '10000.00', NULL, '1522724243.jpg', '4000.00', 40, '1.00', '100.00', 2, '2018-04-03 01:03:53', NULL, 1, 0, NULL, NULL, NULL, NULL),
(7, 1, '2018-04-03 03:51:39', 318, '10000.00', NULL, '1522727499.jpg', '7200.00', 12, '6.00', '600.00', 1, NULL, NULL, 0, 1, NULL, NULL, NULL, NULL),
(8, 1, '2018-04-03 03:59:36', 318, '2333.00', NULL, '1522727976.jpg', '933.20', 40, '1.00', '23.33', 1, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL),
(9, 1, '2018-04-03 04:09:01', 318, '123.00', NULL, '1522728541.jpg', '88.56', 12, '6.00', '7.38', 1, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL),
(10, 1, '2018-04-03 04:09:21', 318, '123.00', NULL, '1522728561.jpg', '59.04', 12, '4.00', '4.92', 1, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL),
(11, 1, '2018-04-03 04:16:16', 318, '123.00', NULL, '1522728976.jpg', '29.52', 6, '4.00', '4.92', 1, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL),
(12, 1, '2018-05-15 04:54:40', 319, '10000.00', NULL, '1526360080.jpg', '7200.00', 12, '6.00', '600.00', 2, '2018-05-15 03:07:27', NULL, 1, 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `investment_referred_payments`
--

CREATE TABLE `investment_referred_payments` (
  `id` bigint(20) NOT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `investment_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `level` int(1) NOT NULL,
  `percentage` decimal(19,2) NOT NULL,
  `amount` decimal(19,2) NOT NULL,
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `paid_date` datetime DEFAULT NULL,
  `customer_user_name` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `investment_states`
--

CREATE TABLE `investment_states` (
  `id` int(11) NOT NULL,
  `state` varchar(140) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `investment_states`
--

INSERT INTO `investment_states` (`id`, `state`) VALUES
(1, 'Pendiente'),
(2, 'Activo'),
(3, 'Finalizada'),
(4, 'Inversión Retirada'),
(5, 'Anulada'),
(6, 'Sin Cupo'),
(7, 'Capital Reinvertido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `investment_timeline`
--

CREATE TABLE `investment_timeline` (
  `id` bigint(20) NOT NULL,
  `investment_id` int(11) NOT NULL,
  `correlative` int(2) NOT NULL,
  `transaction_date` date NOT NULL,
  `amount` decimal(19,2) NOT NULL,
  `paid` tinyint(1) DEFAULT '0',
  `paid_in_bitcoin_wallet` tinyint(1) DEFAULT '0',
  `paid_in_bitcoin_wallet_date` datetime DEFAULT NULL,
  `amount_btc` decimal(10,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('Informacion.smartpc@gmail.com', '$2y$10$SBs5BLg8CeXBJRebtkYdQeAbCGDSxUDBpuzs6VCsf2D0.5PI4Ywrq', '2017-09-26 00:38:36'),
('carlosed1995@gmail.com', '$2y$10$6BiSpT8Lsjo3rDD12jOKNO5KeLCOYunLiTpYrnQeaIgF7mUpEJB/.', '2018-03-30 22:41:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plans`
--

CREATE TABLE `plans` (
  `id` int(2) NOT NULL,
  `description` varchar(250) NOT NULL,
  `percentaje` decimal(10,1) NOT NULL,
  `time` int(2) NOT NULL,
  `titulo_plan` varchar(250) DEFAULT NULL,
  `valor_max` decimal(10,2) DEFAULT NULL,
  `total_rendimiento` decimal(10,2) DEFAULT NULL,
  `valor_min` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `plans`
--

INSERT INTO `plans` (`id`, `description`, `percentaje`, `time`, `titulo_plan`, `valor_max`, `total_rendimiento`, `valor_min`, `created_at`, `updated_at`) VALUES
(14, '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo."', '4.0', 12, 'uno', '10000.00', '0.00', '5000.00', NULL, NULL),
(15, 'Este proceso sera para ganar mucho dinero dentro de 20 años', '6.0', 12, 'Inversion Garantizada', '20000.00', '0.00', '10000.00', NULL, NULL),
(16, 'Esta es un aprueba', '5.0', 12, 'pRUEBA', '20000.00', '0.00', '10000.00', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `politicas`
--

CREATE TABLE `politicas` (
  `id` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Administrador', 'Persona que administra el sistema'),
(2, 'Inversionista', 'Persona que invierte una cantidad de dinero'),
(3, 'Super Administrador', 'Solo super administrador puede hacer configuraciones globales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(140) NOT NULL,
  `description` varchar(140) NOT NULL,
  `value` varchar(2000) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `settings`
--

INSERT INTO `settings` (`id`, `key`, `description`, `value`, `created_at`, `updated_at`) VALUES
(2, 'qty_days_investment', 'Numero de días para recuperar Inversion', '40', NULL, NULL),
(3, 'daily_return_rate', 'Porcentaje de Retorno Diario', '1', NULL, NULL),
(7, 'token_security', 'Codigo de verificación al actualizar los datos del cliente', 'btcriptoecu', NULL, NULL),
(15, 'daily_return_rate', 'Porcentaje de Retorno Diario', '1', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_id` int(11) DEFAULT '2',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `codeqr` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `code` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clave_de_pago` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imguser` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `remember_token`, `rol_id`, `username`, `active`, `codeqr`, `created_at`, `updated_at`, `code`, `clave_de_pago`, `imguser`) VALUES
(16, 'informacion.smartpc@gmail.com', '$2y$10$IcKwfcjNOX790SC/8alYIeY6zFkjdHQjVeEvnAj9hXsuCk5u4SRWW', 'qDRfYxpPZpq6w01wMJp1aAsPIWSmSCbrtKIa1QdbpkUmZwI2TltOf5SOTIT6', 3, 'smartpc', 1, '', '2018-04-03 03:09:23', '2017-12-26 03:49:49', NULL, 'fher0908', NULL),
(215, 'fhernandoscl@gmail.com', '$2y$10$ktqhWvbS2rxeIsNrnOGTJu2K7tBrfwcITVnALnTrVDgyDRrQWHltu', 'nqU572LaUtb3w7bwIxbrUsaelrgAspOIYFKIfnrGuD4gzzm7DYwObpvNKibe', 2, 'fher', 1, '1509570449.jpg', '2018-02-09 03:05:00', '2017-11-01 14:07:29', 'ouk3l7', NULL, NULL),
(307, 'veronicalema86@gmail.com', '$2y$10$4l2Teq1c8gbYuMz84/4KBeMAoN.xDI7fBAxc19WrpZPpBKDn4oUPO', NULL, 2, 'verito', 1, '1516768193.jpg', '2018-01-24 04:32:07', '2018-01-24 03:29:53', 'mqdrp5', NULL, NULL),
(310, 'carlosed1995@gmail.com', '$2y$10$2x6gjDtPxjzUiaU1.e725eWfTCzEsoBb83OdMHncjEn.Gr02Zsgey', '77ibh4qnIipQqh33tHaagni66YlqR136aJtsIe2LAQ1v1eCUcAxpwhOrYnCA', 2, 'carlos', 1, '1518581893.png', '2018-03-31 01:55:30', '2018-02-14 03:18:13', 'psfjvl', '123', '1518581893.jpg'),
(311, 'byron.padilla@gmail.com', '$2y$10$snN.XQ1qrDRSNKW6XLg.WeCu4P04GPXBCOrnp9oM37WRfdKyvH3/q', 'cfJaCiuCJ1I89RaGCNiRshMJ97zIMVujrDvxelcS308faDnCYhRgFYgdPBuH', 2, 'byron', 1, '1516805114.png', '2018-01-24 14:47:41', '2018-01-24 13:45:14', 'opnqhy', NULL, '1516805114.png'),
(313, 'leonardo9526@gmail.com', 'leo3347240', 'I74NpNQ3QnHh06EPoFYTPbq9jq87h6oBvQzhnv0zG67QXhdjikNzOIpxu0TY', 2, 'leoquin26', 1, '1517848064.jpg', '2018-04-03 03:20:50', '2018-02-05 15:27:44', 'o5pfw5', NULL, '1517848064.jpg'),
(315, 'inasasasfo@smartpcecuador.com', '$2y$10$/DxBF6sHWUpKBZfKgy6bkOPWxTnDVuWkepJEeHoLnBXlwDxkJstkO', NULL, 2, 'jfp', 0, '1519009225.png', '2018-03-27 02:47:53', '2018-02-19 02:00:25', '9tcf0p', NULL, '1519009225.png'),
(316, 'info@smartpcecuador.com', '$2y$10$miRSrIcTUQWJMD3X6J96SuvdQE3l2YfvIhhvivn.1SCBBFRDZ.1YG', NULL, 2, 'jfpasas', 1, '', '2018-03-27 02:49:40', '2018-03-27 00:48:32', '8t2z6q', NULL, NULL),
(318, 'yaimaliblanco@gmail.com', '$2y$10$mlkofNkdtDicY24bN.OWjeNVzgFkIjLvkCrOY0abd5kkCN3S0WJyK', NULL, 2, 'yaiblanco', 1, '', '2018-05-15 04:59:46', '2018-05-15 02:59:46', '7kr0q0', NULL, NULL),
(319, 'danieljtorres94@gmail.com', '$2y$10$yKXq1ev9sslV8dbsv6PEfuG.fbgpOe5s5PTw95Ymz7aHskC2hg0cG', 'SKHxpwZX690f8MPk5CpRuN01PrYl7DcVqdarJjuL1vDAGK6ao6xL4PFMCoPl', 3, 'danielt', 1, '', '2018-05-16 18:47:49', '2018-05-15 02:45:13', '3845ee', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `beneficiary`
--
ALTER TABLE `beneficiary`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clavedepago`
--
ALTER TABLE `clavedepago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `concepts`
--
ALTER TABLE `concepts`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `customers_clientes_id` (`cliente_id`),
  ADD KEY `customers_country_id` (`country_id`);

--
-- Indices de la tabla `execute_logs`
--
ALTER TABLE `execute_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `general_ledger`
--
ALTER TABLE `general_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `investment_id` (`investment_id`),
  ADD KEY `concept_id` (`concept_id`);

--
-- Indices de la tabla `investments`
--
ALTER TABLE `investments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_first_name` (`id`),
  ADD KEY `investment_state_id` (`investment_state_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indices de la tabla `investment_referred_payments`
--
ALTER TABLE `investment_referred_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_referred_payment` (`investment_id`,`customer_id`),
  ADD KEY `investment_id` (`investment_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indices de la tabla `investment_states`
--
ALTER TABLE `investment_states`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `investment_timeline`
--
ALTER TABLE `investment_timeline`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `investment_id` (`investment_id`,`correlative`,`transaction_date`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indices de la tabla `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `politicas`
--
ALTER TABLE `politicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indices de la tabla `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_roles_id` (`rol_id`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `beneficiary`
--
ALTER TABLE `beneficiary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT de la tabla `clavedepago`
--
ALTER TABLE `clavedepago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `concepts`
--
ALTER TABLE `concepts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=746;
--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=320;
--
-- AUTO_INCREMENT de la tabla `execute_logs`
--
ALTER TABLE `execute_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `general_ledger`
--
ALTER TABLE `general_ledger`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `investments`
--
ALTER TABLE `investments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `investment_referred_payments`
--
ALTER TABLE `investment_referred_payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `investment_states`
--
ALTER TABLE `investment_states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `investment_timeline`
--
ALTER TABLE `investment_timeline`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT de la tabla `politicas`
--
ALTER TABLE `politicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=320;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_clientes_id` FOREIGN KEY (`cliente_id`) REFERENCES `customers` (`user_id`),
  ADD CONSTRAINT `customers_country_id` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `customers_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `general_ledger`
--
ALTER TABLE `general_ledger`
  ADD CONSTRAINT `general_ledger_ibfk_1` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`),
  ADD CONSTRAINT `general_ledger_ibfk_2` FOREIGN KEY (`concept_id`) REFERENCES `concepts` (`id`);

--
-- Filtros para la tabla `investments`
--
ALTER TABLE `investments`
  ADD CONSTRAINT `investments_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`),
  ADD CONSTRAINT `investments_ibfk_1` FOREIGN KEY (`investment_state_id`) REFERENCES `investment_states` (`id`);

--
-- Filtros para la tabla `investment_referred_payments`
--
ALTER TABLE `investment_referred_payments`
  ADD CONSTRAINT `investment_referred_payments_ibfk_1` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`),
  ADD CONSTRAINT `investment_referred_payments_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`);

--
-- Filtros para la tabla `investment_timeline`
--
ALTER TABLE `investment_timeline`
  ADD CONSTRAINT `investment_timeline_ibfk_1` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_roles_id` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
