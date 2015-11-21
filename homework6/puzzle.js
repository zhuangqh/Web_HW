/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015-11-18 16:49:48
 */

(function() {
    'use strict';

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

    window.onload = function () {
        var restartBtn = document.getElementById('restart'),
            puzzleBoard = document.getElementById('puzzle'),
            panelsFrag = document.createDocumentFragment();

        // dynamically create panel
        for (var i = 0; i < puzzle.level * puzzle.level - 1; ++i) {
            var newPanel = document.createElement('div');
            newPanel.id = 'panel' + i;
            newPanel.className = 'panels';
            panelsFrag.appendChild(newPanel);
        }
        puzzleBoard.appendChild(panelsFrag);

        // bind event listener
        restartBtn.onclick = newGame;
        var panels = document.getElementsByClassName('panels');
        for (i = 0; i < panels.length; ++i) {
            panels[i].onclick = move;
        }

        // dont select anything when double click div/span/p
        document.onselectstart = function () {
            return false;
        }
    }

    function Coordinate(x, y) {
        this.row = x;
        this.col = y;
        this.toIndex = function () {
            return this.row * puzzle.level + this.col;
        }
    }

    function ticktock () {
        ++puzzle.costTime;
        showGameInfo('game-time', puzzle.costTime + 's');
    }

    function showGameInfo (info, status) {
        document.getElementById(info).value = status;
    }

    function newGame() {
        // start or restart
        if (puzzle.firstEnter) {
            document.getElementById('restart').textContent = '重新开始';
            document.getElementsByClassName('game-container')[0].className += ' playing';
            document.getElementById('puzzle').className = '';
            puzzle.firstEnter = false;
        } else {
            // check if wrong click
            if (!confirm('重新开始会清除当前的状态，重新生成拼图‚\n'
                + '是否继续？ (误操作请按取消)')) {
                return;
            } else {
                puzzle.costTime = 0;
                showGameInfo('game-time', 0);
            }
        }

        // count for playing time
        if (puzzle.timeIntervalId)
            clearInterval(puzzle.timeIntervalId);
        puzzle.timeIntervalId = setInterval(ticktock, 1000);

        puzzle.gameOver = false;
        puzzle.costStep = 0;
        showGameInfo('game-step', 0);
        // randomly generate a valid puzzle
        for (var i = 0; i < puzzle.randomTime; ++i) {
            // go to the next step randomly
            var validSteps = validPanels(),
                nextStep = validSteps[Math.floor(Math.random() * validSteps.length)];
            swapSpacePanel(nextStep);
        }

        // move the space to the right-bottom corner
        while (puzzle.space.row != puzzle.level - 1) {
            nextStep = new Coordinate(puzzle.space.row + 1, puzzle.space.col);
            swapSpacePanel(nextStep);
        }

        while (puzzle.space.col != puzzle.level - 1) {
            nextStep = new Coordinate(puzzle.space.row, puzzle.space.col + 1);
            swapSpacePanel(nextStep);
        }
    }

    function move() {
        if (!puzzle.gameOver) {
            var currentIndex = parseInt(this.id.replace(/[^0-9]/ig, "")),
                validSteps = validPanels();
            for (var i = 0; i < validSteps.length; ++i) {
                if (currentIndex == validSteps[i].toIndex())
                    break;
            }

            if (i != validSteps.length) {
                // count for step
                ++puzzle.costStep;
                showGameInfo('game-step', puzzle.costStep + '步');
                swapSpacePanel(validSteps[i]);
            }

            checkWin();
        }
    }

    function checkWin() {
        var panels = document.getElementsByClassName('panels');
        for (var i = 0; i < panels.length; ++i) {
            var currentIndex = parseInt(panels[i].id.replace(/[^0-9]/ig, ""));
            if (currentIndex != i)
                return;
        }
        // has win
        puzzle.gameOver = true;
        clearInterval(puzzle.timeIntervalId);
        alert('恭喜！你完成了拼图\n' + '共用去' + puzzle.costTime + '秒, ' +
            puzzle.costStep + '步');
    }

    function swapSpacePanel(nextStep) {
        // swap two panels
        var panel = document.getElementById('panel' + nextStep.toIndex());
        panel.id = 'panel' + puzzle.space.toIndex();
        puzzle.space = nextStep;
    }

    // compute valid panels around space
    function validPanels() {
        var step = [[-1, 0], [1, 0], [0, 1], [0, -1]],
            validSteps = [];

        for (var i = 0; i < step.length; ++i) {
            var row = puzzle.space.row + step[i][0],
                col = puzzle.space.col + step[i][1];

            if (row >= 0 && row < puzzle.level
                && col >= 0 && col < puzzle.level)
                validSteps.push(new Coordinate(row, col));
        }

        return validSteps;
    }
})();