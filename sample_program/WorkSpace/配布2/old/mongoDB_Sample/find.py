#!/usr/bin/env python
# -*- coding:utf-8 -*-

from pymongo import MongoClient
from datetime import datetime

#コネクション作成
con = MongoClient()

#コネクションからsampleデータベースを取得
db = con.sample

#sampleデータベースからfooコレクションを取得
col = db.foo

print("========find_one========")
print(col.find_one()

print("========find========")
for data in col.find():
    print(data)

print("========find_query========")
for data in col.find({u'a':10}):