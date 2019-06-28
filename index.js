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
    createSubmitWrapper = document.getElementsByClassName('create-submit-wrapper')[0],
    doneInput = document.querySelectorAll('.create-submit-wrapper > input')[0],
    deleteInput = document.querySelectorAll('.create-submit-wrapper > input')[1],
    dateInput = createElementForm.getElementsByTagName('input')[1],
    hiddenDateInput = createElementForm.getElementsByTagName('input')[3],

    createElementShortForm = document.getElementsByClassName('create-element-short-form')[0],
    shortFormTextField = createElementShortForm.getElementsByTagName('input')[0],
    shortFormCreateInput = createElementShortForm.getElementsByTagName('input')[1],

    editElementForm = document.getElementsByClassName('edit-element-form')[0],
    editSubmitWrapper = document.getElementsByClassName('edit-submit-wrapper')[0],
    editFormIsReadyButton = editElementForm.querySelectorAll('.edit-submit-wrapper > input')[0],
    editFormDeleteButton = editElementForm.querySelectorAll('.edit-submit-wrapper > input')[1],
    
    foundTasksListWrapper = document.getElementsByClassName('found-tasks-list-wrapper')[0];

// Создаем таблицу для отрисовки месяца
let table = document.createElement('table');

// Создаем функцию для преобразования даты

function returnMonthDay(numericDate){
    const date = new Date(null);
    date.setMilliseconds(numericDate);
    return date.toLocaleString('ru', {
        month: 'long', 
        day: 'numeric'
    });
}

function storageItemParse(i){
    return JSON.parse(localStorage.getItem(localStorage.key(i)));
}

function closeAndClearDivs(){
    createElementForm.classList.add('hidden');
    createElementShortForm.classList.add('hidden');
    editElementForm.classList.add('hidden');
    createFormClear();
    shortFormTextField.value = null;
    foundTasksListWrapper.classList.add('hidden');
    searchPanel.value = '';
}

// Отображаем/прячем форму быстрого добавления события
createButton.addEventListener('click', () => {
    closeAndClearDivs();
    createElementShortForm.classList.toggle('hidden');
    positionAt(createButton, "bottom", createElementShortForm);
});

// Функция для заполнения данными формы редактирования
function fillOutTheEditForm(tableCell){
    const cellDate = new Date(null);

    const editElementHeader = document.getElementsByClassName('edit-element-header')[0],
        editElementDate = document.getElementsByClassName('edit-element-date')[0],
        editElementMembers = document.getElementsByClassName('edit-element-members')[0],
        editElementDescription = document.getElementsByClassName('edit-element-description')[0];

    cellDate.setMilliseconds(tableCell.querySelector('p.hidden').innerHTML);

    const task = JSON.parse(localStorage.getItem(cellDate));
    editElementHeader.innerText = task.task;
    editElementDate.innerText = cellDate.toLocaleString('ru', {
        month: 'long', 
        day: 'numeric'
    });
    editElementMembers.innerText = task.names;
    editElementDescription.innerText = task.description;

    editElementDescription.addEventListener('input', () => {
        editFormIsReadyButton.classList.add('active');
    });

    editSubmitWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        if ((e.target === editFormIsReadyButton)||(editFormIsReadyButton.classList.contains('active'))) {
            localStorage.setItem(cellDate, 
                `{
                    "task": "${task.task}",
                    "date": "${task.date}",
                    "names": "${task.names}",
                    "description": "${editElementDescription.value}"
                }`
            );
            editFormIsReadyButton.classList.remove('active');
            createTable(cellDate);
        } else if (e.target === editFormDeleteButton) {
            localStorage.removeItem(cellDate);
            createTable(cellDate);
        };
        editElementForm.classList.toggle('hidden');
    });
}



function getTdDate(tableCell){
    const date = new Date(null);
    date.setMilliseconds(tableCell.getElementsByClassName('hidden')[0].innerHTML);
    return date;
}

