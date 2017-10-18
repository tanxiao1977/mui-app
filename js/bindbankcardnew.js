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
		   return false;
	   }

	var  realName = window.localStorage.getItem("realName");
	var  idNumber = window.localStorage.getItem("idNumber");
	 $("#custName").val(realName);  //姓名
	 $("#custIdNo").val(idNumber);  //身份证号码
		   
});


/**
 * 绑定银行卡 点击下一步的操作
 */
function nextGo()
{
	//验证中文正则表达式
	   var myReg = /^[\u4e00-\u9fa5]+$/;
		var custName = $("#custName").val();
		if(custName == null || "" == custName) {
			showErrTip("持卡人不能为空");
			return false;
		}
	    if (!myReg.test(custName)) {
			showErrTip("持卡人必须是中文");
			return false;
	    }
	    
		//验证身份证号码正则表达式
		var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
		isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}(x|X))$/;

		var custIdNo = $("#custIdNo").val();
		if(custIdNo == null || "" == custIdNo) {
			showErrTip("身份证号码不能为空");
			return false;
		}
		
		if(!isIDCard1.test(custIdNo)&&!isIDCard2.test(custIdNo)){
			showErrTip("身份证号码格式不正确");
			return  false;
		}

	
		var cardNo = $("#cardNo").val().replace(/\s/g,"");
		if(cardNo == null || "" == cardNo)
		{
			showErrTip("银行卡卡号不能为空");
			return false;
		}

		if(cardNo.length>21) {
			showErrTip("请输入15-21位银行卡号");
			return false;
		}
		if(!channeCardType())
        {
			return false;
        }
		
		var cardPhone = $("#cardPhone").val();    //银行预留手机号
		if(cardPhone == null || "" == cardPhone)
		{
			showErrTip("银行预留手机号不能为空");
			return false;
		}
		
		var mobileExp = /^(1\d{2})\d{8}$/;
			if(!mobileExp.test(cardPhone)) {
				showErrTip("请输入正确手机号");
				return false;
		}
			 /*按钮点击一次之后禁用掉按钮点击事件*/
			 $("#nextgo").attr('disabled','disabled');
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/userRelation/bindBankCardApply",
		  data: { 
			  realName : window.localStorage.getItem("realName"),
			  idNumber : window.localStorage.getItem("idNumber"),
			  cardNo:  cardNo,
			  cardPhone : $("#cardPhone").val()
		  },
		  dataType: 'json',
		  success: function(obj){
			  if(obj.statusCode == "0000") {
				  var user = obj.data;
			      var hnapayOrderId =user.hnapayOrderId;  
				   
				   window.localStorage.setItem("cardPhone", $("#cardPhone").val());
				   window.localStorage.setItem("hnapayOrderId", hnapayOrderId);
				   //window.top.location.href = "usolvmobile://wallet/webview?url=Li4lMkZwYWdlJTJGYmluZGJhbmtjYXJkbW9iaWxlLmh0bWw~";
				   window.location.href = "../page/bindbankcardmobile.html";

			  }else if(obj.statusCode == "100E5001")
			  {
					 $("#nextgo").removeAttr("disabled");//将按钮可用
				  	showErrTip("商户不存在");
				  	return false;
			  }
			  else if(obj.statusCode == "100E6075")
			  {
					 $("#nextgo").removeAttr("disabled");//将按钮可用
				  	showErrTip("身份证号码格式错误");
				  	return false;
			  }
			  else if(obj.statusCode == "100E6069")
			  {
					 $("#nextgo").removeAttr("disabled");//将按钮可用
				  	showErrTip("银行卡号格式错误");
				  	return false;
			  }
			  else if(obj.statusCode == "100E5154")
			  {
					 $("#nextgo").removeAttr("disabled");//将按钮可用
				  	showErrTip("绑卡申请失败");
				  	return false;
			  }
			  else if(obj.statusCode == "0001")
			  {
					 $("#nextgo").removeAttr("disabled");//将按钮可用
				  	showErrTip("银行卡绑定申请失败");
				  	return false;
			  }
			  else if(obj.statusCode == "0002")
			  {
				  $("#nextgo").removeAttr("disabled");//将按钮可用
				  	showErrTip("银行卡绑定申请失败了");
				  	return false;
			  }
		  },
		  error: function(xhr, type){
			  $("#nextgo").removeAttr("disabled");//将按钮可用
			  showErrTip("加载异常，请检查网络");
		  }
		});

}

