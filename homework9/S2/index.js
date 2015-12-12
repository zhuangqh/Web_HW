/**
* @Author: zhuangqh
* @Email: zhuangqhc@gmail.com
* @Create on: 2015/12/10
*/


$(function () {
    $('#button').mouseenter(initRing);
    $('.apb').click(autoClick);
});

function initRing() {
    $('.num').hide();
    $('.button').addClass('active').removeClass('inactive');
    $('.apb').addClass('curActive');
    $('#sum').text('');
}

function autoClick() {
    $('.num').hide();
    $('#sum').text('');
    $('.apb').removeClass('curActive').off('click'); // 未完成，禁止再点击@+
    var
        $buttons = $('.button'),
        callbacks = [],
        curSum = 0;

    for (var i = 0; i < $buttons.length; i += 1) {
        (function (i) {
            callbacks[i] = function (data) {
                curSum += parseInt(data);
                $buttons.addClass('active').removeClass('inactive') // 所有按钮激活
                    .eq(i).addClass('inactive').removeClass('active') // 当前按钮灭活
                    .find('span.num').text(data); // 显示得到的数据
                if (i < $buttons.length - 1) {
                    getNum(i + 1, callbacks[i + 1]);
                } else {
                    activeBigRing(curSum); // 最后一个按钮得到数据后，点击大气泡
                }
            }
        })(i);
    }

    getNum(0, callbacks[0]);
}

function getNum(buttonIndex, callback) {
    $('.button').addClass('inactive').removeClass('active')
        .eq(buttonIndex).addClass('active').removeClass('inactive')
        .find('span.num').text('...').show();

    $.get('/getNumber', callback);
}

function activeBigRing(curSum) {
    console.log('done');
    $('#sum').text(curSum);
    $('.apb').addClass('curActive').click(autoClick);
}
