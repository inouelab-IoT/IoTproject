var storageRef = firebase.storage().ref();

window.onload = function() {
    if (!localStorage) {
        console.log('ローカルストレージに対応していない');
    }
    // セッションストレージ対応判定
    if (!sessionStorage) {
        console.log('セッションストレージに対応していない');
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
        //sensor_on(); //開始
        document.getElementById("startstop").innerHTML = "停止";
    } else {
        console.log("停止");
        //sensor_off(); //停止
        document.getElementById("startstop").innerHTML = "測定開始";
    }
}

function console_clear() {
    document.getElementById('console_log').innerHTML = "";
}


console.log = function(log) {
    document.getElementById('console_log').innerHTML += log + "\n";
}

function open_srclist() {
    // selectで選択した値を取得
    var value = document.getElementById("src_dir").value;
    //document.getElementById("src_list").innerHTML = value;
    removeChildren(document.getElementById("src_list"))

    if (value == "sample") {
        storageRef.child("source_code/all").listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addli(itemRef.name, "src_list", itemRef.fullPath);
            });
        }).catch(function(error) {
            console.error(error);
        })
    } else if (value == "user") {
        storageRef.child("source_code/users" + uid).listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addli(itemRef.name, "src_list", itemRef.fullPath);
            });
        }).catch(function(error) {
            console.error(error);
        })
    }
}

function addli(name, ul_id, fullpath) {
    var newLi = document.createElement("li");
    var link = document.createElement("a");

    link.innerText = name;
    link.href = "javascript:li_crick('" + fullpath + "','" + name + "');";

    // リストに追加
    newLi.appendChild(link);
    var list = document.getElementById(ul_id);
    list.appendChild(newLi);
}

function removeChildren(x) {
    if (x.hasChildNodes()) {
        while (x.childNodes.length > 0) {
            x.removeChild(x.firstChild)
        }
    }
}


//外部Js組込み
function appendScript(URL) {
    var el = document.createElement('script');
    el.src = URL;
    document.body.appendChild(el);
};