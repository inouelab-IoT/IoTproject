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

data = col.find_one({'b':10})
data['b'] = 11
#データの更新
col.save(data)

for data in col.find({u'b':11}):
    print(data)
