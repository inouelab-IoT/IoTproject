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
		photo_url: photoURL // ←6.ストレージで変更
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
			if (logs[key].user_id == uid) {
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
});
