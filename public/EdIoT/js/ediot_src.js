var storageRef = firebase.storage().ref();

document.getElementById('upload').addEventListener('click', function() {
    var value = document.getElementById("up_dir").value;
    var obj = document.getElementById('file');
    var files = obj.files;
    var upfile = files[0];

    if (value == user)
        var uploadTask = storageRef.child('/source_code/users/' + uid + '/' + upfile.name).put(upfile).then(function(snapshot) {
            alert('アップロードしました');
            obj.value = "";
        });
    else if (value == group)
        var uploadTask = storageRef.child('/source_code/users/' + uid + '/' + upfile.name).put(upfile).then(function(snapshot) {
            alert('アップロードしました');
            obj.value = "";
        });
});


function open_srclist() {
    // selectで選択した値を取得
    var value = document.getElementById("src_dir").value;
    //document.getElementById("src_list").innerHTML = value;
    removeChildren(document.getElementById("src_list"))
    if (value == "sample") {
        storageRef.child("source_code/all").listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addli(itemRef.name, "src_list", itemRef.fullPath)
                document.getElementById("file_place").innerText = itemRef.parent.fullPath
            });
        }).catch(function(error) {
            console.error(error);
        })
    } else if (value == "user") {
        storageRef.child("users/" + uid).listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addli(itemRef.name, "src_list", itemRef.fullPath)
                document.getElementById("file_place").innerText = itemRef.parent.fullPath
            });
        }).catch(function(error) {
            console.error(error);
        })
    } else if (value == "group") {
        storageRef.child("group/" + gid).listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addli(itemRef.name, "src_list", itemRef.fullPath)
                document.getElementById("file_place").innerText = itemRef.parent.fullPath
            });
        }).catch(function(error) {
            removeChildren(document.getElementById("src_list"))
            console.error(error);
        })
    }
}


function display_srctxt(fullpath, name) {
    document.getElementById("input_srcname").value = name;

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
        xmlHttp.addEventListener('load', (event) => {
            const response = event.target.responseText;
            document.getElementById("source_edit").innerHTML = response;
        });
        xmlHttp.open("GET", url);

        xmlHttp.send();
    }).catch(function(error) {
        console.log(error)
    });
}


function addli(name, ul_id, fullpath) {
    var newLi = document.createElement("li");
    var link = document.createElement("a");

    link.innerText = name;
    link.href = "javascript:display_srctxt('" + fullpath + "','" + name + "');";

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