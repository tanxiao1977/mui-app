//(function() {
// 			if (window.localStorage) {
// 				alert('This browser supports localStorage');
// 				window.localStorage.setItem("uid", "york");
// 			} else {
// 				alert('This browser does NOT support localStorage');
// 			}
//			if (window.sessionStorage) {
//				alert('This browser supports sessionStorage');
//				window.localStorage.setItem("uid", "york");
//			} else {
//				alert('This browser does NOT support sessionStorage');
//			}
//			
//			
//})();
mui.ready(function() {
	//window.localStorage.clear();
	var userId = window.localStorage.getItem("userId");
	if (userId !== null) {
		window.location.href = '../page/index.html';
		return;
	}

	flushCode();
});


function flushCode() {

	var src = "https://walletcpstest2.hnapay.com/rest/account/member/authCode";
	//$("#authCodeImg").attr("src", chgUrl(src));
	document.getElementById("authCodeImg").setAttribute("src",chgUrl(src));
	
}

// 去掉前后空格
function trim(obj) {
	var strnew = obj.replace(/^\s*|\s*$/g, "");
	return strnew;
}

// 时间戳
// 为了使每次生成图片不一致，即不让浏览器读缓存，所以需要加上时间戳
function chgUrl(url) {
	var timestamp = (new Date()).valueOf();
	if ((url.indexOf("&") >= 0)) {
		url = url + "×tamp=" + timestamp;
	} else {
		url = url + "?timestamp=" + timestamp;
	}
	return url;
}

/**
 * 更新图形验证码
 */
function changeImg() {
	//var imgSrc = $("#authCodeImg");
	var imgSrc = document.getElementById("authCodeImg");
	//var src = imgSrc.attr("src");
	var src = imgSrc.getAttribute("src");
	imgSrc.setAttribute("src", chgUrl(src));
	//$("#authCode").val("").focus();
	document.getElementById("authCode").value="";
	document.getElementById("authCode").focus();

}
// 登录方法
function login() {
	if (!checkUserName()) {
		return false;
	}
	if (!checkPassword()) {
		return false;
	}
	if (!checkAuthCode()) {
		return false;
	}
	/* 按钮点击一次之后禁用掉按钮点击事件 */
	//$("#loginBtn").attr('disabled', 'disabled');
	document.getElementById("loginBtn").setAttribute("disabled","disabled");
	alert(document.getElementById("authCode").value);
	mui.ajax('https://walletcpstest2.hnapay.com/rest/account/member/login',{
				type : 'POST',
				data : {
					//userName : encode64($("#userName").val()),
					userName:encode64(document.getElementById("userName").value),
					//pwd : encode64($("#pwd").val()),
					pwd : encode64(document.getElementById("pwd").value),
					//authCode : $("#authCode").val()
					authCode : document.getElementById("authCode").value
				},
				dataType : 'json',
				crossDomain: true,
				//async: true,
				timeout:10000,//超时时间设置为10秒；
				//headers:{'Content-Type':'application/json'},	
				success : function(obj) {
					alert(obj.statusCode);
					console.log(obj.data)
					if (obj.statusCode == "0000") {
						var user = obj.data;
						if (user.userStatus == "c4ca4238a0b923820dcc509a6f75849b") // 判断用户是否被锁定
						{
							//$("#loginBtn").removeAttr("disabled");// 将按钮可用
							document.getElementById("loginBtn").removeAttribute("disabled");
							showErrTip("您的账户异常。如有疑问，请联系客服400-089-0098");
							return false;
						}
						//$("#loginBtn").removeAttr("disabled");// 将按钮可用
						document.getElementById("loginBtn").removeAttribute("disabled");				
						window.localStorage.setItem("userId", user.userId);
						window.localStorage.setItem("hnapayCustId",user.hnapayCustId);// 关联新生用户ID
						window.localStorage.setItem("mobile", user.phone);
						window.localStorage.setItem("isRealName",user.isRealName); // 是否实名认证
						window.localStorage.setItem("isSetPaypwd",user.isSetPaypwd); // 是否设置支付密码
						window.localStorage.setItem("idNumber", user.custIdNo);
						window.localStorage.setItem("realName", user.custName);
						window.localStorage.setItem("nickName", user.nickName);
						window.localStorage.setItem("isBindBankCard",user.isBindBankCard); // 是否绑定银行卡
						window.location.href = '../page/index.html';
						//return false;
					} 
					else if (obj.statusCode == "100E2001") {
						//$("#loginBtn").removeAttr("disabled");// 将按钮可用
						document.getElementById("loginBtn").removeAttribute("disabled");				
						showErrTip("您还未注册，请使用注册功能");
					} else if (obj.statusCode == "100E2003") {
						//$("#loginBtn").removeAttr("disabled");// 将按钮可用
						document.getElementById("loginBtn").removeAttribute("disabled");
						showErrTip("您的账户被锁定，请通过新生官网找回密码。或2小时后重试");
					} else if (obj.statusCode == "100E2005") {
						//$("#loginBtn").removeAttr("disabled");// 将按钮可用
						document.getElementById("loginBtn").removeAttribute("disabled");				
						showErrTip("登录密码错误");
					} else {
						//$("#loginBtn").removeAttr("disabled");// 将按钮可用
						document.getElementById("loginBtn").removeAttribute("disabled");
						showErrTip(obj.message);
					}
					
					//changeImg();
				},
				error : function(xhr, type) {
					//$("#loginBtn").removeAttr("disabled");// 将按钮可用
					document.getElementById("loginBtn").removeAttribute("disabled");			
					changeImg();
					showErrTip("系统出错，请稍后尝试");
				}				
	});
}

