/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015-11-26 12:50:25
 */

(function($) {
    var puzzle = {
        level: 4,
        space: new Coordinate(3, 3),
        randomTime: 100,
        gameOver: true,
        firstEnter: true,
        timeIntervalId: null,
        costTime: 0,
        costStep: 0
    };

    $(function () {
        // dynamically create panel
        var panels = [];
        _.times(puzzle.level*puzzle.level, function (i) {
            panels[i] = "<div id='panel" + i + "' class='panels' ></div>";
        });
        $('#puzzle').html(panels.join('\n'));
        $('#restart').click(newGame);
        $('.panels').click(move);
    });

    function Coordinate(x, y) {
        this.row = x;
        this.col = y;
        this.toIndex = function () {
            return this.row * puzzle.level + this.col;
        }
    }

    function ticktock() {
        puzzle.costTime++;
        $('#game-time').val(puzzle.costTime + 's');
    }

    function newGame() {
        if (puzzle.firstEnter) {
            $('#restart').text = "重新开始";
            $('.game-container:first').addClass('playing');
            $('#puzzle').removeClass('puzzle-invisible');
            puzzle.firstEnter = false;
        } else {
            // check if wrong click
            if (!confirm('重新开始会清除当前的状态，重新生成拼图‚\n'
                    + '是否继续？ (误操作请按取消)')) {
                return;
            } else {
                puzzle.costTime = 0;
                $('#game-time').val(0);
            }
        }

        // count for playing time
        if (puzzle.timeIntervalId)
            clearInterval(puzzle.timeIntervalId);
        puzzle.timeIntervalId = setInterval(ticktock, 1000);

        puzzle.gameOver = false;
        puzzle.costStep = 0;
        $('#game-step').val(0);

        // randomly generate a valid puzzle
        _.times(puzzle.randomTime, function () {
            swapSpacePanel(_.sample(adjacentPanels()));
        });
    }

    function move() {
        if (!puzzle.gameOver) {

        }
    }

    // compute panels around space
    function adjacentPanels() {
        var step = [[-1, 0], [1, 0], [0, 1], [0, -1]],
            result = [];
        _.times(4, function (i) {
            var row = puzzle.space.row + step[i][0],
                col = puzzle.space.col + step[i][1];
            result[i] = new Coordinate(row, col);
        });
        return result;
    }
})(jQuery);