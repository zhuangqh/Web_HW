/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015-11-13 15:12:16
 */

var currentMole = -1,
    currentTime = 30,
    score = 0,
    timeIntervalId = null;

window.onload = function () {
	// generate radio-type inputs
	var inputFrag = document.createDocumentFragment();
	for (var i = 0; i < 60; ++i) {
		var newInput = document.createElement('input');
		newInput.name = 'mole';
		newInput.type = 'radio';
        newInput.onclick = hitMole;
		inputFrag.appendChild(newInput);
	}
	document.getElementById('whac-a-mole').appendChild(inputFrag);
	document.getElementById('sta-end').addEventListener('click', startGame);

    // dont select anything when double click div/span/p
    document.onselectstart = function () {
        return false;
    }
}

function hitMole(event) {
    if (currentMole == -1) {
        currentMole = Math.floor(Math.random() * 59);
    } else if (timeIntervalId != null) {
        if (document.getElementsByName('mole')[currentMole].checked) {
            ++score;
            this.checked = false;

            // do not appear in the same place
            var randomMole = Math.floor(Math.random() * 59);
            while (randomMole == currentMole) {
                randomMole = Math.floor(Math.random() * 59);
            }
            currentMole = randomMole;
        } else {
            this.checked = false;
            if (score > 0)
                --score;
        }
    }
    document.getElementsByName('mole')[currentMole].checked = true;
    showGameInfo('score', score);
}

function ticktock() {
    --currentTime;

    if (currentTime <= 0) {
        stopGame();
    } else {
        document.getElementsByName('time')[0].value = currentTime.toString();
    }
}

function startGame() {
    // initialize
    currentMole = -1;
    currentTime = 30;
    score = 0;
    timeIntervalId = setInterval(ticktock, 1000);
    hitMole();

    showGameInfo('game-status', 'Playing');
    var staEnd = document.getElementById('sta-end');
    staEnd.removeEventListener('click', startGame);
    staEnd.addEventListener('click', stopGame);
}

function stopGame() {
    clearInterval(timeIntervalId);
    timeIntervalId = null;
    showGameInfo('game-status', 'Game Over');
    showGameInfo('time', 0);
    alert('Game Over.\n' + 'Your score is: ' + score);
    var staEnd = document.getElementById('sta-end');
    staEnd.removeEventListener('click', stopGame);
    staEnd.addEventListener('click', startGame);
}

function showGameInfo(info, status) {
    document.getElementsByName(info)[0].value = status;
}