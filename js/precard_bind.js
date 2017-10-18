/**
 * 绑定纵横卡precard_bind.html的方法
 */
$(function() {
	$("#cardNo").val("");
	$("#pwd").val("");
});

/**
 * 纵横卡的绑定
 * @returns {Boolean}
 */
function nextGo() {
	var cardNo = $("#cardNo").val();
	var pwd = $("#pwd").val();
	
	if(cardNo == null || "" == cardNo) {
		showErrTip("请输入正确的纵横卡卡号");
		return false;
	}
	if(cardNo.length != 16) {
		$("#cardNo").val("");
		showErrTip("请输入正确的纵横卡卡号");
		return false;
	}
	
	/*此段代码 上灰度环境 一定要放开  测试环境  暂时屏蔽 */
	//测试环境卡BIN：862139，生产环境卡BIN：862137、862138
	if(cardNo.substring(0,6) != 862137 && cardNo.substring(0,6) != 862138 && cardNo.substring(0,6) != 862139 && cardNo.substring(0,6) != 861008 && cardNo.substring(0,6) != 861009){
		$("#cardNo").val("");
		showErrTip("请输入正确的纵横卡卡号");
		return false;
	}
	
	 /*绑定861012----862137开头的实名卡的时候  如果没有钱包用户没有实名认证 提示用户实名认证*/
	var isRealName = localStorage.getItem("isRealName");
	if(isRealName != "1") {
		if(cardNo.substring(0,6) == 861012 || cardNo.substring(0,6) == 862137 || cardNo.substring(0,6) == 861008){
			window.location.href='realname_auth.html';
			//window.location.href='usolvmobile://wallet/webview?url=cmVhbG5hbWVfYXV0aC5odG1s';			
			return false;
		}
	}

	if(pwd == null || "" == pwd) {
		showErrTip("请输入正确的密码");
		return false;
	}
	if(pwd.length != 6) {
		$("#pwd").val("");
		showErrTip("请输入正确的密码");
		return false;
	}
	 /*按钮点击一次之后禁用掉按钮点击事件*/
	 $("#next").attr('disabled','disabled');
	 
	 if(isBindTenPrecard()){
			var idNumber = localStorage.getItem("idNumber");  //身份证号码
			var realName = localStorage.getItem("realName");  //真实姓名
				/*判断是非实名卡的    862143---862138是非实名卡 */
			   if(cardNo.substring(0,6) == 862143 || cardNo.substring(0,6) == 862138 || cardNo.substring(0,6) == 862139 || cardNo.substring(0,6) == 861009){
					 var userId=  window.localStorage.getItem("userId");
					$.ajax({
						  type: 'POST',
						  url: "https://walletcpstest2.hnapay.com/rest/precard/bindNoAuthNamePrepaidCard",
						  data: JSON.stringify({ 
							  cardNo : cardNo,
							  txnPwd : pwd,
							  buyerName : realName,
							  buyerIdType : "1",
							  buyerIdNo : idNumber,
							  userId : userId
						  }),
						  dataType: 'json',
						  contentType : 'application/json',
						  success: function(obj){
						  	alert("ok!")
							  if(obj.statusCode == "0000") {
								 //我的纵横卡页面
								 window.location.href="precard.html";
								 //window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZC5odG1s';
							  }else {
								  $("#next").removeAttr("disabled");
								  showErrTip(obj.message);
								  return false;
							  }
						  },
						  error: function(xhr, type){
							  showErrTip("加载异常，请检查网络");
							  $("#next").removeAttr("disabled");
						  }
						});
				}else {
					$.ajax({
						  type: 'POST',
						  url: "https://walletcpstest2.hnapay.com/rest/precard/authRealNamePrepaidCard",
						  data: JSON.stringify({ 
							  cardNo : cardNo,
							  txnPwd : pwd,
							  buyerName : realName,
							  buyerIdType : "1",
							  buyerIdNo : idNumber,
							  userId :  window.localStorage.getItem("userId")
						  }),
						  dataType: 'json',
						  contentType : 'application/json',
						  success: function(obj){
							  //console.log('PResult: '+JSON.stringify(obj));
							  if(obj.statusCode == "0000") {
								  bindPrepaidCard(cardNo,pwd,realName,idNumber);
							  }else {
								  $("#next").removeAttr("disabled");
								  showErrTip(obj.message);
								  return false;
							  }
						  },
						  error: function(xhr, type){
							  showErrTip("加载异常，请检查网络");
							  $("#next").removeAttr("disabled");
						  }
						});
				}
	 }
}

/**
 * 绑定预付卡
 */
function bindPrepaidCard(cardNo,txnPwd,realName,idNumber){
	var userId = localStorage.getItem("userId");
	$.ajax({
		type: 'POST',
		url: "https://walletcpstest2.hnapay.com/rest/precard/bindPrepaidCard",
		data: JSON.stringify({ 
			cardNo : cardNo,
			txnPwd : txnPwd,
			buyerName : realName,
			buyerIdType : "1",
			buyerIdNo : idNumber,
			userId : userId
		}),
		dataType: 'json',
		contentType : 'application/json',
		success: function(obj){
			if(obj.statusCode == "0000") {
				//我的纵横卡页面
				window.location.href="precard.html";
				//window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZC5odG1s';
			} else {
				showErrTip(obj.message);
				$("#next").removeAttr("disabled");
				return false;
			}
		},
		error: function(xhr, type){
			showErrTip("加载异常，请检查网络");
			$("#next").removeAttr("disabled");
		}
	});
}


/**
 * 校验用户下绑定纵横卡数量已达到10张
 */
function isBindTenPrecard(){
	//console.log("isBindTenPrecard");
	var reFlag = false;
	var userId = localStorage.getItem("userId");
	$.ajax({
		type: 'POST',
		url: "https://walletcpstest2.hnapay.com/rest/precard/isExistTenPrecard",
		data: JSON.stringify({ 
			userId : userId
		}),
		dataType: 'json',
		contentType : 'application/json',
		async:false,//同步请求
		success: function(obj){
			if(obj.statusCode == "0000") {
				var flag = obj.data;
				if(flag == true){
					//window.location.href='precard_bind.html';
					//window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZF9iaW5kLmh0bWw~';
					reFlag = true;
				}else{
					$("#next").removeAttr("disabled");
					showErrTip("该用户下绑定纵横卡数量已达到10张，不能继续绑卡");
					//return false; 
					reFlag = false;
				}
			}else{
				$("#next").removeAttr("disabled");
				showErrTip(obj.message);
				//return false;
				reFlag = false;
			}
	    
		},
		error: function(xhr, type){
			$("#next").removeAttr("disabled");
			showErrTip("加载异常，请检查网络");
			reFlag = false;
		}
	});
	
	return reFlag;
}