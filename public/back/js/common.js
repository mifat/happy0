
  if(location.href.indexOf("login.html")===-1){
    $.ajax({
      type:"get",
      url:"/employee/checkRootLogin",
      dataType:"json",
      success:function(info){
        console.log(info);
       if(info.success){
          console.log("成功登录")
      }
       if(info.error===400){
         location.href="login.html"
         console.log("qqqqq")
         
        }
      }

    })
  }


$(function(){
  $('.nav .category').click(function() {
    $('.nav .child').stop().slideToggle();
  })
  
  // 点击换背景



$('.icon_menu').click(function(){
  $('.lt-aside').toggleClass("hidemenu");
  $('.lt-main').toggleClass("hidemenu");
  $('.lt-topbar').toggleClass("hidemenu");




});
$('.icon_logout').click(function(){
  $('#logoutModal').modal('show');
  $('#logoutbtn').click(function(){


   $.ajax({
     type:"get",
     url: "/employee/employeeLogout",
     dataType:"json",
     success:function(info){
      console.log(info);
      if(info.success){
        location.href="login.html"
      }
     }
   })
  });

  });

 

});

