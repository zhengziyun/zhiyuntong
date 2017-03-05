var bool1 = false, bool2 = false;
var base = new Base64();
if(sessionStorage.user){
	$("#user").val(sessionStorage.user);
	$("#pass").val(sessionStorage.pass);
	bool1 = true;
	bool2 = true;
};
$("#user").blur(function(){
	if($(this).val()){
		bool1 = true;
		$("#isUser").text("");
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
$("#loginbtn").click(function(){
	if(bool1 == true && bool2 == true){
		$.ajax({
			type: "post",
			url: "http://localhost:8005/admin/login",
			data: {"username": $("#user").val(), "password": base.SET($("#pass").val())},
			success: function(e){
				if(e.flag == 1){
					location.href="index.html?=" + $("#user").val();
				}else if(e.flag == 2){
					if(!$(".result_msg").is(":animated")){
						$(".result_msg").text("用户名不存在！").animate({"bottom":"146px","opacity":"1"},"normal","linear",function(){
							$(this).delay(1000).animate({"opacity":0, "bottom":0},0);
						});
					}
				}else if(e.flag == 3){
					if(!$(".result_msg").is(":animated")){
						$(".result_msg").text("密码错误！").animate({"bottom":"146px","opacity":"1"},"normal","linear",function(){
							$(this).delay(1000).animate({"opacity":0, "bottom":0},0);
						});
					}
				}
			},
			error: function(){
				alert("error!");
			}
		});
	}else{
		$("#user").blur();
		$("#pass").blur();
	}
});