#!/usr/bin/env python
# -*- coding:utf-8 -*-
from pymongo import MongoClient
import requests
import urllib
import urllib.request, urllib.parse
import os
import boto3
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from ast import literal_eval
from datetime import datetime
import time
import json
import reverse_geocode
import sys
import numpy as np
import cv2
import time
from keras.applications.vgg16 import VGG16
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from tensorflow.keras.models import Sequential, Model, load_model
from keras.layers import Input, Activation, Dropout, Flatten, Dense, BatchNormalization
from keras import optimizers
import tensorflow as tf

import keras.backend.tensorflow_backend as tb
tb._SYMBOLIC_SCOPE.value = True

##########モデル構築#############################
#事前に設定するパラメータ
classes = ["名前１", "名前２", "名前３"]
nb_classes = len(classes)
img_width, img_height = 150, 150

# VGG16のロード。FC層は不要なので include_top=False
input_tensor = Input(shape=(img_width, img_height, 3))
vgg16 = VGG16(include_top=False, weights='imagenet', input_tensor=input_tensor)

# FC層の作成
top_model = Sequential()
top_model.add(Flatten(input_shape=vgg16.output_shape[1:]))
top_model.add(Dense(256, activation='relu', kernel_initializer='he_normal'))
top_model.add(BatchNormalization())
top_model.add(Dropout(0.5))
top_model.add(Dense(nb_classes, activation='softmax'))


# VGG16とFC層を結合してモデルを作成
vgg_model = Model(input=vgg16.input, output=top_model(vgg16.output))

#重み読み込み
vgg_model.load_weights('./Final.h5')

#model 読み込み
#vgg_model = tf.keras.models.load_model("./VGGtake1.h5")

########################################

# opencv モデル読み込み
cascade_path = "/home/pi/haarcascades/haarcascade_frontalface_alt.xml"
cascade = cv2.CascadeClassifier(cascade_path)
color = (255, 0, 255)

image_size = 150
categories = classes

print("keras 準備完了")

def whoisface_fromPhoto(filename):
    
    return "output_face_detected_1.png", face_list, face_num

#IFTTT setting
event_name = "postSlack"
account = "cd_auNitkCwO0hnJBuj_1C"
URL = "https://maker.ifttt.com/trigger/" + event_name + "/with/key/" + account


# AWS 認証情報取得 
port = 443  # Cognito経由の認証では、Websocket SigV4　しか使用できない
rootCA = "/home/pi/002_AWSIoT/root-CA.crt"
clientId = "inouelabiot" # "YOUR_USER_NAME"
awsRegion = 'ap-northeast-1' # Your Region
endPoint = 'anmwgx2rsnw45-ats.iot.ap-northeast-1.amazonaws.com' # Require 'lowercamelcase'!!
accessId = 'AKIA34MKVHJNJI7DNDW4'
secretKey = '/h+WIfH9gsLX46/GROlDRilpLO4mdqbdQ5NDTh3s'

#topic
topic = clientId + "/albam"

# mongoDB 設定
con = MongoClient()
db = con.mqtt # mqtt データベース
col = db.albam # albam コレクション

# S3 の設定
try:
    bucketname = "ediot"
    KeyPrefix = clientId + '/'
    resource = boto3.resource(
        's3',
        region_name=awsRegion,
        # Hard coded strings as credentials, not recommended.
        aws_access_key_id=accessId,
        aws_secret_access_key=secretKey
    )
except ClientError as e:
        logging.error(e)


