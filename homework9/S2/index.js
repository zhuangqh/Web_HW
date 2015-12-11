/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/10
 */

(function ($) {
    var isActive = [];

    $(function () {
        $('#button').mouseenter(initRing);
        $('.apb').click(autoClick);
    });

    function initRing() {
        isActive = [false, false, false, false, false];
        $('.num').hide();
        $('.button').addClass('active').removeClass('inactive');
        $('#info-bar').removeClass('infoActive');
        $('#sum').text('');
    }

    function autoClick() {
        var $buttons = $('.button');
        function getNum(buttonIndex) {
            var
                $that = $buttons.eq(buttonIndex),
                $num = $that.find('span.num');

            $buttons.addClass('inactive').removeClass('active');
            $that.addClass('active').removeClass('inactive');
            $num.text('...').show();
            isActive[$num.attr('id')[3]] = false;

            $.get('/getNumber', function (data) {
                $num.text(data);
                $buttons.addClass('active').removeClass('inactive');
                $that.addClass('inactive').removeClass('active');
                isActive[$num.attr('id')[3]] = true;
                activeBigRing();
                if (buttonIndex + 1 < $buttons.length)
                    getNum(buttonIndex + 1);
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