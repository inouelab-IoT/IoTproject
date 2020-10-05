from pymongo import MongoClient
from datetime import datetime

class TestMongo(object):

     def __init__(self):
         self.clint = MongoClient()
         self.db = self.clint['test']

     def add_one(self):
        """データ挿入"""
        post = {
            'animal': '猫',
            'English': 'cat',
            'cry': 'ニャー',
            'created_at': datetime.now()
        }
        return self.db.test.insert_one(post)

def main():
    obj = TestMongo()
    rest = obj.add_one()
    print(rest)

if __name__ == '__main__':
    main()