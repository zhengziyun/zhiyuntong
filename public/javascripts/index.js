var bool1 = false, bool2 = false, bool3 = false;
var index = 0;
var unamestr = location.href.split("=")[1];
$("#uname").text(unamestr);
var pageName = 0;
var totalNum = 0;
var totalPage = 0;
var oPersonCum = document.getElementById('personCum');
oPersonCum.checked = true;
var oPublicCum = document.getElementById('publicCum');
countPage();
var oSearchCls = document.getElementById('searchCls');
function countPage(){
	$.ajax({
		type: "get",
		url: "http://localhost:8005/custom/getTotalLists",
		success: function(e){
			if(e){
				totalNum = e[0]['count(*)'];
				totalPage = Math.ceil(totalNum/10);
				if(e[0]['count(*)'] != 0){
					$(".comLists_lists").html('<table border="1" cellspacing="2" cellpadding="2"><thead><tr><th>操作</th><th>姓名</th><th>年龄</th><th>性别</th><th>电话</th><th>公司</th><th>职位</th><th>客户阶段</th><th>兴趣爱好</th><th>空闲时间</th><th>住址</th><th>邮箱</th><th>QQ</th></tr></thead><tbody id="tobody"></tbody></table>');
					$(".zongtiaoshu").show();
					$(".yeshu").show();
					$("#prevPage").show();
					$("#nextPage").show();
					updateTable(pageName);
					$("#totalLists").text(totalNum);
					$("#totalPage").text((pageName+1)+"/"+totalPage);
				}else{
					$(".zongtiaoshu").hide();
					$(".yeshu").hide();
					$("#prevPage").hide();
					$("#nextPage").hide();
					$(".comLists_lists").empty();
					$(".comLists_lists").append('<div class="noRecords"><img src="images/hh.png" class="margin_top"><p class="font_size1">您还没有添加客户！</p></div>');
				}
			}else{
				$("#add_result").show();
				$("#msg_result").text("您还未登陆，请先登录！");
				$("#add_result").css('background','#000');
				$("#sureBtn").click(function(){
					location.href = "login.html";
				})
			}
		},
		error: function(){
			alert("error!");
		}
	});
}