//验证姓名
function checkCustName() {
	
	//验证中文正则表达式
   var myReg = /^[\u4e00-\u9fa5]+$/;
	var custName = $("#custName").val();
	if(custName == null || "" == custName) {
		showErrTip("持卡人不能为空");
		return false;
	}
    if (!myReg.test(custName)) {
		showErrTip("持卡人必须是中文");
		return false;
    }
}

//验证身份证号码
function checkCustIdNo() {
     
	//验证身份证号码正则表达式
	var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
	isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}(x|X))$/;

	var custIdNo = $("#custIdNo").val();
	if(custIdNo == null || "" == custIdNo) {
		showErrTip("身份证号码不能为空");
		return false;
	}
	
	if(!isIDCard1.test(custIdNo)&&!isIDCard2.test(custIdNo)){
		showErrTip("身份证号码格式不正确");
		return  false;
	}
  
}


//验证银行卡卡号
function checkCardNo() {

	var cardNo = $("#cardNo").val();   
	if(cardNo == null || "" == cardNo)
	{
		showErrTip("银行卡卡号不能为空");
		return false;
	}
	
}


function addwhiteSpace(){
	if($("#cardNo").val().replace(/[^\d\s]/g,"").replace(/\s/g,'').length>21){
		showErrTip("请输入15-21位银行卡号");
		$("#cardNo").val($("#cardNo").val().replace(/[^\d\s]/g,"").replace(/\s/g,'').substr(0,21).replace(/(\d{4})(?=\d)/g,"$1 "));
	}else{
		showErrTip("");
		var value=$("#cardNo").val().replace(/[^\d\s]/g,"").replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
		$("#cardNo").val(value)
	}
}


/*根据银行卡 卡号获取卡的类型*/
function channeCardType()
{
	//addwhiteSpace();
	var flag=0;  //标识返回类型
	var card_front_no = $("#cardNo").val().replace(/\s/g,"");    //银行卡卡号
	//alert(card_front_no)
	//alert(card_front_no.length)
	if(card_front_no.length>21) {
		showErrTip("请输入15-21位银行卡号");
		return false;
	}
	var cardNoEnd=card_front_no.substr(0, 6);   //获取银行卡卡号前6位
	 
		$.ajax({
			  async: false,
			  type: 'POST',
			  url: "https://walletcpstest2.hnapay.com/rest/account/userRelation/getCardTypeName",
			  data: { 
				  cardNoEnd : cardNoEnd
			  },
			  dataType: 'json',
			  success: function(obj){
				  if(obj.statusCode == "0000") {
					  var user = obj.data;
					   $("#cardType").val(user.cardTypeName);  
					   flag=1;
					  showErrTip("");
					  return true;
				  }else if(obj.statusCode == "0001")
					  {
					  	flag=0;
						  $("#cardType").val("");
						  showErrTip("查询系统失败");
					  	return false;
					  }
				  else if(obj.statusCode == "0002")
				  {
					 	flag=0;
					  $("#cardType").val("");
				  	showErrTip("无法查询该银行卡的信息");
				  	return false;
				  }
				  else if(obj.statusCode == "0003")
				  {
					 	flag=0;
					  $("#cardType").val("");
				  	showErrTip("仅支持绑定借记卡");	
				  	return false;
				  }
			  },
			  error: function(xhr, type){
				 	flag=0;
				  $("#cardType").val("");
				  showErrTip("加载异常，请检查网络");
			  }
			});
		return Boolean(flag);
}

//验证银行预留手机号格式是否正确
function checkCardPhone() {

	var cardPhone = $("#cardPhone").val();    //银行预留手机号
	if(cardPhone == null || "" == cardPhone)
	{
		showErrTip("银行预留手机号不能为空");
		return false;
	}
	
	var mobileExp = /^(1\d{2})\d{8}$/;
		if(!mobileExp.test(cardPhone)) {
			showErrTip("请输入正确手机号");
			return false;
	}
	
}

//错误提示信息
function showErrTip(tip) {
	$("#wrongDiv").show();
	$("#wrongTip").html(tip);
}
