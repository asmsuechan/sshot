exports.upload = async (imageName, imagePath) => {
  const aws = require('aws-sdk');
  const config = require('./config.json');
  /*eslint-disable */
  const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION, BUCKET_NAME} = config;
  /*eslint-enable */

  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION,
  });

  const s3 = new aws.S3({apiVersion: '2006-03-01'});
  const fs = require('fs');
  const screenshot = await new Promise((resolve, reject) => {
    fs.readFile(imagePath, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
  const result = await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: imageName,
    Body: screenshot,
  }).promise();
  return result;
};

exports.getUrl = async (imageName) => {
  const aws = require('aws-sdk');
  const config = require('./config.json');
  /*eslint-disable */
  const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION, BUCKET_NAME} = config;
  /*eslint-enable */

  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION,
  });

  const s3 = new aws.S3({apiVersion: '2006-03-01'});
  const result = await s3.getObject({
    Bucket: BUCKET_NAME,
    Key: imageName,
  }).promise();
  return result;
};