$("#prevPage").click(function(){
	pageName --;
	if(bool3 == true){
		if(oPersonCum.checked == true){
			if(pageName >= 0){
				updateTable3(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName ++;
			}
		}else{
			if(pageName >= 0){
				updateTable4(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName ++;
			}
		}
	}else{
		if(oPersonCum.checked == true){
			if(pageName >= 0){
				updateTable(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName ++;
			}
		}else{
			if(pageName >= 0){
				updateTable2(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName ++;
			}
		}
	}
});

$("#nextPage").click(function(){
	pageName ++;
	if(bool3 == true){
		if(oPersonCum.checked == true){
			if(pageName <= totalPage - 1){
				updateTable3(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName --;
			}
		}else{
			if(pageName <= totalPage - 1){
				updateTable4(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName --;
			}
		}
	}else{
		if(oPersonCum.checked == true){
			if(pageName <= totalPage - 1){
				updateTable(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName --;
			}
		}else{
			if(pageName <= totalPage - 1){
				updateTable2(pageName);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				pageName --;
			}
		}
	}
});

function updateTable(page){
	$.ajax({
		type: "get",
		url: "http://localhost:8005/custom/getLists?pageName=" + page,
		success: function(e){
			var html = "";
			for(var i=0; i<e.length; i++){
				if(e[i].importance == 1){
					e[i].importance = "成交客户";
				}else if(e[i].importance == 2){
					e[i].importance = "商机客户";
				}else if(e[i].importance == 3){
					e[i].importance = "储蓄客户";
				}
				html += '<tr><td><img src="images/cao1.jpg" class="xiugai" index2='+i+' cid="'+e[i].cusId+'" title="客户视图"><img src="images/cao2.jpg" cid="'+e[i].cusId+'" cusName="'+e[i].name+'" title="添加联系记录" class="chakan"><img src="images/cao3.jpg" title="放入公海" cid="'+e[i].cusId+'" class="zhuanru"></td><td>'+e[i].name+'</td><td>'+e[i].com2+'</td><td>'+e[i].sex+'</td><td>'+e[i].tel+'</td><td>'+e[i].company+'</td><td>'+e[i].job+'</td><td>'+e[i].importance+'</td><td>'+e[i].habits+'</td><td>'+e[i].freetime+'</td><td>'+e[i].address+'</td><td>'+e[i].email+'</td><td>'+e[i].qq+'</td></tr>';
			}
			$("#tobody").html(html);
			$(".chakan").off("click");
			$(".chakan").click(function(){
				index = $(this).attr("cid");
				$("#addConcat").show();
				$("#username2").val($(this).attr("cusName"));
				$("#cusBianhao").text($(this).attr("cid"));

				// 查看通话记录
				$("#telRecords").empty();
				$.ajax({
					type: 'get',
					url: 'http://localhost:8005/telrecord/getRecordLists?cusId=' + index,
					success: function(e){
						var htmlStr = '<div class="details_title">通话记录</div>';
						if(e.length == 0){
							htmlStr += '<div class="noRecords"><img src="images/hh.png"><p>您还没有添加通话记录！</p></div>';
						}else{
							
							for(var i=0; i<e.length; i++){
								htmlStr += '<ul class="ul_style"><li><span>记录序号</span><span>'+ (i+1) +'</span></li><li><span>客户姓名</span><span>'+e[i].name+'</span></li><li><span>本次通话</span><span>'+e[i].time+'</span></li><li><span>下次通话</span><span>'+e[i].nexttime+'</span></li><li><span class="pd_right">通话内容</span><span class="pd_left">'+e[i].message+'</span></li></ul>';
							}
						}
						$("#telRecords").html(htmlStr);
					},
					error: function(){
						alert("error!");
					}
				})
			})
			$(".xiugai").off("click");
			$(".xiugai").click(function(){
				var cid = $(this).attr('cid');
				var index2 = $(this).attr('index2');
				$(".updateBtn").attr("upId", cid);
				$("#updateCustom").show();
				$.ajax({
					type: "get",
					url: "http://localhost:8005/custom/details?cusId=" + cid,
					success: function(e){
						$("#kh_age").val(e[0].com2);
						$("#kh_name").val(e[0].name);
						$("#kh_sex").val(e[0].sex);
						$("#kh_tel").val(e[0].tel);
						$("#kh_company").val(e[0].company);
						$("#kh_job").val(e[0].job);
						$("#kh_bianhao").val(e[0].cusId);
						$("#kh_important").val(e[0].importance);
						$("#kh_habits").val(e[0].habits);
						$("#kh_freetime").val(e[0].freetime);
						$("#kh_email").val(e[0].email);
						$("#kh_qq").val(e[0].qq);
						$("#kh_jointime").val(e[0].jointime);
						$("#kh_address").val(e[0].address);
						$("#updateBtn2").attr("cid", e[0].cusId);
						$("#updateBtn2").attr("index2", index2);
					},
					error: function(){
						alert("error!");
					}
				})
			})
			$("#updateBtn2").off("click");
			$("#updateBtn2").click(function(){
				var upId = $(this).attr("upId");
				var index2 = $(this).attr("index2");
				$.ajax({
					type: "post",
					url: "http://localhost:8005/custom/update",
					data: {
						name: $("#kh_name").val(),
						old: $("#kh_age").val(),
						sex: $("#kh_sex").val(),
						tel: $("#kh_tel").val(),
						company: $("#kh_company").val(),
						job: $("#kh_job").val(),
						important: $("#kh_important").val(),
						habits: $("#kh_habits").val(),
						freetime: $("#kh_freetime").val(),
						addr: $("#kh_address").val(),
						email: $("#kh_email").val(),
						qq: $("#kh_qq").val(),
						cId: upId
					},
					success: function(e){
						if(e.affectedRows){
							if(e.changedRows > 0){
								$("#add_result").show();
								$("#msg_result").text('客户信息修改成功！');
								$("#tobody tr:eq("+index2+") td:eq(1)").text($("#kh_name").val());
								$("#tobody tr:eq("+index2+") td:eq(2)").text($("#kh_age").val());
								$("#tobody tr:eq("+index2+") td:eq(3)").text($("#kh_sex").val());
								$("#tobody tr:eq("+index2+") td:eq(4)").text($("#kh_tel").val());
								$("#tobody tr:eq("+index2+") td:eq(5)").text($("#kh_company").val());
								$("#tobody tr:eq("+index2+") td:eq(6)").text($("#kh_job").val());
								if($("#kh_important").val() == "1"){
									$("#tobody tr:eq("+index2+") td:eq(7)").text("成交客户");
								}else if($("#kh_important").val() == "2"){
									$("#tobody tr:eq("+index2+") td:eq(7)").text("商机客户");
								}else if($("#kh_important").val() == "3"){
									$("#tobody tr:eq("+index2+") td:eq(7)").text("储蓄客户");
								}
								$("#tobody tr:eq("+index2+") td:eq(8)").text($("#kh_habits").val());
								$("#tobody tr:eq("+index2+") td:eq(9)").text($("#kh_freetime").val());
								$("#tobody tr:eq("+index2+") td:eq(10)").text($("#kh_address").val());
								$("#tobody tr:eq("+index2+") td:eq(11)").text($("#kh_email").val());
								$("#tobody tr:eq("+index2+") td:eq(12)").text($("#kh_qq").val());
							}else if(e.changedRows == 0){
								$("#add_result").show();
								$("#msg_result").text('您没有修改客户信息！');
							}
						}else{
							$("#add_result").show();
							$("#msg_result").text('客户信息修改失败！');
						}
					},
					error: function(){
						alert("error!");
					}
				})
			});
			// 放入公海
			$(".zhuanru").off("click");
			$(".zhuanru").click(function(){
				var cId2 = $(this).attr('cid');
				var _this = $(this);
				$.ajax({
					type: "get",
					url: "http://localhost:8005/custom/changepublic?cId2=" + cId2,
					success: function(e){
						if(e.changedRows > 0){
							$("#add_result").show();
							$("#msg_result").text('转入公海成功！');
							$(_this).parent().parent().remove();
							if($("#tobody>tr").length == 0){
								if(pageName > 0){
									pageName --;
								}else{
									pageName = 0;
								}
							}
							countPage();
						}else{
							$("#add_result").show();
							$("#msg_result").text('转入公海失败！');
						}
					},
					error: function(){
						alert("error!");
					}
				})
			});
		},
		error: function(){
			alert("error!");
		}
	});
}

$("#username2").blur(function(){
	if($(this).val()){
		$(this).attr("placeholder", "");
	}else{
		$(this).attr("placeholder", "该项不能为空！");
	}
});
$("#benci").blur(function(){
	if($(this).val()){
		$(this).attr("placeholder", "");
	}else{
		$(this).attr("placeholder", "该项不能为空！");
	}
});
$("#xiaci").blur(function(){
	if($(this).val()){
		$(this).attr("placeholder", "");
	}else{
		$(this).attr("placeholder", "该项不能为空！");
	}
});
$("#content").blur(function(){
	if($(this).val()){
		$(this).attr("placeholder", "");
	}else{
		$(this).attr("placeholder", "该项不能为空！");
	}
});

$("#sureBtn").click(function(){
	$("#add_result").hide();
});

$(".close").click(function(){
	$(".black_bg").hide();
});

$("#name").blur(function(){
	judgeBool();
	if($(this).val()){
		$.ajax({
			type: "post",
			url: "http://localhost:8005/custom/configCustom",
			data: {"username": $("#name").val()},
			success: function(e){
				if(e.flag == 1){
					bool2 = false;
					$("#isName").text("用户名已存在！");
				}else if(e.flag == 2){
					bool2 = true;
					$("#isName").text("");
				}
			},
			error: function(){
				alert("error!");
			}
		});
		$("#isName").text("");
	}else{
		$("#isName").text("姓名不能为空！");
	}
});
$("#old").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isOld").text("");
	}else{
		$("#isOld").text("年龄不能为空！");
	}
});
$("#sex").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isSex").text("");
	}else{
		$("#isSex").text("性别不能为空！");
	}
});
$("#tel").blur(function(){
	judgeBool();
	if($(this).val()){
		if($("#tel").val().match(/^1[34587](\d{9})$/)){
			$("#isTel").text("");
		}else{
			$("#isTel").text("手机号码格式错误！");
		}
	}else{
		$("#isTel").text("电话不能为空！");
	}
});
$("#company").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isCpy").text("");
	}else{
		$("#isCpy").text("公司不能为空！");
	}
});
$("#job").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isJob").text("");
	}else{
		$("#isJob").text("职位不能为空！");
	}
});
$("#habit").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isHabit").text("");
	}else{
		$("#isHabit").text("兴趣爱好不能为空！");
	}
});
$("#freetime").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isFree").text("");
	}else{
		$("#isFree").text("空闲时间不能为空！");
	}
});
$("#address").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isAddr").text("");
	}else{
		$("#isAddr").text("地址不能为空！");
	}
});
$("#email").blur(function(){
	judgeBool();
	if($(this).val()){
		if($("#email").val().match(/(\w+)@(\w+)(\.com)/)){
			$("#isEmail").text("");
		}else{
			$("#isEmail").text("邮箱格式错误！");
		}
	}else{
		$("#isEmail").text("邮箱不能为空！");
	}
});
$("#qq").blur(function(){
	judgeBool();
	if($(this).val()){
		$("#isQQ").text("");
	}else{
		$("#isQQ").text("QQ不能为空！");
	}
});
function judgeBool(){
	if($("#name").val() && $("#old").val() && $("#sex").val() && $("#tel").val() && $("#company").val() && $("#job").val() && $("#habit").val() && $("#freetime").val() && $("#address").val() && $("#email").val() && $("#qq").val() && $("#tel").val().match(/^1[34587](\d{9})$/) && $("#email").val().match(/(\w+)@(\w+)(\.com)/) && bool2){
		bool1 = true;
	}else{
		bool1 = false;
	}
}

