/**
 * 网络账户、纵横卡相关页面公共JS
 */

/**
 * 弹出支付密码弹出框
 * oper:调用支付密码弹出框的位置，1：首页，2：我的网络账户页，3：我的纵横卡页
 */
function openDialog(oper){
	var mask = mui.createMask(callback);
	mask.show();
	$("#pwdDialog").show();
	//提交验证
	$(".safeexit").click(function(){
		//校验支付密码
		checkPayPwdAuth(oper);
	})
}
function callback(){
	return false;
}
/**
 * 检验用户状态，是否设置支付密码、实名、绑卡
 * @returns {Boolean}
 */
function checkStatus(){
	//console.log("进入checkStatus方法");
	//获取设置支付密码标识，1:已设置，0：未设置
	var isSetPaypwd = localStorage.getItem("isSetPaypwd");
	if(isSetPaypwd != "1") {
		window.location.href='set_pay_pwd.html';
		//window.location.href='usolvmobile://wallet/webview?url=c2V0X3BheV9wd2QuaHRtbA~~';		
		return false;
	}
	
	//获取实名认证标识，1:已实名，0：未实名
	var isRealName = localStorage.getItem("isRealName");
	if(isRealName != "1") {
		window.location.href='realname_auth.html';
		//window.location.href='usolvmobile://wallet/webview?url=cmVhbG5hbWVfYXV0aC5odG1s';
		return false;
	}

	//获取绑定银行卡标识，1:已绑卡，0：未绑卡
	var isBindBankCard = window.localStorage.getItem("isBindBankCard");//是否绑定银行卡
	if(isBindBankCard !="1"){   
		//如果没有绑定银行卡，就跳转到绑定银行卡页面
		window.location.href='bindbankcardnew.html';
		//window.location.href='usolvmobile://wallet/webview?url=YmluZGJhbmtjYXJkbmV3Lmh0bWw~';
		return false;
	}
	return true;
}

/**
 * 校验支付密码
 * oper:调用支付密码弹出框的位置，1：首页，2：我的网络账户页，3：我的纵横卡页
 * @returns {Boolean}
 */
function checkPayPwdAuth(oper){
	//隐藏错误提示信息
	hideDialogTip();
	//获取钱包用户手机号码
	var phone = localStorage.getItem("mobile");
	//获取用户输入支付密码
	var payPwd = $("#payPwd").val();
	
	if(payPwd == null || "" == payPwd) {
		showDialogTip("支付密码不能为空");
		return false;
	}
	//"提交验证"按钮点击一次之后禁用掉按钮点击事件
	$(".safeexit").attr('disabled','disabled');
	
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/userRelation/checkPayPwdAuth",
		  data: { 
			  payPwd : payPwd,
			  phone : phone
		  },
		  dataType: 'json',
		  success: function(obj){
			  //console.log("obj:"+obj);
			  if(obj.statusCode == "0000") {
				  //关闭弹出框
				  //$.dialog.close();
				  	//mask.close();
				  	//$("#pwdDialog").hide();
				  if(oper == "1"){
					  //首页——跳转网络账户页面
					  window.location.href="wallet_unionprecard.html";
					  //window.location.href='usolvmobile://wallet/webview?url=d2FsbGV0X3VuaW9ucHJlY2FyZC5odG1s';
				  } else if(oper == "2"){
					  //要解绑的卡号
					  var preCardId = $("#preCardId_new").val();
					  //实名卡/非实名卡状态标识
					  var identifyStatus = $("#identifyStatus_new").val();
					  //网络账户页面——调用解绑函数
					  unbindPrepaidCard(preCardId,identifyStatus,"wallet_unionprecard");
				  } else if(oper == "3"){
					  //要解绑的卡号
					  var preCardId = $("#preCardId_new").val();
					  //实名卡/非实名卡状态标识
					  var identifyStatus = $("#identifyStatus_new").val();					  
					  //我的纵横卡页面——调用解绑函数
					  unbindPrepaidCard(preCardId,identifyStatus,"precard");
				  }else {
					  //首页——跳转网络账户页面
					  window.location.href="wallet_unionprecard.html";
					  //window.location.href='usolvmobile://wallet/webview?url=d2FsbGV0X3VuaW9ucHJlY2FyZC5odG1s';
				  }
			  } else {
				  //"提交验证"按钮恢复可点击状态
				  $(".safeexit").removeAttr("disabled");
				  showDialogTip(obj.message);
				  return ;
			  }
		  },
		  error: function(xhr, type){
			  //"提交验证"按钮恢复可点击状态
			  $(".safeexit").removeAttr("disabled");
			  showErrTip("加载异常，请检查网络");
		  }
	});
}


