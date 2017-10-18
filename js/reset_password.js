$(function() {

	//跳转页面
	$('.ui-list li,.ui-tiled li').click(function() {
		if ($(this).data('href')) {
			location.href = $(this).data('href');
		}
	});

	var value = localStorage.getItem("mobile");
	if (value == null) {
		showErrTip("请先校验手机");
	} else {
		var starMobile = value.substring(0, 3) + "****"
				+ value.substring(7, 11);
		$("#starMobile").val(starMobile);
	}

});

/**
 * 定时器
 * 
 * @returns {Boolean}
 */
var timer;
function timing() {
	var $this = $("#sendSMS");
	var t = 60; // 设置倒计时数
	// disabled
	$this.attr("disabled", "disabled");
	$this.removeClass("yzmbtn");
	$this.addClass("btn-button-4-gray");
	timer = setInterval(function() {
		if (t > 0) {
			$this.html("重新发送(" + t + ")");
			t--;
		} else {
			clearInterval(timer);
			$this.html("重新发送");
			$this.removeAttr("disabled");
			$this.removeClass("btn-button-4-gray");
			$this.addClass("yzmbtn");
		}
	}, 1000)
	return false;
}

function sendSms() {
	var mobile = localStorage.getItem("mobile");
	if (mobile == null) {
		showErrTip("请先校验手机");
		return false;
	}

	timing();

	// 发送短信
	$.ajax({
		type : 'POST',
		url : "https://walletcpstest2.hnapay.com/rest/account/member/sendSms",
		// data to be added to query string:
		data : {
			mobile : mobile
		},
		// type of data we are expecting in return:
		dataType : 'json',
		success : function(obj) {
			if (obj.statusCode != "0000") {
				showErrTip(obj.message);
				clearInterval(timer);
				$("#sendSMS").hmtl("重新发送");
				$("#sendSMS").removeAttr("disabled");
				$("#sendSMS").removeClass("btn-button-4-gray");
				$("#sendSMS").addClass("yzmbtn");
				return;
			}

		},
		error : function(xhr, type) {
			showErrTip("加载异常，请检查网络");
			clearInterval(timer);
			$("#sendSMS").html("重新发送");
			$("#sendSMS").removeAttr("disabled");
			$("#sendSMS").removeClass("btn-button-4-gray");
			$("#sendSMS").addClass("yzmbtn");
		}
	});
}

function updatePwd() {

	var mobile = localStorage.getItem("mobile");
	if (mobile == null) {
		showErrTip("请先校验手机");
		return false;
	}

	if(!checkSMSCode()){
		return false;
	}

	if (!checkOldPwd()) {
		return false;
	}

	if (!checkPwd()) {
		return false;
	}

	if (!checkPwdConfirm()) {
		return false;
	}
	
	if (!checkOldPwdAndPwd()){
		return false;
	}
	
	/* 按钮点击一次之后禁用掉按钮点击事件 */
	$("#updateLoginPwd").attr('disabled', 'disabled');
	// 发送短信
	$
			.ajax({
				type : 'POST',
				url : "https://walletcpstest2.hnapay.com/rest/account/member/updatePwd",
				// data to be added to query string:
				data : {
					mobile : mobile,
					pwd : $("#pwd").val(),
					oldPwd : $("#oldPwd").val(),
					smsCode : $("#smsCode").val()

				},
				// type of data we are expecting in return:
				dataType : 'json',
				success : function(obj) {
					if (obj.statusCode == "0000") {
						$("#updateLoginPwd").removeAttr("disabled");// 将按钮可用
						/*window.location.href = 'usolvmobile://wallet/webview?url=bG9naW4uaHRtbA~~';*/
						mui.init()
						mui.alert('您的登录密码修改成功', 'Hello MUI', function() {
							window.localStorage.clear();
							window.location.href='../page/login.html';
						});
						return;
					} else {
						$("#updateLoginPwd").removeAttr("disabled");// 将按钮可用
						showErrTip(obj.message);
						return false;
					}
				},
				error : function(xhr, type) {
					showErrTip("加载异常，请检查网络");
					$("#updateLoginPwd").removeAttr("disabled");// 将按钮可用
					return false;
				}
			});

}

function checkPwd() {
	var ele = $("#pwd");
	var tip = isPassword(ele);
	if (null != tip) {
		showErrTip("密码" + tip);
		return false;
	}
	showErrTip("");
	return true;
}
function checkOldPwd() {
	var ele = $("#oldPwd");
	var tip = isNullPassword(ele);
	if (null != tip) {
		showErrTip(tip);
		return false;
	}
	showErrTip("");
	return true;
}
function checkPwdConfirm() {
	var ele = $("#pwdConfirm");

	var pwd = $("#pwd").val();
	var pwdConfirm = ele.val();

    if(pwdConfirm == null || "" == pwdConfirm) {
        showErrTip("请设置确认密码");
        return false;
    }

	if (pwd != pwdConfirm) {
		showErrTip("密码两次输入不一致");
		return false;
	}
	showErrTip("");
	return true;
}

function isPassword(pwdEle) {
	var pwd = pwdEle.val();
	if (pwd == null || "" == pwd) {
		return "不能为空";
	}
	var num = /^(?:\d*)$/;
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
		return tip2;
	}
	if (pwd.match(num) != null || pwd.match(upperLetter) != null
			|| pwd.match(lowLetter) != null || pwd.match(special) != null) {
		return tip1;
	}
	if (pwd.match(isNewPassword) == null) {
		return tip1;
	}
}

function checkSMSCode() {
	var smsCode = $("#smsCode").val();
	if (smsCode == null || "" == smsCode) {
		showErrTip("验证码不能为空");
		return false;
	}
	var smsCodeExp = /^\d{6}$/
	if (!smsCodeExp.test(smsCode)) {
		showErrTip("验证码格式错误");
		return false;
	}
	showErrTip("");
	return true;
}

function showErrTip(tip) {
	//$("#wrongDiv").show();
	$("#errortips").html(tip);
}


function checkOldPwdAndPwd() {
	var oldPwd = $("#oldPwd").val();
	var pwd = $("#pwd").val();
	if(pwd == oldPwd){
		showErrTip("您设置的新登录密码与旧登录密码相同，请重新设置");
		return false;
	}
	return true;
}


function isNullPassword(pwdEle) {
	var pwd = pwdEle.val();
	if(pwd == null || "" == pwd) {
		return "请输入原登录密码";
	}
}