$("#addBtn").click(function(){
	if(bool1 == true){
		$.ajax({
			type: "post",
			url: "http://localhost:8005/custom/add",
			data: {
				name: $("#name").val(),
				old: $("#old").val(),
				sex: $("#sex").val(),
				tel: $("#tel").val(),
				company: $("#company").val(),
				job: $("#job").val(),
				habit: $("#habit").val(),
				freetime: $("#freetime").val(),
				address: $("#address").val(),
				email: $("#email").val(),
				qq: $("#qq").val(),
				important: $("#import").val()
			},
			success: function(e){
				if(e.flag == 1){
					$("#add_result").show();
					$("#result_img").attr("src", "images/success.jpg");
					$("#msg_result").text("客户添加成功！");
					$(".add input").val("");
					$("#tobody").empty();
					if(oPublicCum.checked == true){
						pageName = 0;
					}	
					countPage();
				}else if(e.flag == 2){
					$("#add_result").show();
					$("#result_img").attr("src", "images/default.jpg");
					$("#msg_result").text("客户添加失败！");
				}
			},	
			error: function(){
				alert("error!");
			}
		})
	}else{
		$("#name").blur();
		$("#sex").blur();
		$("#tel").blur();
		$("#old").blur();
		$("#company").blur();
		$("#job").blur();
		$("#habit").blur();
		$("#freetime").blur();
		$("#address").blur();
		$("#email").blur();
		$("#qq").blur();
	}
});

