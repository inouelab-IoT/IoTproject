#!/usr/bin/env python
# -*- coding:utf-8 -*-
import logging
import boto3
from botocore.exceptions import ClientError
import os

# 認証情報取得 
port = 443  # Cognito経由の認証では、Websocket SigV4　しか使用できない
rootCA = "/home/pi/002_AWSIoT/root-CA.crt"
clientId = "inouelabiot" # "YOUR_USER_NAME"
awsRegion = 'ap-northeast-1' # Your Region
endPoint = 'anmwgx2rsnw45-ats.iot.ap-northeast-1.amazonaws.com' # Require 'lowercamelcase'!!
accessId = 'AKIA34MKVHJNJI7DNDW4'
secretKey = '/h+WIfH9gsLX46/GROlDRilpLO4mdqbdQ5NDTh3s'

try:
    bucketname = "ediot"
    KeyPrefix = 'inouelabiot/'
    resource = boto3.resource(
        's3',
        region_name=awsRegion,
        # Hard coded strings as credentials, not recommended.
        aws_access_key_id=accessId,
        aws_secret_access_key=secretKey
    )
except ClientError as e:
        logging.error(e)
        
bucket = resource.Bucket(bucketname)
objs = bucket.meta.client.list_objects_v2(Bucket=bucket.name, Prefix=KeyPrefix)
for o in objs.get('Contents'):
    key = o.get('Key')
    if key[-4:]=='.jpg':
        print(key)
        os.makedirs(os.path.dirname(key), exist_ok=True)
        bucket.download_file(key, key) # download

#download
#bucket.upload_file('DownloadするS3のpath', '保存先のpath')

#upload
#bucket.upload_file('UPするファイルのpath', '保存先S3のpath')
