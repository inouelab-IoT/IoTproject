window.onload = function() {
    text_update();
    if (!localStorage) {
        console.log('ローカルストレージに対応していない');
    }
    // セッションストレージ対応判定
    if (!sessionStorage) {
        console.log('セッションストレージに対応していない');
    }

}


var clientId = "inouelabiot"; // "YOUR_USER_NAME"
var awsRegion = 'ap-northeast-1'; // Your Region
var deviceName = "browser";
var awsIotEndpoint = 'anmwgx2rsnw45-ats.iot.ap-northeast-1.amazonaws.com'; // Require 'lowercamelcase'!!
var AWS_ACCESS_KEY = 'AKIA34MKVHJNJI7DNDW4'; //
var AWS_SECRET_ACCESS_KEY = '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';

//ローカルストレージを削除
function removeConfig() {
    localStorage.clear();
    console.log("削除しました");
}


function text_update() {
    document.getElementById('sendMes_area').innerHTML = "ここに入力\n\n---------\nSender : " + displayName + "\nE-mail : " + email;
}

function send_Message() {

    var time = moment.utc();
    var dateStamp = time.format('YYYYMMDD');
    var date = dateStamp + 'T' + time.format('HHmmss') + 'Z';

    var say = document.getElementById('sendMes_area')
    var sendMes = {
        messages: say.value,
        sender: deviceName,
        date: date
    }
    topic = clientId + "/postLine";
    send(JSON.stringify(sendMes), topic);
    say.value = '';

}
//署名作成

function SigV4Utils() {}

SigV4Utils.sign = function(key, msg) {
    var hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
};

SigV4Utils.sha256 = function(msg) {
    var hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
};

SigV4Utils.getSignatureKey = function(key, dateStamp, regionName, serviceName) {
    var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
};

function createEndpoint(regionName, awsIotEndpoint, accessKey, secretKey) {
    var time = moment.utc();
    var dateStamp = time.format('YYYYMMDD');
    var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    var service = 'iotdevicegateway';
    var region = regionName;
    var secretKey = secretKey;
    var accessKey = accessKey;
    var algorithm = 'AWS4-HMAC-SHA256';
    var method = 'GET';
    var canonicalUri = '/mqtt';
    var host = awsIotEndpoint;

    var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    var canonicalHeaders = 'host:' + host + '\n';
    var payloadHash = SigV4Utils.sha256('');
    var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

    var stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + SigV4Utils.sha256(canonicalRequest);
    var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
    var signature = SigV4Utils.sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    return 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
}

var endpoint = createEndpoint(
    awsRegion, // Your Region
    awsIotEndpoint, // Require 'lowercamelcase'!!
    AWS_ACCESS_KEY, //
    AWS_SECRET_ACCESS_KEY);
var client = new Paho.MQTT.Client(endpoint, clientId);


var connectOptions = {
    useSSL: true,
    timeout: 3,
    mqttVersion: 4,
    onSuccess: onConnect
};
client.connect(connectOptions);

function onConnect() {
    console.log("connected");
}


function send(content, topic) {
    var message = new Paho.MQTT.Message(content);
    message.destinationName = topic;
    client.send(message);
    console.log("sent");
}

/*
function onMessage(message) {
    data.messages.push(message.payloadString);
    console.log("message received: " + message.payloadString);
}
*/