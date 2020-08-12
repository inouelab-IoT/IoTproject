$(function () {

	// submit時
	$("#input_form").submit(function () {
		writeChatData(displayName, $("#input_text").val());
		return false;
	});

	// 発言を登録
	function writeChatData(name, text) {
		var group_name = $("#chat_group").val()
		$("#input_text").val("");
		firebase.database().ref('chat/' +group_name).push({
			name: name,
			text: text,
			user_id: uid,
			photo_url: photoURL
		}).catch(function (error) {
			alert(error.message);
		});
	}

	// 発言を更新
	function updateChatData(key, text) {
		var group_name = $("#chat_group").val()
		firebase.database().ref('chat/' + group_name + '/' + key + '/text').set(text).catch(function (error) {
			alert(error.message);
		});
	}

	// 発言を表示
	
	function displayChatData(snapshot) {
		$("#chat_area").html("");

		var logs = snapshot.val();
		for (var key in logs) {
			var logHtml = '';
			var photoUrl = logs[key].photo_url;
			if (!photoUrl) photoUrl = "";
			if (logs[key].user_id == uid) {
				logHtml = '<p><img src="' + photoUrl + '" height="40px">' + logs[key].name + '：<input type="text" class="update_text" size="50" value="' + logs[key].text + '" data-key="' + key + '"/></p><hr>'
			} else {
				logHtml = '<p><img src="' + photoUrl + '" height="40px">' + logs[key].name + '：' + logs[key].text + '</p><hr>'
			}

			$("#chat_area").prepend(logHtml);
		}

		$(".update_text").off("change");
		$(".update_text").on("change", function () {
			var key = $(this).attr("data-key");
			var text = $(this).val();
			updateChatData(key, text);
		});

	}

	//チャットグループの初期状態を設定
	var current_group = $("#chat_group").val();
	firebase.database().ref("chat/" + current_group).on("value",displayChatData(snapshot)); 
	//チャットグループの変更
	$("#chat_group").on("change",function(){
		firebase.database().ref("chat/" + current_group).off("value"); 
		current_group = $("#chat_group").val();
		firebase.database().ref("chat/" + current_group).on("value",displayChatData(snapshot)); 	
	});

	//利用可能なチャットグループの追加
	//Todo
	$("#chat_group")
});