// 添加通话记录
$("#addRecord").click(function(){
	if($("#username2").val() && $("#benci").val() && $("#xiaci").val() && $("#content").val()){
		$.ajax({
			type: "post", 
			url: "http://localhost:8005/telrecord/addTelRecordLists",
			data: {
				cid: index,
				name: $("#username2").val(),
				time: $("#benci").val(),
				nexttime: $("#xiaci").val(),
				msg: $("#content").val()
			},
			success: function(e){
				if(e.flag == 1){
					$("#add_result").show();
					$("#msg_result").text("通话记录添加成功！");
					var length = $(".ul_style").length + 1;
					if(length == 1){
						$(".noRecords").remove();
					}
					$("#telRecords").append('<ul class="ul_style"><li><span>记录序号</span><span>'+length+'</span></li><li><span>客户姓名</span><span>'+$("#username2").val()+'</span></li><li><span>本次通话</span><span>'+$("#benci").val()+'</span></li><li><span>下次通话</span><span>'+$("#xiaci").val()+'</span></li><li><span class="pd_right">通话内容</span><span class="pd_left">'+$("#content").val()+'</span></li></ul>');
					$("#benci").val("");
					$("#xiaci").val("");
					$("#content").val("");

				}else{
					$("#add_result").show();
					$("#msg_result").text("通话记录添加失败！");
					$("#benci").val("");
					$("#xiaci").val("");
					$("#content").val("");
				}
			},
			error: function(){
				alert('error!');
			}
		})
	}else{
		$("#username2").blur();
		$("#benci").blur();
		$("#xiaci").blur();
		$("#content").blur();
	}
});

$("#personCum").change(function(){
	bool3 = false;
	if(this.checked == true){
		pageName = 0;
		totalNum = 0;
		totalPage = 0;
		countPage();
	}
});

