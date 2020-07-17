window.onload = function() {
    if (!localStorage) {
        console.log('ローカルストレージに対応していない');
    }
    // セッションストレージ対応判定
    if (!sessionStorage) {
        console.log('セッションストレージに対応していない');
    }

    news_uppdate();
}

//ローカルストレージを削除
function removeConfig() {
    localStorage.clear();
    console.log("削除しました");
}


// Newsを更新
function news_uppdate() {
    //    writeNewsData(document.getElementById('news').innerHTML);
    firebase.database().ref("news").on("value", function(snapshot) {
        var logs = snapshot.val();
        console.log(logs);
        for (key in logs) {
            document.getElementById('news').innerHTML = logs[key].text;
        }
    });
}

function writeNewsData(text) {
    var date = new Date();
    var time_unix = date.getTime();
    firebase.database().ref('news').push({
        text: text,
        user_id: uid,
        date: time_unix
    }).catch(function(error) {
        alert(error.message);
    });
}