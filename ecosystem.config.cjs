module.exports = {
  apps: [
    {
      name: "vengrow",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      watch: false,
      ignore_watch: ["node_modules", "logs", "storage"],
    },
    {
      name: "vengrow-staging",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        SUPERADMIN_EMAIL: "superadmin@vengrow.com",
        SUPERADMIN_PASSWORD_HASH: "$2b$10$N1sHD/nd9YwsI7z.2E0RE.gs6kZCUz2.8nwAVsbpqTEkCu3O02fki",
        COOKIE_DOMAIN: "staging.vengrow.net",
        PORT: 5001,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      watch: false,
      ignore_watch: ["node_modules", "logs", "storage"],
    }
  ]
};