// 验证用户名
function checkUserName() {
	//var userName = $("#userName").val();
	var userName = document.getElementById("userName").value;
	if (userName == null || "" == userName) {
		showErrTip("用户名不能为空");
		return false;
	}
	var userNameExp = /^1\d{10}$/
	if (!userNameExp.test(userName)) {
		showErrTip("请输入正确手机号");
		return false;
	}
	return true;
}
// 验证用户密码
function checkPassword() {
	//var pwd = $("#pwd").val();
	var pwd = document.getElementById("pwd").value;
	if (pwd == null || "" == pwd) {
		showErrTip("密码不能为空");
		return false;
	}
/*	var num = /^(?:\d*)$/;
	var upperLetter = /^([A-Z]*)$/;
	var lowLetter = /^([a-z]*)$/;
	var special = /^([\~\!\@\#\^\*\-\[\]\{\}\:\?]*)$/;
	var isNewPassword = /^[a-zA-Z0-9\~\!\@\#\^\*\_\-\[\]\,\{\}\:\?]{8,20}$/;
	// var isNotNewPassword =
	// /^(?:\d*|[a-zA-Z]*|[\w\~\!\@\#\^\*\-\[\]\{\}\:\?]*)$/;
	// weiyajun 20150909
	var isNotNewPassword = /^(?:\d*|[a-zA-Z]*|[\w\~\!\@\#\^\*\_\-\[\]\,\{\}\:\?]*)$/;

	var tip1 = "至少使用8-20位大小写英文字母、数字或标点符号两种组成";// "至少使用8-20位大小写英文字母、数字或标点符号两种组成";
	var tip2 = "输入字符有误，支持的字符为~!@#^*_-[],{}:?";
	if (pwd.match(isNotNewPassword) == null) {
		showErrTip(tip2);
		return false;
	}
	if (pwd.match(num) != null || pwd.match(upperLetter) != null
			|| pwd.match(lowLetter) != null || pwd.match(special) != null) {
		showErrTip(tip1);
		return false;
	}
	if (pwd.match(isNewPassword) == null) {
		showErrTip(tip1);
		return false;
	}*/
	return true;
}

function checkAuthCode() {
	//var authCode = $("#authCode").val();
	var authCode = document.getElementById("authCode").value;
	if (authCode == null || "" == authCode) {
		showErrTip("验证码不能为空");
		return false;
	}
	var authCodeExp = /^[\da-zA-Z]{4}$/
	if (!authCodeExp.test(authCode)) {
		showErrTip("验证码格式错误");
		return false;
	}

	return true;
}

function showErrTip(tip) {
	//$("#wrongDiv").show();
	document.getElementById("wrongDiv").style.display="inline";
	//$("#wrongTip").html(tip);
	document.getElementById("wrongTip").innerHTML=tip;
}

//base64加密开始  
var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"  
        + "wxyz0123456789+/" + "=";  
  
function encode64(input) {  

    var output = "";  
    var chr1, chr2, chr3 = "";  
    var enc1, enc2, enc3, enc4 = "";  
    var i = 0;  
    do {  
        chr1 = input.charCodeAt(i++);  
        chr2 = input.charCodeAt(i++);  
        chr3 = input.charCodeAt(i++);  
        enc1 = chr1 >> 2;  
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
        enc4 = chr3 & 63;  
        if (isNaN(chr2)) {  
            enc3 = enc4 = 64;  
        } else if (isNaN(chr3)) {  
            enc4 = 64;  
        }  
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)  
                + keyStr.charAt(enc3) + keyStr.charAt(enc4);  
        chr1 = chr2 = chr3 = "";  
        enc1 = enc2 = enc3 = enc4 = "";  
    } while (i < input.length);  

    return output;  
}  
// base64加密结束  
