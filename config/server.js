module.exports = {
    production: {
        port: '4001',
        ip: '127.0.0.1'
    },
    development: {
        port: process.env.SERVER_PORT || '90',
        ip: process.env.SERVER_IP || '127.0.0.1'
    }
}[process.env.NODE_ENV]