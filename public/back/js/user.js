

$(function(){
var currentPage = 1;
var pageSize = 5;
var currentId;

render();

// var page = 1 ;
// var pageSize = 5;

// 进入页面就开始请求数据
function render(){
  $.ajax({
    type:"get",
    url:"/user/queryUser",
    dataType:"json",
    data:{
      page: currentPage,
      pageSize: pageSize
    },

    success:function(info){
      console.log(info);
      console.log(info.total);
      var htmlStr= template("tpl" , info);
      $('tbody').html(htmlStr)


      // 分页
      $("#pagintor").bootstrapPaginator({
        bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
        currentPage:info.page,//当前页
        totalPages:Math.ceil (info.total /info.size ),//总页数
        // size:"small",//设置控件的大小，mini, small, normal,large


        onPageClicked:function(a, b, c,page){
          //为按钮绑定点击事件 page:当前点击的按钮值
          currentPage = page;
          render();
        }
      });

     
    }
  })
}


$("tbody").on("click",".btn",function(){
  $("#userModal").modal("show");
  currentId = $(this).parent().data("id");

  var isDelete = $(this).hasClass("btn-success") ? 1 : 0;

  console.log(currentId);
  console.log(isDelete)


  $("#subimtBtn").off("click").on("click",function(){
console.log(1233)
 $.ajax({
    type:"post",
    url:"/user/updateUser",
    dataType:"json",
    data:{
      id: currentId,
      isDelete :isDelete
    },
    success:function(info){
      console.log(info);
      if(info.success){
       $("#userModal").modal("hide");
       render();
        
      }
    }


  })
 
  })
 




})




})