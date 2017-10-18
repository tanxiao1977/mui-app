//默认加载事件
//$(function(){
//
//	 var isRealName=  window.localStorage.getItem("isRealName");
//	   if(isRealName!="1"){   //如果没有实名认证 就跳转到实名认证页面
//		   window.top.location.href = "usolvmobile://wallet/webview?url=cmVhbG5hbWVfYXV0aC5odG1s";
//		   return ;
//	   }
//
//});

/**
 * 提交设置交支付密码
 */
function  setPayPwdAuth() {

	var payPwd = $("#payPwd").val();    //支付密码
	if(payPwd == null || "" == payPwd)
	{
		showErrTip("支付密码不能为空");
		return false;
	}
	
	var num = /^(?:\d*)$/;
	var upperLetter = /^([A-Z]*)$/;
	var lowLetter = /^([a-z]*)$/;
	var special = /^([\~\!\@\#\^\*\-\[\]\{\}\:\?]*)$/;
	var isNewPassword = /^[a-zA-Z0-9\~\!\@\#\^\*\_\-\[\]\,\{\}\:\?]{8,20}$/;
	var isNotNewPassword = /^(?:\d*|[a-zA-Z]*|[\w\~\!\@\#\^\*\_\-\[\]\,\{\}\:\?]*)$/;

	if (payPwd.match(isNotNewPassword) == null) {
		showErrTip("输入字符有误，支持的字符为~!@#^*_-[],{}:?");
		return false;
	}
	if (payPwd.match(num) != null || payPwd.match(upperLetter) != null
			|| payPwd.match(lowLetter) != null || payPwd.match(special) != null) {
		showErrTip("至少使用8-20位大小写英文字母、数字或标点符号两种组成");
		return false;
	}
	if (payPwd.match(isNewPassword) == null) {
		showErrTip("至少使用8-20位大小写英文字母、数字或标点符号两种组成");
		return false;
	}
	
	var confirmPayPwd = $("#confirmPayPwd").val();  //确认支付密码
	if(confirmPayPwd == null || "" == confirmPayPwd) {
		showErrTip("确认支付密码不能为空");
		return false;
	}
	if(payPwd !=confirmPayPwd ){
    	showErrTip("确认支付密码和支付密码输入不一致");
         return false;
      }
	
	var phone = window.localStorage.getItem("mobile");
	if(phone == null) {
		showErrTip("用户未登录");
        return false;
	}
		/*按钮点击一次之后禁用掉按钮点击事件*/
		$("#setPayPwd").attr('disabled','disabled');
		$.ajax({
			  type: 'POST',
			  url: "https://walletcpstest2.hnapay.com/rest/account/userRelation/setPayPwdAuth",
			  // data to be added to query string:
			  data: { 
				  payPwd : $("#payPwd").val(),
				  phone : phone
			  },

			  dataType: 'json',
			  success: function(data){
			       if(data.statusCode=="0000")
			    	   {
			    	   		window.localStorage.setItem("isSetPaypwd", "1");
						   setPayPwdComplete();
						   //window.location.href="usolvmobile://wallet/webview?url=c2V0X3BheV9wd2RfYXV0aF9vay5odG1s";//设置支付密码成功
			    	        //window.location.href="../page/realname_auth.html";//设置支付密码成功
					   }else if(data.statusCode == "100E2039")   //支付密码同登录密码不能相同
					   {
						   $("#setPayPwd").removeAttr("disabled");//将按钮可用
							  showErrTip("支付密码同登录密码不能相同");
						      return false ;
				        }
					   else if(obj.statusCode=="0001")  
			    	   {
			        	 $("#setPayPwd").removeAttr("disabled");//将按钮可用
			    		   //window.location.href="usolvmobile://wallet/webview?url=c2V0X3BheV9wd2RfYXV0aF9lcnJvci5odG1s";//设置支付密码失败
			    		   window.location.href="../page/set_pay_pwd_auth_error.html"
			    	   }else if(obj.statusCode=="0002"){
			    			 $("#setPayPwd").removeAttr("disabled");//将按钮可用
			    			 showErrTip("调用接口出现异常");
			    		     return false ;
			    	  }
			  },
			  error: function(xhr, type){
				  $("#setPayPwd").removeAttr("disabled");//将按钮可用
				  showErrTip("加载异常，请检查网络");
			  }
			});
};


function setPayPwdComplete(){
	mui.init()
	var btnArray = ['返回首页', '实名认证'];
	mui.confirm('你可以选择？', 'false', btnArray, function(e) {
		if (e.index == 1) {
			window.location.href = "../page/realname_auth.html";
		}else{
			window.location.href = "../page/login.html";
		}
	})
}

//验证支付密码
function checkCustPwd(pwd) {

	var custPwd = $(pwd).val();    //支付密码

	if(custPwd == null || "" == custPwd)
	{
		var str="";
		if(pwd.name == 'payPwd'){
			str = "支付密码不能为空"
		}
		if(pwd.name == 'confirmPayPwd'){
			str = "确认支付密码不能为空"

		}
		showErrTip(str);
		return false;
	}

	var num = /^(?:\d*)$/;
	var upperLetter = /^([A-Z]*)$/;
	var lowLetter = /^([a-z]*)$/;
	var special = /^([\~\!\@\#\^\*\-\[\]\{\}\:\?]*)$/;
	var isNewPassword = /^[a-zA-Z0-9\~\!\@\#\^\*\_\-\[\]\,\{\}\:\?]{8,20}$/;
	var isNotNewPassword = /^(?:\d*|[a-zA-Z]*|[\w\~\!\@\#\^\*\_\-\[\]\,\{\}\:\?]*)$/;

	if (custPwd.match(isNotNewPassword) == null) {
		showErrTip("输入字符有误，支持的字符为~!@#^*_-[],{}:?");
		return false;
	}
	if (custPwd.match(num) != null || custPwd.match(upperLetter) != null
		|| custPwd.match(lowLetter) != null || custPwd.match(special) != null) {
		showErrTip("至少使用8-20位大小写英文字母、数字或标点符号两种组成");
		return false;
	}
	if (custPwd.match(isNewPassword) == null) {
		showErrTip("至少使用8-20位大小写英文字母、数字或标点符号两种组成");
		return false;
	}

	if(pwd.name='confirmPayPwd'&&$(pwd).val()!=null&&$(pwd).val()!=""){
		var payPwd = $("#payPwd").val();  //确认支付密码

		if(payPwd !=$(pwd).val() ){
			showErrTip("确认支付密码和支付密码输入不一致");
			return false;
		}
	}
	var confirmPayPwd = $("#confirmPayPwd").val();
	if($(pwd).name='payPwd'&&$(pwd).val()!=null&&$(pwd).val()!=""&&confirmPayPwd!=null&&confirmPayPwd!=""){

		if(confirmPayPwd !=$(pwd).val() ){
			showErrTip("确认支付密码和支付密码输入不一致");
			return false;
		}
	}
	showErrTip("")


}
//错误提示信息
function showErrTip(tip) {
	$("#wrongDiv").show();
	$("#wrongTip").html(tip);
}
