var chooseAmt;
var submitValue;

(function(){
	if (window.sessionStorage) {
//		alert('This browser supports sessionStorage');
		window.localStorage.setItem("uid", "york");
	} else {
		alert('This browser does NOT support sessionStorage');
	}
	//chooseAmt = 100;
	//跳转页面
	$('.ui-list li,.ui-tiled li').click(function() {
		if ($(this).data('href')) {
			location.href = $(this).data('href');
		}
	});
})();


function test(amt)
{
	// document.getElementById("inputAmt").value = "";
	showErrTip("");
	$("#inputAmt").val("");
	chooseAmt = amt;
	$("#goPay").removeAttr("disabled");
}

function gotopay()
{
	alert(22);
	//金额校验
	if(checkAmt()){
	 /*按钮点击一次之后禁用掉按钮点击事件*/
	 $("#goPay").attr('disabled','disabled');
	$.ajax({
		  type: 'POST',
		  url: "https://walletcpstest2.hnapay.com/rest/precard/recPrepaidCard",
		  data: { 
			  walletUserId : window.localStorage.getItem("userId"),
			  amt : submitValue,
			  cardNo: window.localStorage.getItem("preCardId"),
			  realName: window.localStorage.getItem("realName"),
			  idNumber: window.localStorage.getItem("idNumber")
		  },
		  dataType: 'json',
		  success: function(obj){
		  	alert(obj.statusCode);
			  if(obj.statusCode == "0000") {
			  	  alert(13);
				  var data = obj.data;
				  $("#tranCode").val(data.tranCode);
				  $("#version").val(data.version);
				  $("#charset").val(data.charset);
				  $("#signType").val(data.signType);
				  $("#merId").val(data.merId);
				  $("#virCardNoIn").val(data.virCardNoIn);
				  $("#merOrderNum").val(data.merOrderNum);
				  $("#tranAmt").val(data.tranAmt);
				  $("#currencyType").val(data.currencyType);
				  $("#returnUrl").val(data.returnUrl);
				  $("#notifyUrl").val(data.notifyUrl);
				  $("#tranDateTime").val(data.tranDateTime);
				  $("#tranIP").val(data.tranIP);
				  $("#goodsName").val(data.goodsName);
				  $("#merUserId").val(data.merUserId);
				  $("#buyerName").val(data.buyerName);
				  $("#idNumber").val(data.idNumber);
				  $("#phone").val(data.phone);
				  $("#signValue").val(data.signValue);
				  $("#reChargeCardForm").attr("action",data.targetUrl);
				  $("#reChargeCardForm").submit();
			  }else {
			  	  alert(33);
				  showErrTip(obj.message);
					$("#goPay").removeAttr("disabled");
				  return ;
			  }
		  },
		  error: function(xhr, type){
			  showErrTip("加载异常，请检查网络");
		  }
		});
	}
}

function checkAmt(){
	var inputValue = $("#inputAmt").val();
	if(inputValue != null && inputValue != ""){
		//if(!isPositiveNum(inputValue)){
		if(!checkOtherAmt(inputValue)){
			//	alert("请输入大于100元且小于1000元的金额");
				showErrTip("请输入10-5000元的任意金额");
				return false;
			}else{
				submitValue = inputValue;
				showErrTip("");
				return true;
			}
	}else{
		changechooseAmt();
		if(chooseAmt !=null && chooseAmt != ""){
			submitValue = chooseAmt;
			showErrTip("");
			return true;
		}else{
			showErrTip("请输入10-5000元的任意金额，最低充值金额10元");
			return false;
		}
	}
}

/**
 * 是否为100到1000的整数
 * @param num
 * @returns
 */
function isPositiveNum(num) {
	var patten = /^[1-9]00$/;
	return patten.test(num)
}
/**
 * 当选项为“其他金额”时移除默认值100
 */
function changechooseAmt(){
	var display =$(".buycard2").css('display');
	if(display == 'block'){
		//其他金额——显示,移除默认值100
		chooseAmt = "";
	}
}


// 错误提示信息
function showErrTip(tip) {
	//$("#wrongDiv").show();
	$("#errortips").html(tip);
}



//校验其他金额
function checkOtherAmt(amt){
	var amtExp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;

	if(!amtExp.test(amt) || amt > 5000 || amt < 10) {
		showErrTip("请输入10-5000元的任意金额");
		return false;
	}
	showErrTip("");
	return true;
}

//限制用户只能输入两位小数，限制后调用校验其他金额方法
function replaceAmt(obj){
	$("#goPay").removeAttr("disabled");
	//只能输入两个小数
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
	checkOtherAmt($("#inputAmt").val());
}
