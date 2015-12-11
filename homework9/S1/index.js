/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/10
 */

(function ($) {
    var isActive = [];

    $(function () {
        $('#button').mouseenter(initRing);
    });

    function initRing() {
        isActive = [false, false, false, false, false];
        $('.num').hide();
        $('.button').addClass('active').removeClass('inactive').click(getNum);
        $('#info-bar').removeClass('infoActive').off('click');
        $('#sum').text('');
    }

    function getNum() {
        var
            $that = $(this),
            $buttons = $('.button'),
            $num = $that.find('span.num');

        $buttons.addClass('inactive').removeClass('active').off('click');
        $that.addClass('active').removeClass('inactive');
        $num.text('...').show();
        isActive[$num.attr('id')[3]] = false;

        $.get('/getNumber', function (data) {
            $num.text(data);
            $buttons.addClass('active').removeClass('inactive').click(getNum);
            $that.addClass('inactive').removeClass('active').off('click');
            isActive[$num.attr('id')[3]] = true;
            activeBigRing();
        });
    }

    function activeBigRing() {
        var allActive = isActive.every(function (item) {
                return item;
            });
        if (allActive) {
            $('#info-bar').addClass('infoActive').click(computeSum);
            return true;
        } else {
            return false;
        }
    }

    function computeSum() {
        if (!activeBigRing()) return;
        var
            $nums = $('.num'),
            sum = 0;

        for (var i = 0; i < $nums.length; i += 1) {
            sum += parseInt($nums.eq(i).text());
        }
        $('#sum').text(sum);
    }
})(jQuery);