/**
 * 交易列表页面trades.html的方法
 */
$(function() {
	//加载首次记录
	initInfo();
});

/**
 * 加载交易记录
 * @returns {Boolean}
 */
function initInfo() {
	var temp = 1;
	var maxnum = 100; //设置一共要加载几次
	var userId = window.localStorage.getItem("userId");
	if (userId == null) {
		showErrTip("用户未登录");
		return false;
	}

	$.ajax({
		type : 'POST',
		url : "https://walletcpstest2.hnapay.com/rest/account/member/myTrans",
		data : {
			walletUserId : userId,
			pagenum : temp,
			pageCount : parseInt(15) * parseInt(temp)
		},
		dataType : 'json',
		success : function(obj) {
			var orderListInfo = obj.data;
			for (var i = 0; i < orderListInfo.length; i++) {
				
				var listInfo = '<a href="trades_detailInfo.html?orderNo='+orderListInfo[i].orderDetailUrl+'">'
				+ '<div class="payall-jl">'
				+ '<p class="jlmxz">'
				+ orderListInfo[i].product
				+ '</p>'
				+ '<p class="jlmxzdate">'
				+ orderListInfo[i].days
				+'</p>';

				//交易状态(0:进行中;1:成功;2:失败,3:异常)
				if(orderListInfo[i].txnStaCd == 1){
					listInfo += '<p class="jlje">￥<span>'
						+ toDecimal2(orderListInfo[i].totalAmount)
						+ '</span></p>'
						+ '<img src="../img/jycg.png" class="jyzt"/>'
						+ '</div>'
						+ '</a>';
				} else if(orderListInfo[i].txnStaCd == 2){
					listInfo += '<p class="jlje2">￥<span>'
						+ toDecimal2(orderListInfo[i].totalAmount)
						+ '</span></p>'
						+ '<img src="../img/jysb.png" class="jyzt"/>'
						+ '</div>'
						+ '</a>';
				} else if(orderListInfo[i].txnStaCd == 0){
					listInfo += '<p class="jlje2 paying">￥<span>'
						+ toDecimal2(orderListInfo[i].totalAmount)
						+ '</span></p>'
						+ '<img src="../img/paying.png" class="jyzt"/>'
						+ '</div>'
						+ '</a>';
				} else {
					listInfo += '<p class="jlje payfail">￥<span>'
						+ toDecimal2(orderListInfo[i].totalAmount)
						+ '</span></p>'
						+ '<img src="../img/payno.png" class="jyzt"/>'
						+ '</div>'
						+ '</a>';
				}
				
				$("#list_box").append(listInfo); 
				}
			},
			error : function(xhr, type) {
				showErrTip("加载异常，请检查网络");
			}
	});
  	
	$(window).scroll(function() {
		checkload();
	});

	function checkload() {
		var srollPos = $(window).scrollTop(); //滚动条距离顶部的高度
		var windowHeight = $(window).height(); //窗口的高度
		var dbHiht = $(".section").height();
		s = setTimeout(
				function() {
					if ((windowHeight + srollPos) >= (dbHiht)
							&& temp != maxnum) {
						temp++;
						LoadList();
					}
				}, 1000);
	}

	//下拉加载新内容
	function LoadList() {
		$.ajax({
			type : 'POST',
			url : "https://walletcpstest2.hnapay.com/rest/account/member/myTrans",
			data : {
				walletUserId : window.localStorage.getItem("userId"),
				pagenum : parseInt(15) * (parseInt(temp) - 1)+ 1,
				pageCount : parseInt(15) * parseInt(temp)
			},
			dataType : 'json',
			success : function(objNew) {
				var orderListInfoNew = objNew.data;
				for (var i = 0; i < orderListInfoNew.length; i++) {
					var listInfo = '<a href="trades_detailInfo.html?orderNo='+orderListInfoNew[i].orderDetailUrl+'">'
					+ '<div class="payall-jl">'
					+ '<p class="jlmxz">'
					+ orderListInfoNew[i].product
					+ '</p>'
					+ '<p class="jlmxzdate">'
					+ orderListInfoNew[i].days
					+'</p>';
					
					//交易状态(0:进行中;1:成功;2:失败,3:异常)
					if(orderListInfoNew[i].txnStaCd == 1){
						listInfo += '<p class="jlje">￥<span>'
							+ toDecimal2(orderListInfoNew[i].totalAmount)
							+ '</span></p>'
							+ '<img src="../img/jycg.png" class="jyzt"/>'
							+ '</div>'
							+ '</a>';
					} else if(orderListInfoNew[i].txnStaCd == 2){
						listInfo += '<p class="jlje2">￥<span>'
							+ toDecimal2(orderListInfoNew[i].totalAmount)
							+ '</span></p>'
							+ '<img src="../img/jysb.png" class="jyzt"/>'
							+ '</div>'
							+ '</a>';
					} else if(orderListInfoNew[i].txnStaCd == 0){
						listInfo += '<p class="jlje2 paying">￥<span>'
							+ toDecimal2(orderListInfoNew[i].totalAmount)
							+ '</span></p>'
							+ '<img src="../img/paying.png" class="jyzt"/>'
							+ '</div>'
							+ '</a>';
					} else {
						listInfo += '<p class="jlje payfail">￥<span>'
							+ toDecimal2(orderListInfoNew[i].totalAmount)
							+ '</span></p>'
							+ '<img src="../img/payno.png" class="jyzt"/>'
							+ '</div>'
							+ '</a>';
					}
					
					$("#list_box").append(listInfo); 
				}
			},
			error : function(xhr, type) {
				showErrTip("加载异常，请检查网络");
			}
		});
	}
	
	 //强制显示成2位小数  
    function toDecimal2(x) {
        var f = parseFloat(x);    
        if (isNaN(f)) {    
            return false;    
        }    
        var f = Math.round(x*100)/100;    
        var s = f.toString();    
        var rs = s.indexOf('.');    
        if (rs < 0) {    
            rs = s.length;    
            s += '.';    
        }    
        while (s.length <= rs + 2) {    
            s += '0';    
        }    
        return s;    
    }    
}