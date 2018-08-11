$(function () {

  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataTypa: "json",
      success: function (info) {
        console.log(info);

        //  渲染页面
        var htmlStr = template("producttpl", info);

        $("tbody").html(htmlStr);


        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;

            render();

          },

          itemTexts:function(type, page, current){
            console.log(arguments);
            switch ( type ){
              case "page":
              return page;
              case "first":
              return "首页";
              case "last":
              return "尾页";
              case "prev":
              return "上一页";
              case "next":
              return "下一页";
            }

          }
        });


      }




    })
  }
  $("#addproBtn").click(function () {

    $("#addProMadal").modal("show");

    // 点击模态框显示后就发送ajax请求
    // 渲染二级分类
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

        var htmlProduct = template("protql", info);
        $(".pro-menu").html(htmlProduct);
      
       

      }



    })

  });

$(".dropdown-menu").on("click","a",function(){
  var txt = $(this).text();
  $(".drodownText").text(txt);


  var id =$(this).data("id");

  $('[name="brandId"]').val(id);

  $("#form").data('bootstrapValidator').updateStatus("brandId", "VALID")

})

  
// 文件上传初始化
$("#fileupload").fileupload({      dataType:"json",    
  //e：事件对象     
   //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
  done:function (e, data) {       
  // console.log(data.result);  
  picArr.unshift(data.result)
  console.log(data.result.picAddr);  

  var picUrl = data.result.picAddr;
  $("#imgbox").prepend('<img src="'+picUrl+'" width="100" alt="">');

   
     if(picArr.length > 3){
      picArr.pop();
     $("#imgbox img:last-of-type").remove();
    }
   
    if(picArr.length === 3){
      $("#form").data('bootstrapValidator').updateStatus("picStatus", "VALID")
    }
   }});

// 表单校验
$('#form').bootstrapValidator({
  // 对隐藏域进行校验
  excluded: [],
  // 配置图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',     
    invalid: 'glyphicon glyphicon-remove',  
    validating: 'glyphicon glyphicon-refresh'  
  },

  // 配置字段
  fields: {
    brandId: {
      validators: {
        notEmpty: {
          message: "请选择二级分类"
        }
      }
    },
    proName: {
      validators: {
        notEmpty: {
          message: "请输入商品名称"
        }
      }
    },
    proDesc: {
      validators: {
        notEmpty: {
          message: "请输入商品描述"
        }
      }
    },

    num: {
      validators: {
        notEmpty: {
          message: "请输入商品库存"
        },
        regexp: {
          regexp: /^[1-9]\d*$/,
          message: '商品库存必须是非零开头的数字'
        }
      }
    },

    size: {
      validators: {
        notEmpty: {
          message: "请输入商品库存"
        },

        regexp: {
          regexp: /^\d{2}-\d{2}$/,
          message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
        }
      }
    },


    oldPrice: {
      validators: {
        notEmpty: {
          message: "请输入商品原价"
        }
      }
    },

    price: {
      validators: {
        notEmpty: {
          message: "请输入商品现价"
        }
      }
    },

    picStatus: {
      validators: {
        notEmpty: {
          message: "请上传3张图片"
        }
      }
    }
  }
  


});

// ok 发送请求,渲染页面
$("#form").on('success.form.bv', function (e) {
  e.preventDefault();
  //使用ajax提交逻辑
  
  var paramsStr = $("#form").serialize();

  paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
  paramsStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
  paramsStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;

  $.ajax({
    type: "post",
    url: "/product/addProduct",
    data: paramsStr,
    dataType: "json",
    success:function(info){
      console.log(info);
      if(info.success){
        $("#addProMadal").modal("hide");
        currentPage = 1 ;
        render();

        $('#form').data("bootstrapValidator").resetForm(true);

        $('.drodownText').text("请输入二级分类");
        $('#imgbox img').remove();
        picArr = [];
      

      }
    }



  })


});

})