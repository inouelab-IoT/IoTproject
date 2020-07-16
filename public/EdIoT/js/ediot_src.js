var storageRef = firebase.storage().ref();

document.getElementById('upload').addEventListener('click', function() {
    var obj = document.getElementById('file');
    var files = obj.files;
    var upfile = files[0];

    var uploadTask = storageRef.child('users/' + uid + '/' + upfile.name).put(upfile).then(function(snapshot) {
        alert('アップロードしました');
        obj.value = "";
    });
});

document.addEventListener('change', function() {
    var table = document.createElement('table');
    var tableBody = document.createElement("tbody");

    storageRef.listAll().then(function(result) {
        result.items.forEach(function(ref) {
            var row = document.createElement("tr");
            var cell = document.createElement("td");
            cell.appendChild(document.createTextNode(ref.name));
            cell.appendChild(document.createTextNode(ref.url));
            row.appendChild(cell);
            tableBody.appendChild(row);
            table.appendChild(tableBody);
        });
        document.getElementById("table").appendChild(table);
    }).catch(function(error) {
        console.error(error);
    })
});