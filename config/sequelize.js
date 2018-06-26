module.exports = {
    production: {
        username: 'root',
        password: ')V6ry[*bzeGA*L,b',
        database: 'b1b',
        host: '127.0.0.1',
        dialect: 'mysql'
    },
    development: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'b1b_dev',
        host: process.env.MYSQL_HOST || '127.0.0.1',
        dialect: 'mysql'
    }
}[process.env.NODE_ENV]