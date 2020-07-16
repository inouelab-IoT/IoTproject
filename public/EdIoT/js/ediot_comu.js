$(function(){

	// submit時
	$("#input_form").submit(function(){
		writeChatData(displayName, $("#input_text").val());
		return false;
	});

	// 発言を登録
	function writeChatData(name, text) {
	  $("#input_text").val("");
	  firebase.database().ref('chat').push({
		name: name,
		text: text,
		user_id: uid,   // ←5.セキュリティルールで変更
		photo_url: $("#user_icon").attr("src") // ←6.ストレージで変更
	  }).catch(function(error) {
		alert(error.message);
	  });
	}

	//↓↓5.セキュリティルールで変更↓↓
	// 発言を更新
	function updateChatData(key, text) {
	  firebase.database().ref('chat/' + key + '/text').set(text).catch(function(error) {
		alert(error.message);
	  });
	}
	//↑↑5.セキュリティルールで変更↑↑

	// 発言を表示
	firebase.database().ref("chat").on("value", function(snapshot) {
		$("#chat_area").html("");

		var logs = snapshot.val();
		for (var key in logs) {
			var logHtml = '';
			//↓↓5.セキュリティルールで変更↓↓
			var photoUrl = logs[key].photo_url; // 6.ストレージで変更
			if (!photoUrl) photoUrl = "";　　　　 // 6.ストレージで変更
			if (logs[key].user_id == userId) {
			   // 6.ストレージで変更
			  logHtml = '<p><img src="' + photoUrl + '" height="40px">' + logs[key].name + '：<input type="text" class="update_text" size="50" value="' + logs[key].text + '" data-key="' + key + '"/></p><hr>'
			} else {
			   // 6.ストレージで変更
			  logHtml = '<p><img src="' + photoUrl + '" height="40px">' + logs[key].name + '：' + logs[key].text + '</p><hr>'
			}
			//↑↑5.セキュリティルールで変更↑↑

			$("#chat_area").prepend(logHtml);
		}

		//↓↓5.セキュリティルールで変更↓↓
		$(".update_text").off("change");
		$(".update_text").on("change", function(){
		  var key = $(this).attr("data-key");
		  var text = $(this).val();
		  updateChatData(key, text);
		});
		//↑↑5.セキュリティルールで変更↑↑

	});

	//↓↓4.認証で追加↓↓
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		$("#login_info").hide();
		$("#logout_info").show();
		if (user.displayName) {
		  $("#name").val(user.displayName);
		}
		//↓↓6.ストレージで追加↓↓
		if (user.photoURL) {
		  $("#user_icon").attr("src", user.photoURL);
		}
		//↑↑6.ストレージで追加↑↑
		userId = user.uid;
	  } else {
		$("#logout_info").hide();
		$("#login_info").show();
		$("#name").val("");
	  }
	});

	// ユーザー登録
	$("#user_regist_btn").click(function(){
	  var email = $("#email").val();
	  var password = $("#password").val();
	  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
	  });
	});

	// ログイン
	$("#login_btn").click(function(){
	  var email = $("#email").val();
	  var password = $("#password").val();
	  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
	  });
	});

	// ログアウト
	$("#logout_btn").click(function(){
	  firebase.auth().signOut().then(function() {
		// Sign-out successful.
	  }, function(error) {
		// An error happened.
	  });
	});

	// 名前が変更されたらプロフィールを変更
	$("#name").change(function(){
	  var user = firebase.auth().currentUser;
	  if (user) {
		user.updateProfile({
		  displayName: $("#name").val()
		});
	  }
	});

	//↑↑4.認証で追加↑↑

	//↓↓6.ストレージで追加↓↓
	$("#icon_up_btn").click(function(){
	  var file = $('#icon_file')[0].files[0];
	  if (!file) return false;

	  var storageRef = firebase.storage().ref();
	  var uploadTask = storageRef.child('images/' + userId + '/' + file.name).put(file);

	  uploadTask.on('state_changed', function(snapshot){
		// アップロード中のステータスが変わったときに何かする場所
	  }, function(error) {
		alert("アップロードに失敗しました");
	  }, function() {
		var iconURL = uploadTask.snapshot.downloadURL;
		console.log(iconURL);
		$('#icon_file').val("");
		alert("アップロード完了");

		// ユーザーのアイコン画像に設定
		var user = firebase.auth().currentUser;
		if (user) {
		  user.updateProfile({
			photoURL: iconURL
		  });
		}
		$("#user_icon").attr("src", iconURL);

	  });
	});
	//↑↑6.ストレージで追加↑↑

  });
