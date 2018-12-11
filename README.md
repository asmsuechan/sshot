sshot
====
![logo]()

sshot is a tool to take the screenshot of a website.

## Usage
Just curl to the endpoint with `url` parameter.

```sh
$ curl "https://vckvs9l162.execute-api.ap-northeast-1.amazonaws.com/production/screenshot?url=https://github.com/asmsuechan"
{"screenshot":{"url":"https://s3-ap-northeast-1.amazonaws.com/sshot-images/kvd6ajor2hbprpb9.png"}}
```

Caution: Your screenshots will be uploaded to our public S3 bucket (sshot-images). If you hate to make your screenshots public, you should deploy your own sshot on your AWS by serverless framework.

## Options
Available options in query parameter are:

|name|value|
|-:|-:|
|url|string (e.g. https://github.com)|
|base64|boolean (true/false)|

## Deploy your own sshot
1. Clone this repository and run `yarn`
2. Install `serverless` framework
3. Create an IAM user with appropreate rights for `serverless` and get its credentials
4. Create a S3 bucket
5. Fill config.json
6. Set environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `REGION`) to run serverless
7. Run `yarn run deploy`

Any questions? Open an issue and ask us, please.

## How to develop
TODO

## Libraries
* [sshot-js]()

## Licence
[MIT](https://github.com/asmsuechan/sshot/blob/master/LICENCE)

## Author
[asmsuechan](https://github.com/asmsuechan)
