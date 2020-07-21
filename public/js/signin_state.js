//DOCTYPE Java Script


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBpLH2BZss_Y89cClQ-yydTyDr0GbIKwWI",
    authDomain: "ediotwebserver.firebaseapp.com",
    databaseURL: "https://ediotwebserver.firebaseio.com",
    projectId: "ediotwebserver",
    storageBucket: "ediotwebserver.appspot.com",
    messagingSenderId: "912743111383",
    appId: "1:912743111383:web:f5ba9e7195d6edcd17ee92",
    measurementId: "G-9PXKR293NL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var displayName = "Guest";
var displayGroup = "Guest";
var email = "@gmail.com";
var uid = "guest";
var gid = "noAffiliation";
var photoURL = ""

initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            displayName = user.displayName;
            email = user.email;
            var emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            var user_img = document.getElementById("user_icon");
            user.getIdToken().then(function(accessToken) {
                document.getElementById("sign_button").textContent = 'Sign out';
                document.getElementById("user_name").textContent = "ユーザ名：" + displayName;
                firebase.database().ref("groups").once("value", function(snapshot) {
                    if (!snapshot) {
                        displayGroup = "見所属";
                    } else {
                        var groups = snapshot.val();
                        console.log(groups)
                        var key_id = groups[0];
                        displayGroup = groups[key_id].g_name;
                        gid = key_id;
                    }
                });
                document.getElementById("group_name").textContent = "所属グループ : " + displayGroup;
                user_img.src = photoURL
                    /*
                    document.getElementById('sign-in-status').textContent = 'Signed in';
                    document.getElementById('sign-in').textContent = 'Sign out';
                    document.getElementById('account-details').textContent = JSON.stringify({
                        displayName: displayName,
                        email: email,
                        emailVerified: emailVerified,
                        phoneNumber: phoneNumber,
                        photoURL: photoURL,
                        uid: uid,
                        accessToken: accessToken,
                        providerData: providerData
                    }, null, '  ');
                    */
            });
        } else {
            // User is signed out.
            displayName = "Guest";
            email = "@gmail.com";
            uid = "guest";
            document.getElementById("sign_button").textContent = 'Sign in';
            document.getElementById("user_name").textContent = "ユーザ名：" + displayName;
            document.getElementById("user_icon").src = "/img/no_login_icon.png";
            /*
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';
            */
        }
    }, function(error) {
        console.log(error);
    });
};

window.addEventListener('load', function() {
    initApp();
});

function sign_button() {
    if (document.getElementById("sign_button").innerHTML == "Sign out") {
        sign_out();
        //        document.getElementById("sign_button").innerHTML="sigh in";
        //        document.getElementById("user_icon"),src = "/img/no_login_icon.png";
    } else {
        window.location.href = "/login.html"
            //sign_in(); 
    }
};

function sign_out() {
    firebase.auth().onAuthStateChanged((user) => {
        firebase.auth().signOut().then(() => {
                console.log("ログアウトしました");
            })
            .catch((error) => {
                console.log(`ログアウト時にエラーが発生しました (${error})`);
            });
    });
    firebase.initializeApp(firebaseConfig);

};

function sign_in() {
    var uiConfig = {
        /*
        callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            //trueにするとsignInSuccessUrlで定めた場所にリダイレクトされる
            //falseにするとページは遷移しない
            return true;
        },
        uiShown: function() {
            // ログイン画面が出たときに行う作業
        }
        },
        */
        //signInFlow: 'popup',
        //認証成功後のページ
        //signInSuccessUrl: '/',
        signInOptions: [
            //firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        // 利用規約のページ
        tosUrl: './terms-of-services.html',
        // プライバシーポリシーのページ
        privacyPolicyUrl: './privacy-pocily.html'
    };

    // FirebaseUI ウィジェットの初期化と上のConfigの登録
    // headでauthentification用のライブラリを読み込まないとfirebase.auth()でエラーが出ます。
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
}