module.exports = {
    production: {
        service: "gmail",
        user: "danieljtorres94@gmail.com",
        password: "ktcglllngdjvoxft",
        from: "'PROD B1B'<b1b@prod.prod>"
    },
    development: {
        service: process.env.EMAIL_SERVICE || "gmail",
        user: process.env.EMAIL_USER || "danieljtorres94@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "ktcglllngdjvoxft",
        from: process.env.EMAIL_FROM || "'dev b1b'<b1b@dev.dev>"
    }
}[process.env.NODE_ENV]