#Subscribe
def onSubscribe(client, userdata, message):
    print("= Subscribe ========================")
    print("message:{} topic:{}".format(message.payload, message.topic))
    print("topic: " + message.topic)
    print("payload: " + str(message.payload.decode('utf-8')))
    
    payload_DICT = json.loads(message.payload.decode('utf-8'))
    
    payload_DICT["topic"] = message.topic
    print(payload_DICT)
    print("====================================")

    if ("latitude" in payload_DICT["messages"] and "longitude" in payload_DICT["messages"] ):
        # 天気取得
        weather_data = get_weather(payload_DICT["messages"]["latitude"], payload_DICT["messages"]["longitude"])

        #国、都市取得
        place_txt =  rev_geocode(payload_DICT["messages"]["latitude"], payload_DICT["messages"]["longitude"])
    else :
        weather_data = "unknown"
        place_txt = "unknown"

    if ("photourl" in payload_DICT["messages"]):
        #人物検出
        key = payload_DICT["messages"]["photourl"]
        bucket = resource.Bucket(bucketname)
        filename = "./albam_temp.jpg"
        bucket.download_file(key, filename)
            
    ######
        frame = cv2.imread(filename)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        facerect = cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=2, minSize=(20, 20))

        face_list = []
        face_num = 0

        for rect in facerect:
            face_num += 1
            cv2.rectangle(frame, tuple(rect[0:2]), tuple(
                rect[0:2] + rect[2:4]), color, thickness=2)
            x = rect[0]
            y = rect[1]
            width = rect[2]
            height = rect[3]

            cv2.imwrite("frontalface.png", frame)
            img = cv2.imread("frontalface.png")

            dst = img[y:y+height, x:x+width]
            cv2.imwrite("output.png", dst)
            cv2.imread("output.png")
            x = []

            img = load_img("./output.png", target_size=(image_size, image_size))

            x = img_to_array(img)
            x = np.expand_dims(x, axis=0)
            # 学習時にImageDataGeneratorのrescaleで正規化したので同じ処理が必要
            # これを忘れると結果がおかしくなるので注意
            x = x / 255.0
            np.set_printoptions(suppress=True)
            
            #vgg_model.summary()
            pre = vgg_model.predict(x)

            print(pre)
            if pre[0][0] > 0.95:
                print(categories[0])
                face_list.append(classes[0])
                text = categories[0] + "  " + str('{:.1f}'.format(pre[0][0] *100))+ " %"
                font = cv2.FONT_HERSHEY_PLAIN
                cv2.putText(
                    frame, text, (rect[0], rect[1]-10), font, 2, color, 2, cv2.LINE_AA)
            elif pre[0][1] > 0.95:
                print(categories[1])
                face_list.append(classes[1])
                text = categories[1] + "  " + str('{:.1f}'.format(pre[0][1] *100))+ " %"
                font = cv2.FONT_HERSHEY_PLAIN
                cv2.putText(
                    frame, text, (rect[0], rect[1]-10), font, 2, color, 2, cv2.LINE_AA)
            elif pre[0][2] > 0.95:
                print(categories[2])
                face_list.append(classes[2])
                text = categories[2] + "  " + str('{:.1f}'.format(pre[0][2] *100))+ " %"
                font = cv2.FONT_HERSHEY_PLAIN
                cv2.putText(
                    frame, text, (rect[0], rect[1]-10), font, 2, color, 2, cv2.LINE_AA)
            

            #cv2.imshow("Show FLAME Image", frame)
            cv2.imwrite("output_face_detected_1.png", frame)
            # time.sleep(0.1)


    #######
        photopath = "output_face_detected_1.png"
        photo_url = 'recognized_' + os.path.basename(key)
        bucket.upload_file(photopath, photo_url)
    else :
        photo_url = "unknown"
        face_list = "unknown"
        face_num = "unknown"
    
    #データ整理
    photo_data = {
        "time" : payload_DICT["date"], #撮影時間
        "place" : place_txt, #撮影場所(国, 都市)
        "weather" : weather_data, #撮影時天気 
        "sender" : payload_DICT["sender"], #写真の撮影者
        "detected_person" : str(face_list), #検出された人
        "face_num" : face_num, #検出された顔の数
        "photo_url" : photo_url, #写真のURL
    }

    print(photo_data)
    #col.insert(photo_data)

    data = {
	    "value1":"test",

        "value2":str(photo_data),
        "value3":"\nSlackへの通知\n" 
    }

    data = urllib.parse.urlencode(data).encode("utf-8")# ここでエンコードして文字→バイトにする！
    with urllib.request.urlopen(URL, data=data) as res:
        html = res.read().decode("utf-8")
        print(html)

def get_weather(lat, lon):
    key="0e0f01e91a3a6a1cc3d7678b8da00107"
    url = "http://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&APPID={}".format(lat, lon, key)
    readObj = urllib.request.urlopen(url)
    response = readObj.read().decode("utf-8")
    return json.loads(response)["weather"][0]["description"]

def rev_geocode(lat, lon):
    coordinates = [[lat, lon]]
    place = reverse_geocode.search(coordinates)[0]
    return place["city"] + ', ' + place["country_code"]

#Main
def main():
    client = AWSIoTMQTTClient(clientId, useWebsocket=True) # Websocket SigV4を利用
    client.configureIAMCredentials(accessId, secretKey)
    client.configureCredentials(rootCA) # ルート証明書の設定が必要
    client.configureEndpoint(endPoint, port)
    client.configureAutoReconnectBackoffTime(1, 32, 20)
    client.configureOfflinePublishQueueing(-1)
    client.configureDrainingFrequency(2)
    client.configureConnectDisconnectTimeout(10)
    client.configureMQTTOperationTimeout(5)
    client.connect()
    client.subscribe(topic, 1, onSubscribe)
    
    while True:
        time.sleep(5)

if __name__ == '__main__':
    main()