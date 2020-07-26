var storageRef = firebase.storage().ref();

document.getElementById('upload').addEventListener('click', function() {
    var value = document.getElementById("up_dir").value;
    var obj = document.getElementById('file');
    var files = obj.files;
    var upfile = files[0];

    if (value == "user") {
        var uploadTask = storageRef.child('/source_code/users/' + uid + '/' + upfile.name).put(upfile).then(function(snapshot) {
            alert('アップロードしました');
            obj.value = "";
        }).catch(function(error) {
            alert('アクセス拒否');
            console.error(error);
        });
    } else if (value == "group") {
        if (groupname == "") {
            alert('未所属');
        } else {
            var uploadTask = storageRef.child('/source_code/groups/' + groupname + '/' + upfile.name).put(upfile).then(function(snapshot) {
                alert('アップロードしました');
                obj.value = "";
            }).catch(function(error) {
                alert('アクセス拒否');
                console.error(error);
            });
        }
    }
});


function open_srclist() {
    // selectで選択した値を取得
    var value = document.getElementById("src_dir").value;
    //document.getElementById("src_list").innerHTML = value;
    removeChildren(document.getElementById("src_list"))

    if (value == "sample") {
        document.getElementById("file_place").innerText = "source_code/all";
        storageRef.child("source_code/all").listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addli(itemRef.name, "src_list", itemRef.fullPath);
            });
        }).catch(function(error) {
            alert('アクセス拒否');
            console.error(error);
        })
    } else if (value == "user") {
        document.getElementById("file_place").innerText = "source_code/users/" + uid;
        storageRef.child("source_code/users/" + uid).listAll().then(function(result) {
            result.items.forEach(function(itemRef) {
                addli(itemRef.name, "src_list", itemRef.fullPath);
            });
        }).catch(function(error) {
            alert('アクセス拒否');
            console.error(error);
        })
    } else if (value == "group") {
        if (groupname == "") {
            alert('未所属');
        } else {
            document.getElementById("file_place").innerText = "source_code/groups/" + groupname;
            storageRef.child("source_code/groups/" + groupname).listAll().then(function(result) {
                result.items.forEach(function(itemRef) {
                    addli(itemRef.name, "src_list", itemRef.fullPath);
                });
            }).catch(function(error) {
                alert('アクセス拒否');
                console.error(error);
            })
        }
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
        alert('アクセス拒否');
        console.error(error);
    })
}


function file_uppdate() {
    var filepath = document.getElementById("file_place").innerHTML;
    var filename = document.getElementById("input_srcname").value;

    const txt = document.getElementById('source_edit').value;
    const blob = new Blob([txt], { type: 'text/plain' });
    const upfile = new File([blob], filename, { type: "text/plain" })
    console.log(filepath + '/' + filename)
    var uploadTask = storageRef.child(filepath + '/' + filename).put(upfile).then(function(snapshot) {
        alert('アップロードしました');
    }).catch(function(error) {
        alert('アクセス拒否');
        console.error(error);
    });
}

function file_delete() {
    var filepath = document.getElementById("file_place").innerHTML;
    var filename = document.getElementById("input_srcname").value;

    var desertRef = storageRef.child(filepath + '/' + filename);

    // Delete the file
    desertRef.delete().then(function() {
        alert('File deleted successfully');
        // File deleted successfully
    }).catch(function(error) {
        alert('Uh-oh, an error occurred!');
        // Uh-oh, an error occurred!
    });
}

function file_download() {
    var filepath = document.getElementById("file_place").innerHTML;
    var filename = document.getElementById("input_srcname").value;

    storageRef.child(filepath + '/' + filename).getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
            var blob = xhr.response;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.download = filename;
            a.href = url;
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element:
    }).catch(function(error) {
        // Handle any errors
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