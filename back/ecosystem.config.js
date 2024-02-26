module.exports = {
  apps: [
    {
      script: "./dist/main.js",
      autorestart: true,
      ignore_watch:["node_modules","db"],
      watch:["dist"],
      max_restarts: 10,
    },

  ],
};