function countPage2(){
	$.ajax({
		type: "get",
		url: "http://localhost:8005/custom/getPubTotalLists",
		success: function(e){
			totalNum = e[0]['count(*)'];
			totalPage = Math.ceil(totalNum/10);
			if(e[0]['count(*)'] != 0){
				$(".comLists_lists").html('<table border="1" cellspacing="2" cellpadding="2"><thead><tr><th>操作</th><th>姓名</th><th>年龄</th><th>性别</th><th>电话</th><th>公司</th><th>职位</th><th>客户阶段</th><th>兴趣爱好</th><th>空闲时间</th><th>住址</th><th>邮箱</th><th>QQ</th></tr></thead><tbody id="tobody"></tbody></table>');
				$(".zongtiaoshu").show();
				$(".yeshu").show();
				$("#prevPage").show();
				$("#nextPage").show();
				updateTable2(pageName);
				$("#totalLists").text(totalNum);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				$(".zongtiaoshu").hide();
				$(".yeshu").hide();
				$("#prevPage").hide();
				$("#nextPage").hide();
				$(".comLists_lists").html('<div class="noRecords"><img src="images/hh.png" class="margin_top"><p class="font_size1">不好意思，暂时没有公海客户！</p></div>');
			}
		},
		error: function(){
			alert("error!");
		}
	});
}

function updateTable2(page){
	$.ajax({
		type: "get",
		url: "http://localhost:8005/custom/public?pageName=" + page,
		success: function(e){
			if(e.length == 0){
				$(".comLists_lists").html('<div class="noRecords"><img src="images/hh.png" class="margin_top"><p class="font_size1">不好意思，暂时没有公海客户！</p></div>');
			}else{
				$(".comLists_lists").html('<table border="1" cellspacing="2" cellpadding="2"><thead><tr><th>操作</th><th>姓名</th><th>年龄</th><th>性别</th><th>电话</th><th>公司</th><th>职位</th><th>客户阶段</th><th>兴趣爱好</th><th>空闲时间</th><th>住址</th><th>邮箱</th><th>QQ</th></tr></thead><tbody id="tobody"></tbody></table>');
				var html = "";
				for(var i=0; i<e.length; i++){
					if(e[i].importance == 1){
						e[i].importance = "成交客户";
					}else if(e[i].importance == 2){
						e[i].importance = "商机客户";
					}else if(e[i].importance == 3){
						e[i].importance = "储蓄客户";
					}
					html += '<tr><td><img src="images/cao1.jpg" class="xiugai" index2='+i+' cid="'+e[i].cusId+'" title="客户视图"><img src="images/cao2.jpg" cid="'+e[i].cusId+'" cusName="'+e[i].name+'" title="添加联系记录" class="chakan"><img src="images/cao3.jpg" title="收起该客户" cid="'+e[i].cusId+'" class="zhuanru"></td><td>'+e[i].name+'</td><td>'+e[i].com2+'</td><td>'+e[i].sex+'</td><td>'+e[i].tel+'</td><td>'+e[i].company+'</td><td>'+e[i].job+'</td><td>'+e[i].importance+'</td><td>'+e[i].habits+'</td><td>'+e[i].freetime+'</td><td>'+e[i].address+'</td><td>'+e[i].email+'</td><td>'+e[i].qq+'</td></tr>';
				}
				$("#tobody").html(html);
				$(".xiugai").off("click");
				$(".xiugai").click(function(){
					$("#add_result").show();
					$("#msg_result").text("请先将该客户转为自己的客户！");
				});
				$(".chakan").off("click");
				$(".chakan").click(function(){
					$("#add_result").show();
					$("#msg_result").text("请先将该客户转为自己的客户！");
				});
				$(".zhuanru").off("click");
				$(".zhuanru").click(function(){
					var cId3 = $(this).attr('cid');
					var _this = $(this);
					$.ajax({
						type: "get",
						url: "http://localhost:8005/custom/changeperson?cId3=" + cId3,
						success: function(e){
							if(e.changedRows > 0){
								$("#add_result").show();
								$("#msg_result").text('转入个人客户成功！');
								$(_this).parent().parent().remove();
								if($("#tobody>tr").length == 0){
									if(pageName > 0){
										pageName --;
									}else{
										pageName = 0;
									}
								}
								countPage2();
							}else{
								$("#add_result").show();
								$("#msg_result").text('转入个人客户失败！');
							}
						},
						error: function(){
							alert("error!");
						}
					})
				});
			}
		},
		error: function(){
			alert("error!");
		}
	});
}

