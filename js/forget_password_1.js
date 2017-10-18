
function findPwdFisrt() {
	
	if(!checkMobile()) {
		return false;
	}
	
	//发送短信
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/findPwdFisrt",
		  // data to be added to query string:
		  data: { 
			  mobile : $("#mobile").val()
		  },
		  // type of data we are expecting in return:
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode == "0000") {
				  var telephone=obj.data;
				  window.localStorage.setItem("tmobile", telephone);
				  window.location.href='forget_password_2.html';
				 // window.location.href='usolvmobile://wallet/webview?url=Zm9yZ2V0X3Bhc3N3b3JkXzIuaHRtbA~~';
				  return  true ;
			  }else {
				  showErrTip(obj.message);
				  return false;
			  }
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
			  return false;
		  }
		});
	
}
function checkMobile() {
	var mobile = $("#mobile").val();
	if(mobile == null || "" == mobile) {
		showErrTip("手机号不能为空");
		return false;
	}
	var mobileExp = /^1\d{10}$/
	if(!mobileExp.test(mobile)) {
		showErrTip("请输入正确手机号");
		return false;
	}
	showErrTip("");
	return true;
}

function showErrTip(tip) {
	//$("#wrongDiv").show();
	$("#errortips").html(tip);
}
