var flag_sup = 0;
var watchID_GPS;

var Max_acc = [0, 0, 0, 0];
var Max_accg = [0, 0, 0, 0];
var Max_accd = [0, 0, 0];
var Min_acc = [0, 0, 0];
var Min_accg = [0, 0, 0];
var Min_accd = [0, 0, 0];

function Infomation(data, text) {
    var d = data;
    var t = text;
    if (d != undefined) {
        document.write("<p><span class='info'>" + text + "</span></p>");
        document.write("<p style='margin-left: 1em;'>" + d + "</p>");
    }
}

//Geolocation API成功時のコールバック関数
function successCallback(position) {
    if (position.coords.latitude)
        document.getElementById("tx_latitude").innerHTML = MyLatitude(position.coords.latitude);
    else
        document.getElementById("tx_latitude").innerHTML = "---";

    if (position.coords.longitude)
        document.getElementById("tx_longitude").innerHTML = MyLongitude(position.coords.longitude);
    else
        document.getElementById("tx_longitude").innerHTML = "---";

    if (position.coords.altitude)
        document.getElementById("tx_altitude").innerHTML = position.coords.altitude + "m";
    else
        document.getElementById("tx_altitude").innerHTML = "---";

    if (position.coords.accuracy)
        document.getElementById("tx_accuracy").innerHTML = position.coords.accuracy + "m";
    else
        document.getElementById("tx_accuracy").innerHTML = "---";

    if (position.coords.altitudeAccuracy)
        document.getElementById("tx_altitudeAccuracy").innerHTML = position.coords.altitudeAccuracy + "m";
    else
        document.getElementById("tx_altitudeAccuracy").innerHTML = "---";

    if (position.coords.heading)
        document.getElementById("tx_heading").innerHTML = MyHeading(position.coords.heading);
    else
        document.getElementById("tx_heading").innerHTML = "---";

    if (position.coords.speed)
        document.getElementById("tx_speed").innerHTML = MySpeed(position.coords.speed);
    else
        document.getElementById("tx_speed").innerHTML = "---";


    document.getElementById("msg_error").innerHTML = "---";

}
//Geolocation APIエラー時のコールバック関数
function errorCallback(error) {
    var err_msg = "";
    switch (error.code) {
        case 1:
            err_msg = "Error:位置情報の取得が許可がされていません。";
            break;
        case 2:
            err_msg = "Error:デバイスの位置情報が利用できません。";
            break;
        case 3:
            err_msg = "Error:タイムアウトしました。";
            break;
    }
    document.getElementById("msg_error").innerHTML = err_msg;
    document.getElementById("tx_latitude").innerHTML = "---";
    document.getElementById("tx_longitude").innerHTML = "---";
    document.getElementById("tx_altitude").innerHTML = "---";
    document.getElementById("tx_accuracy").innerHTML = "---";
    document.getElementById("tx_altitudeAccuracy").innerHTML = "---";
    document.getElementById("tx_heading").innerHTML = "---";
    document.getElementById("tx_speed").innerHTML = "---";
}

