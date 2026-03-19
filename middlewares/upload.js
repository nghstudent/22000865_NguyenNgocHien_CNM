const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Client } = require("../config/aws");
require("dotenv").config();

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `products/${uniqueSuffix}-${file.originalname}`);
        }
    })
});

module.exports = upload;