module.exports = {
    production: {
        username: 'root',
        password: ')V6ry[*bzeGA*L,b',
        database: 'b1b',
        host: '144.202.44.43',
        dialect: 'mysql',
        //logging: false,
    },
    development: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'b1b_dev',
        host: process.env.MYSQL_HOST || '127.0.0.1',
        dialect: 'mysql',
        //logging: process.env.MYSQL_LOG || false,
    }
}[process.env.NODE_ENV]