// import { template } from "handlebars";

$(function () {
  var currentpage = 1;
  var pageSize = 5;

  render();

  // 1.这是渲染,和分页
  function render() {


    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentpage,
        pageSize: pageSize
      },
      dataTypa: "json",
      success: function (info) {
        console.log(info);

        // 这是渲染,

        var htmlStr = template("secondtql", info);

        $(".lt-body tbody").html(htmlStr);
        // 和分页
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentpage = page;
            render();
          }
        });

      }


    })

  }


// 2.显示一级分类类容
  $("#addBtn").click(function () {

    $("#secondMadal").modal("show");

    // 点击模态框显示后就发送ajax请求
    // 渲染一级分类
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      dataTypa: "json",
      data: {
        page: 1,
        pageSize: 30
      },
      success: function (info) {
        console.log(info);

        var htmlFrist = template("fristtql", info);
        $(".frist-menu").html(htmlFrist);

      }



    })

  })

// 3.给一级分类文字填充

$(".frist-menu").on("click","a",function () {
  
  var txt = $(this).text();
  $(".drodownText").text(txt);

  var id = $(this).data("id");
  $('[name="categoryId"]').val(id);//val设置值


// 重置
$("#form").data('bootstrapValidator').updateStatus("categoryId", "VALID")
 
      
})

// 文件上传初始话
$("#fileupload").fileupload({
  dataType:"json",
  //e：事件对象
  //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
  done:function (e, data) {
    console.log(data.result.picAddr);

    var imgsrc = data.result.picAddr;
    $("#imgbox img").attr("src" , imgsrc);

    $('[name="brandLogo"]').val(imgsrc);



    // 重置
    $("#form").data('bootstrapValidator').updateStatus("brandLogo", "VALID");
  }
});

// 校验
$("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // excluded: [':disabled', ':hidden', ':not(:visible)'],
    excluded: [],


  // 配置图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // 校验的字段
  fields: {
    categoryId: {
      // 校验规则
      validators: {
        // 非空检验
        notEmpty: {
          // 提示信息
          message: "请输入一级分类名称"
        }
      }
    },
    brandName: {
      // 校验规则
      validators: {
        // 非空检验
        notEmpty: {
          // 提示信息
          message: "请输入二级分类名称"
        }
      }
    },
    brandLogo: {
      // 校验规则
      validators: {
        // 非空检验
        notEmpty: {
          // 提示信息
          message: "请选择图片"
        }
      }
    }
  }
});

$("#form").on('success.form.bv', function (e) {
  e.preventDefault();
  //使用ajax提交逻辑

  $.ajax({
   type:"post",
   url:"/category/addSecondCategory",
   data: $("#form").serialize(),
   success:function(info){
    console.log(info);
    if(info.success){
      $("#secondMadal").modal("hide");

      currentpage = 1;
      render();
      $("#form").data('bootstrapValidator').resetForm(true);
     
      $(".drodownText").text("请选择一级分类");
      $("#imgbox img").attr("src","images/none.png")


    }
   

   }
 


  })
});



})