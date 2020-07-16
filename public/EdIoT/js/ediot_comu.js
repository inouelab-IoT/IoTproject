$(function () {

	// submit時
	$("#input_form").submit(function () {
		writeChatData(displayName, $("#input_text").val());
		return false;
	});

	// 発言を登録
	function writeChatData(name, text) {
		$("#input_text").val("");
		firebase.database().ref('chat').push({
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
		firebase.database().ref('chat/' + key + '/text').set(text).catch(function (error) {
			alert(error.message);
		});
	}

	// 発言を表示
	firebase.database().ref("chat").on("value", function (snapshot) {
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

	});
});
