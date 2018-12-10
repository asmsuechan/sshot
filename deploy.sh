#!/bin/sh

sed -i -e "s/aws-access-key-id/${AWS_ACCESS_KEY_ID}/" config.json
sed -i -e "s~aws-secret-access-key~${AWS_SECRET_ACCESS_KEY}~" config.json
sed -i -e "s/sshot-assets/${BUCKET_NAME}/" config.json
sed -i -e "s/region/${REGION}/" config.json

serverless deploy --stage production --region $REGION
