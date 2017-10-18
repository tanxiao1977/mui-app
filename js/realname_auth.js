//默认加载事件
$(function(){
	var isSetPaypwd=  window.localStorage.getItem("isSetPaypwd");
	if(isSetPaypwd !="1"){   //如果没有设置支付密码  就跳转到设置支付密码页面
		window.location.href = "../page/set_pay_pwd.html";
		//window.top.location.href = "usolvmobile://wallet/webview?url=Li4lMkZwYWdlJTJGc2V0X3BheV9wd2QuaHRtbA~~";
		return false;
	}
});


/**
 * 提交实名认证申请
 */
function  custNameAuth() {
	
		//验证中文正则表达式
	   var myReg = /^[\u4e00-\u9fa5]+$/;
		var custName = $("#custName").val();
		if(custName == null || "" == custName) {
			showErrTip("姓名不能为空");
			return false;
		}
	    if (!myReg.test(custName)) {
			showErrTip("姓名必须是中文");
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
	
		var userId = window.localStorage.getItem("userId");
		if(userId == null) {
			showErrTip("用户未登录");
	        return false;
		}
			/*按钮点击一次之后禁用掉按钮点击事件*/
			$("#nextGo").attr('disabled','disabled');
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/account/userRelation/realNameAuth",
	
		  data: { 
			  custName : $("#custName").val(), 
			  custIdNo : $("#custIdNo").val(),
			  hnapayCustId: window.localStorage.getItem("hnapayCustId"),
			  walletUserId: window.localStorage.getItem("userId")
			  
		  },
		
		  dataType: 'json',
		  success: function(obj){
		    	      if(obj.statusCode=="0000")  
			    	   {
			    	   	   if(obj.data.userStatus=="c4ca4238a0b923820dcc509a6f75849b")
						   {
				    	   		$("#nextGo").removeAttr("disabled");
							    showErrTip("您的账户异常。如有疑问，请联系客服400-089-0098");
							   	return false;
						   }
		    	    	  window.localStorage.setItem("realName", obj.data.custName);
						  window.localStorage.setItem("idNumber", obj.data.custIdNo);
						  window.localStorage.setItem("isRealName", obj.data.isRealName);
			    	      //window.location.href="usolvmobile://wallet/webview?url=Li4lMkZwYWdlJTJGYmluZGJhbmtjYXJkbmV3Lmh0bWw~";//认证成功
			    	      window.location.href="../page/bindbankcardnew.html";//认证成功
			    	   }
		    	      else if(obj.statusCode=="0001")  
			    	   {
			        	 $("#nextGo").removeAttr("disabled");//将按钮可用
			    		 //window.location.href="usolvmobile://wallet/webview?url=cmVhbG5hbWVfYXV0aF9lcnJvci5odG1s";//认证失败
						   showErrTip("认证失败");
			    	   }else if(obj.statusCode=="0002"){
			    			 $("#nextGo").removeAttr("disabled");//将按钮可用
			    			 showErrTip("您的证件号码输入有误，请重新输入");
			    		     return false ;
			    	  }
		    	
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
			  $("#nextGo").removeAttr("disabled");
		  }
		});
};


//验证姓名
function checkCustName() {
	
	//验证中文正则表达式
   var myReg = /^[\u4e00-\u9fa5]+$/;
	var custName = $("#custName").val();
	if(custName == null || "" == custName) {
		showErrTip("姓名不能为空");
		return false;
	}
    if (!myReg.test(custName)) {
		showErrTip("姓名必须是中文");
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

//验证身份证有效期限
function checkCustIdNOValidity() {

	
	//验证中文正则表达式
   var myReg = /^[\u4e00-\u9fa5]+$/;
	
	var custIdNOValidity = $("#custIdNOValidity").val();    //支付密码
	if(custIdNOValidity == null || "" == custIdNOValidity)
	{
		showErrTip("身份证有效期限不能为空");
		return false;
	}
	if (myReg.test(custIdNOValidity)) {
		showErrTip("身份证有效期限不能为中文");
		return false;
    }
	

}



//验证支付密码
function checkCustPwd() {

	var payPwd = $("#payPwd").val();    //支付密码
	if(payPwd == null || "" == payPwd)
	{
		showErrTip("支付密码不能为空");
		return false;
	}
	if(payPwd.length<8 || payPwd.length>20){
			showErrTip("支付密码长度为8-20位");
			return false;
		}
	var confirmPayPwd = $("#confirmPayPwd").val();  //确认支付密码
	if(confirmPayPwd == null || "" == confirmPayPwd) {
		showErrTip("确认支付密码不能为空");
		return false;
	}
	if(payPwd !=confirmPayPwd ){
    	showErrTip("确认支付密码和支付密码输入不一致");
         $("#payPwd").val("");
         $("#confirmPayPwd").val("");
      }
}

//错误提示信息
function showErrTip(tip) {
	$("#wrongDiv").show();
	$("#wrongTip").html(tip);
}