// Функция для заполнения данными формы создания
function fillOutTheCreateForm(tableCell){

    const tdDate = getTdDate(tableCell);
    dateInput.value =
        tdDate.toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    hiddenDateInput.value = +tdDate;
}

function createFormClear(){
        createElementForm.getElementsByTagName('input')[0].value = null;
        createElementForm.getElementsByTagName('input')[2].value = null;
        createElementForm.getElementsByTagName('textarea')[0].value = null;
        createElementForm.getElementsByTagName('input')[3].value = null;
        editFormIsReadyButton.classList.remove('active');
}

createSubmitWrapper.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target === doneInput) {
        const taskInputValue = createElementForm.getElementsByTagName('input')[0].value,
            namesInputValue = createElementForm.getElementsByTagName('input')[2].value,
            descriptionInputValue = createElementForm.getElementsByTagName('textarea')[0].value,
            date = createElementForm.getElementsByTagName('input')[3].value,
            tdDate = new Date(null);
            tdDate.setMilliseconds(date);
        if(taskInputValue.trim() === ""){
            createFormClear();
            createElementForm.classList.toggle('hidden');
            return;
        }else{
            localStorageItemSet(tdDate, descriptionInputValue, taskInputValue, namesInputValue);
            createFormClear();
            editFormIsReadyButton.classList.remove('active');
            createTable(tdDate);
        }
    }
    createElementForm.classList.toggle('hidden');
});

// Функция для позиционирования форм
function positionAt(anchor, position, elem) {
    let anchorCoords = anchor.getBoundingClientRect();

    switch (position) {
      /*case "top":
        elem.style.left = anchorCoords.left + "px";
        elem.style.top = anchorCoords.top - elem.offsetHeight + "px";
        break;*/

      case "right":
        elem.style.left = anchorCoords.left + anchor.offsetWidth + 10 + "px";
        elem.style.top = anchorCoords.top - 20 + "px";
        break;

        case "bottom":
            elem.style.left = anchorCoords.left + "px";
            elem.style.top = anchorCoords.top + anchor.offsetHeight + 16 + "px";
            break;

      /*case "left":
        elem.style.left = anchorCoords.right - anchor.offsetWidth - 10 + "px";
        elem.style.top = anchorCoords.top + anchor.offsetHeight + "px";
        break;*/

    }
}

// Выбираем, какое из форм открывать при клике на таблице
calendarTable.addEventListener('click', (e) => {
    closeAndClearDivs();
    if (e.target.tagName === "TD") {

        createElementForm.style.cssText = `
        z-index: 2;
        position: absolute;
        `;
        positionAt(e.target, "right", createElementForm); 

        editElementForm.style.cssText = `
        z-index: 2;
        position: absolute;
        `;
        positionAt(e.target.parentElement, "right", editElementForm);

        if (e.target.lastElementChild.classList.contains('hidden')) {
            if (editElementForm.classList.contains('hidden')) {
                fillOutTheCreateForm(e.target);
                createElementForm.classList.toggle('hidden');              
            }
        } else {
            if (createElementForm.classList.contains('hidden')) {
                fillOutTheEditForm(e.target);
                editElementForm.classList.toggle('hidden');
            }
        }

    } else if (e.target.parentElement.tagName === "TD") {

        if (e.target.parentElement.classList.contains('hidden')) {
            if (editElementForm.classList.contains('hidden')) {
                fillOutTheCreateForm(e.target.parentElement);
                createElementForm.classList.toggle('hidden');
            }
        } else {
            if(createElementForm.classList.contains('hidden')){
                fillOutTheEditForm(e.target.parentElement);
                editElementForm.classList.toggle('hidden');
                positionAt(e.target.parentElement, "right", editElementForm);
            }
        }
    } else {
        return;
    }
});

// Cоздаем обработчики событий для кнопок листания месяцев
dateMover.addEventListener('click', moveMonth);

//Создаем функцию для листания месяцев
const mover = {
    myDate: new Date,
    foundDate: null
}

createTable(mover.myDate);