//緯度を整形する
function MyLatitude(latitude) {
    var NorS;
    var Lat_Deg;
    var Lat_Min;
    var Lat_Sec;
    var Lat_mSec;
    //北緯か南緯
    if (latitude > 0.0)
        NorS = "北緯";
    else
        NorS = "南緯";
    latitude = Math.abs(latitude); //絶対値化
    Lat_Deg = Math.floor(latitude); //度
    Lat_Min = Math.floor((latitude - Lat_Deg) * 60); //分
    Lat_Sec = Math.floor((latitude - Lat_Deg - Lat_Min / 60) * 3600); //秒
    Lat_mSec = Math.floor((latitude - Lat_Deg - Lat_Min / 60 - Lat_Sec / 3600) * 3600000); //ミリ秒
    if (Lat_mSec < 10) Lat_mSec = "00" + Lat_mSec;
    else if (Lat_mSec < 100) Lat_mSec = "0" + Lat_mSec;

    return NorS + Lat_Deg + "度" + Lat_Min + "分" + Lat_Sec + "秒" + Lat_mSec;
}
//経度を整形する
function MyLongitude(longitude) {
    var EorW;
    var Lon_Deg;
    var Lon_Min;
    var Lon_Sec;
    var Lon_mSec;
    //東経か西経か
    if (longitude > 0.0)
        EorW = "東経";
    else
        EorW = "西経";
    longitude = Math.abs(longitude); //絶対値化
    Lon_Deg = Math.floor(longitude); //度
    Lon_Min = Math.floor((longitude - Lon_Deg) * 60); //分
    Lon_Sec = Math.floor((longitude - Lon_Deg - Lon_Min / 60) * 3600); //秒
    Lon_mSec = Math.round((longitude - Lon_Deg - Lon_Min / 60 - Lon_Sec / 3600) * 3600000); //ミリ秒
    if (Lon_mSec < 10) Lon_mSec = "00" + Lon_mSec;
    else if (Lon_mSec < 100) Lon_mSec = "0" + Lon_mSec;

    return EorW + Lon_Deg + "度" + Lon_Min + "分" + Lon_Sec + "秒" + Lon_mSec;
}
//方角を整形する
function MyHeading(heading) {
    var head16;

    if (heading < 11.25)
        head16 = "北";
    else if (heading < 22.5 + 11.25)
        head16 = "北北東";
    else if (heading < 22.5 * 2 + 11.25)
        head16 = "北東";
    else if (heading < 22.5 * 3 + 11.25)
        head16 = "東北東";
    else if (heading < 22.5 * 4 + 11.25)
        head16 = "東";
    else if (heading < 22.5 * 5 + 11.25)
        head16 = "東南東";
    else if (heading < 22.5 * 6 + 11.25)
        head16 = "南東";
    else if (heading < 22.5 * 7 + 11.25)
        head16 = "南南東";
    else if (heading < 22.5 * 8 + 11.25)
        head16 = "南";
    else if (heading < 22.5 * 9 + 11.25)
        head16 = "南南西";
    else if (heading < 22.5 * 10 + 11.25)
        head16 = "南西";
    else if (heading < 22.5 * 11 + 11.25)
        head16 = "西南西";
    else if (heading < 22.5 * 12 + 11.25)
        head16 = "西";
    else if (heading < 22.5 * 13 + 11.25)
        head16 = "西北西";
    else if (heading < 22.5 * 14 + 11.25)
        head16 = "北西";
    else if (heading < 22.5 * 15 + 11.25)
        head16 = "北北西";
    else if (heading < 22.5 * 16 + 11.25)
        head16 = "北";
    else
        head16 = "異常値";


    return head16 + "（方位角：" + Math.round(heading) + "deg.）"
}
//速さを整形する
function MySpeed(speed) {
    return (speed * 3.6).toFixed(2) + "km/h　" + (speed).toFixed(2) + "m/s　" + (speed / 0.44704).toFixed(2) + "mph　" + (speed * 3600 / 1852).toFixed(2) + "knot";
}

//照度センサのイベントハンドラ
var deviceLightHandler = function(event) {
        document.getElementById("tx_lux").innerHTML = event.value.toFixed(2) + "lx";
    }
    //近接センサのイベントハンドラ
var deviceProximityHandler = function(event) {
    document.getElementById("tx_dist_cur").innerHTML = event.value.toFixed(2) + "cm";
    document.getElementById("tx_dist_max").innerHTML = event.max.toFixed(2) + "cm";
    document.getElementById("tx_dist_min").innerHTML = event.min.toFixed(2) + "cm";
}
var userProximityHandler = function(event) {
        document.getElementById("tx_dist_boo").innerHTML = (event.near ? "TRUE" : "FALSE");
    }
    //電子コンパスのイベントハンドラ
