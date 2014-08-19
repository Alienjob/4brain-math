
//служебные функции
var readyList = [];
function onReady(handler) {

	if (!readyList.length) {
		bindReady(function() {
			for(var i=0; i<readyList.length; i++) {
				readyList[i]();
			}
		});
	}

	readyList.push(handler);
}
function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent('on' + evType, fn)
	}
	else {
		elem['on' + evType] = fn
	}
}
function bindReady(handler){

	var called = false;

	function ready() { // (1)
		if (called) return;
		called = true;
		handler();
	}

	if ( document.addEventListener ) { // (2)
		document.addEventListener( "DOMContentLoaded", function(){
			ready();
		}, false );
	} else if ( document.attachEvent ) {  // (3)

		// (3.1)
		if ( document.documentElement.doScroll && window == window.top ) {
			function tryScroll(){
				if (called) return;
				if (!document.body) return;
				try {
					document.documentElement.doScroll("left");
					ready();
				} catch(e) {
					setTimeout(tryScroll, 0);
				}
			}
			tryScroll();
		}

		// (3.2)
		document.attachEvent("onreadystatechange", function(){

			if ( document.readyState === "complete" ) {
				ready();
			}
		});
	}

	// (4)
    if (window.addEventListener)
        window.addEventListener('load', ready, false);
    else if (window.attachEvent)
        window.attachEvent('onload', ready);
    /*  else  // (4.1)
        window.onload=ready
	*/
}

//протокласс
function Challenge() {
    
}

