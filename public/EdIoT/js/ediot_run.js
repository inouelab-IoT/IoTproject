window.onload=function(){
if(!localStorage) {
	console.log('ローカルストレージに対応していない');
}
// セッションストレージ対応判定
if(!sessionStorage) {
	console.log('セッションストレージに対応していない');
	}
}

//ローカルストレージを削除
function removeConfig(){
	localStorage.clear();
	console.log("削除しました");
}


function startstop(){
	if (document.getElementById("startstop").innerHTML=="測定開始"){
		console.log("測定開始");
		//sensor_on(); //開始
		document.getElementById("startstop").innerHTML="停止";
	} 
	else {
		console.log("停止");
		//sensor_off(); //停止
		document.getElementById("startstop").innerHTML="測定開始";
	}
}

function console_clear(){
	document.getElementById('console_log').innerHTML = "";
}


console.log = function (log) {
	document.getElementById('console_log').innerHTML += log + "\n" ;
}
