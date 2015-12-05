/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/5
 */

$(function () {
    var $reminder = $('#reminder'),
        $errorMessage = $('#errorMessage');
    $reminder.hide();

    // 检查并显示错误提示
    $("input[type='text']")
    .click(function () {
        $errorMessage.hide();
    })
    .change(errorHandler());

    $('form').submit(function () {
        var inputs = $("input[type='text']");
        for (var i = 0; i < inputs.length; ++i) {
            if (inputs.eq(i).val() == "") {
                alert("您有某项未输入，请重新输入后再提交");
                return false;
            }
        }
        if ($('#reminder:visible').length) {
            alert("您的输入不合法，请重新输入后再提交");
            return false;
        }
    });

    // 重置，隐藏错误提示
    $('#reset').click(function () {
        $errorMessage.hide();
        $reminder.hide();
        $reminder.find('p').hide();
    });
});

// 返回检查错误的函数
function errorHandler() {
    var errorMessage = {
        'username': 'err1',
        'studentId': 'err2',
        'phone': 'err3',
        'mail': 'err4'
    };
    var validator = {
        'username': /^[a-zA-Z]{1}\w{5,17}$/,
        'studentId': /^[1-9]{1}\d{7}$/,
        'phone': /^[1-9]{1}\d{10}$/,
        'mail': /^[A-Za-z0-9_\-]+@(([A-Za-z0-9_\-])+\.)+[A-Za-z]{2,4}$/
    };
    return function () {
        var $reminder = $('#reminder');
        $reminder.show();
        var id = $(this).attr('id'),
            $err = $('#' + errorMessage[id]);
        if (validator[id].test($(this).val())) {
            $err.hide();
        } else {
            $err.show();
        }

        if (!$reminder.find('p:visible').length)
            $reminder.hide();
    }
}