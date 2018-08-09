

$(function(){
 var currentPage = 1;
 var pageSize = 5;
 rander();

  function rander() {
  
    $.ajax({
     url:"/category/queryTopCategoryPaging",      
     type:"get",
     data:{
     page: currentPage,
     pageSize : pageSize
     },
    success:function(info){
    console.log(info);
     
    var htmlStr = template("tpl",info);
    $("tbody").html(htmlStr);

    
    $("#pagintor").bootstrapPaginator({
      bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
      currentPage: info.page ,//当前页
      totalPages: Math.ceil(info.total/pageSize),//总页数
      // size:"small",//设置控件的大小，mini, small, normal,large
      onPageClicked:function(a, b, c,page){
        currentPage = page;
        rander();
        //为按钮绑定点击事件 page:当前点击的按钮值
      }
    });

    }
 


    })
 


  }

$("#addBtn").click(function(){
//  console.log(45647)
 $("#fristModal").modal("show");
})


$("#form").bootstrapValidator({

  // 配置图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // 校验的字段
  fields: {
    categoryName: {
      // 校验规则
      validators: {
        // 非空检验
        notEmpty: {
          // 提示信息
          message: "请输入一级分类名称"
        }
      }
    }
  }
});



$('#form').on("success.form.bv", function( e ) {
  e.preventDefault();

  $.ajax({
    url: "/category/addTopCategory",
    type: "POST",
    data: $('#form').serialize(),
    success: function( info ) {
      console.log(info);
    
      if(info.success){
        rander();
        currentPage = 1;
        $("#fristModal").modal("hide");
       $("#form").data('bootstrapValidator').resetForm(true);  //获取表单校验实例

      }
    }
  })

})
//  $("#form").data('bootstrapValidator')  //获取表单校验实例

})