module.exports = {
  apps: [
    {
      script: "./dist/main.js",
      autorestart: true,
      watch:["src"],
      max_restarts: 10,
      env_production: {
        "NODE_ENV": "production"
      }
    },

  ],
};
