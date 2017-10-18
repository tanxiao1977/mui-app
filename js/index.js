/**
 * 首页index.html的方法
 */

$(function() {
	

	//首页——网络账户
	$(".indeximg1").click(function(){
		//检验用户状态，是否实名、绑卡、设置支付密码
		if(checkStatus()){
			//弹出支付密码弹出框
			openDialog("1");
		}
	})
	//首页——绑定纵横卡
	$(".indeximg2").click(function(){
		//检验用户状态，是否实名、绑卡、设置支付密码		
		if(checkStatus()){
			//进入纵横卡绑定页面
			window.location.href="precard_bind.html";
			//window.location.href='usolvmobile://wallet/webview?url=cHJlY2FyZF9iaW5kLmh0bWw~';
		}
	})
})