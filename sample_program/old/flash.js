//output 
var newDiv = document.createElement("div");
newDiv.id = "flash";
newDiv.style.width = "128px";
newDiv.style.height = "128px";
newDiv.style.color = '#a0a0a0';
var output_area = document.getElementById("output_area");
output_area.appendChild(newDiv);

//input 
//button 作成
var newBtn = document.createElement("button");
newBtn.innerText = "ぶるぶる";
newBtn.value = "stop"
newBtn.id = "btn_vib"
var input_area = document.getElementById("input_area");
input_area.appendChild(newBtn); //input ereaにボタン追加


// 処理

var vibrateInterval;
btn_vib = document.getElementById("btn_vib");
btn_vib.addEventListener("click", function() {
    console.log(btn_vib.value);
    if (btn_vib.value == "stop") {
        btn_vib.value = "start";
        startVibrate(1000);
    } else if (btn_vib.value == "start") {
        btn_vib.value = "stop";
        stopVibrate();
    }
});


// 渡されたレベルでバイブレーションを開始
function startVibrate(duration) {
    window.navigator.vibrate(duration);
}

// バイブレーションを停止
function stopVibrate() {
    // インターバルをクリアして継続的なバイブレーションを停止 
    if (vibrateInterval) clearInterval(vibrateInterval);
    window.navigator.vibrate(0);
}

// 与えられた時間とインターバルによる継続的なバイブレーションを開始
// 数値が与えられるものとする
function startPersistentVibrate(duration, interval) {
    vibrateInterval = setInterval(function() {
        startVibrate(duration);
    }, interval);
}