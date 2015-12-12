/**
* @Author: zhuangqh
* @Email: zhuangqhc@gmail.com
* @Create on: 2015/12/10
*/


$(function () {
    $('#button').mouseenter(enterRing).mouseleave(outRing);
    $('.apb').click(autoClick);
});

function outRing() {
    $('#message').text('');
    $('#sequence').text('');
}

function enterRing() {
    $('.num').hide();
    $('.button').addClass('active').removeClass('inactive');
    $('.apb').addClass('curActive');
    $('#sum').text('');
}

function ErrorMsg(message, curSum) {
    this.message = message;
    this.currentSum = curSum;
}

// 发生异常将再次请求直到无异常为止
function autoClick() {
    enterRing();
    $(this).off('click').removeClass('curActive');
    var
        $buttons = $('.button'),
        alphabet = ['A', 'B', 'C', 'D', 'E'],
        randomIndex,
        len = $buttons.length,
        sequence = "",
        funcMap,
        clickList = [],
        invokeList = [],
        callbacks = [],
        msgList,
        curSum = 0,
        i;

    msgList = [
        '这是一个天大的秘密',
        '我不知道',
        '你不知道',
        '他不知道',
        '才怪'
    ];

    funcMap = {
        'A': aHandler,
        'B': bHandler,
        'C': cHandler,
        'D': dHandler,
        'E': eHandler
    };

    // 生成随机序列并显示
    while (len) {
        randomIndex = Math.floor(Math.random() * $buttons.length);
        if ($.inArray(randomIndex, clickList) === -1) {
            clickList.push(randomIndex);
            len -= 1;
            sequence += alphabet[randomIndex];
        }
    }
    $('#sequence').text(sequence);
    len = $buttons.length;

    // 生成函数调用序列
    for (i = 0; i < len; i += 1) {
        invokeList.push(funcMap[sequence[i]]);
    }
    invokeList.push(bubbleHandler); // 最后调用点击大气泡

    // 生成回调函数并链式调用
    for (i = 0; i < len; i += 1) {
        (function (i) {
            callbacks[i] = function (data) {
                // 判断是否已经退出@+
                if (!$('#info-bar:visible').length) {
                    $('.apb').click(autoClick);
                    return;
                }

                curSum += parseInt(data);

                $('#message').text(msgList[clickList[i]]);
                $('#sum').text(curSum).show();

                $('.button').addClass('active').removeClass('inactive') // 所有按钮激活
                    .eq(clickList[i]).addClass('inactive').removeClass('active') // 当前按钮灭活
                    .find('span.num').text(data).show();  // 显示数据
                exeHandler(i+1);
            }
        })(i);
    }

    exeHandler(0);
    // 执行并递归处理异常
    function exeHandler(i) {
        try {
            invokeList[i](curSum, callbacks[i]);
        } catch (errMsg) {
            $('#message').text(errMsg.message);
            $('#sum').text(errMsg.currentSum);
            console.log("Error in handler " + alphabet[clickList[i]]);
            arguments.callee(i);
        }
    }

}

function aHandler(curSum, callback) {
    if (Math.random() > 0.5)
        throw new ErrorMsg('这不是一个天大的秘密', curSum);

    $('.button').addClass('inactive').removeClass('active') // 所有按钮灭活
        .eq(0).addClass('active').removeClass('inactive') // 当前按钮激活
        .find('span.num').text('...').show();  // 显示数据

    $.get('/getNumber', callback);
}

function bHandler(curSum, callback) {
    if (Math.random() > 0.5)
        throw new ErrorMsg('我知道', curSum);

    $('.button').addClass('inactive').removeClass('active') // 所有按钮灭活
        .eq(1).addClass('active').removeClass('inactive') // 当前按钮激活
        .find('span.num').text('...').show();  // 显示数据

    $.get('/getNumber', callback);
}

function cHandler(curSum, callback) {
    if (Math.random() > 0.5)
        throw new ErrorMsg('你知道', curSum);

    $('.button').addClass('inactive').removeClass('active') // 所有按钮灭活
        .eq(2).addClass('active').removeClass('inactive') // 当前按钮激活
        .find('span.num').text('...').show();  // 显示数据

    $.get('/getNumber', callback);
}

function dHandler(curSum, callback) {
    if (Math.random() > 0.5)
        throw new ErrorMsg('他知道', curSum);

    $('.button').addClass('inactive').removeClass('active') // 所有按钮灭活
        .eq(3).addClass('active').removeClass('inactive') // 当前按钮激活
        .find('span.num').text('...').show();  // 显示数据

    $.get('/getNumber', callback);
}

function eHandler(curSum, callback) {
    if (Math.random() > 0.5)
        throw new ErrorMsg('恩', curSum);

    $('.button').addClass('inactive').removeClass('active') // 所有按钮灭活
        .eq(4).addClass('active').removeClass('inactive') // 当前按钮激活
        .find('span.num').text('...').show();  // 显示数据

    $.get('/getNumber', callback);
}

function bubbleHandler(curSum) {
    setTimeout((function (curSum) {
        return function () {
            $('#message').text('楼主异步战斗力感人，目测不超过' + curSum);
            $('.apb').click(autoClick).addClass('curActive');
        }
    })(curSum), 1500);

}
