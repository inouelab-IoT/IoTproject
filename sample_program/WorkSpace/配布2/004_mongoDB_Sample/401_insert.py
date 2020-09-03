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

#データの更新
col.insert({'b' : 10})

for data in col.find({'b':10}):
    print(data)