/**
 * 充值纵横卡
 */
function rechargeCard(preCardId){
	//检验用户状态，是否设置支付密码、实名、绑卡
	if(checkStatus()){
		window.localStorage.setItem("preCardId", preCardId);
		window.location.href='precard_pay.html';
		//window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZF9wYXkuaHRtbA~~';	
	}
}

/**
 * 添加纵横卡
 * @returns {Boolean}
 */
function addPreCard(){
	//console.log("addPreCard");
	//检验用户状态，是否设置支付密码、实名、绑卡
	if(checkStatus()){
		//校验用户下绑定纵横卡数量已达到10张,没有超过则到纵横卡绑卡页面
		isExistTenPrecard();
	}
}

/**
 * 校验用户下绑定纵横卡数量已达到10张
 */
function isExistTenPrecard(){
	//console.log("isExistTenPrecard");
	var userId = localStorage.getItem("userId");
	$.ajax({
		type: 'POST',
		url: "https://walletcpstest2.hnapay.com/rest/precard/isExistTenPrecard",
		data: JSON.stringify({ 
			userId : userId
		}),
		dataType: 'json',
		contentType : 'application/json',
		success: function(obj){
			if(obj.statusCode == "0000") {
				var flag = obj.data;
				if(flag == true){
					window.location.href='precard_bind.html';
					//window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZF9iaW5kLmh0bWw~';
				}else{
					showErrTip("该用户下绑定纵横卡数量已达到10张，不能继续绑卡");
					return false; 
				}
			}else{
				showErrTip(obj.message);
				return false;
			}
	    
		},
		error: function(xhr, type){
			showErrTip("加载异常，请检查网络");
		}
	});
}

/**
 * 解绑纵横卡
 * @param preCardId  纵横卡卡号
 * @param identifyStatus 纵横卡类型：1-实名卡,0-非实名卡
 */
function unbindPrepaidCard(preCardId,identifyStatus,href){
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/precard/unbindPrepaidCard",
		  data: JSON.stringify({ 
			  preCardId : preCardId,
			  identifyStatus : identifyStatus
		  }),
		  dataType: 'json',
		  contentType : 'application/json',
		  success: function(obj){
			  //console.log('unbindPrepaidCard: '+JSON.stringify(obj));
			  if(obj.statusCode == "0000") {
			//	  window.location.href=href+'.html';
				  if(href == "wallet_unionprecard") {
					  //网络账户页面
					  window.location.href="wallet_unionprecard.html";
					  //window.location.href='usolvmobile://wallet/webview?url=d2FsbGV0X3VuaW9ucHJlY2FyZC5odG1s';
				  } else if(href == "precard") {
					  //我的纵横卡页面
					  window.location.href="precard.html";
					  //window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZC5odG1s'; 
				  } else {
					  //我的纵横卡页面
					  window.location.href="precard.html";
					  //window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZC5odG1s'; 
				  } 
			  }else {
				  showErrTip(obj.message);
				  return ;
			  }
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
		  }
	});
}

//展示提示信息
function showErrTip(tip) {
	$("#wrongTip").html(tip);
}
//隐藏提示信息
function hideErrTip() {
	$("#wrongTip").html("");
}

//展示弹出框提示信息
function showDialogTip(tip) {
	$("#dialogtips").html(tip);
}
//隐藏弹出框提示信息
function hideDialogTip() {
	$("#dialogtips").html("");
}