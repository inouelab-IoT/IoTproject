#!/usr/bin/env python
# -*- coding:utf-8 -*-

import boto3
import time
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import json
from ast import literal_eval

# file open
MQTT_FILE = "/home/pi/002_AWSIoT/aws_iot_mqtt.json"
mqtt_broker = open(MQTT_FILE).read()
mqtt_dict = literal_eval(mqtt_broker)

# 認証情報取得 
clientId = mqtt_dict['CLIENT_ID']
endPoint = mqtt_dict['ENDPOINT']
port = mqtt_dict['PORT'] # Cognito経由の認証では、Websocket SigV4　しか使用できない
rootCA = mqtt_dict['ROOT_CA']
accessId = mqtt_dict['ACCESS_ID']
secretKey = mqtt_dict['SECRET_KEY']

# TOPIC
SUB_TOPIC = "#"
PUB_TOPIC_1 = clientId + "/test"
PUB_TOPIC_2 = clientId + "/alert/fromServer"

client = AWSIoTMQTTClient(clientId, useWebsocket=True) # Websocket SigV4を利用
client.configureIAMCredentials(accessId, secretKey)
client.configureCredentials(rootCA) # ルート証明書の設定が必要
client.configureEndpoint(endPoint, port)
client.configureAutoReconnectBackoffTime(1, 32, 20)
client.configureOfflinePublishQueueing(-1)
client.configureDrainingFrequency(2)
client.configureConnectDisconnectTimeout(10)
client.configureMQTTOperationTimeout(5)

# Subscribe したときに呼び出される
def onSubscribe(client, userdata, message):
    print("= Subscribe ========================")
    print("message:{} topic:{}".format(message.payload, message.topic))
    print("topic: " + message.topic)
    print("payload: " + str(message.payload.decode('utf-8')))
    print("====================================")
    if(message.topic== clientId + "/alert/fromDevice"):
        messegeJson=json.loads(message.payload.decode('utf-8'))
        send(PUB_TOPIC_2, messegeJson)

def send(topic,message):
    print("= Publish ========================")
    messageJson = json.dumps(message)
    client.publish(topic, messageJson, 0) # publish
    print('Published topic %s: %s' % (topic, messageJson))
    print("====================================")

# AWS IoT connect

if __name__ == '__main__':
    client.connect()
    client.subscribe(SUB_TOPIC, 1, onSubscribe)

    loopCount=0
    while True:
        message = {}
        message['message'] = "test"
        message['sequence'] = loopCount
        send(PUB_TOPIC_1, message) # publish
        loopCount += 1
        time.sleep(5)