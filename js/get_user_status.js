//默认加载事件
$(function() {
	
	var userId=  window.localStorage.getItem("userId");
	if( userId== null || userId==""){    //如果用户没有登录，就返回到登录页面
		 //window.location.href='usolvmobile://wallet/webview?url=bG9naW4uaHRtbA~~';
		 window.location.href='../page/login.html';
		  return false;
   }
	
	$.ajax({
				type : 'POST',
				url : "http://walletcpstest2.hnapay.com/rest/account/userRelation/getUserStatus",
				data : {
					walletUserId : window.localStorage.getItem("userId")
				},
				dataType : 'json',
				success : function(obj) {
					if (obj.statusCode == "0000") {
						var user = obj.data;
						if (user.userStatus == "c4ca4238a0b923820dcc509a6f75849b") {
							//window.location.href = "usolvmobile://wallet/webview?url=dXNlcl9mcmVlemUuaHRtbA~~";
							window.location.href = "../page/user_freeze.html";
							return false;
						}

					} else if (obj.statusCode == "0001") {
						showErrTip("参数失败");
						return;
					} else if (obj.statusCode == "0002") {
						showErrTip("出现异常");
						return;
					}
				},
				error : function(xhr, type) {
					showErrTip("加载异常，请检查网络");
				}
			});

});

/*判断是不是空的对象*/
function isNullObj(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            return false;
        }
    }
    return true;
}

// 登出
function signOut() {
	window.localStorage.clear();
	//window.location.href = "usolvmobile://wallet/webview?url=bG9naW4uaHRtbA~~";
	window.location.href = "../page/login.html";
}

// 错误提示信息
function showErrTip(tip) {
	$("#wrongDiv").show();
	$("#wrongTip").html(tip);
}