function moveMonth(e) {
    let nextMonthFirstDay = new Date(mover.myDate.getFullYear(), mover.myDate.getMonth(), 1);
    nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + 1);
    let previousMonthLastDay = new Date(mover.myDate.getFullYear(), mover.myDate.getMonth(), 0);

    if (e.target === monthUpButton) {
        mover.myDate = new Date(nextMonthFirstDay);
        createTable(mover.myDate)
    } else if (e.target === monthDownButton) {
        mover.myDate = new Date(previousMonthLastDay);
        createTable(mover.myDate)
    } else if (e.target === todayButton) {
        mover.myDate = new Date;
        createTable(mover.myDate)
    } else {
        return;
    }
}

// Создаем div для размещения таблицы и таблицу
calendarTable.appendChild(table);

// Код для получения первого и последнего дня месяца
function createTable(myDate) {
    table.innerHTML = '';

    if (myDate == null) {
        myDate = new Date;
    }

    // Находим дату для старта отрисовки таблицы
    let firstMonthDate = new Date(myDate.getFullYear(), myDate.getMonth(), 1);
    let firstDateIndex = firstMonthDate.getDay();
    let fisrstTableDate = new Date(firstMonthDate.setDate(firstMonthDate.getDate() - firstDateIndex + 1));

    // Выбираем, какую информацию отрисовывать в ячейке таблицы
    function renderTableDate(date, count, target) {
        let todayDate = new Date;

        function getTask(taskDate) {
            if (localStorage.getItem(taskDate) !== null) {
                const taskInfo = JSON.parse(localStorage.getItem(taskDate));
                return `<p>${taskInfo.task} ${taskInfo.names} ${taskInfo.description}</p>`;
            } else {
                return "";
            }
        }

        if ((date.getFullYear() == todayDate.getFullYear()) &&
            (date.getMonth() == todayDate.getMonth()) &&
            (date.getDate() == todayDate.getDate())) {
            target.className = "today-date";
        }

        if (`${date}` == `${mover.foundDate}`){
            target.className = 'active-add';
            mover.foundDate = null;
        }

        if (count < 7) {
            target.innerHTML = 
            `${capitalizeFirstLetter(date.toLocaleString('ru-ru', { weekday: 'long' }))},
            ${date.getDate()}
            <p class = "hidden">${date.getTime()}</p>
            ${getTask(date)}`;
            if(getTask(date) !== ""){
                target.classList.add('event-added');
            }
            
        } else {
            target.innerHTML = 
            `${date.getDate()}
            <p class = "hidden">${date.getTime()}</p>
            ${getTask(date)}`;
            if(getTask(date) !== ""){
                target.classList.add('event-added');
            }
        }
    }

    // Выводим текущий месяц в блоке nav
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    date.innerHTML = `
        ${capitalizeFirstLetter(myDate.toLocaleString('ru-ru', { month: 'long' }))} 
        ${myDate.getFullYear()}
    `;

    // Получаем последний день месяца
    let lastMonthDate = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);

    // Получаем максимальное количество ячеек таблицы для месяца
    let maxCellsQuantity = () => {
        let cellsQuantity = (firstDateIndex + lastMonthDate.getDate() - 1);
        if ((cellsQuantity % 7) === 0) {
            return (cellsQuantity);
        } else {
            return ((cellsQuantity + 7) - (cellsQuantity % 7));
        }
    };

    let beforeFisrstTableDate = new Date(fisrstTableDate.setDate(fisrstTableDate.getDate() - 1));

    //Создаем и наполняем блоки таблицы
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

function localStorageItemSet(date, description, task, names) {
    localStorage.setItem(date, `
        {
            "task": "${task}",
            "date": "${date.getTime()}",
            "names": "${names}",
            "description": "${description}"
        }
    `);
}

createElementShortForm.addEventListener('click', (e) => {
    if(e.target === createElementShortForm){
        createElementShortForm.classList.toggle('hidden');
    }
})

