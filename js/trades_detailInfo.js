/**
 * 交易详情页面trades_detailInfo.html的方法
 */
$(function() {
	var thisURL = document.URL; //读取交易列表传过来的url路径   
	var getval = thisURL.split('?')[1]; //获取参数
	var showval = getval.split("=")[1]; //获取参数的值
	//根据订单号获取订单明细信息
	tradesDetail(showval);
});


/**
 * 根据订单号获取订单明细信息
 * @param showval 订单号
 */
function tradesDetail(showval){
	$.ajax({
		type : 'GET',
		url : "https://walletcpstest2.hnapay.com/rest/account/member/myTransDeatailInfo",
		data : {
			orderNo : showval
		},
		dataType : 'json',
		success : function(obj) {
			var orderDetailInfo= obj.data; //数据信息
			if (obj.statusCode == "0") {
				var listInfo = 
					'<p class="payalllist">'
					+ '<p class="fll payallz">订单号</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">商户名称</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">订单详情</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">订单生成日期</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">订单金额</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">交易状态</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">支付方式</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">交易卡号</p>'
					+ '<p class="flr payallz"> </p>'
					+ '</p>';

				$("#mesaage").append(obj.message);
				$("#orderInfo").append(listInfo);
			} else {
				
				var listInfo = 
					'<p class="payalllist">'
					+ '<p class="fll payallz">订单号</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.orderNo 
					+ '</p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">商户名称</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.channel
					+ '</p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">订单详情</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.product
					+ '</p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">订单生成日期</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.yearDays
					+ '</p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">订单金额</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.totalAmount
					+'元</p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">交易状态</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.txnStaCd 
					+ '</p>'
					+ '</p>';
					
				var listInfoEnd =
					'<p class="payalllist">'
					+ '<p class="fll payallz">支付方式</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.paymentName
					+ '</p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">交易卡号</p>'
					+ '<p class="flr payallz">'
					+ orderDetailInfo.cardNo
					+ '</p>'
					+ '</p>';
				
				var listInfoEnd2 =
					'<p class="payalllist">'
					+ '<p class="fll payallz">支付方式</p>'
					+ '<p class="flr payallz">'
					+ '</p>'
					+ '</p>'
					+ '<p class="payalllist">'
					+ '<p class="fll payallz">交易卡号</p>'
					+ '<p class="flr payallz">'
					+ '</p>'
					+ '</p>';	

				if(orderDetailInfo.paymentName==null||orderDetailInfo.paymentName==""){
					listInfo=listInfo+listInfoEnd2;
				}else{
					listInfo=listInfo+listInfoEnd;
				}

				$("#orderInfo").append(listInfo);
			}
		},
		error : function(xhr, type) {
			showErrTip("加载异常，请检查网络");
		}
	});
}