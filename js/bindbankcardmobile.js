//默认加载事件
$(function(){



		 var isSetPaypwd=  window.localStorage.getItem("isSetPaypwd");
		   if(isSetPaypwd !="1"){   //如果没有设置支付密码  就跳转到设置支付密码页面
			   window.location.href = "../page/set_pay_pwd.html";
			   //window.top.location.href = "usolvmobile://wallet/webview?url=Li4lMkZwYWdlJTJGc2V0X3BheV9wd2QuaHRtbA~~";
			   return false;
		  }

		var isRealName=  window.localStorage.getItem("isRealName");
		if(isRealName!="1"){   //如果没有实名认证 就跳转到实名认证页面
			window.location.href = "../page/realname_auth.html";
			//window.top.location.href = "usolvmobile://wallet/webview?url=Li4lMkZwYWdlJTJGcmVhbG5hbWVfYXV0aC5odG1s";
			return false ;
		}
		   var cardPhone = window.localStorage.getItem("cardPhone");
			if(cardPhone == null) {
				showErrTip("银行预留手机号为空值");
				return false;
		     }else
		      {
		    	 /*调用定时器*/
				   timing();
		     }
		$("#message").show();  //提示信息显示
		var starMobile = cardPhone.substring(0,3)+"****"+cardPhone.substring(7,11);
		$("#starMobile").html(starMobile);

});

/**
 * 绑定银行卡确认 点击下一步的操作
 */
function nextGo()
{
	var smsCode = $("#smsCode").val();
	if(smsCode == null || "" == smsCode) {
		showErrTip("验证码不能为空");
		return false;
	}
	var smsCodeExp = /^\d{6}$/
	if(!smsCodeExp.test(smsCode)) {
		showErrTip("验证码格式错误");
		return false;
	}
	
	 /*按钮点击一次之后禁用掉按钮点击事件*/
	 $("#next").attr('disabled','disabled');
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/userRelation/bindBankCardConfirm",
		  data: { 
			  
			  smsCode:  $("#smsCode").val(),
			  hnapayOrderId: window.localStorage.getItem("hnapayOrderId"),
			  walletUserId: window.localStorage.getItem("userId")
		  },
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode == "0000") {
					 window.localStorage.setItem("isBindBankCard", 1);
				  	complete();
				    //window.top.location.href = "usolvmobile://wallet/webview?url=YmluZGJhbmtjYXJkX29rLmh0bWw~";
				  	return false;
			  }
			  else if(obj.statusCode == "100E8005")
			  {
					 $("#next").removeAttr("disabled");//将按钮可用
				  	showErrTip("手机验证码格式错误");
				  	return false;
			  }else if(obj.statusCode == "100E8006")
			  {
					$("#next").removeAttr("disabled");//将按钮可用
				  	showErrTip("手机验证码验证失败");
				  	return false;
			  }
			  else if(obj.statusCode == "0001")
			  {
					$("#next").removeAttr("disabled");//将按钮可用
				    //window.top.location.href = "usolvmobile://wallet/webview?url=YmluZGJhbmtjYXJkX2Vycm9yLmh0bWw~";
				  showErrTip("银行卡绑定失败");
				  return false;
			  }
			  else if(obj.statusCode == "0002")
			  {
					 $("#next").removeAttr("disabled");//将按钮可用
				  	showErrTip("银行卡绑定申请失败");
				  	return false;
			  }
		  },
		  error: function(xhr, type){
				 $("#next").removeAttr("disabled");//将按钮可用
			  showErrTip("加载异常，请检查网络");
		  }
		});

}

function complete(){
	mui.init()
	mui.alert('欢迎使用钱包', '返回首页', function() {
		window.location.href = "../page/index.html";
	});
}
/**
 * 定时器
 * @returns {Boolean}
 */
var timer;
function timing(){
	var $this = $("#sendSMS");
	var t=60; // 设置倒计时数
    //disabled
	$this.attr("disabled","disabled");
	$this.removeClass("red4151");
	$this.removeClass("yzmbtn");
	//toDO
	timer = setInterval(function() {
		if(t>0) {
			$this.html("重新发送("+t+")");
			t--;
		}else {
			clearInterval(timer);
			$this.html("重新发送");
			$this.removeAttr("disabled");
			$this.addClass("red4151");
		}
	}, 1000) 
	return false;
}

//发送短信验证码
function sendSms(){
	var cardPhone_2 = window.localStorage.getItem("cardPhone");
	if(cardPhone_2 == null) {
		showErrTip("银行预留手机号为空值");
		return false;
	}
	/*调用定时器*/
	timing();

	$("#message").show();  //提示信息显示
	var starMobile = cardPhone_2.substring(0,3)+"****"+cardPhone_2.substring(7,11);
	$("#starMobile").html(starMobile);
	//发送短信
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/sendSms",
		  data: { 
			  mobile : cardPhone_2
		  },
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode != "0000") {
				  showErrTip(obj.message);
				  clearInterval(timer);
				  $("#sendSMS").hmtl("重新发送");
				  $("#sendSMS").removeAttr("disabled");
				  $("#sendSMS").addClass("red4151");
				  return ;
			  }
		    
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
			  clearInterval(timer);
			  $("#sendSMS").hmtl("重新发送");
			  $("#sendSMS").removeAttr("disabled");
			  $("#sendSMS").addClass("red4151");
		  }
		});
	
}
//验证短信验证码
function checkSMSCode() {
	var smsCode = $("#smsCode").val();
	if(smsCode == null || "" == smsCode) {
		showErrTip("验证码不能为空");
		return false;
	}
	var smsCodeExp = /^\d{6}$/
	if(!smsCodeExp.test(smsCode)) {
		showErrTip("验证码格式错误");
		return false;
	}
	
	return true;
}

//错误提示信息
function showErrTip(tip) {
	$("#wrongDiv").show();
	$("#wrongTip").html(tip);
}
