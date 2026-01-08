module.exports = {
    apps: [
        {
            name: "meu-next",
            script: "npm",
            args: "run start",
            env: {
                PORT: 3005,
                NODE_ENV: "production"
            }
        }
    ]
};
