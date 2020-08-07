var storageRef = firebase.storage().ref();
var timer;
//var run_type = "js";

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
    if (document.getElementById("startstop").innerHTML == "実行") {
        document.getElementById("startstop").disabled = true;
        console.log("実行");
        var filepath = document.getElementById("src_list").value
        if (filepath == "----") {
            document.getElementById("startstop").disabled = false;
            return false;
        }
        document.getElementById("scriptstate").innerHTML = "ファイル読み込み中：" + filepath;

        //js storageからDownload & 読み込み
        if (StoregeToText(filepath) == "catch_error") {
            document.getElementById("startstop").disabled = false;
            return false;
        } else {
            document.getElementById("scriptstate").innerHTML = "実行中：" + filepath;
            //開始
            document.getElementById("startstop").disabled = false;
            document.getElementById("startstop").innerHTML = "停止";
            return true;
        }
    } else {
        console.log("停止");
        if (timer) {
            clearInterval(timer);
        }
        removeChildren(document.getElementById("addscript"));
        //window.location.reload(true);
        //sensor_off(); //停止
        document.getElementById("startstop").innerHTML = "実行";
        document.getElementById("scriptstate").innerHTML = "";
    }
}


function open_srclist() {
    // selectで選択した値を取得
    var value = document.getElementById("src_dir").value;
    //document.getElementById("src_list").innerHTML = value;
    removeChildren(document.getElementById("src_list"))
    addoption("----", "src_list", "----");

    if (value == "sample") {
        storageRef.child("source_code/all").listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addoption(itemRef.name, "src_list", itemRef.fullPath);
            });
        }).catch(function(error) {
            alert('アクセス拒否');
        })
    } else if (value == "user") {
        storageRef.child("source_code/users/" + uid).listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addoption(itemRef.name, "src_list", itemRef.fullPath);
            });
        }).catch(function(error) {
            alert('アクセス拒否');
        })
    } else if (value == "group") {
        if (groupname == "") {
            alert('未所属');
        } else {
            storageRef.child("source_code/groups/" + groupname).listAll().then(function(result) {
                result.items.forEach(function(itemRef) {
                    addoption(itemRef.name, "src_list", itemRef.fullPath);
                });
            }).catch(function(error) {
                alert('アクセス拒否');
            })
        }
    }
}

function StoregeToText(fullpath) {
    //console.log("load path : " + fullpath)

    storageRef.child(fullpath).getDownloadURL().then(function(url) {
        var response
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                xmlHttp = null;
            }
        }
        xmlHttp.addEventListener('load', (event) => {
            response = event.target.responseText;
            //console.log(response);
            if (get_extension(fullpath) == "html") {
                run_newHTML(response)
            }
            if (get_extension(fullpath) == "js") {
                appendScript(response);
            }
        });
        xmlHttp.open("GET", url);
        xmlHttp.send();
        return "success";

    }).catch(function(error) {
        alert('アクセス拒否' + error);
        return "catch_error";
    });
}

function addoption(display, id, value) {
    var newOption = document.createElement("option");

    newOption.innerText = display;
    newOption.value = value;

    // リストに追加
    var select_opt = document.getElementById(id);
    select_opt.appendChild(newOption);
}

function removeChildren(x) {
    if (x.hasChildNodes()) {
        while (x.childNodes.length > 0) {
            x.removeChild(x.firstChild)
        }
    }
}


//外部Js組込み
function appendScript(srctext) {
    var newScript = document.getElementById("addscript");
    var el = document.createElement('script');
    el.innerHTML = srctext;
    newScript.appendChild(el);
}

function console_clear() {
    document.getElementById('console_log').innerHTML = "";
    window.location.reload(true);
}

//HTML new page open
function run_newHTML(srctext) {
    var obj = window.open();
    obj.document.open();
    obj.document.write(srctext);
    obj.document.close();
}

console.log = function(log) {
    var obj = document.getElementById('console_log');
    obj.innerHTML += log + "\n";
    obj.scrollTop = obj.scrollHeight;
}

console.error = function(error) {
    var obj = document.getElementById('console_log');
    obj.innerHTML += error.message + "\n";
    obj.scrollTop = obj.scrollHeight;
}

console.warn = function(warn) {
    var obj = document.getElementById('console_log');
    obj.innerHTML += warn + "\n";
    obj.scrollTop = obj.scrollHeight;
}

function get_extension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}