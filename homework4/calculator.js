/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015-11-05 00:32:35
 */

var expression = "";
var leftPara = 0, rightPara = 0;
var operators = ["+", "-", "*", "/"];
var preIsOperator = false;
var preIsDot = false;

// bind event listener for buttons
window.onload = function () {
    // special operation buttons
    document.getElementById("btn-CE").onclick = function () {
        delAll();
    }
    document.getElementById("btn-<-").onclick = function () {
        delOne();
    }
    document.getElementById("btn-=").onclick = function() {
        computeAns();
    }

    // basic buttons
    var btns = document.getElementsByTagName("input");
    var re = /normal-btn/;
    for (var i = 0; i < btns.length; ++i) {
        if (re.test(btns[i].className)) {
            btns[i].onclick = function (event) {
                readIn(event.target.value);
            }
        }
    }
}

// print expression to the calculator screen
function display() {
    var oExpress = document.getElementById("express-view");
    oExpress.value = expression;
}

// check if the input is invalid and set the border of calculator
// screen to red in order to warn user
function wrongInput(isWrongInput) {
    var oExpress = document.getElementById("express-view");
    if (isWrongInput) {
        oExpress.style.borderColor = 'red';
    } else {
        oExpress.style.borderColor = '#BBBBBB';
    }
}

function readIn(cc) {
    // simple check for parentheses
    if (cc === "(") {
        ++leftPara;
    } else if (cc === ")") {
        ++rightPara;
        if (rightPara > leftPara) {
            --rightPara;
            wrongInput(true);
            return;
        }
    }

    // prevent the expression from adjacent operators
    var isOperator = operators.some(function (item, index, array) {
        return item === cc;
    });
    if (preIsOperator && isOperator) {
        wrongInput(true);
        return;
    }
    if (isOperator) {
        preIsOperator = true;
        preIsDot = false;
    } else {
        preIsOperator = false;
    }

    // prevent the expression from adjacent dot
    if (preIsDot && cc === ".") {
        wrongInput(true);
        return;
    }
    if (cc === ".") {
        preIsDot = true;
    }

    expression += cc;
    wrongInput(false);
    display();
}

function computeAns() {
    try {
        if (expression) {
            var ans = eval(expression).toFixed(10);
            expression = ans.toString();
            if (isNaN(ans)) {
                alert("Not a number!");
                expression = "";
            }
        }
    } catch(err) {
        alert("invalid expression!");
        expression = "";
    }

    wrongInput(false);
    display();
    // initialize
    preIsOperator = false;
    var re = /./;
    if (re.test(expression))
        preIsDot = true;
    else
        preIsDot = false;
    leftPara = rightPara = 0;
}

// delete the last character from the expression
// which is not empty
function delOne() {
    if (preIsOperator)
        preIsOperator = false;
    wrongInput(false);
    if (expression != "") {
        expression = expression.substr(0, expression.length - 1);
        display();
    }
}

// clean up the expression
function delAll() {
    wrongInput(false);
    preIsOperator = false;
    preIsDot = false;
    expression = "";
    display();
}
