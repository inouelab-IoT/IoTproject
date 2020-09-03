import urllib.request, urllib.parse

event_name = "postSlack"
account = "cd_auNitkCwO0hnJBuj_1C"
URL = "https://maker.ifttt.com/trigger/" + event_name + "/with/key/" + account

data = {
	"value1": "HELLO!!Slack",
	"value2": "TEST in Las Vegas",
	"value3": "http://res.cloudinary.com/simpleview/image/upload/v1497480003/clients/lasvegas/strip_b86ddbea-3add-4995-b449-ac85d700b027.jpg"
}

# ここでエンコードして文字→バイトにする！
data = urllib.parse.urlencode(data).encode("utf-8")
with urllib.request.urlopen(URL, data=data) as res:
	html = res.read().decode("utf-8")
	print(html)
