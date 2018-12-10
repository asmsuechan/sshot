const setup = require('./starter-kit/setup');
const exec = require('child_process').exec;
const confit = require('./config.json');
const baseUrl = 'https://s3-ap-northeast-1.amazonaws.com/moriokalab-assets/';

exports.handler = async (event, context, callback) => {
  const pageUrl = event['queryStringParameters']['url'];
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  try {
    const url = await exports.run(browser, pageUrl);
    const screenshot = {screenshot: {url: url}};
    callback(null, {
      'statusCode': 200,
      'body': JSON.stringify((screenshot)),
    });
  } catch (e) {
    callback(e);
  }
};

exports.run = async (browser, pageUrl) => {
  process.env.HOME = process.env.LAMBDA_TASK_ROOT;
  const command = `fc-cache -v ${process.env.HOME}.fonts`;
  exec(command, (error, stdout, stderr) => {});
  // implement here
  // this is sample
  const page = await browser.newPage();
  /*eslint-disable */
  // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36');
  /*eslint-enable */
  await page.goto(pageUrl, {waitUntil: 'networkidle0'});
  console.log((await page.content()).slice(0, 5000));

  const randomString = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
  const imagePath = `/tmp/${randomString}.png`;
  await page.screenshot({path: imagePath, fullPage: true});

  const aws = require('aws-sdk');
  const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, REGION, BUCKET_NAME } = config;

  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
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
  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: `${randomString}.png`,
    Body: screenshot,
  }).promise();

  await page.close();
  return `${baseUrl}${randomString}.png`;
};
