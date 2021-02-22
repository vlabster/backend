module.exports = {
    apps: [
        {
            name: "backend",
            script: "./index.js",
            cwd: "/srv/backend/src",
            env: {
                NODE_ENV: "production",
            },
            kill_timeout: 15000,
            max_memory_restart: "150M",
        },
    ],
};
