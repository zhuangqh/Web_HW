/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/10
 */

(function ($) {
    var isActive = [],
        isOut = false;

    $(function () {
        $('#button').mouseenter(enterRing).mouseleave(outRing);
    });

    function outRing() {
        isOut = true;
    }

    function enterRing() {
        isOut = false;
        isActive = [false, false, false, false, false];
        $('.num').hide();
        $('.button').addClass('active').removeClass('inactive');
        $('.apb').click(autoClick).addClass('curActive');
        $('#sequence').text('');
        $('#sum').text('');
    }

    function autoClick() {
        enterRing();
        $(this).off('click').removeClass('curActive');
        var
            $buttons = $('.button'),
            clickList = [],
            alphabet = ['A', 'B', 'C', 'D', 'E'],
            randomIndex,
            len = $buttons.length,
            sequence = "";

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
        function getNum(clickIndex) {
            var
                $that = $buttons.eq(clickList[clickIndex]),
                $num = $that.find('span.num');

            $buttons.addClass('inactive').removeClass('active');
            $that.addClass('active').removeClass('inactive');
            $num.text('...').show();
            isActive[$num.attr('id')[3]] = false;

            $.get('/getNumber', function (data) {
                if (isOut) return;
                $num.text(data);
                $buttons.addClass('active').removeClass('inactive');
                $that.addClass('inactive').removeClass('active');
                isActive[$num.attr('id')[3]] = true;
                activeBigRing();
                if (++clickIndex < len)
                    getNum(clickIndex);
            });
        }
        getNum(0);
    }

    function activeBigRing() {
        var allActive = isActive.every(function (item) {
                return item;
            });
        if (allActive) {
            computeSum();
            $('.apb').click(autoClick).addClass('curActive');
        }
    }

    function computeSum() {
        var
            $nums = $('.num'),
            sum = 0;

        for (var i = 0; i < $nums.length; i += 1) {
            sum += parseInt($nums.eq(i).text());
        }
        $('#sum').text(sum);
    }
})(jQuery);