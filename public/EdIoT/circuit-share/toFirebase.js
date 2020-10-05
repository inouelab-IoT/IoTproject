//ログイン
function getNames(){
    if(document.getElementById("user_name").innerHTML.substr(5)!="Guest"){
        document.getElementsByName("icon")[0].value=document.getElementById("user_icon").src;
        document.getElementsByName("name")[0].value=document.getElementById("user_name").innerHTML.substr(5);    
    }
}
function upload(url,filename,path){
    var storage= firebase.storage;
    var ref = storage.ref().child(path+"/"+filename);
    ref.putString(url,'data_url').then(function(snapshot){
        addMsg("回路のセーブに成功しました。<br>Path:"+path+"/"+filename);
    });
}
