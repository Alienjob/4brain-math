function Challenge() {

    function isNumber(n) {
      return !isNaN(parseInt(n)) && isFinite(n);
    }

    function getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function createUUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
}
    
function MathChallenge() {
    
    MathChallenge.prototype = Challenge();
    
    //древовидная структура мат. выражения
    function expression(inFirstOperand, inSecondOperand, inOperator) {
        this.firstOperand = inFirstOperand;
        this.secondOperand = inSecondOperand;
        this.operator = inOperator;
        
        this.toString = function(){
            
          return firstOperand.toString() + ' ' + operator + ' ' + secondOperand.toString();
          
        };
        this.call = function(){
            var o1 = 0;
            var o2 = 0;
            
            if ( prototype.isNumber(firstOperand))
                o1 = parseInt(firstOperand);
            else 
                o1 = firstOperand.call();
            
            if ( prototype.isNumber(secondOperand))
                o1 = parseInt(secondOperand);
            else 
                o1 = secondOperand.call();
            
            if (operator === '+')
                return o1 + o2;
            if (operator === '*')
                return o1 * o2;
            if (operator === '-')
                return o1 - o2;
            if (operator === '/')
                return Math.floor(o1 / o2);
            
        };
        
    }
    
    //public
    this.Combo = 0;
    this.Points = 0;
    this.Header = "Устный счет";
    this.OldQuestion= "Здесь будет показан предыдущий вопрос.";
    this.UID = this.createUUID();
    
    function getRandomQuestion(){
        
        return getPrimitiveQuestion({MIN : 1, MAX : this.prototype.getRandomInt(5, 1000)}, {MIN : 1, MAX : this.prototype.getRandomInt(5, 1000)}, '+-*/');

    }

    function getPrimitiveQuestion(firstOperandLimit, secondOperandLimit, operatorLimit){
        
        //firstOperandLimit ограничение на первый операнд. Структура из минимального и максимального значения. {MIN: x, MAX: X}
        //secondOperandLimit ограничение на второй операнд. Структура из минимального и максимального значения. {MIN: x, MAX: X}
        //operationLimit ограничение на оператор. Строка допустимых операторов "+-*/^!"
        
        var firstOperand = getRandomInt(firstOperandLimit.MIN, firstOperandLimit.MAX);
        var secondOperand = getRandomInt(secondOperandLimit.MIN, secondOperandLimit.MAX);
        var indexOperator = getRandomInt(1, 120)%operatorLimit.length;
        var operator = operatorLimit[indexOperator];
        
        return new expression(firstOperand, secondOperand, operator);
        
    }

    function getHeader(){
        var result = '<style> input{border:white; width:50px; height:20px;} .out-botton{color:green; text-align:center; padding:10px; cursor: pointer;} table{width:100%;} </style>';
        return result + '<h3>' + this.Header + '</h3> <div class="MathChallenge">';
    }

    function getQuestion(text){
        var result = ' <table><tr ><td style="padding: 5px 10px 5px 5px; ">';
        result += text;
        result += '</td><td style="padding: 5px 10px 5px 5px;">Ваш ответ:<input type="text"/></td></tr> </table>';
        return result;
    }

    function getEnd(Comment_text){
        var result = Comment_text;
        result += '</div>';
        return result;
    }

    this.RandomText = function() {
        var randomQuestion = getRandomQuestion();
        var result =  getHeader();
        result += getQuestion(randomQuestion.toString());
        result += getEnd('');
        return result;
    };
    
}




function HelloWorld() {
   return 'Hello, World!';
}





