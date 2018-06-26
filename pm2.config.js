module.exports = {
    apps : [
        {
          name: "b1b",
          script: "./app.js",
          watch: true,
          ignore_watch : ["node_modules", "public", "resources"],
          env: {
            "NODE_ENV": "production",
          }
        }
    ]
  }