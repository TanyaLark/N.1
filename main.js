
Vue.createApp({
    data() {
        return {
             //const inputINN = 3174803737;//3463463460;//2063463479;
            InnCode: '',
            info: '',
            validation: true
        }
    },
    methods: {

            parseINN() {
 
                if (this.InnCode.length == 10 ){

                    let inn = this.InnCode
                    .toString() // Преобразование в строку, на случай если код был передан числом.
                    .replaceAll(' ', '') // Очистка от пробелов (не лучший вариант).
                    .split('')
                    .map(i => +i) // Преобразуем все цифры из строк в числа.
                    .filter(item => !isNaN(item)); // Все НЕ цифры после преобразования станут NaN'ами, и тут мы их фильтруем. Т.е. если пользователь введёт случайно буквы, мы очистим от них введённую строку. 

                    let coefficients = [-1, 5, 7, 9, 4, 6, 10, 5, 7]; // Коэфициенты. 

                    let controlSum = coefficients.reduce((acc, item, i) => acc + item * inn[i], 0); // Находим контрольную сумму, перемножая соответствующие элементы массива с цифрами ИНН'а и коэфициентами, и суммируем полученные произведения. 
                    // В соответствии с Х = А*(-1) + Б*5 + В*7 + Г*9 + Ґ*4 + Д*6 + Е*10 + Є*5 + Ж*7.

                    controlSum = (controlSum % 11) % 10; // В соответствии с З = MOD(MOD(X;11);10).

                    const resultObject = { // Подготовим объект для возврата результатов.
                        code: inn.join(''),
                        isCorrect: controlSum === inn[inn.length - 1] // Установим флаг корректности.
                    }

                    if (resultObject.isCorrect) {
                        resultObject.sex = inn[inn.length - 2] % 2 === 0 ? 'женский' : 'мужской'; // Если код корректен, то определяем пол.

                        // Первые пять цифр кодируют дату рождения владельца номера — как правило, это пятизначное число представляет 
                        // собой количество дней от 31 декабря 1899   года до даты рождения человека.

                        let INNdays = +resultObject.code
                            .slice(0, 5);//к-во дней от 31.12.1899 до даты рождения пользователя
                        let result = new Date(1900, 0, INNdays);
                        let year = result.getUTCFullYear();
                        let month = 1 + result.getUTCMonth();
                        let day = 1 + result.getUTCDate();

                        let today = new Date();//текущая дата
                        let currentMonth = 1 + today.getUTCMonth();
                        let currentDay = today.getUTCDate();

                        let fullYearsNum;//сколько полных лет человеку
                        if (month > currentMonth){
                            fullYearsNum = today.getUTCFullYear() - year - 1;
                        } else if (month === currentMonth){
                            if(day > currentDay){
                                fullYearsNum = today.getUTCFullYear() - year - 1;
                            }else{
                                fullYearsNum = today.getUTCFullYear() - year;
                            }
                        }else{
                            fullYearsNum = today.getUTCFullYear() - year;
                        }

                        if (month < 10) { //формируем строку для вывода даты рождения 
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        let dateOfBirthString = `${year}-${month}-${day}`; // дата рождения

                        resultObject.dateOfBirth = dateOfBirthString;
                        resultObject.fullYears = `${fullYearsNum}`;

                        //Знак зодиака
                        function getZodiac(month, day){
                            //bound is zero indexed and returns the day of month where the boundary occurs
                            //ie. bound[0] = 20; means January 20th is the boundary for a zodiac sign
                            var bound = [20,19,20,20,20,21,22,22,21,22,21,21];
                            //startMonth is zero indexed and returns the zodiac sign of the start of that month
                            //ie. startMonth[0] = "Capricorn"; means start of January is Zodiac Sign "Capricorn"
                            var startMonth = ["Козерог","Водолей","Рыбы","Овен","Телец","Близнецы",
                                              "Рак ","Лев","Дева","Весы","Скорпион","Стрелец"];
                            monthIndex = month-1; //so we can use zero indexed arrays
                            if (day <= bound[monthIndex]){ //it's start of month -- before or equal to bound date
                                signMonthIndex = monthIndex;
                            }else{ //it must be later than bound, we use the next month's startMonth
                                signMonthIndex = (monthIndex+1) % 12; //mod 12 to loop around to January index.
                            }
                            return startMonth[signMonthIndex]; //return the Zodiac sign of start Of that month.
                        }

                        resultObject.zodiac = getZodiac(month,day);

                        // animal in the chinese calendar

                        switch ((year - 4) % 12) {
                            case 0:
                                resultObject.chineseCalendar = 'Крыса';
                                break;
                    
                            case 1:
                                resultObject.chineseCalendar = 'Бык';
                                break;
                    
                            case 2:
                                resultObject.chineseCalendar = 'Тигр';
                                break;
                    
                            case 3:
                                resultObject.chineseCalendar = 'Кролик';
                                break;
                    
                            case 4:
                                resultObject.chineseCalendar = 'Дракон';
                                break;
                    
                            case 5:
                                resultObject.chineseCalendar = 'Змея';
                                break;
                    
                            case 6:
                                resultObject.chineseCalendar = 'Лошадь';
                                break;
                    
                            case 7:
                                resultObject.chineseCalendar = 'Овца';
                                break;
                    
                            case 8:
                                resultObject.chineseCalendar = 'Обезьяна';
                                break;
                    
                            case 9:
                                resultObject.chineseCalendar = 'Петух';
                                break;
                    
                            case 10:
                                resultObject.chineseCalendar = 'Собака';
                                break;
                    
                            case 11:
                                resultObject.chineseCalendar = 'Свинья';
                                break;
                    
                        }

                        resultObject.isCorrect = 'Корректен'
                    }else{
                        resultObject.isCorrect = 'Не корректен'
                    } 
                    
                    this.info = resultObject;
                    return resultObject;

                } else {
                    
                   this.validation = false;
                    
                }
           
        }
    }
}).mount('#app')
