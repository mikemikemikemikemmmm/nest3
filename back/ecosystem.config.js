module.exports = {
  apps: [
    {
      script: "./dist/main.js",
      autorestart: true,
      ignore_watch:["node_modules","db"],
      cron_restart: '0 0 * * *',
      stop_exit_codes: [0],
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },

  ],
};
