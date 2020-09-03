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

print("===before===")
for data in col.find():
    print(data)

col.remove({'b':11})

print("===after===")
for data in col.find():
    print(data)
