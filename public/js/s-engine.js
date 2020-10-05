console.log("test");

window.onload = function () {
	if (!localStorage) {
		console.log('ローカルストレージに対応していない');
	}
	// セッションストレージ対応判定
	if (!sessionStorage) {
		console.logt('セッションストレージに対応していない');
	}
}

//ローカルストレージを削除
function removeConfig() {
	localStorage.clear();
	console.log("削除しました");
}


function startstop() {
	if (document.getElementById("startstop").innerHTML == "測定開始") {
		console.log("測定開始");
		sensor_on(); //開始
		document.getElementById("startstop").innerHTML = "停止";
	}
	else {
		console.log("停止");
		sensor_off(); //停止
		document.getElementById("startstop").innerHTML = "測定開始";
	}
}


function sensor_off() {
	window.removeEventListener("devicemotion", sensor);
}


function sensor_on() {
	localStorage.clear(); //スタート時にクリアー
	console.log("sensor_on");
	window.addEventListener("devicemotion", sensor);
}

function sensor(e) {
	console.trace();
	console.log("measuring");


	//日付（タイムスタンプ）
	var date = new Date();
	var time_unix = date.getTime();
	printValue("unixtime", time_unix);

	//加速度
	var acc = e.acceleration;
	var x = Numlimit5(acc.x);
	var y = Numlimit5(acc.y);
	var z = Numlimit5(acc.z);

	//加速度(重力加速度)
	var acc_g = e.accelerationIncludingGravity;
	var gx = Numlimit5(acc_g.x);
	var gy = Numlimit5(acc_g.y);
	var gz = Numlimit5(acc_g.z);

	//回転
	var rota_r = e.rotationRate;
	var ra = Numlimit5(rota_r.alpha);
	var rb = Numlimit5(rota_r.beta);
	var rg = Numlimit5(rota_r.gamma);

	//取得値の表示

	printValue('acc-x', x); //x
	printValue('acc-y', y); //y
	printValue('acc-z', z); //z

	console.log('acc-x', x); //x
	console.log('acc-y', y); //y
	console.log('acc-z', z); //z

	printValue('acc-gx', gx); //gx
	printValue('acc-gy', gy); //gy
	printValue('acc-gz', gz); //gz 

	printValue('rr-a', ra); //ra
	printValue('rr-b', rb); //rb
	printValue('rr-g', rg); //rg 

	//保存データ
	var datalist = { acc_x: x, acc_y: y, acc_z: z, acc_gx: gx, acc_gy: gy, acc_gz: gz, rr_a: ra, rr_b: rb, rr_g: rg }

	//ローカルストレージに記録
	localStorage.setItem(time_unix, JSON.stringify(datalist));

	function printValue(id, value) {
		var id_obj = document.getElementById(id);
		id_obj.innerHTML = value;
	}
	function Numlimit5(obj) {
		return Number(obj).toFixed(5);
	}

}


function list() {
	alert("> キーの一覧を列挙する");
	for (var i = 0; i < localStorage.length; i++) {

		var localstragekey = localStorage.key(i)
		var d_acc_x = "";
		var d_acc_gx = "";
		var d_rr_a = "";

		if (localStorage.getItem(localstragekey)) {

			var d = JSON.parse(localStorage.getItem(localstragekey));
			d_acc_x = d.acc_x;
			d_acc_gx = d.acc_gx;
			d_rr_a = d.rr_a;
		}
		display_row = localstragekey + "," + d_acc_x + "," + d_acc_gx + "," + d_rr_a;

		alert(display_row);    // 'banana','mango'
	}

}


//function
function exportcsv() {

	var finalVal = '';

	for (var i = 0; i < localStorage.length; i++) {

		var localstragekey = localStorage.key(i)
		var d_acc_x = "";
		var d_acc_y = "";
		var d_acc_z = "";

		var d_acc_gx = "";
		var d_acc_gy = "";
		var d_acc_gz = "";

		var d_rr_a = "";
		var d_rr_b = "";
		var d_rr_g = "";

		if (localStorage.getItem(localstragekey)) {

			var d = JSON.parse(localStorage.getItem(localstragekey));
			d_acc_x = d.acc_x;
			d_acc_y = d.acc_y;
			d_acc_z = d.acc_z;

			d_acc_gx = d.acc_gx;
			d_acc_gy = d.acc_gy;
			d_acc_gz = d.acc_gz;

			d_rr_a = d.rr_a;
			d_rr_b = d.rr_b;
			d_rr_g = d.rr_g;
		}

		//キーの値をCSV用にリスト化
		finalVal += localstragekey + "," + d_acc_x + "," + d_acc_y + "," + d_acc_z + "," + d_acc_gx + "," + d_acc_gy + "," + d_acc_gz + "," + d_rr_a + "," + d_rr_b + "," + d_rr_g + '\n';
	}



	// Display the month, day, and year. getMonth() returns a 0-based number.
	var date = new Date();
	var year = date.getFullYear();
	var month = ("0" + (date.getMonth() + 1)).slice(-2);
	var day = ("0" + date.getDate()).slice(-2);


	//set csv-data to a-tag on html
	var download = document.getElementById('download');
	download.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(finalVal));

	download.setAttribute('download', 'sensor' + year + month + day + '.csv');


}
