#!/usr/bin/env python
# -*- coding:utf-8 -*-
import logging
import boto3
from botocore.exceptions import ClientError
import os

groupname ='YOUR_GROUP_NAME' # グループ名を入力

try:
    bucketname = "ediot"
    KeyPrefix = groupname + '/facedetect'
    resource = boto3.resource(
        's3',
        region_name='ap-northeast-1',
        aws_access_key_id='YOUR_ACCESS_KEY', # AWS のアクセスキー
        aws_secret_access_key='YOUR_SECRET_KEY' #　AWS のシークレットキー
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
