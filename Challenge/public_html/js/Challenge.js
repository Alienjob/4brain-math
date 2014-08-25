
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

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) { 
  	options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];    
    if (propValue !== true) { 
      updatedCookie += "=" + propValue;
     }
  }

  document.cookie = updatedCookie;
}

//протокласс
function Challenge() {
    
}

//корневой класс для устного счета
function MathChallenge(_limit) {
    
    var MAXSCORE = 100;
    var delayLimit = 30000;
    
    var Combo = 0;
    var Score = 0;
    var bonus = 0;
    var lastTime = new Date(1000);
    var flDisabled = false;
    
    var Header = "Устный счет";
    var OldQuestion= "Здесь будет показан предыдущий вопрос.";
    var UID = createUUID();
    var Question = expression(0,0,'+');
    var limit = _limit;
    
    var elQuestion;
    var elIn;
    var elOldQuestion;
    var elChallenge;
    var elScore;
    var elCombo;
    var comboFlags;
    
    var elComboBar;
    var comboBar;
 
    function comboBar(){
        result =  '<style type="text/css">\n\
                my_progress_bar_wrapper {\n\
                    border: 1px solid #000000;\n\
                }\n\
            </style>\n\
            \n\
            <div  style="width: 20; height: 20; margin: 0px auto;">\n\
                <div  class = "Challenge_Combo_Bar" id="Combo_Bar_' + UID + '" style="position: relative; top: 45%; margin: 0px auto;"></div>\n\
            </div>';
            /*    
            var timerId = null;
            timerId = window.setInterval(function() {
                    //myProgressBar.animationSmoothness = ProgressBar.AnimationSmoothness.Smooth1;

                    if (myProgressBar.value >= myProgressBar.maxValue){
                            myProgressBar.setValue(0);
                    } else {
                            myProgressBar.setValue(myProgressBar.value + 20);
                    }

            },
            100);
            */
           return result;
    }

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
            if (this.operator === '^')
                return Math.pow(o1, o2);
            
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
        //Можно указать обязательную кратность - DIVISIBLE
        //Можно указать цифры, которые будут дописаны к операнду - SUFFIX
        //operationLimit ограничение на оператор. Строка допустимых операторов "+-*/^!"
        
        var firstOperand = getRandomInt(firstOperandLimit.MIN, firstOperandLimit.MAX);
        var secondOperand = getRandomInt(secondOperandLimit.MIN, secondOperandLimit.MAX);
        var indexOperator = getRandomInt(1, 120)%operatorLimit.length;
        var operator = operatorLimit[indexOperator];
        
        if (firstOperandLimit.DIVISIBLE !== undefined){
            firstOperand = firstOperand - firstOperand % firstOperandLimit.DIVISIBLE;
        }
        if (secondOperandLimit.DIVISIBLE !== undefined){
            secondOperand = secondOperand - secondOperand % secondOperandLimit.DIVISIBLE;
        }

        if (firstOperandLimit.SUFFIX !== undefined){
            firstOperand = +(firstOperand.toString() + firstOperandLimit.SUFFIX.toString());
        }
        if (secondOperandLimit.SUFFIX !== undefined){
            secondOperand = +(secondOperand.toString() + secondOperandLimit.SUFFIX.toString());
        }

        return new expression(firstOperand, secondOperand, operator);
        
    };

    function getScore(){
        var result = ' <SPAN class = "Challenge_Score" id = Score_' + UID +' > ';
        result+= Score;
        result+='</SPAN>';
        return result;
    };

    function getCombo(){
        return comboBar();
    };

    function getHeader(){
        var result = ' <div id = Challenge_' + UID + ' class="Challenge_Math"><style> input{border:white; width:50px; height:20px;} .out-botton{color:green; text-align:center; padding:10px; cursor: pointer;} table{width:100%;} </style>';
        return result + '<table><td width = "40%"><h3>Устный счет.' + Header+ '</h3></td><td  width = "20%" align="right" >' + getCombo()+'</td><td  width = "10%" align="right" ><h3>' + getScore() +'</h3></td></table>' ;
    };

    function getQuestion(text){
        var result = ' <table class = "Challenge_Question_Table" ><tr ><td style="padding: 5px 10px 5px 5px; ">';
        result += '<div  class = "Challenge_Question"  id = ' + 'Question_' + UID + '>' + text + '</div>';
        result += '</td><td align="right"  style="padding: 5px 10px 5px 5px;"><SPAN  class = "Challenge_Answer_Text"> Введите ответ и нажмите Enter:</SPAN><input class = "Challenge_Answer" id = "' + 'In_' + UID + '" type="text"/></td></tr> </table>';
        return result;
    };

    function getEnd(){
        var result = '<div  class = "Challenge_Old_Question" id = "' + 'OldQuestion_' + UID + '">' + OldQuestion + '</div>';
        result += '</div>';
        return result;
    };
    function verifyAnswer(){
        var currentTime = new Date();
        var delay = currentTime - lastTime;
        lastTime = currentTime;
        
        var rightAnswer = Question.call();
        var currentAnswer = +elIn.value;
        
        if (rightAnswer === currentAnswer){
            elChallenge.style.backgroundColor = '#F0FFF0';
            if (delay < delayLimit)
                Combo += 1;
            else
                Combo = 0;
            bonus = 1 + Combo * 2; 
            Score += bonus;
        }
        else{
            elChallenge.style.backgroundColor = '#FFF5EE';
            Combo = 0;
            bonus = 0;
        }
        if (Combo === 10)
            alert('поздравляем, вы отлично справились с упражнением ' + Header);
        
        if (Score > 100)
            disable();
        
        setCookie(Header, Score, 20*60*60*1000); // сохраняем результат на 20 часов, 
                                                  // чтобы на следующий день можно было в этоже время снова тренироваться 
        
    }
    function disable(){
        elIn.disabled = true;
        elQuestion.innerHTML = 'Вы достаточно упражнялись в ' + Header + ' сегодня.';
    }
    function refreshScore(){
        if (bonus > 0)
            elScore.innerHTML = Score + '(+' + bonus + ')';
        else
            elScore.innerHTML = Score;
            
        if (Score > MAXSCORE)
            flDisabled = true;
        comboBar.labelText = Score + '(+' + bonus + ')';
        comboBar.setValue(200/10*Combo);
    }
    function refresh(){
        verifyAnswer();
        refreshScore();
        elOldQuestion.innerHTML = Question.toString() + " = " + Question.call() + " / ваш ответ " + elIn.value + ".";
        Question = getRandomQuestion();
        elQuestion.innerHTML = Question.toString();
        elIn.value = "";
        if (flDisabled)
            disable();

    }
    
    function findScore(){
        elScore         = document.getElementById( 'Score_'    + UID);
        
        elComboBar         = document.getElementById( 'Combo_Bar_' + UID);
        elComboBar.style.position = 'inline-block';
        
        comboBar = new ProgressBar('Combo_Bar_' + UID ,{
                borderRadius: 10,
                width: 200,
                height: 20,
                value: 0,
                maxValue: 200,
                showLabel: false,
                extraClassName: {
                        wrapper: 'my_progress_bar_wrapper'
                },
                orientation: ProgressBar.Orientation.Horizontal,
                direction: ProgressBar.Direction.LeftToRight,
                animationInterval: 50,
                imageUrl: 'images/h_fg202.png',
                backgroundUrl: 'images/h_bg3.png'
            });

    };

    function findElements(){

        elQuestion      = document.getElementById( 'Question_'    + UID);
        elIn            = document.getElementById( 'In_'          + UID);
        elOldQuestion   = document.getElementById( 'OldQuestion_' + UID);
        elChallenge     = document.getElementById( 'Challenge_'   + UID);
        findScore();
        
        elIn.onchange = refresh;
        
        if (Score > 0)
            elChallenge.style.backgroundColor = '#F0FFF0';
        if (flDisabled)
            disable();
            
    };

    this.RandomText = function(Header_text) {
        Header = Header_text;

        var cookie = getCookie(Header);
        if (cookie !== undefined)
            if (+cookie > 0){
                Score = +cookie;
            if (Score > MAXSCORE)
                flDisabled = true;
            }
        
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
            firstOperandLimit = ({MIN : 100, MAX : 1000, DIVISIBLE : 2});
            secondOperandLimit = ({MIN : 5, MAX : 5});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply25')        {
            firstOperandLimit = ({MIN : 100, MAX : 1000, DIVISIBLE : 4});
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
        if (typeLimit === 'multiplyXX')        {
            firstOperandLimit = ({MIN : 20, MAX : 100});
            secondOperandLimit = ({MIN : 20, MAX : 100});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply11')        {
            firstOperandLimit = ({MIN : 20, MAX : 100});
            secondOperandLimit = ({MIN : 11, MAX : 11});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiplyXXX11')        {
            firstOperandLimit = ({MIN : 200, MAX : 1000});
            secondOperandLimit = ({MIN : 11, MAX : 11});
            operatorLimit = '*';
        }
        if (typeLimit === 'squareX')        {
            firstOperandLimit = ({MIN : 2, MAX : 9});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
        }
        if (typeLimit === 'squareXX')        {
            firstOperandLimit = ({MIN : 10, MAX : 99});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
        }
        if (typeLimit === 'squareXXX')        {
            firstOperandLimit = ({MIN : 100, MAX : 999});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
        }
        if (typeLimit === 'squareX5')        {
            firstOperandLimit = ({MIN : 1, MAX : 9, SUFFIX : 5});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
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
    this.multiplyXX = getLimit('multiplyXX');
    this.multiply11 = getLimit('multiply11');
    this.multiplyXXX11 = getLimit('multiplyXXX11');
    this.multiply25 = getLimit('multiply25');
    this.squareX = getLimit('squareX');
    this.squareXX = getLimit('squareXX');
    this.squareXXX = getLimit('squareXXX');
    this.squareX5 = getLimit('squareX5');
    
    
};
