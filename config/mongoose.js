module.exports = {
    production: {
        host: '127.0.0.1',
        port: '27017',
        database: '',
        auth: false,
        user: '',
        password: ''
    },
    development: {
        host: process.env.MONGO_HOST || '127.0.0.1',
        port: process.env.MONGO_PORT || '27017',
        database: process.env.MONGO_DATABASE || '',
        auth: process.env.MONGO_AUTH || false,
        user: process.env.MONGO_USER || '',
        password: process.env.MONGO_PASSWORD || ''
    }
}[process.env.NODE_ENV]