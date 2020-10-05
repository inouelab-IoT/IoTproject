#!/usr/bin/env python
# -*- coding:utf-8 -*-

import boto3
import time
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
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

topic = clientId + "/#"

def onSubscribe(client, userdata, message):
    print("= Subscribe ========================")
    print("message:{} topic:{}".format(message.payload, message.topic))
    print("topic: " + message.topic)
    print("payload: " + str(message.payload.decode('utf-8')))
    print("====================================")

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