require('app-module-path').addPath(__dirname + '/');

const path = require('path');
global.__basePath = path.resolve(__dirname);

const fs   = require('fs'),
	dotenv = require('dotenv');

//Asignacion de variables de ambiente
const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (var k in envConfig) {
	process.env[k] = envConfig[k]
}

const express           = require('express'),
	cookieParser        = require('cookie-parser'),
	bodyParser          = require('body-parser'),
	multipartMiddleware = require("connect-multiparty")(),
	helmet              = require('helmet'),
	cors                = require('cors'),
	serverConfig        = require('config/server');

const App = express();

App.enable('trust proxy');
App.disable('x-powered-by');
App.use(helmet());
App.use(cors())
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(cookieParser());
App.use(multipartMiddleware);

App.use(express.static(__dirname + '/public'));
App.use('', express.static(path.join(__dirname, 'public')));

const API_VERSIONS = {'Dev': '/v0'/*, 'Version 1': '/v1'*/};

App.get("/versiones", (req, res) => res.status(200).json(API_VERSIONS) );

Object.keys(API_VERSIONS).forEach(function(k) {
    App.use(`/api${API_VERSIONS[k]}`, require(`routes/Http${API_VERSIONS[k]}`));
});

// catch 404 and forward to error handler
App.use((req, res, next) => {

	let err = null;

	try {
		throw new Error('No se encuentra');
	} catch (e) {
		err = e;
	}
	
	err.status = 404;
	next(err);
});

// Manejador de errores
App.use((err, req, res) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// Responder con pagina de error
	res.status(err.status || 500);
	res.json({ error: err.message });
});

global.__httpUrl = `http://${serverConfig.ip}:${serverConfig.port}`;

const server = App.listen(serverConfig.port, () => {
	console.clear()
	let env = process.env.NODE_ENV == "development" ? "DESARROLLO" : "PRODUCCIÓN"
	console.log(`Servidor corriendo en ambiente de ${env}, URL: http://${serverConfig.ip}:${serverConfig.port}`);
});

const io = require('socket.io')(server),
	ws   = require('routes/Ws');

ws(io);

require('cronjobs')


module.exports = App;