function countPage3(){
	var index3 = 0;
	if(oPersonCum.checked == true){
		index3 = 0;
	}else{
		index3 = 1;
	}
	$.ajax({
		type: "post",
		url: "http://localhost:8005/custom/searchNum",
		data: {
			classify: oSearchCls.value,
			index3: index3,
			text: $("#searchIpt").val()
		},
		success: function(e){
			totalNum = e[0]['count(*)'];
			totalPage = Math.ceil(totalNum/10);
			if(e[0]['count(*)'] != 0){
				$(".comLists_lists").html('<table border="1" cellspacing="2" cellpadding="2"><thead><tr><th>操作</th><th>姓名</th><th>年龄</th><th>性别</th><th>电话</th><th>公司</th><th>职位</th><th>客户阶段</th><th>兴趣爱好</th><th>空闲时间</th><th>住址</th><th>邮箱</th><th>QQ</th></tr></thead><tbody id="tobody"></tbody></table>');
				$(".zongtiaoshu").show();
				$(".yeshu").show();
				$("#prevPage").show();
				$("#nextPage").show();
				if(oPersonCum.checked == true){
					updateTable3(pageName);
				}else{
					updateTable4(pageName);
				}
				$("#totalLists").text(totalNum);
				$("#totalPage").text((pageName+1)+"/"+totalPage);
			}else{
				$(".zongtiaoshu").hide();
				$(".yeshu").hide();
				$("#prevPage").hide();
				$("#nextPage").hide();
				$(".comLists_lists").html('<div class="noRecords"><img src="images/hh.png" class="margin_top"><p class="font_size1">不好意思，没有您搜索的客户！</p></div>');
			}
		},
		error: function(){
			alert("error!");
		}
	});
}

