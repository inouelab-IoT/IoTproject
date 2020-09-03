import urllib.request
import urllib.parse
import boto3
import time
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

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

topic = clientId + "/postLine"

# IFTTT 初期化
event_name = "postLine"
account = "cd_auNitkCwO0hnJBuj_1C"
URL = "https://maker.ifttt.com/trigger/" + event_name + "/with/key/" + account

def send_ifttt(message):
	data = {
		"value1": message,
		"value2": "From MQTT"
	}
    
	# ここでエンコードして文字→バイトにする！
	data = urllib.parse.urlencode(data).encode("utf-8")
	with urllib.request.urlopen(URL, data=data) as res:
		html = res.read().decode("utf-8")
		print(html)


def onSubscribe(client, userdata, message):
    print("message:{} topic:{}".format(message.payload, message.topic))
    send_ifttt(message.payload)

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