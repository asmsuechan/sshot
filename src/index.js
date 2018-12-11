const setup = require('./starter-kit/setup');
const exec = require('child_process').exec;
const {upload, buildUrl} = require('./s3');

exports.handler = async (event, context, callback) => {
  const pageUrl = event['queryStringParameters']['url'];
  const base64 = event['queryStringParameters']['base64'];
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  try {
    /*eslint-disable */
    const randomString = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
    /*eslint-enable */
    const imageName = `${randomString}.png`;
    /*eslint-disable */
    const screenshotData = await exports.takeScreenShot({browser: browser, pageUrl: pageUrl, imageName: imageName});
    /*eslint-enable */

    let screenshot;
    if (base64 === 'true') {
      screenshot = {base64: screenshotData.toString('base64')};
    } else {
      await upload(imageName);
      const url = await buildUrl(imageName);
      screenshot = {url: url};
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

exports.takeScreenShot = async (params) => {
  const {pageUrl, browser, imageName} = params;
  process.env.HOME = process.env.LAMBDA_TASK_ROOT;
  const command = `fc-cache -v ${process.env.HOME}.fonts`;
  exec(command, (error, stdout, stderr) => {});
  const page = await browser.newPage();
  await page.goto(pageUrl, {waitUntil: 'networkidle0'});

  const imagePath = `/tmp/${imageName}`;
  const screenshot = await page.screenshot({path: imagePath, fullPage: true});
  await page.close();
  return screenshot;
};
