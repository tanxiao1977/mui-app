$(function() {
	var  tmobile = window.localStorage.getItem("tmobile");
	if(tmobile == null) {
		showErrTip("手机号码不正确");
	}else {
		var starMobile = tmobile.substring(0,3)+"****"+tmobile.substring(7,11);
		$("#starMobile").html(starMobile);
	}
	
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
	$this.attr("disabled","disabled");
	$this.removeClass("yzmbtn");
	$this.addClass("btn-button-4-gray");
	timer = setInterval(function() {
		if(t>0) {
			$this.html("重新发送("+t+")");
			t--;
		}else {
			clearInterval(timer);
			$this.html("重新发送");
			$this.removeAttr("disabled");
			$this.removeClass("btn-button-4-gray");
			$this.addClass("yzmbtn");
		}
	}, 1000) 
	return false;
}

function sendSms(){
	
	var  tmobile = window.localStorage.getItem("tmobile");
	if(tmobile == null) {
		showErrTip("手机号码不正确");
	}

	timing();
	//发送短信
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/sendSms",
		  // data to be added to query string:
		  data: { 
			  mobile : tmobile
		  },
		  // type of data we are expecting in return:
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode != "0000") {
				  showErrTip(obj.message);
				  clearInterval(timer);
				  $("#sendSMS").html("重新发送");
				  $("#sendSMS").removeAttr("disabled");
				  $("#sendSMS").removeClass("btn-button-4-gray");
				  $("#sendSMS").addClass("yzmbtn");
				  return ;
			  }
		    
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
			  clearInterval(timer);
			  $("#sendSMS").html("重新发送");
			  $("#sendSMS").removeAttr("disabled");
			  $("#sendSMS").removeClass("btn-button-4-gray");
			  $("#sendSMS").addClass("yzmbtn");
		  }
		});
}

function findPwd() {
	
	var  tmobile = window.localStorage.getItem("tmobile");
	if(tmobile == null) {
		showErrTip("手机号码不正确");
		return false;
	}
	
	if(!checkSMSCode()) {
		return false;
	}
	
		 /*按钮点击一次之后禁用掉按钮点击事件*/
		 $("#nextSubmit").attr('disabled','disabled');
	//发送短信
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/findPwd",
		  // data to be added to query string:
		  data: { 
			  mobile : tmobile,
//			  pwd : $("#pwd").val(),
			  smsCode : $("#smsCode").val()
			  
		  },
		  // type of data we are expecting in return:
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode == "0000") {
			  	  window.location.href='login.html';
				  //window.location.href='usolvmobile://wallet/webview?url=bG9naW4uaHRtbA~~';
				  return ;
			  }else if(obj.statusCode == "100E8005")
				 {
						 $("#nextSubmit").removeAttr("disabled");//将按钮可用
						  showErrTip("手机验证码格式错误");
					      return false ;
				   }else if(obj.statusCode == "100E8006")
				  {
						 $("#nextSubmit").removeAttr("disabled");//将按钮可用
						  showErrTip("手机验证码验证失败");
					      return false ;
				   }else if(obj.statusCode == "100E8008")
				  {
						 $("#nextSubmit").removeAttr("disabled");//将按钮可用
						  showErrTip("手机验证码失效");
					      return false ;
				   }else if(obj.statusCode=="0001")  
		    	   {
			    	   $("#nextSubmit").removeAttr("disabled");//将按钮可用
			    	   showErrTip("找回登录密码失败");
		    		    return false ;
		    	   }else {
				     showErrTip("调用接口异常");
				    return false ;
			  }
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
		  }
		});
	
}


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
	showErrTip("");
	return true;
}

function showErrTip(tip) {
	//$("#wrongDiv").show();
	$("#errortips").html(tip);
}