function updateTable3(page){
	var index3 = 0;
	if(oPersonCum.checked == true){
		index3 = 0;
	}else{
		index3 = 1;
	}
	$.ajax({
		type: "post",
		url: "http://localhost:8005/custom/getSearchLists",
		data: {
			pageName: page,
			classify: oSearchCls.value,
			index3: index3,
			text: $("#searchIpt").val()
		},
		success: function(e){
			var html = "";
			for(var i=0; i<e.length; i++){
				if(e[i].importance == 1){
					e[i].importance = "成交客户";
				}else if(e[i].importance == 2){
					e[i].importance = "商机客户";
				}else if(e[i].importance == 3){
					e[i].importance = "储蓄客户";
				}
				html += '<tr><td><img src="images/cao1.jpg" class="xiugai" index2='+i+' cid="'+e[i].cusId+'" title="客户视图"><img src="images/cao2.jpg" cid="'+e[i].cusId+'" cusName="'+e[i].name+'" title="添加联系记录" class="chakan"><img src="images/cao3.jpg" title="放入公海" cid="'+e[i].cusId+'" class="zhuanru"></td><td>'+e[i].name+'</td><td>'+e[i].com2+'</td><td>'+e[i].sex+'</td><td>'+e[i].tel+'</td><td>'+e[i].company+'</td><td>'+e[i].job+'</td><td>'+e[i].importance+'</td><td>'+e[i].habits+'</td><td>'+e[i].freetime+'</td><td>'+e[i].address+'</td><td>'+e[i].email+'</td><td>'+e[i].qq+'</td></tr>';
			}
			$("#tobody").html(html);
			$(".chakan").off("click");
			$(".chakan").click(function(){
				index = $(this).attr("cid");
				$("#addConcat").show();
				$("#username2").val($(this).attr("cusName"));
				$("#cusBianhao").text($(this).attr("cid"));
				// 查看通话记录
				$("#telRecords").empty();
				$.ajax({
					type: 'get',
					url: 'http://localhost:8005/telrecord/getRecordLists?cusId=' + index,
					success: function(e){
						var htmlStr = '<div class="details_title">通话记录</div>';
						if(e.length == 0){
							htmlStr += '<div class="noRecords"><img src="images/hh.png"><p>您还没有添加通话记录！</p></div>';
						}else{
							for(var i=0; i<e.length; i++){
								htmlStr += '<ul class="ul_style"><li><span>记录序号</span><span>'+ (i+1) +'</span></li><li><span>客户姓名</span><span>'+e[i].name+'</span></li><li><span>本次通话</span><span>'+e[i].time+'</span></li><li><span>下次通话</span><span>'+e[i].nexttime+'</span></li><li><span class="pd_right">通话内容</span><span class="pd_left">'+e[i].message+'</span></li></ul>';
							}
						}
						$("#telRecords").html(htmlStr);
					},
					error: function(){
						alert("error!");
					}
				})
			})
			$(".xiugai").off("click");
			$(".xiugai").click(function(){
				var cid = $(this).attr('cid');
				var index2 = $(this).attr('index2');
				$(".updateBtn").attr("upId", cid);
				$("#updateCustom").show();
				$.ajax({
					type: "get",
					url: "http://localhost:8005/custom/details?cusId=" + cid,
					success: function(e){
						$("#kh_age").val(e[0].com2);
						$("#kh_name").val(e[0].name);
						$("#kh_sex").val(e[0].sex);
						$("#kh_tel").val(e[0].tel);
						$("#kh_company").val(e[0].company);
						$("#kh_job").val(e[0].job);
						$("#kh_bianhao").val(e[0].cusId);
						$("#kh_important").val(e[0].importance);
						$("#kh_habits").val(e[0].habits);
						$("#kh_freetime").val(e[0].freetime);
						$("#kh_email").val(e[0].email);
						$("#kh_qq").val(e[0].qq);
						$("#kh_jointime").val(e[0].jointime);
						$("#kh_address").val(e[0].address);
						$("#updateBtn2").attr("cid", e[0].cusId);
						$("#updateBtn2").attr("index2", index2);
					},
					error: function(){
						alert("error!");
					}
				})
			})
			$("#updateBtn2").off("click");
			$("#updateBtn2").click(function(){
				var upId = $(this).attr("upId");
				var index2 = $(this).attr("index2");
				$.ajax({
					type: "post",
					url: "http://localhost:8005/custom/update",
					data: {
						name: $("#kh_name").val(),
						old: $("#kh_age").val(),
						sex: $("#kh_sex").val(),
						tel: $("#kh_tel").val(),
						company: $("#kh_company").val(),
						job: $("#kh_job").val(),
						important: $("#kh_important").val(),
						habits: $("#kh_habits").val(),
						freetime: $("#kh_freetime").val(),
						addr: $("#kh_address").val(),
						email: $("#kh_email").val(),
						qq: $("#kh_qq").val(),
						cId: upId
					},
					success: function(e){
						if(e.affectedRows){
							if(e.changedRows > 0){
								$("#add_result").show();
								$("#msg_result").text('客户信息修改成功！');
								$("#tobody tr:eq("+index2+") td:eq(1)").text($("#kh_name").val());
								$("#tobody tr:eq("+index2+") td:eq(2)").text($("#kh_age").val());
								$("#tobody tr:eq("+index2+") td:eq(3)").text($("#kh_sex").val());
								$("#tobody tr:eq("+index2+") td:eq(4)").text($("#kh_tel").val());
								$("#tobody tr:eq("+index2+") td:eq(5)").text($("#kh_company").val());
								$("#tobody tr:eq("+index2+") td:eq(6)").text($("#kh_job").val());
								if($("#kh_important").val() == "1"){
									$("#tobody tr:eq("+index2+") td:eq(7)").text("成交客户");
								}else if($("#kh_important").val() == "2"){
									$("#tobody tr:eq("+index2+") td:eq(7)").text("商机客户");
								}else if($("#kh_important").val() == "3"){
									$("#tobody tr:eq("+index2+") td:eq(7)").text("储蓄客户");
								}
								$("#tobody tr:eq("+index2+") td:eq(8)").text($("#kh_habits").val());
								$("#tobody tr:eq("+index2+") td:eq(9)").text($("#kh_freetime").val());
								$("#tobody tr:eq("+index2+") td:eq(10)").text($("#kh_address").val());
								$("#tobody tr:eq("+index2+") td:eq(11)").text($("#kh_email").val());
								$("#tobody tr:eq("+index2+") td:eq(12)").text($("#kh_qq").val());
							}else if(e.changedRows == 0){
								$("#add_result").show();
								$("#msg_result").text('您没有修改客户信息！');
							}
						}else{
							$("#add_result").show();
							$("#msg_result").text('客户信息修改失败！');
						}
					},
					error: function(){
						alert("error!");
					}
				})
			});
			// 放入公海
			$(".zhuanru").off("click");
			$(".zhuanru").click(function(){
				var cId2 = $(this).attr('cid');
				var _this = $(this);
				$.ajax({
					type: "get",
					url: "http://localhost:8005/custom/changepublic?cId2=" + cId2,
					success: function(e){
						if(e.changedRows > 0){
							$("#add_result").show();
							$("#msg_result").text('转入公海成功！');
							$(_this).parent().parent().remove();
							if($("#tobody>tr").length == 0){
								if(pageName > 0){
									pageName --;
								}else{
									pageName = 0;
								}
							}
							countPage3();
						}else{
							$("#add_result").show();
							$("#msg_result").text('转入公海失败！');
						}
					},
					error: function(){
						alert("error!");
					}
				})
			});
		},
		error: function(){
			alert("error!");
		}
	});
}

