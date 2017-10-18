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
$(function() {
	
});

function register() {
	//if(!checkUserName()) {
	//	return false;
	//}
	if(!checkPwd()) {
		return false;
	}
	if(!checkPwdConfirm()) {
		return false;
	}
		//注册按钮点击一次 就禁用
		$("#register1").attr("disabled","disabled");
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/register",
		  // data to be added to query string:
		  data: { 
			  //userName : $("#userName").val(),
			  pwd : $("#pwd").val()
		  },
		  // type of data we are expecting in return:
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode == "0000") {
				  var user = obj.data;
				  window.localStorage.setItem("userId", user.userId);  
				  window.localStorage.setItem("hnapayCustId", user.hnapayCustId);//关联新生用户ID
				  window.localStorage.setItem("mobile", user.phone);
				  window.localStorage.setItem("isRealName", user.isRealName); 		//是否实名认证
				  window.localStorage.setItem("isSetPaypwd", user.isSetPaypwd);		//是否设置支付密码
				  window.localStorage.setItem("nickName", user.nickName);
				  window.localStorage.setItem("isBindBankCard", user.isBindBankCard);   //是否绑定银行卡
				  //window.location.href='usolvmobile://wallet/webview?url=Li4lMkZwYWdlJTJGc2V0X3BheV9wd2QuaHRtbA~~';
				 window.location.href='../page/set_pay_pwd.html';
				  return ;
			  }else {
				  $("#register1").removeAttr("disabled");
				  showErrTip(obj.message);
				  return ;
			  }
		    
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
		  }
		});
}

function checkUserName() {
	var userName = $("#userName").val();
	if(userName == null || "" == userName) {
		showErrTip("用户名不能为空");
		return false;
	}
	
	var userNameExp = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{8,20}$/;
	if(!userNameExp.test(userName)){
		showErrTip("用户名为8-20位字符，大小写英文字母，数字，汉字均可");
		return false;
	}else{
		return true;
	}
//	var userNameExp = /^1\d{10}$/
//	if(!userNameExp.test(userName)) {
//		showErrTip("请输入正确手机号");
//		return false;
//	}
}

function checkPwd() {
	var ele = $("#pwd");
	var tip = isPassword(ele);
	if(null != tip) {
		showErrTip("登录密码"+tip);
		return false;
	}
	return true;
}

function checkPwdConfirm() {
	var ele = $("#pwdConfirm");
	var tip = isPassword(ele);
	if(null != tip) {
		showErrTip("确认登录密码"+tip);
		return false;
	}
	
	var pwd = $("#pwd").val();
	var pwdConfirm = ele.val();
	if(pwd != pwdConfirm) {
		showErrTip("确认登录密码与登录密码不一致");
		return false;
	}
	showErrTip();
	return true;
}

function isPassword(pwdEle) {
	var pwd = pwdEle.val();
	if(pwd == null || "" == pwd) {
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

function showErrTip(tip) {
	$("#wrongDiv").show();
	$("#wrongTip").html(tip);
}
