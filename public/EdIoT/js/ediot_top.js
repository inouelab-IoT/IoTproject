window.onload=function(){
	if(!localStorage) {
		console.log('ローカルストレージに対応していない');
	}
	// セッションストレージ対応判定
	if(!sessionStorage) {
		console.log('セッションストレージに対応していない');
		}
	
	news_uppdate();
}

//ローカルストレージを削除
function removeConfig(){
	localStorage.clear();
	console.log("削除しました");
}


function news_uppdate(){
	document.getElementById('news').innerHTML = news_get() + "\n" + document.getElementById('news').innerHTML;
}

function news_get(){
	var date = new Date() ;
	var time_unix = date.getTime() ;
	var new_news = "update" + time_unix
	return new_news
}