function updateTable4(page){
	var index3 = 0;
	if(oPersonCum.checked == true){
		index3 = 0;
	}else{
		index3 = 1;
	}
	$.ajax({
		type: "post",
		url: "http://localhost:8005/custom/getSearchLists",
		data: {
			pageName: page,
			classify: oSearchCls.value,
			index3: index3,
			text: $("#searchIpt").val()
		},
		success: function(e){
			if(e.length == 0){
				$(".comLists_lists").html('<div class="noRecords"><img src="images/hh.png" class="margin_top"><p class="font_size1">不好意思，暂时没有公海客户！</p></div>');
			}else{
				$(".comLists_lists").html('<table border="1" cellspacing="2" cellpadding="2"><thead><tr><th>操作</th><th>姓名</th><th>年龄</th><th>性别</th><th>电话</th><th>公司</th><th>职位</th><th>客户阶段</th><th>兴趣爱好</th><th>空闲时间</th><th>住址</th><th>邮箱</th><th>QQ</th></tr></thead><tbody id="tobody"></tbody></table>');
				var html = "";
				for(var i=0; i<e.length; i++){
					if(e[i].importance == 1){
						e[i].importance = "成交客户";
					}else if(e[i].importance == 2){
						e[i].importance = "商机客户";
					}else if(e[i].importance == 3){
						e[i].importance = "储蓄客户";
					}
					html += '<tr><td><img src="images/cao1.jpg" class="xiugai" index2='+i+' cid="'+e[i].cusId+'" title="客户视图"><img src="images/cao2.jpg" cid="'+e[i].cusId+'" cusName="'+e[i].name+'" title="添加联系记录" class="chakan"><img src="images/cao3.jpg" title="收起该客户" cid="'+e[i].cusId+'" class="zhuanru"></td><td>'+e[i].name+'</td><td>'+e[i].com2+'</td><td>'+e[i].sex+'</td><td>'+e[i].tel+'</td><td>'+e[i].company+'</td><td>'+e[i].job+'</td><td>'+e[i].importance+'</td><td>'+e[i].habits+'</td><td>'+e[i].freetime+'</td><td>'+e[i].address+'</td><td>'+e[i].email+'</td><td>'+e[i].qq+'</td></tr>';
				}
				$("#tobody").html(html);
				$(".xiugai").off("click");
				$(".xiugai").click(function(){
					$("#add_result").show();
					$("#msg_result").text("请先将该客户转为自己的客户！");
				});
				$(".chakan").off("click");
				$(".chakan").click(function(){
					$("#add_result").show();
					$("#msg_result").text("请先将该客户转为自己的客户！");
				});
				$(".zhuanru").off("click");
				$(".zhuanru").click(function(){
					var cId3 = $(this).attr('cid');
					var _this = $(this);
					$.ajax({
						type: "get",
						url: "http://localhost:8005/custom/changeperson?cId3=" + cId3,
						success: function(e){
							if(e.changedRows > 0){
								$("#add_result").show();
								$("#msg_result").text('转入个人客户成功！');
								$(_this).parent().parent().remove();
								if($("#tobody>tr").length == 0){
								if(pageName > 0){
									pageName --;
								}else{
									pageName = 0;
								}
							}
								countPage3();
							}else{
								$("#add_result").show();
								$("#msg_result").text('转入个人客户失败！');
							}
						},
						error: function(){
							alert("error!");
						}
					})
				});
			}
		},
		error: function(){
			alert("error!");
		}
	});
}

$("#publicCum").change(function(){
	bool3 = false;
	if(this.checked == true){
		pageName = 0;
		totalNum = 0;
		totalPage = 0;
		countPage2();
	}
});

// 安全退出
$("#tuichu").click(function(){
	$.ajax({
		type: "get",
		url: 'http://localhost:8005/custom/tuichu',
		success: function(e){
			if(e.flag == 1){
				location.href = "login.html";
				sessionStorage.clear();
			}
		}
	})
})

// 搜索功能
$("#searchBtn").click(function(){
	if($("#searchCls").val() == "default"){
		bool3 = false;
		pageName = 0;
		totalNum = 0;
		totalPage = 0;
		if(oPersonCum.checked == true){
			countPage();
		}else{
			countPage2();
		}
		$("#searchIpt").val("");
	}else{
		bool3 = true;
		var pageName = 0;
		var totalNum = 0;
		var totalPage = 0;
		countPage3();
	}
});






















