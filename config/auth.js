module.exports = {
    production: {
        enabled: true,
        secretKey: 'production',
        exp: {
            unit: "days",
            qty: 7
        }
    },
    development: {
        enabled: process.env.AUTH_ENABLE || true,
        secretKey: process.env.AUTH_SECRET_KEY || 'zero@two',
        exp: {
            unit: process.env.AUTH_UNIT || 'days',
            qty: process.env.AUTH_QTY || 7
        }
    }
}[process.env.NODE_ENV]