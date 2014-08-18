function Zadacha() {
 
    //public
    this.QuestionTypeEnum = Object.freeze({S100010_10: 0, S100010_6: 1});
    
    this.RandomText = function(QuestionType) {
        randomQuestion = getRandomQuestion(QuestionType);
        result =  Zadacha_Header();
        result += Zadacha_Question(randomQuestion.Question);
        result += Zadacha_Answer(randomQuestion.Answer);
        result += Zadacha_End('Если вы решили задачу правильно и быстро, то вы смогли сконцентрироваться на цифрах и избежали соблазна получить красивый ответ. Именно такой подход нужен для устного счета.');
        return result;
    };
    
    function getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomQuestion(typeQuestion){
        result = Object( {Question:'Вопрос', Answer:'Ответ'});
        if (typeQuestion === 0)
                return getRandomQuestion_S100010(5);
        if (typeQuestion === 1)
                return getRandomQuestion_S100010(3);
    }
    
    function getRandomQuestion_S100010(Count2){
        var NumberList = new Array(Count2*2);
        var Answer = 0;
        for(var i=0; i<Count2*2; i++)
            NumberList[i] = Object( {ZNAK: '+', X: getRandomInt(1, 9)});
        for(var i=0; i<Count2; i++)
            for(var j=0; j<2; j++)
            {
                NumberList[i*2 + j].X *= j*1000 + (1-j)*10;
                Answer += NumberList[i*2 + j].X;
            }
        return Object({Question: PrintOuestion(NumberList), Answer: Answer});
    }

    function PrintOuestion(NumberList){
        result = '';
        for (var i = 0; i<NumberList.length; i++) {
            if ( (result !== '')||(NumberList[i].ZNAK === '-')) 
                result += ' ' + NumberList[i].ZNAK;
            result +=  ' ' + NumberList[i].X;
        }
        return result;
    }

    function Zadacha_Header(){
        result = '<style> input{border:white; width:50px; height:20px;} .out-botton{color:green; text-align:center; padding:10px; cursor: pointer;} table{width:100%;} </style>';
        return result + '<h3>Задача 1</h3> <div class="zadacha">';
    }

    function Zadacha_Question(text){
        result = ' <table><tr ><td style="padding: 5px 10px 5px 5px; ">';
        result += text;
        result += '</td><td style="padding: 5px 10px 5px 5px;">Ваш ответ:<input type="text"/></td></tr> </table>';
        return result;
    }
    function Zadacha_Answer(text){
        result = '<div class="out-botton">Проверьте свое решение →</div> <div style="display: none;  color:DimGray; margin: 10px; border-top:2px groove silver;"><b>Ответ: ';
        result += text;
        result += '. </b></div>';
        return result;
    }

    function Zadacha_End(Comment_text){
        result = Comment_text;
        result += '</div>';
        return result;
    }
}




function HelloWorld() {
   return 'Hello, World!';
}





