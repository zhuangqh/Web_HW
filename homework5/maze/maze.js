/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015-11-12 21:51:20
 */

var gameStart = false,
    hasCheat = false,
    gameOver = false;

window.onload = function () {
    var start = document.getElementById('start'),
        end = document.getElementById('end'),
        blocks = document.getElementsByClassName('block'),
        cheatCheck = document.getElementById('cheat-check'),
        maze = document.getElementById('maze');

    start.onmouseover = startGame;
    end.onmouseover = endGame;
    maze.onmouseleave = outMaze;

    for (var i = 0; i < blocks.length; ++i) {
        blocks[i].onmouseover = overBlock;
    }

    // dont select anything when double click div/span/p
    document.onselectstart = function () {
        return false;
    }
}

function startGame() {
    display("");
    // change color
    var blocks = document.getElementsByClassName('block block-changed');
    for (var i = 0; i < blocks.length; ++i) {
        blocks[i].className = blocks[i].className.replace(' block-changed', '');
    }
    gameStart = true;
    hasCheat = false;
    gameOver = false;
}

function endGame() {
    if (!gameOver && (!gameStart || hasCheat)) {
        display("Don't cheat, you should start from the 'S' and move " +
            "to the 'E' inside the maze!");
    } else if (gameStart && !gameOver) {
        display("You win");
    }

    gameStart = false;
    hasCheat = false;
}

function overBlock(event) {
    if (!gameStart || gameOver) return;

    gameOver = true;
    var className = event.target.className;
    if (className.indexOf(' block-changed') == -1) {
        event.target.className += ' block-changed';
    }
    display("You lose");
}

function outBlock(event) {
    var className = event.target.className;
    if (className.indexOf('block-changed') != -1) {
        event.target.className = className.replace(' block-changed', '');
    }
}

function outMaze () {
    hasCheat = true;
    var blocks = document.getElementsByClassName('block block-changed');
    for (var i = 0; i < blocks.length; ++i) {
        blocks[i].className = 'block';
    }
}

function cheat() {
    hasCheat = true;
}

function display(info) {
    var notice = document.getElementById('notice');
    if (info == "") {
        notice.className = 'invisible';
    } else {
        notice.className = '';
        notice.textContent = info;
    }
}