shortFormCreateInput.addEventListener('click', (e) => {
    e.preventDefault();
    //closeAndClearDivs();
    let [dateInfo, ...taskDescriptionArray] = shortFormTextField.value.split(', ', 3);
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    const shortFormDate = (dateString) => {
        const date = dateString.split(' ');

        if (( months.indexOf(date[1]) < 0 ) || ( months.indexOf(date[1]) > 11 ) ||
        ( +date[0] < 0) || (+date[0] > 31 )) {
            shortFormTextField.value = "";
            createElementShortForm.classList.add('hidden');
            return;
        };

        const yearDate = new Date;
        const dateStandardized = new Date(yearDate.getFullYear(), months.indexOf(date[1]), date[0]);
        return (dateStandardized);
    }

    if (shortFormDate(dateInfo) instanceof Date) {
        shortFormDate(dateInfo);
        const taskDescription = taskDescriptionArray.join('. ')
        if(taskDescription.trim() === ""){
            shortFormTextField.value = "";
            return;
        }else{
            localStorageItemSet(shortFormDate(dateInfo), "", taskDescription, "");
            shortFormTextField.value = "";
            createElementShortForm.classList.add('hidden');
        }
    }
});

searchPanel.addEventListener('input', () => {
    let substringForSearching = searchPanel.value;
    foundTasksListWrapper.classList.remove('hidden');
    foundTasksListWrapper.innerHTML = "";
    resultsSearch(substringForSearching);
    positionAt(searchPanel, "bottom", foundTasksListWrapper); 

    if (searchPanel.value === "") {
        foundTasksListWrapper.classList.add('hidden');
    }
});

searchPanel.addEventListener('click', closeAndClearDivs);

function resultsSearch(substring){
    let localStorageStringsArr = [];

    for (let i = 0; i < localStorage.length; i++){
        const storageItem = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let string = "";

        if ((storageItem.task !== null) && (storageItem.task !== '') && (storageItem.task !== undefined)) {
            string += storageItem.task;
            string += " ";
        }

        if ((storageItem.date !== null) && (storageItem.date !== '') && (storageItem.date !== undefined)) {
            
            const dayMonth = new Date(null);
            dayMonth.setMilliseconds(storageItem.date);
            string += dayMonth.toLocaleString('ru', {
                month: 'long', 
                day: 'numeric'
            });
            
            string += " ";
        }

        if ((storageItem.description !== null) && (storageItem.description !== '') && (storageItem.description !== undefined)) {
            string += storageItem.names;
            string += " ";
        }
        
        localStorageStringsArr.push(string);
    }
    
    const filteredStringsIndexesArr = [];

    let list = document.createElement('div');
    list.className = "found-tasks-list";
    
    for (let i = 0; i < localStorageStringsArr.length; i++) {
    
        if(localStorageStringsArr[i].toLowerCase().indexOf(substring.toLowerCase()) !== -1){

            const task = storageItemParse(i).task,
                date = storageItemParse(i).date,
                div = document.createElement('div'),
                pTask = document.createElement('p'),
                pDate = document.createElement('p'),
                pNumericDate = document.createElement('p');

            pTask.innerText = `${task}`;
            pTask.classList.add('p-task');
            pDate.innerText = returnMonthDay(storageItemParse(i).date);
            pNumericDate.innerText = date;
            pDate.classList.add('p-date');
            pTask.value = i;
            pNumericDate.className = 'hidden';

            div.appendChild(pTask);
            div.appendChild(pDate);
            div.appendChild(pNumericDate);

            list.appendChild(div);
        }

        if (filteredStringsIndexesArr.length > 0) {
            foundTasksListWrapper.classList.remove('hidden');
        }
    }
    
    foundTasksListWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        if(e.target.tagName == 'P'){
            const numericDate = e.target.parentElement.lastChild.innerText;
            const date = new Date(null);
            date.setMilliseconds(numericDate);
            mover.foundDate = date;
            searchPanel.value = '';
            foundTasksListWrapper.classList.add('hidden');
            createTable(date);            
        }
    })
    
    foundTasksListWrapper.appendChild(list);
}