var orientationHandler = function(event) {
        var absolute = event.absolute;
        var alpha = event.alpha;
        var beta = event.beta;
        var gamma = event.gamma;
        //北極:0度、左回転すると増える（よく使われる方位角と逆周りなので符号反転する）
        document.getElementById("tx_or_alpha").innerHTML = MyHeading(360 - alpha);
        //仰俯角：デバイスの上端が水平下向きになるのが正方向
        document.getElementById("tx_or_beta").innerHTML = (beta > 0.0 ? "仰角" : "俯角") + Math.abs(beta).toFixed(1) + "deg.";
        //ロール角：デバイスの右が正方向
        document.getElementById("tx_or_gamma").innerHTML = (gamma < 0.0 ? "左" : "右") + Math.abs(gamma).toFixed(1) + "deg.";

    }
    //加速度センサのイベントハンドラ
var deviceMotionHandler = function(event) {
    var acc = event.acceleration;
    var acc_g = event.accelerationIncludingGravity;
    var rot = event.rotationRate;

    var acc_ab = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    var acc_g_ab = Math.sqrt(acc_g.x * acc_g.x + acc_g.y * acc_g.y + acc_g.z * acc_g.z);

    if (event.acceleration) {

        document.getElementById("tx_acc_x").innerHTML = "X:" + acc.x.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_y").innerHTML = "Y:" + acc.y.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_z").innerHTML = "Z:" + acc.z.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_ab").innerHTML = "絶対値" + acc_ab.toFixed(2) + "m/s<sup>2</sup>";

        document.getElementById("tx_acc_xg").innerHTML = "X:" + acc_g.x.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_yg").innerHTML = "Y:" + acc_g.y.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_zg").innerHTML = "Z:" + acc_g.z.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_abg").innerHTML = "絶対値" + acc_g_ab.toFixed(2) + "m/s<sup>2</sup>";

        document.getElementById("tx_acc_a").innerHTML = "α:" + rot.alpha.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_b").innerHTML = "β:" + rot.beta.toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_g").innerHTML = "γ:" + rot.gamma.toFixed(2) + "m/s<sup>2</sup>";


        //最大値記録
        if (Max_acc[0] < acc.x) Max_acc[0] = acc.x;
        if (Max_acc[1] < acc.y) Max_acc[1] = acc.y;
        if (Max_acc[2] < acc.z) Max_acc[2] = acc.z;
        if (Max_acc[3] < acc_ab) Max_acc[3] = acc_ab;

        if (Max_accg[0] < acc_g.x) Max_accg[0] = acc_g.x;
        if (Max_accg[1] < acc_g.y) Max_accg[1] = acc_g.y;
        if (Max_accg[2] < acc_g.z) Max_accg[2] = acc_g.z;
        if (Max_accg[3] < acc_g_ab) Max_accg[3] = acc_g_ab;

        if (Max_accd[0] < rot.alpha) Max_accd[0] = rot.alpha;
        if (Max_accd[1] < rot.beta) Max_accd[1] = rot.beta;
        if (Max_accd[2] < rot.gamma) Max_accd[2] = rot.gamma;


        //最小値記録
        if (Min_acc[0] > acc.x) Min_acc[0] = acc.x;
        if (Min_acc[1] > acc.y) Min_acc[1] = acc.y;
        if (Min_acc[2] > acc.z) Min_acc[2] = acc.z;

        if (Min_accg[0] > acc_g.x) Min_accg[0] = acc_g.x;
        if (Min_accg[1] > acc_g.y) Min_accg[1] = acc_g.y;
        if (Min_accg[2] > acc_g.z) Min_accg[2] = acc_g.z;

        if (Min_accd[0] > rot.alpha) Min_accd[0] = rot.alpha;
        if (Min_accd[1] > rot.beta) Min_accd[1] = rot.beta;
        if (Min_accd[2] > rot.gamma) Min_accd[2] = rot.gamma;

        document.getElementById("tx_acc_xmx").innerHTML = "X:" + Max_acc[0].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_ymx").innerHTML = "Y:" + Max_acc[1].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_zmx").innerHTML = "Z:" + Max_acc[2].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_abmx").innerHTML = "絶対値" + Max_acc[3].toFixed(2) + "m/s<sup>2</sup>";

        document.getElementById("tx_acc_xgmx").innerHTML = "X:" + Max_accg[0].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_ygmx").innerHTML = "Y:" + Max_accg[1].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_zgmx").innerHTML = "Z:" + Max_accg[2].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_abgmx").innerHTML = "絶対値" + Max_accg[3].toFixed(2) + "m/s<sup>2</sup>";

        document.getElementById("tx_acc_xmi").innerHTML = "X:" + Min_acc[0].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_ymi").innerHTML = "Y:" + Min_acc[1].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_zmi").innerHTML = "Z:" + Min_acc[2].toFixed(2) + "m/s<sup>2</sup>";

        document.getElementById("tx_acc_xgmi").innerHTML = "X:" + Min_accg[0].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_ygmi").innerHTML = "Y:" + Min_accg[1].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_zgmi").innerHTML = "Z:" + Min_accg[2].toFixed(2) + "m/s<sup>2</sup>";

        document.getElementById("tx_acc_amx").innerHTML = "α:" + Max_accd[0].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_bmx").innerHTML = "β:" + Max_accd[1].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_gmx").innerHTML = "γ:" + Max_accd[2].toFixed(2) + "m/s<sup>2</sup>";

        document.getElementById("tx_acc_ami").innerHTML = "α:" + Min_accd[0].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_bmi").innerHTML = "β:" + Min_accd[1].toFixed(2) + "m/s<sup>2</sup>";
        document.getElementById("tx_acc_gmi").innerHTML = "γ:" + Min_accd[2].toFixed(2) + "m/s<sup>2</sup>";

    }

}

