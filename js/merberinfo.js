//设置默认值
(function() {

	//跳转页面
	$('.ui-list li,.ui-tiled li').click(function() {
		if ($(this).data('href')) {
			location.href = $(this).data('href');
		}
	});
	if (window.sessionStorage) {
		window.localStorage.setItem("uid", "york");
	} else {
		alert('This browser does NOT support sessionStorage');
	}
	
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/member/info",
		  data: { 
			  userId : window.localStorage.getItem("userId")
		  },
		  dataType: 'json',
		  success: function(data){
			  
			//$("#nickName").html(data.data.nickName);
			$("#phone").html(data.data.phone);
			if(data.data.isRealName == "1"){
			  $("#realName").html(data.data.custName);
			  $("#realName").html("<img src='../img/yrz.png' class='czjz mr5'/>"+data.data.custName);
			}else{
			  $("#realName").html("<img src='../img/wrz.png' class='czjz mr5'/>");
			}

			$("#email").html(data.data.email);
			$("#address").html(data.data.address);
			$("#company").html(data.data.company);

			if(data.data.isSetPaypwd == "1"){
				$("#payPwd").html("<i class='ui-icon-arrow ml-7'></i>"+"修改");
			}else{
				$("#payPwd").html("<i class='ui-icon-arrow ml-7'></i>"+"未设置");
			}
			  	   
			var isBindBankCard= window.localStorage.getItem("isBindBankCard");
			if(isBindBankCard!="1"){   //如果没有银行卡快捷认证  就显示未绑卡
				// $("#bindBankCard").html("<i class='ui-icon-arrow ml-7'></i>"+"未绑卡");
				$("#bindBankCard").html("<img src='../img/wbd.png' class='czjz mr5'/>");
			}else{
			 	$("#bindBankCard").html("<img src='../img/ybd.png' class='czjz mr5'/>");
			}

			$("#realNameBtn").click(function(){
				window.location.href="realname_auth.html";
			});

			$("#setPwdBtn").click(function(){
				window.location.href="set_pay_pwd.html";
			});

			$("#bindBankCardBtn").click(function(){
				   window.location.href = "bindbankcardnew.html";
			});

		  },
		  error: function(xhr, type){
			  alert("加载异常，请检查网络");
		  }
		});

})();

//修改登录密码
function modifyLoginPwd(){
	 window.top.location.href = "reset_password.html";
}

//修改支付密码
function modifyPayPwd(){

	var isSetPaypwd = localStorage.getItem("isSetPaypwd");
	if(isSetPaypwd != "1") {
		//$("#setPwdDialog").dialog("show");
		window.top.location.href = "set_pay_pwd.html";
		return false;
	}

/*	var isRealName = localStorage.getItem("isRealName");
	if(isRealName != "1") {
		//var dia2=$("#realNameDialog").dialog("show");
		window.top.location.href = "usolvmobile://wallet/webview?url=cmVhbG5hbWVfYXV0aC5odG1s";
		return false;
	}*/

	window.top.location.href = "modify_pay_pwd.html";
}


//实名认证
function realNameAuth(){

	var isSetPaypwd = localStorage.getItem("isSetPaypwd");
	if(isSetPaypwd != "1") {
		//$("#setPwdDialog").dialog("show");
		window.top.location.href = "set_pay_pwd.html";
		return false;
	};

	var isRealName=  window.localStorage.getItem("isRealName");
	if(isRealName!="1"){   //如果没有实名认证 就跳转到实名认证页面
	   window.top.location.href = "realname_auth.html";
	   return false ;
	}
}

//绑定银行卡
function modifyBindBankCard(){

	var isSetPaypwd = localStorage.getItem("isSetPaypwd");
	if(isSetPaypwd != "1") {
		//$("#setPwdDialog").dialog("show");
		window.top.location.href = "set_pay_pwd.html";
		return false;
	}

	var isRealName = localStorage.getItem("isRealName");
	if(isRealName != "1") {
		//var dia2=$("#realNameDialog").dialog("show");
		window.top.location.href = "realname_auth.html";
		return false;
	}
	
  	var isBindBankCard= window.localStorage.getItem("isBindBankCard");
	if(isBindBankCard!="1"){   //如果没有银行卡快捷认证  就跳转到设置银行卡快捷认证页面
	  	//window.top.location.href = "usolvmobile://wallet/webview?url=YmluZGJhbmtjYXJkbmV3Lmh0bWw~";
	  	window.top.location.href = "bindbankcardnew.html";
	  	return false;
	  }
}

//登出
function signOut(){
	//$("#nickName").html("");
	  $("#phone").html("");
	  $("#realName").html("");
	  $("#email").html("");
	  $("#address").html("");
	  $("#company").html("");
	window.localStorage.clear();
	//window.location.href = "usolvmobile://wallet/webview?url=bG9naW4uaHRtbA~~";
	window.location.href = "login.html";
}

//操作指引
function operate(){
	window.location.href = "operate.html";
}

//商户列表
function merchantList(){
	window.location.href = "merchantList.html";
}
