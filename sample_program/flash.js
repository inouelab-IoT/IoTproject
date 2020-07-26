//input button
var newDiv = document.createElement("div");
newDiv.id = "flash";
newDiv.style.width = "128px";
newDiv.style.height = "128px";
newDiv.style.color = '#a0a0a0';
var output_area = document.getElementById("output_area");
output_area.appendChild(newDiv);

//input button
var newBtn = document.createElement("button");
newBtn.onclick = "run_flash();";
newBtn.innerText = "ピカァ！";
var input_area = document.getElementById("input_area");
input_area.appendChild(newBtn);


// 処理

var isLock = false;
var target_elm = document.getElementById("flash");
var perc = 0.1;
var timer = null;

function run_flash() {
    //処理中じゃないか
    if (!isLock) {
        //処理ロック
        isLock = true;
        //透過度リセット
        perc = 0.1;
        //0.1秒間隔(本当は三角関数使うなどして自然な上昇率にするといい)
        timer = setInterval(
            function() {
                if (1 <= perc) {
                    //IE
                    target_elm.style.filter = 'alpha(opacity=100)';
                    //FF
                    target_elm.style.MozOpacity = 1.0;
                    //other
                    target_elm.style.opacity = 1.0;
                    //処理ロック解除
                    isLock = false;
                    //タイマー削除
                    clearInterval(timer);
                } else {
                    //IE
                    target_elm.style.filter = 'alpha(opacity=' + (100 * perc) + ')';
                    //FF
                    target_elm.style.MozOpacity = perc;
                    //other
                    target_elm.style.opacity = perc;
                    perc += 0.1;
                }
            },
            100
        );
    }
}