//корневой класс для устного счета
function MathChallenge(_limit) {
    
    var Combo = 0;
    var Points = 0;
    var Header = "Устный счет";
    var OldQuestion= "Здесь будет показан предыдущий вопрос.";
    var UID = createUUID();
    var Question = expression(0,0,'+');
    var limit = _limit;
    
    var elQuestion;
    var elIn;
    var elOldQuestion;
 
    
    function isNumber(n) {
      return !isNaN(parseInt(n)) && isFinite(n);
    };
    function getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    function createUUID()  {
        var s = [];      
        var hexDigits = "qwrtyuiopgabcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        //s[14] = "4";  
        //s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  
        //s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };
    
    //древовидная структура мат. выражения
    function expression(inFirstOperand, inSecondOperand, inOperator) {
        this.firstOperand = inFirstOperand;
        this.secondOperand = inSecondOperand;
        this.operator = inOperator;
        
        this.toString = function(){
            
          return this.firstOperand.toString() + ' ' + this.operator + ' ' + this.secondOperand.toString();
          
        };
        this.call = function(){
            var o1 = 0;
            var o2 = 0;
            
            if ( isNumber(this.firstOperand))
                o1 = parseInt(this.firstOperand);
            else 
                o1 = this.firstOperand.call();
            
            if ( isNumber(this.secondOperand))
                o2 = parseInt(this.secondOperand);
            else 
                o2 = this.secondOperand.call();
            
            if (this.operator === '+')
                return o1 + o2;
            if (this.operator === '*')
                return o1 * o2;
            if (this.operator === '-')
                return o1 - o2;
            if (this.operator === '/')
                return Math.floor(o1 / o2);
            
        };
        
    };
    function getRandomQuestion (){
        
        if (limit === undefined)
        {
            var firstOperandLimit = ({MIN : 1, MAX : getRandomInt(5, 1000)});
            var secondOperandLimit = ({MIN : 1, MAX : getRandomInt(5, 1000)});
            var operatorLimit = '+-*/';
            
            limit = ({firstOperandLimit : firstOperandLimit, secondOperandLimit:secondOperandLimit, operatorLimit:operatorLimit});
        }
        
        Question = getPrimitiveQuestion(limit.firstOperandLimit, limit.secondOperandLimit, limit.operatorLimit);
        return Question;

    };

    function getPrimitiveQuestion(firstOperandLimit, secondOperandLimit, operatorLimit){
        
        //firstOperandLimit ограничение на первый операнд. Структура из минимального и максимального значения. {MIN: x, MAX: X}
        //secondOperandLimit ограничение на второй операнд. Структура из минимального и максимального значения. {MIN: x, MAX: X}
        //operationLimit ограничение на оператор. Строка допустимых операторов "+-*/^!"
        
        var firstOperand = getRandomInt(firstOperandLimit.MIN, firstOperandLimit.MAX);
        var secondOperand = getRandomInt(secondOperandLimit.MIN, secondOperandLimit.MAX);
        var indexOperator = getRandomInt(1, 120)%operatorLimit.length;
        var operator = operatorLimit[indexOperator];
        
        if (firstOperandLimit.DIVISIBLE !== undefined)
        {
            firstOperand = firstOperand - firstOperand % firstOperandLimit.DIVISIBLE;
        }
        
        if (secondOperandLimit.DIVISIBLE !== undefined)
        {
            secondOperand = secondOperand - secondOperand % secondOperandLimit.DIVISIBLE;
        }

        return new expression(firstOperand, secondOperand, operator);
        
    };

    function getHeader(){
        var result = '<style> input{border:white; width:50px; height:20px;} .out-botton{color:green; text-align:center; padding:10px; cursor: pointer;} table{width:100%;} </style>';
        return result + '<h3>' + Header + '</h3> <div class="MathChallenge">';
    };

    function getQuestion(text){
        var result = ' <table><tr ><td style="padding: 5px 10px 5px 5px; ">';
        result += '<div  id = ' + 'Question_' + UID + '>' + text + '</div>';
        result += '</td><td style="padding: 5px 10px 5px 5px;">Ваш ответ:<input id = "' + 'In_' + UID + '" type="text"/></td></tr> </table>';
        return result;
    };

    function getEnd(){
        var result = '<div id = "' + 'OldQuestion_' + UID + '">' + OldQuestion + '</div>';
        result += '</div>';
        return result;
    };

    function refresh(){
        elOldQuestion.innerHTML = Question.toString() + " = " + Question.call() + " / ваш ответ " + elIn.value + ".";
        Question = getRandomQuestion();
        elQuestion.innerHTML = Question.toString();
        elIn.value = "";
    }
    
    function findElements(){
        elQuestion      = document.getElementById( 'Question_'    + UID);
        elIn            = document.getElementById( 'In_'          + UID);
        elOldQuestion   = document.getElementById( 'OldQuestion_' + UID);
        
        elIn.onchange = refresh;
    };

    this.RandomText = function(Header_text) {
        Header = Header_text;
        var randomQuestion = getRandomQuestion();
        var result =  getHeader();
        result += getQuestion(randomQuestion.toString());
        result += getEnd(OldQuestion);
        return result;
    };
    
    onReady(findElements);
    
};
function MathChallenge_limitFactory() {

    function getLimit(typeLimit){
        var firstOperandLimit;
        var secondOperandLimit;
        var operatorLimit;
        
        if (typeLimit === 'minus789')        {
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 7, MAX : 9});
            operatorLimit = '-';
        }
        if (typeLimit === 'multiply9')        {
            firstOperandLimit = ({MIN : 10, MAX : 100});
            secondOperandLimit = ({MIN : 9, MAX : 9});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply2')        {
            firstOperandLimit = ({MIN : 100, MAX : 10000});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply4')        {
            firstOperandLimit = ({MIN : 100, MAX : 5000});
            secondOperandLimit = ({MIN : 4, MAX : 4});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply8')        {
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 8, MAX : 8});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply5')        {
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 5, MAX : 5});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply25')        {
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 25, MAX : 25});
            operatorLimit = '*';
        }
        if (typeLimit === 'division2')        {
            var firstOperandLimit = ({MIN : 1, MAX : 10000, DIVISIBLE : 2});
            var secondOperandLimit = ({MIN : 2, MAX : 2});
            var operatorLimit = '/';
            
        }
        if (typeLimit === 'division4')        {
            firstOperandLimit = ({MIN : 100, MAX : 5000, DIVISIBLE : 4});
            secondOperandLimit = ({MIN : 4, MAX : 4});
            operatorLimit = '/';
        }
        if (typeLimit === 'division8')        {
            firstOperandLimit = ({MIN : 100, MAX : 1000, DIVISIBLE : 8});
            secondOperandLimit = ({MIN : 8, MAX : 8});
            operatorLimit = '/';
        }
        if (typeLimit === 'multiply19')        {
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 1, MAX : 9});
            operatorLimit = '*';
        }
        return ({firstOperandLimit : firstOperandLimit, secondOperandLimit:secondOperandLimit, operatorLimit:operatorLimit});
    }
    this.minus789 = getLimit('minus789');
    this.multiply9 = getLimit('multiply9');
    this.multiply2 = getLimit('multiply2');
    this.multiply4 = getLimit('multiply4');
    this.multiply8 = getLimit('multiply8');
    this.multiply5 = getLimit('multiply5');
    this.multiply25 = getLimit('multiply25');
    this.division2 = getLimit('division2');
    this.division4 = getLimit('division4');
    this.multiply19 = getLimit('multiply19');
    
    
};
