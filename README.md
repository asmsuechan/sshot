# sshot
![logo]()

sshot is a tool to take the screenshot of a website.

## Usage
Just curl to the endpoint with `url` parameter.

```sh
$ curl "https://vckvs9l162.execute-api.ap-northeast-1.amazonaws.com/production/screenshot?url=https://github.com/asmsuechan"
{"screenshot":{"url":"https://s3-ap-northeast-1.amazonaws.com/sshot-assets/kvd6ajor2hbprpb9.png"}}
```

## Options
Available options in query parameter are:

|name|value|
|-:|-:|
|url|string (e.g. https://github.com)|
|base64|boolean (true/false)|

## Create your own sshot
1. Install `serverless` framework
2. Create an IAM user with appropreate rights and get credentials
3. Create a S3 bucket
4. Fill config.json
5. Set environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `REGION`) to run serverless
6. Run `yarn run deploy`

## How to develop
TODO

## Libraries
* [sshot-js]()

## Licence
[MIT](https://github.com/asmsuechan/sshot/blob/master/LICENCE)

## Author
[asmsuechan](https://github.com/asmsuechan)
