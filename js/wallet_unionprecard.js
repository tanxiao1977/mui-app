/**
 * 我的网络账户
 */
$(function() {
	
	var userId = localStorage.getItem("userId");
	var isRealName = localStorage.getItem("isRealName");
	//查询网络账户
	qryVircardAccount();
	//监听删除事件——弹出支付密码验证框
	$(".delthiscard").live("click",function(){
		//预付卡卡号
		var preCardId = $(this).attr("id");
		//预付卡类型：1-实名卡,0-非实名卡
		var identifyStatus_new =  $("#status"+preCardId).val();	
		
		$("#preCardId_new").val(preCardId);
		$("#identifyStatus_new").val(identifyStatus_new);
		
		//弹出提示框
		openDialog("2");
	})
	
	//监听充值事件——跳转到充值页面
	$(".addcas").live("click",function(){
		//预付卡卡号
		var preCardId = $(this).attr("id");
		//预付卡充值
		rechargeCard(preCardId);
	})

	//监听添加纵横卡事件——跳转到添加纵横卡页面
	$(".addcardimg2").click(function(){
		console.log("addcardimg");
		//添加纵横卡
		addPreCard();
	})	
	
	//监听交易记录按钮——跳转到交易记录页面
	$("#tradeButton").click(function(){
		//交易记录
		window.location.href='trades.html';
		//window.location.href='usolvmobile://wallet/webview?url=dHJhZGVzLmh0bWw~';		
	})
	
	function qryVircardAccount(){
		$.ajax({
			type : 'POST',
			url : 'https://walletcpstest2.hnapay.com/rest/vircard/qryVircardAccount',
			data : JSON.stringify({
				"walletUserId" : userId
			}),
			contentType : 'application/json',
			dataType : 'json',
			//timeout: 300,
			success : function(result) {
				//console.log('AResult: ' + JSON.stringify(result));
				var vircard = '';
				if (typeof (result.data) == "undefined"
						|| result.data == null || result.data == "") {
					//console.log("查询网络账户结果为空");
					return;
				} else {
					vircard = result.data;
					$("#vircardId").html(vircard.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 "));
					//加载预付卡列表
					loadPrepaidCardList();
				}
			},
			error : function(xhr, type) {
				showErrTip('加载异常，请检查网络');
				return;
			}
		});
	}

	function loadPrepaidCardList(){
		if(userId == null || "" == userId){
			showErrTip("请重新登录");
			//登录页面
			window.location.href = "login.html";			
			//window.location.href='usolvmobile://wallet/webview?url=bG9naW4uaHRtbA~~';
		}else{
			if(isRealName == "1") {
				$.ajax({
					type: 'POST',
					url: "https://walletcpstest2.hnapay.com/rest/precard/loadPrepaidCardList",
					data: JSON.stringify({ 
						userId : userId
					}),
					dataType: 'json',
					contentType : 'application/json',
					success: function(obj){
						if(obj.statusCode == "0000") {
							//console.log('PResult: '+JSON.stringify(obj));
							var htm = "";
							var walletParcard = obj.data;
							if(walletParcard.precardResponseList != null){
								if(walletParcard.precardResponseList.length != 0){
									//装载页面
									for(var i in walletParcard.precardResponseList) {
										var identifyStatus = walletParcard.precardResponseList[i].identifyStatus;
										var preCardId = walletParcard.precardResponseList[i].preCardId;
										if(identifyStatus == 1){
											htm +='<div class="cards-yes mt30">';
										} else {
											htm +='<div class="cards-no mt30">';
										}
										
										htm +=
										'<img src="../img/cardimg.png" class="cardimg"/>'
										+ '<input type="hidden" id="no'+preCardId+'" value="'+preCardId+'"/>'
										+ '<input type="hidden" id="status'+preCardId+'" value="'+identifyStatus+'"/>'
										+ '<p class="ftz36 cardtitle">纵横卡</p>'
										+ '<p class="ftz36 cardtitle">纵横卡</p>'
										+ '<p class="ftz40 cardnum">'
										+ walletParcard.precardResponseList[i].preCardId
										+'</p>'
										+ '<p class="ftz40 cardcas" id="jiage'+preCardId+'"></p>';
										if(identifyStatus == 1){
											htm += '<img src="../img/yesrealname.png" class="realname"/>'
												+ '<p class="carddel2">'
												+ '<p class="carderrtips" id="tips'+preCardId+'"></p>'
												+ '<p class="addcas" style="cursor:pointer" id="'+preCardId+'">充值</p>'
												+ '<p class="delthiscard"  style="cursor:pointer" id="'+preCardId+'">解绑</p>';
										} else {
											htm += '<img src="../img/norealname.png" class="realname"/>'
												+ '<p class="carddel">'
												+ '<p class="carderrtips" id="tips'+preCardId+'"></p>'
												+ '<p></p>'
												+ '<p class="delthiscard" style="cursor:pointer" id="'+preCardId+'">解绑</p>';
											//  onclick="show_unbind_confirm('+preCardId+','+identifyStatus+')"
										}
										htm += '</p>'
										htm += '</div>';
									}
									$("#showList").prepend(htm);
									$("#showList").show();
								//	$("#payPwd").val("");
									return ;
								}
							}else{
								$(".shopheader-bj").hide();
								$(".shopheader-wc").hide();
								//$("#empty").show();
							}
							
						}else {
							showErrTip(obj.message);
							return ;
						}
						
					},
					error: function(xhr, type){
						showErrTip("加载异常，请检查网络");
						return ;
					}
				});

				//查询卡片金额
				qryPrepaidCardAmt();
			} else {
			//	$("#loading").hide();
			//	$('#modaltrigger').leanModal({ top: 110, overlay: 0.45, closeButton: ".hidemodal" });
			//  $("#empty").show();
			}
		}
	}

	//查询卡片金额
	function qryPrepaidCardAmt() {
		
		$.ajax({
			type : 'POST',
			url : 'https://walletcpstest2.hnapay.com/rest/precard/qryPrepaidCardAmt',
			data : JSON.stringify({
				userId : userId
			}),
			contentType : 'application/json',
			dataType : 'json',		
			success : function(obj) {
				
				if(obj.statusCode == "0000") {
					
					//console.log('PResult2: '+JSON.stringify(obj));
					var walletParcard = obj.data;
					
					if(typeof(obj.data) == "undefined" || obj.data.sumBalance == null||obj.data.sumBalance == "")
					{
						$("#sumBalance").html("0.00");
					}
					$("#sumBalance").html(walletParcard.sumBalance);					
					
					
					if(walletParcard.precardResponseList != null){
						if(walletParcard.precardResponseList.length != 0){
							//装载页面
							for(var i in walletParcard.precardResponseList) {
								var preCardId = walletParcard.precardResponseList[i].preCardId;
								
								if(walletParcard.precardResponseList[i].onlineAvailable != null){
									//console.log('jiage'+preCardId+":"+walletParcard.precardResponseList[i].onlineAvailable);
									$("#jiage"+preCardId).html(walletParcard.precardResponseList[i].onlineAvailable);
								}else{
									//console.log('tips'+preCardId+":"+walletParcard.precardResponseList[i].remark1);
									$("#tips"+preCardId).html(walletParcard.precardResponseList[i].remark1);
								}
							}
						//	return ;
						}
					} else {
						//	$(".shopheader-bj").hide();
						//	$(".shopheader-wc").hide();
						//$("#empty").show();
						//return ;
					}
				} else {
					$("#loading").hide();
					showErrTip(obj.message);
				//	return ;
				}
				
				queryAnnualQuota();
			},
			error : function(xhr, type) {
				showErrTip('加载异常，请检查网络');
				return;
			}
		});
	}

	
	function queryAnnualQuota(){
		//console.log('queryAnnualQuota: ');
		$.ajax({
			type : 'POST',
			url : 'https://walletcpstest2.hnapay.com/rest/vircard/queryAnnualQuota',
			data : JSON.stringify({
				"walletUserId" : userId
			}),
			contentType : 'application/json',
			dataType : 'json',
			//timeout: 300,
			success : function(result) {
				//console.log('AResult: ' + JSON.stringify(result));
				var annualQuotaAmt = '';
				if (typeof (result.data) == "undefined"
						|| result.data == null || result.data == "") {
					//console.log("查询年度剩余额度为空");
					return;
				} else {
					annualQuotaAmt = result.data;
					$("#annualQuotaAmt").html(annualQuotaAmt);
				}
			},
			error : function(xhr, type) {
				showErrTip('加载异常，请检查网络');
				return;
			}
		});
	}
});