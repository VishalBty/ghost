#!/usr/bin/env node

/*
  This file creates and writes our production config after the build has been completed.
  Make changes here if you want to use a different image storage service or email provider.
*/

var fs = require("fs");
var path = require("path");

var appRoot = path.join(__dirname, "..");
var contentPath = path.join(appRoot, "/content/");

require("dotenv").config();
function createConfig() {
  var fileStorage, storage;

  if (process.env.CLOUDINARY_URL) {
    console.log("CLOUDINARY_URL found, setting storage to cloudinary");
    fileStorage = true;
    storage = {
      active: "cloudinary",
      cloudinary: {
        useDatedFolder: false,
        upload: {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          folder: "ghost-blog-images",
          tags: ["blog"],
        },
        fetch: {
          quality: "auto",
          secure: true,
          cdn_subdomain: true,
        },
      },
    };
  } else if (process.env.S3_ACCESS_KEY_ID) {
    console.log("S3_ACCESS_KEY_ID found, setting storage to s3");
    fileStorage = true;

    storage = {
      active: "s3",
      s3: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION || "us-east-1",
        bucket: process.env.S3_BUCKET || "ghost-blog-images",
        assetHost: process.env.S3_ASSET_HOST,
        signatureVersion: process.env.S3_SIGNATURE_VERSION,
        pathPrefix: process.env.S3_PATH_PREFIX,
        endpoint: process.env.S3_ENDPOINT,
        serverSideEncryption: process.env.S3_SERVER_SIDE_ENCRYPTION,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE,
        forcePathStyle: true,

        acl: process.env.S3_ACL,
      },
    };
  } else {
    console.log("S3 OR CLOUDINARY_URL not found, setting storage to false");
    fileStorage = false;
    storage = {};
  }

  config = {
    url: process.env.BLOG_URL,
    logging: {
      level: "info",
      transports: ["stdout"],
    },
    mail: {
      transport: "SMTP",
      options: {
        service: process.env.EMAIL_SERVICE || "Sendgrid",
        host: process.env.EMAIL_HOST || "smtp.sendgrid.net",
        port: process.env.EMAIL_PORT || "587",
        auth: {
          user: process.env.EMAIL_USER || "apikey",
          pass: process.env.EMAIL_PASS,
        },
      },
    },
    fileStorage: fileStorage,
    storage: storage,
    database: {
      client: "mysql",
      connection: process.env.MYSQL_URL,
      pool: { min: 0, max: 5 },
      debug: false,
    },
    server: {
      host: "0.0.0.0",
      port: process.env.PORT,
    },
    paths: {
      contentPath: contentPath,
    },
  };
  console.log(config);
  return config;
}

var configContents = JSON.stringify(createConfig(), null, 2);
fs.writeFileSync(path.join(appRoot, "config.production.json"), configContents);
fs.mkdirSync(path.join(contentPath, "/data/"), { recursive: true });
