'use strict';

let today = new Date;

let myDate = new Date;

const date = document.querySelector('.date-mover > p'), //дата в DOM
    calendarTable = document.querySelector('.main > div'), //div для календаря
    createButton = document.querySelectorAll('.event-edit > button')[0],
    refreshButton = document.querySelectorAll('.event-edit > button')[1],
    searchPanel = document.getElementsByClassName('search-panel')[0],
    monthUpButton = document.getElementsByClassName('date-mover-button')[1],
    monthDownButton = document.getElementsByClassName('date-mover-button')[0],
    todayButton = document.getElementsByClassName('today-button')[0];

let table = document.createElement('table');

table.className = "month-table";

let dateForTable = new Date(today.getFullYear(), today.getMonth());
console.log(dateForTable);

const firstDay = new Date(today.getFullYear(), today.getMonth(), 1); //первый день месяца
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);//последний день месяца

/*today.setMonth(today.getMonth() + 2);
console.log(today);*/


createTable(myDate);


// создаем обработчики событий для кнопок листания месяцев

monthUpButton.addEventListener('click', moveMonthUp);
monthDownButton.addEventListener('click', moveMonthDown);

//Создаем функции для листания месяцев

function moveMonthUp() {

    //Нужно:
    //Проверить переменную myDate на пустоту. Если пустая, установить на текущую дату

    if(myDate == null) {
        myDate = new Date();
    }

    let firstMonthDay = getFirstDayOfMonth(myDate);
    console.log(firstMonthDay.getMonth() + 1 );
    let nextMonthFirstDay = firstMonthDay.setMonth(firstMonthDay.getMonth() + 1);
    console.log(new Date(nextMonthFirstDay));


    table.innerHTML = "";

    createTable(getRowsNumber(nextMonthFirstDay));

    console.log(myDate);

    date.innerHTML = `${capitalizeFirstLetter(myDate.toLocaleString('ru-ru',
 { month: 'long' }))} ${myDate.getFullYear()}`;

    




    /*today.setMonth(today.getMonth() + 1);
    table.innerHTML = "";
    createTable(getRowsNumber(today));
    console.log(today);*/
}

function moveMonthDown() {
    /*today.setMonth(today.getMonth() - 1);
    console.log(today);*/
}

function showThisMonthTable() {
    table.innerHTML = "";
    createTable(getRowsNumber(today));
    date.innerHTML = `${capitalizeFirstLetter(myDate.toLocaleString('ru-ru',
 { month: 'long' }))} ${myDate.getFullYear()}`;
}


function getFirstDayOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1); //первый день месяца
    console.log(firstDay.getDay());//получаем порядковый номер дня недели,
                                // на который выпадает первое число месяца (воскресенье - 0).
    return firstDay;
}


 
// создаем div для размещения таблицы и таблицу

calendarTable.appendChild(table);

// код для получения первого и последнего дня месяца

console.log(firstDay.getDay());//получаем порядковый номер дня недели,
                                // на который выпадает первое число месяца (воскресенье - 0).

console.log(lastDay.getDay());//число последнего дня месяца

//функция, определяющая количество строк таблицы для отрисовки выбранного месяца

function getRowsNumber(date){
    let cellsQuantity = ((firstDay.getDay() + lastDay.getDate())-1);
    if((cellsQuantity % 7) > 0){
        return Math.floor((cellsQuantity/7) + 1)
    } else {
        return (cellsQuantity/7)
    }
}

function createCellDates(counter, date){
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0);
    if (counter < firstDay.getDay()){
        return(prevMonthLastDate.getDate() - firstDay.getDay() + counter + 1);
    }
    else if((counter - firstDay.getDay() + 1) > lastDay) {
        return((counter - firstDay.getDay() + 1) - lastDay);
    }
    else {
        return (counter - firstDay.getDay() + 1);
    }
}

/*function createTable(rowsNumber) {
    let count = 1; 
    for (let i = 0; i < rowsNumber; i++){
        let tr = document.createElement('tr');//создали строку
        table.appendChild(tr);
        let lastRow = table.lastChild;
        for (let j = 0; j < 7; j++){
            let td = document.createElement('td');//создали ячейку
            td.innerHTML = createCellDates(count, today);
            lastRow.appendChild(td);
            count++
        }
    }
}*/

//createTable(getRowsNumber(today));

function createTable(myDate){
    //Находим дату для старта отрисовки таблицы
let firstMonthDate = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
let firstDateIndex = firstMonthDate.getDay();
let fisrstTableDate = new Date(firstMonthDate.setDate(firstMonthDate.getDate() - firstDateIndex + 1));

console.log('fisrstTableDate = ', fisrstTableDate);//Готово!

function renderTableDate(date, count, target){
    if(count < 7){
        target.innerHTML = `${capitalizeFirstLetter(date.toLocaleString('ru-ru', {  weekday: 'long' }))}, ${date.getDate()}`;
    }else{
        target.innerHTML = date.getDate();
    }
}

//Выводим текущий месяц в блоке nav
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

date.innerHTML = `${capitalizeFirstLetter(myDate.toLocaleString('ru-ru',
 { month: 'long' }))} ${myDate.getFullYear()}`;


//
//Для увеличения даты на 1 день:
//
//firstMonthDate.setDate(firstMonthDate.getDate() + 1)
//
//Для уменьшения даты на 1 день:
//firstMonthDate.setDate(firstMonthDate.getDate() - 1)
//;
//Получаем последний день месяца
let lastMonthDate = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
console.log('lastMonthDate = ', lastMonthDate);
//Получаем максимальное количество ячеек таблицы для месяца
let maxCellsQuantity = () => {
    let cellsQuantity = (firstDateIndex + lastMonthDate.getDate() - 1);
    if ((cellsQuantity % 7) === 0) {
        return(cellsQuantity);
    } else {
        return ((cellsQuantity + 7) - (cellsQuantity % 7));
    }
};

let tr = document.createElement('tr');//создали строку
let beforeFisrstTableDate = new Date(fisrstTableDate.setDate(fisrstTableDate.getDate()-1));

for (let i = 0; i < maxCellsQuantity(); i++) {
    if (i % 7 !== 0) {
        beforeFisrstTableDate.setDate(beforeFisrstTableDate.getDate() + 1);
        let td = document.createElement('td');
        table.lastChild.appendChild(td);
        renderTableDate(beforeFisrstTableDate, i, td);
        
    } else {
        beforeFisrstTableDate.setDate(beforeFisrstTableDate.getDate() + 1); 
        let tr = document.createElement('tr');
        table.appendChild(tr);
        let td = document.createElement('td');
        table.lastChild.appendChild(td);
        renderTableDate(beforeFisrstTableDate, i, td);
    }
}

//console.log(table);
}

