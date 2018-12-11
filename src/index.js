const setup = require('./starter-kit/setup');
const exec = require('child_process').exec;
const {upload, buildUrl, getBase64Image} = require('./s3');
// const baseUrl = 'https://s3-ap-northeast-1.amazonaws.com/sshot-assets/';

exports.handler = async (event, context, callback) => {
  const pageUrl = event['queryStringParameters']['url'];
  const base64 = event['queryStringParameters']['base64'];
  console.log(event['queryStringParameters']);
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  try {
    const imageName = await exports.takeScreenShot(browser, pageUrl);
    let screenshot;
    if (base64) {
      await upload(imageName);
      screenshot = await getBase64Image(imageName);
    } else {
      screenshot = await buildUrl(imageName);
    }
    const responseParams = {
      'statusCode': 200,
      'body': JSON.stringify(({screenshot: screenshot})),
    };
    callback(null, responseParams);
  } catch (e) {
    callback(e);
  }
};

exports.takeScreenShot = async (browser, pageUrl) => {
  process.env.HOME = process.env.LAMBDA_TASK_ROOT;
  const command = `fc-cache -v ${process.env.HOME}.fonts`;
  exec(command, (error, stdout, stderr) => {});
  const page = await browser.newPage();
  await page.goto(pageUrl, {waitUntil: 'networkidle0'});

  /*eslint-disable */
  const randomString = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
  /*eslint-enable */
  const imageName = `${randomString}.png`;
  const imagePath = `/tmp/${imageName}`;
  await page.screenshot({path: imagePath, fullPage: true});

  await page.close();
  return imageName;
};
