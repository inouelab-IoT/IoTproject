var storageRef = firebase.storage().ref();
var timer;
var srctext = "asasas";

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
        StoregeToText(filepath);

    } else {
        console.log("停止");
        if (timer) {
            clearInterval(timer);
        }
        removeChildren(document.getElementById("addscript"));
        //window.location.reload(true);
        //sensor_off(); //停止
        document.getElementById("app_frame").className = "";
        w = window.open(null, "app_frame");
        w.location.reload();
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
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                xmlHttp = null;
            }
        }

        xmlHttp.open('GET', url, false);
        xmlHttp.send();

        if (xmlHttp.status === 200) {
            srctext = xmlHttp.responseText
            run_src(srctext, fullpath);
        }
    }).catch(function(error) {
        //alert('catch_error' + error);
        srctext = "catch_error";
    });
}


function run_src(srctext, filepath) {
    if (srctext == "catch_error") {
        document.getElementById("startstop").disabled = false;
        return false;
    } else {
        if (get_extension(filepath) == "html") {
            var w;
            w = window.open(null, "app_frame");
            w.location.reload();
            w.document.writeln(srctext);
            w.document.close();
            document.getElementById("app_frame").className = "popup";
        }
        if (get_extension(filepath) == "js") {
            appendScript(srctext);
        }
        document.getElementById("scriptstate").innerHTML = "実行中：" + filepath;
        //開始
        document.getElementById("startstop").disabled = false;
        document.getElementById("startstop").innerHTML = "停止";
        return true;
    }
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

console.log = function(log) {
    document.getElementById('console_log').innerHTML += log + "\n";
    document.getElementById('console_log').innerHTML.scrollTop = document.getElementById('console_log').innerHTML.scrollHeight;
}

console.error = function(error) {
    document.getElementById('console_log').innerHTML += error.message + "\n";
    document.getElementById('console_log').innerHTML.scrollTop = document.getElementById('console_log').innerHTML.scrollHeight;
}

console.warn = function(warn) {
    document.getElementById('console_log').innerHTML += warn + "\n";
    document.getElementById('console_log').scrollTop = document.getElementById('console_log').innerHTML.scrollHeight;
}

function get_extension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

function sleep(waitMsec) {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
}