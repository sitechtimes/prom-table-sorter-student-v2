module.exports = {
  apps: [
    {
      name: "prom-table",
      script: ".output/server/index.mjs",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      node_args: "-r dotenv/config",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: "5000",
        DOTENV_CONFIG_PATH: ".env",
      },
    },
  ],
};
