var bool1 = false, bool2 = false, bool3 = false;
var base = new Base64();
$("#user").blur(function(){
	if($(this).val()){
		$.ajax({
			type: "post",
			url: "http://localhost:8005/admin/configUser",
			data: {"username": $("#user").val(), "password": $("#pass").val()},
			success: function(e){
				if(e.flag == 1){
					bool1 = false;
					$("#isUser").text("用户名已存在，请更换另一个！");
				}else if(e.flag == 2){
					bool1 = true;
					$("#isUser").text("");
				}
			},
			error: function(){
				alert("error!");
			}
		});
	}else{
		bool1 = false;
		$("#isUser").text("用户名不能为空！");
	}
});
$("#pass").blur(function(){
	if($(this).val()){
		bool2 = true;
		$("#isPass").text("");
	}else{
		bool2 = false;
		$("#isPass").text("密码不能为空！");
	}
});
$("#configPass").blur(function(){
	if($(this).val() == $("#pass").val()){
		bool3 = true;
		$("#isConPass").text("");
	}else{
		bool3 = false;
		$("#isConPass").text("确认密码不一致！");
	}
});

$("#sureBtn").click(function(){
	location.href = "login.html";
});

$("#registbtn").click(function(){
	if($("#pass").val() == $("#configPass").val()){
		$("#isConPass").text("");
		if(bool1 == true && bool2 == true && bool3 == true){
			$.ajax({
				type: "post",
				url: "http://localhost:8005/admin/regist",
				data: {"username": $("#user").val(), "password": base.SET($("#pass").val())},
				success: function(e){
					if(e.flag == 1){
						$("#add_result").show();
						$("#msg_result").text("注册成功！");
						sessionStorage.user = $("#user").val();
						sessionStorage.pass = $("#pass").val();
					}else if(e.flag == 2){
						alert("用户名已存在！");
					}else if(e.flag == 3){
						alert("注册失败！");
					}
				},
				error: function(){
					alert("error!");
				}
			});
		}
	}else{
		$("#isConPass").text("确认密码不一致！");
	}
});