module.exports = {
  apps: [
    {
      name: "vengrow",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        SUPERADMIN_EMAIL: "superadmin@vengrow.com",
        SUPERADMIN_PASSWORD_HASH: "$2b$10$N1sHD/nd9YwsI7z.2E0RE.gs6kZCUz2.8nwAVsbpqTEkCu3O02fki"
      }
    }
  ]
};
