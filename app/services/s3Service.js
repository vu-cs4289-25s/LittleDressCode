// /services/s3Service.js
import AWS from "aws-sdk";

// AWS Configuration
AWS.config.update({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "YOUR_AWS_REGION",
});

const s3 = new AWS.S3({
  params: { Bucket: "YOUR_BUCKET_NAME" },
  signatureVersion: "v4",
});

export const uploadToS3 = (file, fileName) => {
  const params = {
    Key: fileName,
    Body: file,
    ContentType: "image/jpeg",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};
