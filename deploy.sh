#!/bin/sh

sed -i -e "s/aws-access-key/${AWS_ACCESS_KEY_ID}/" config.json
sed -i -e "s/aws-secret-access-key/${AWS_SECRET_ACCESS_KEY_ID}/" config.json
sed -i -e "s/bucket-name/${BUCKET_NAME}/" config.json

serverless deploy
