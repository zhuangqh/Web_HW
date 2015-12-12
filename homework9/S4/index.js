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
    $('#sequence').text('');
}

function enterRing() {
    $('.num').hide();
    $('.button').addClass('active').removeClass('inactive');
    $('.apb').addClass('curActive');
    $('#sum').text('');
}

function autoClick() {
    enterRing();
    $(this).off('click').removeClass('curActive');
    var
        $buttons = $('.button'),
        clickList = [],
        callbacks = [],
        alphabet = ['A', 'B', 'C', 'D', 'E'],
        randomIndex,
        len = $buttons.length,
        sequence = "",
        curSum = 0,
        i;

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

    // 获取数字并触发下一个按钮
    for (i = 0; i < len; i += 1) {
        (function (i) {
            callbacks[i] = function (data) {
                // 判断是否已经退出@+
                if (!$('#info-bar:visible').length) {
                    $('.apb').click(autoClick);
                    return;
                }

                curSum += parseInt(data);

                $('.button').addClass('active').removeClass('inactive') // 所有按钮激活
                    .eq(clickList[i]).addClass('inactive').removeClass('active') // 当前按钮灭活
                    .find('span.num').text(data).show();  // 显示数据
                if (i + 1 < len)
                    getNum(clickList[i+1], callbacks[i + 1]);
                else
                    activeBigRing(curSum); // 最后激活大气泡
            }
        })(i);
    }

    getNum(clickList[0], callbacks[0]);
}

function getNum(clickIndex, callback) {
    $('.button').addClass('inactive').removeClass('active')
        .eq(clickIndex).addClass('active').removeClass('inactive')
        .find('span.num').text('...').show();

    $.get('/getNumber', callback);
}

function activeBigRing(curSum) {
    $('.apb').click(autoClick).addClass('curActive');
    $('#sum').text(curSum);
}