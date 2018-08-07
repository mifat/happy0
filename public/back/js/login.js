$(function () {

  //使用表单校验插件
  $("#form").bootstrapValidator({


    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-heart',
      invalid: 'glyphicon glyphicon-grain',
      validating: 'glyphicon glyphicon-repeat'
    },

    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12之间'
          },
          callback: {
            message: "密码不正确"
          }
        }
      },
    }


  });
  /*
   * 2. 实现登录功能
   *    submit 按钮, 默认点击时会进行表单提交, 插件会在表单提交时进行检验
   *    (1) 如果校验成功, 页面会跳转, 我们需要阻止这次跳转, 通过ajax提交请求
   *    (2) 如果校验失败, 默认插件就会阻止这次提交跳转
   *
   *    注册表单校验成功事件, 在事件中阻止默认行为, 通过 ajax 进行提交请求
   * */

  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error === 1000) {
          // alert('用户不存在');
          // BootstrapValidator
          // 在用户输入内容的时候，会做校验，
          //  当调用bootstrap的插件的方法
          //  可以手动会改变字段值的状态。 
          //  可以使用updateStatus
          //  (field, status, validatorName)
          //   方法更新字段的状态
          $('#form').data('bootstrapValidator').updateStatus("username", "INVALID","callback");
        }
        if (info.error === 1001) {
          // alert('密码错误');
          $('#form').data('bootstrapValidator').updateStatus("password", "INVALID","callback");
        }
      }
    })
  })
  $('.btn-reset').click(function(){
    $('#form').data('bootstrapValidator').resetForm();//重置表单，并且会隐藏所有的错误提示和图标
  });

});