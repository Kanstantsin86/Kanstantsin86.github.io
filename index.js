'use strict';

const date = document.querySelector('.date-mover > p'),
    calendarTable = document.querySelector('.main > div'),
    createButton = document.querySelectorAll('.event-edit > button')[0],
    refreshButton = document.querySelectorAll('.event-edit > button')[1],
    searchPanel = document.getElementsByClassName('search-panel')[0],
    monthUpButton = document.getElementsByClassName('date-mover-button')[1],
    monthDownButton = document.getElementsByClassName('date-mover-button')[0],
    todayButton = document.getElementsByClassName('today-button')[0],
    dateMover = document.getElementsByClassName('date-mover')[0],
    createElementForm = document.getElementsByClassName('create-element-form')[0],
    createElementShortForm = document.getElementsByClassName('create-element-short-form')[0];

let table = document.createElement('table');
table.className = "month-table";

createButton.addEventListener('click', () => {
    createElementShortForm.classList.toggle('hidden');
    createElementShortForm.style.position = 'absolute';
    createElementShortForm.style.top = '120px';
    createElementShortForm.style.display = 'flex';
    createElementShortForm.style.flexDirection = 'column';/*flex-direction: column;*/
})

calendarTable.addEventListener('click', () => {
    createElementForm.classList.toggle('hidden');
    //createElementForm.classList.style.position = 'absolute';
})

// создаем обработчики событий для кнопок листания месяцев

dateMover.addEventListener('click', moveMonth);

//Создаем функции для листания месяцев

const mover = {
    myDate: new Date
}

createTable(mover.myDate);

function moveMonth(e) {
    let nextMonthFirstDay = new Date(mover.myDate.getFullYear(), mover.myDate.getMonth(), 1);
    nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + 1);
    let previousMonthLastDay = new Date(mover.myDate.getFullYear(), mover.myDate.getMonth(), 0);

    if(e.target === monthUpButton) {
        mover.myDate = new Date(nextMonthFirstDay);
        createTable(mover.myDate)
    }else if(e.target === monthDownButton) {
        mover.myDate = new Date(previousMonthLastDay);
        createTable(mover.myDate)
    }else if(e.target === todayButton) {
        mover.myDate = new Date;
        createTable(mover.myDate)
    }else {
        return;
    }
}

// Создаем div для размещения таблицы и таблицу

calendarTable.appendChild(table);

// Код для получения первого и последнего дня месяца

function createTable(myDate){

    table.innerHTML = '';

    if(myDate == null){
        myDate = new Date;
    }
    // Находим дату для старта отрисовки таблицы
    let firstMonthDate = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    let firstDateIndex = firstMonthDate.getDay();
    let fisrstTableDate = new Date(firstMonthDate.setDate(firstMonthDate.getDate() - firstDateIndex + 1));

    function renderTableDate(date, count, target){

        let todayDate = new Date;

        if((date.getFullYear() == todayDate.getFullYear())&&
        (date.getMonth() == todayDate.getMonth())&&
        (date.getDate() == todayDate.getDate())){
            target.className = "today-date";
        }
        if(count < 7){
            target.innerHTML = `${capitalizeFirstLetter(date.toLocaleString('ru-ru', {  weekday: 'long' }))}, ${date.getDate()}`;
        }else{
            target.innerHTML = date.getDate();
        }
    }

// Выводим текущий месяц в блоке nav
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    date.innerHTML = `${capitalizeFirstLetter(myDate.toLocaleString('ru-ru',
        { month: 'long' }))} ${myDate.getFullYear()}`;

// Получаем последний день месяца
    let lastMonthDate = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);

// Получаем максимальное количество ячеек таблицы для месяца
    let maxCellsQuantity = () => {
        let cellsQuantity = (firstDateIndex + lastMonthDate.getDate() - 1);
        if ((cellsQuantity % 7) === 0) {
            return(cellsQuantity);
        } else {
            return ((cellsQuantity + 7) - (cellsQuantity % 7));
        }
    };

    let tr = document.createElement('tr');
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
}

