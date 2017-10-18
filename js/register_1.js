$(function() {
	
	
	$("#mobFocus").click(function(){
		$("#mobile").focus();
	});
	
	$("#smsCodeFocus").click(function(){
		$("#smsCode").focus();
	});
	
	$("#protocol").click(function(){
		if($("#protocol").attr("checked")) {
			$("#regBtn").removeAttr("disabled");
		}else {
			$("#regBtn").attr("disabled","disabled");
		}
		
	});
});

/**
 * 定时器
 * @returns {Boolean}
 */
var timer;
function timing(){
	var $this = $("#sendSMS");
	var t=60; // 设置倒计时数
    //disabled
    $("#sendSMS").css("background-color","");
	$this.attr("disabled","disabled");
	$this.removeClass("yzmbtn");
	$this.addClass("rgb102");
	
	//toDO
	timer = setInterval(function() {
		if(t>0) {
			$this.html("重新发送("+t+")");
			t--;
		}else {
			clearInterval(timer);
			$this.html("重新发送");
			$this.removeAttr("disabled");
			$this.removeClass("rgb102");
			$this.addClass("yzmbtn");
		}
	}, 1000) 
	return false;
}

/**
 * 发送短信验证码
 * @returns {Boolean}
 */
function sendSms(){
	
	if(!checkMobile()) {
		 $("#sendSMS").removeAttr("disabled");
		 $("#sendSMS").css("background-color","#c4151c !important");
		return false;
	}

	if(!getIsExistUserSMS()) {
		 $("#sendSMS").removeAttr("disabled");
		 $("#sendSMS").css("background-color","#c4151c !important");
		return false;
	}
		//把错误提醒内容清空
		showErrTip("");	
	timing();
	//发送短信
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/sendSms",
		  data: { 
			  mobile : $("#mobile").val()
		  },
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode != "0000") {
				  showErrTip(obj.message);
				  clearInterval(timer);
				  return ;
			  }
			  $("#regBtn").removeAttr("disabled");
			  $("#regBtn").addClass("fontcolorred");
		    
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
			  clearInterval(timer);
			  $("#sendSMS").html("重新发送");
			  $("#sendSMS").removeAttr("disabled");
			  $("#sendSMS").removeClass("rgb102");
			  $("#sendSMS").addClass("yzmbtn");
		  }
		});
}



/**
 * 查询钱包是否存在了该用户的信息
 * 发送短信的时候用
 * @returns {Boolean}
 */
function getIsExistUserSMS() {
	
	var flag=0;  //标识返回类型
	if(!checkMobile()) {
		return false;
	}
	//发送短信
	$.ajax({
		  async: false,
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/getIsExistUser",
		  data: { 
			  mobile : $("#mobile").val(),
		  },
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode == "0000") {
				  flag=1;
				  return true ;
			  }else if(obj.statusCode == "0002") {
				  showErrTip("您已注册，请登录。如有疑问，请联系客服：400-089-0098");
				  flag=0;
				  return false ;
			  }else {
				  flag=0;
				  showErrTip(obj.message);
				  return  false;
			  }
		  },
		  error: function(xhr, type){
			  flag=0;
			  showErrTip("加载异常，请检查网络");
			  return  false;
		  }
		});
	return Boolean(flag);
}

/**
 * 注册第一步发短信验证码
 * @returns {Boolean}
 */
function registerFirst() {
	
	if(!checkMobile()) {
		return false;
	}
	
	if(!checkSMSCode()) {
		return false;
	}
	if(!getIsExistUserSMS()) {
		return false;
	}
	
	//发送短信
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/registerFirst",
		  // data to be added to query string:
		  data: { 
			  mobile : $("#mobile").val(),
			  smsCode : $("#smsCode").val()
			  
		  },
		  // type of data we are expecting in return:
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode == "0000") {
				  //window.location.href='usolvmobile://wallet/webview?url=cmVnaXN0ZXJfMS5odG1s';
				  window.location.href='../page/register_2.html';
				  return ;
			  }else {
				  showErrTip(obj.message);
				  return ;
			  }
		    
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请刷新!");
		  }
		});
	
}

/**
 * 验证手机号
 * @returns {Boolean}
 */
function checkMobile() {
	var mobile = $("#mobile").val();
	if(mobile == null || "" == mobile) {
		showErrTip("手机号不能为空");
		return false;
	}
	var mobileExp = /^1\d{10}$/
	if(!mobileExp.test(mobile)) {

		//$("#sendSMS").attr("disabled",true);
		//$("#sendSMS").addClass("fontcolorred");
		showErrTip("请输入正确手机号");
		return false;
	}

	//$("#sendSMS").removeAttr("disabled");
	//$("#sendSMS").addClass("fontcolorred");
	return true;
}

/**
 * 验证手机验证码
 * @returns {Boolean}
 */
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

function showErrTip(tip) {
	$("#wrongDiv").show();
	$("#wrongTip").html(tip);
}
