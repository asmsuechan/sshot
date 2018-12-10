#!/bin/sh

sed -i -e "s/sshot-assets/${BUCKET_NAME}/" config.json
sed -i -e "s/region/${REGION}/" config.json

serverless deploy --stage production --region $REGION
