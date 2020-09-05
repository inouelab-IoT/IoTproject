#!/usr/bin/env python
# -*- coding:utf-8 -*-
import logging
import boto3
from botocore.exceptions import ClientError
import os

try:
    bucketname = "ediot"
    KeyPrefix = 'inouelabiot/'
    resource = boto3.resource(
        's3',
        region_name='ap-northeast-1',
        # Hard coded strings as credentials, not recommended.
        aws_access_key_id='AKIA34MKVHJNJI7DNDW4',
        aws_secret_access_key='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'
    )
except ClientError as e:
        logging.error(e)
        
bucket = resource.Bucket(bucketname)
objs = bucket.meta.client.list_objects_v2(Bucket=bucket.name, Prefix=KeyPrefix)
for o in objs.get('Contents'):
    key = o.get('Key')
    if key[-4:]=='.jpg':
        print(key)
        bucket.download_file(key, os.path.basename(key)) # download

#download
#bucket.upload_file('DownloadするS3のpath', '保存先のpath')

#upload
#bucket.upload_file('UPするファイルのpath', '保存先S3のpath')