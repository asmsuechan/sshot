const setup = require('./starter-kit/setup');
const exec = require('child_process').exec;
const {upload, buildUrl} = require('./s3');
// const baseUrl = 'https://s3-ap-northeast-1.amazonaws.com/sshot-assets/';

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

  /*eslint-disable */
  const randomString = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
  /*eslint-enable */
  const imageName = `${randomString}.png`;
  const imagePath = `/tmp/${imageName}`;
  await page.screenshot({path: imagePath, fullPage: true});

  // TODO: Check if it successes
  await upload(imageName, imagePath);
  const imageUrl = await buildUrl(imageName);
  await page.close();
  return imageUrl;
};
