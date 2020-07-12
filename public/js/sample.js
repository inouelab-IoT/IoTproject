{
  window.addEventListener("deviceorientation", function(evt){
      //デジタルコンパス情報取得
      var ch = evt.webkitCompassHeading;
      var chAcc = evt.webkitCompassAccuracy;
      var html ="";
          html += "方角："+ch
          html += "　誤差："+chAcc;
      document.getElementById("compass").innerHTML = html;
      
      //ジャイロセンサー情報取得
      var alpha = evt.alpha;   // z-axis
      var beta = evt.beta;     // x-axis
      var gamma = evt.gamma;   // y-axis
      var html ="";
          html += 'Z回転(alpha):' + alpha + "<br>";
          html += "X回転(beta):" + beta + "<br>";
          html += "Y回転(gumma):" + gamma;
      document.getElementById("gyroscope").innerHTML = html;
      
  }, false);

  //加速度センサー情報取得
  window.addEventListener("devicemotion", function(evt){

    //加速度
    var x = evt.acceleration.x;
    var y = evt.acceleration.y;
    var z = evt.acceleration.z;


    //傾き
    var xg = evt.accelerationIncludingGravity.x; //左右
    var yg = evt.accelerationIncludingGravity.y; //上下
    var zg = evt.accelerationIncludingGravity.z; //前後

    //回転値
    var a = evt.rotationRate.alpha; //z方向
    var b = evt.rotationRate.beta; //x方向
    var g = evt.rotationRate.gamma; // y方向

      var html ="";
          html  += "x:"+x+"<br>";
          html += "y:"+y+"<br>";
          html += "z:"+z+"<br>";
          
          html += "傾きx:"+xg+"<br>";
          html += "傾きy:"+yg+"<br>";
          html += "傾きz:"+zg+"<br>";
          
          html += "alpha(z):"+a+"<br>";
          html += "beta(x):"+b+"<br>";
          html += "gamma(y):"+g+"<br>";

    document.getElementById("rotation").innerHTML = html;

  }, true); 
}