//バッテリー情報
function MyBattery() {
    if (navigator.getBattery) {
        navigator.getBattery().then(function(battery) {

            document.getElementById("tx_battery_charge").innerHTML = (battery.charging ? "充電中" : "放電中");
            document.getElementById("tx_battery_level").innerHTML = (battery.level * 100).toFixed(0) + "%";
            if (battery.chargingTime < Number.POSITIVE_INFINITY) {
                document.getElementById("tx_battery_remain1").innerHTML = "充電完了まで推定" + battery.chargingTime + "秒";
            } else {
                document.getElementById("tx_battery_remain1").innerHTML = "---";
            }
            if (battery.dischargingTime < Number.POSITIVE_INFINITY) {
                document.getElementById("tx_battery_remain2").innerHTML = "使用可能時間は推定" + battery.dischargingTime + "秒";
            } else {
                document.getElementById("tx_battery_remain2").innerHTML = "---";
            }

            battery.addEventListener('chargingchange', function() {
                document.getElementById("tx_battery_charge").innerHTML = (battery.charging ? "充電中" : "放電中");
            });

            battery.addEventListener('levelchange', function() {
                document.getElementById("tx_battery_level").innerHTML = (battery.level * 100).toFixed(0) + "%";
            });

            battery.addEventListener('chargingtimechange', function() {
                document.getElementById("tx_battery_remain2").innerHTML = "充電完了まで推定" + battery.chargingTime + "秒";
                document.getElementById("tx_battery_remain1").innerHTML = "---";
            });

            battery.addEventListener('dischargingtimechange', function() {
                document.getElementById("tx_battery_remain1").innerHTML = "使用可能時間は推定" + battery.dischargingTime + "秒";
                document.getElementById("tx_battery_remain2").innerHTML = "---";
            });

        });
    }
}
//画面情報
var deviceOrientationScreenHandler = function() {
    document.getElementById("tx_screen_ori").innerHTML = screen.orientation.type;
    document.getElementById("tx_screen_ang").innerHTML = screen.orientation.angle + "deg.";
}

//イベント登録
if (window.addEventListener) {
    window.addEventListener('devicelight', deviceLightHandler);
    window.addEventListener('deviceproximity', deviceProximityHandler);
    window.addEventListener('userproximity', userProximityHandler);
    window.addEventListener('deviceorientation', orientationHandler);
    window.addEventListener('devicemotion', deviceMotionHandler);

}
if (screen.orientation.addEventListener) {
    screen.orientation.addEventListener('change', deviceOrientationScreenHandler);
}