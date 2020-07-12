window.onload=function(){
	if(!localStorage) {
		console.log('ローカルストレージに対応していない');
	}
	// セッションストレージ対応判定
	if(!sessionStorage) {
		console.log('セッションストレージに対応していない');
		}
	
	text_update();
}


//ローカルストレージを削除
function removeConfig(){
	localStorage.clear();
	console.log("削除しました");
}


function text_update(){
	document.getElementById('sendMes_area').innerHTML = "ここに入力\n\n---------\nSender : " + displayName + "\nE-mail : " + email;
}

function send_Message(){
//未実装

}


