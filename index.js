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
    createFormCloseButton = createElementForm.getElementsByClassName('close-button')[0],
    createSubmitWrapper = document.getElementsByClassName('create-submit-wrapper')[0],
    doneInput = document.querySelectorAll('.create-submit-wrapper > input')[0],
    deleteInput = document.querySelectorAll('.create-submit-wrapper > input')[1],
    dateInput = createElementForm.getElementsByTagName('input')[1],
    hiddenDateInput = createElementForm.getElementsByTagName('input')[3],

    createElementShortForm = document.getElementsByClassName('create-element-short-form')[0],
    shortFormCloseButton = createElementShortForm.getElementsByClassName('close-button')[0],
    shortFormTextField = createElementShortForm.getElementsByTagName('input')[0],
    shortFormCreateInput = createElementShortForm.getElementsByTagName('input')[1],

    editElementForm = document.getElementsByClassName('edit-element-form')[0],
    editFormCloseButton = editElementForm.getElementsByClassName('close-button')[0],
    editSubmitWrapper = document.getElementsByClassName('edit-submit-wrapper')[0],
    editFormIsReadyButton = editElementForm.querySelectorAll('.edit-submit-wrapper > input')[0],
    editFormDeleteButton = editElementForm.querySelectorAll('.edit-submit-wrapper > input')[1],
    editFormTextArea = editElementForm.getElementsByTagName('textarea'),
    editFormHiddenDate = editElementForm.getElementsByTagName('input')[0],
    
    foundTasksListWrapper = document.getElementsByClassName('found-tasks-list-wrapper')[0];

// Создаем таблицу для отрисовки месяца
let table = document.createElement('table');

// Создаем обработчики событий для кнопок закрывания форм
createFormCloseButton.addEventListener('click', (e) => {
    e.preventDefault();
    closeAndClearDivs()
});
shortFormCloseButton.addEventListener('click', (e) => {
    e.preventDefault();
    createElementShortForm.classList.add('hidden');
    shortFormTextField.value = null;
});
editFormCloseButton.addEventListener('click', (e) => {
    e.preventDefault();
    editElementForm.classList.add('hidden');
    editFormTextArea.value = null;
});

// Создаем обработчик события для кнопоки Обновить
refreshButton.addEventListener('click', (e) => {
    closeAndClearDivs();
    createTable(mover.myDate);
});

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
    editFormHiddenDate.value = +cellDate;
    editElementMembers.innerText = task.names;
    editElementDescription.value = task.description;
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
        let styleElem = document.head.appendChild(document.createElement('style'));
        styleElem.innerHTML = ".create-element-form:after, .create-element-form:before, .edit-element-form:after,.edit-element-form:before { top: 30px; left: 4px; box-shadow: -4px 4px 7px -3px rgba(0, 0, 0, 0.3);}";
}

createSubmitWrapper.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target === doneInput) {

        const taskInputValue = createElementForm.getElementsByTagName('input')[0].value,
            namesInputValue = createElementForm.getElementsByTagName('input')[2].value,
            descriptionInputValue = createElementForm.getElementsByTagName('textarea')[0].value,
            date = createElementForm.getElementsByTagName('input')[3].value;
        let tdDate = new Date(null);
        tdDate.setMilliseconds(date);

        if (taskInputValue.trim() === "") {
            createFormClear();
            createElementForm.classList.toggle('hidden');
            return;
        } else {
            localStorageItemSet(tdDate, descriptionInputValue, taskInputValue, namesInputValue);
            createFormClear();
            createElementForm.classList.toggle('hidden');
            createTable(tdDate);
        }
    } else if (e.target === deleteInput) {

        e.preventDefault();
        createFormClear();
        closeAndClearDivs();
        console.log('очистил форму');
    } else {
        console.log(`Обработчик события 'click' для этой цели не установлен`);
        return;
    }
});

editSubmitWrapper.addEventListener('click', (e) => {
    e.preventDefault();
    
    const cellDate = new Date(null);
    cellDate.setMilliseconds(editFormHiddenDate.value);
    const task = JSON.parse(localStorage.getItem(cellDate));

    if (e.target === editFormIsReadyButton) {
        localStorage.setItem(cellDate, 
            `{
                "task": "${task.task}",
                "date": "${task.date}",
                "names": "${task.names}",
                "description": "${document.getElementsByClassName('edit-element-description')[0].value}"
            }`
        );
        createTable(cellDate);

    } else if (e.target === editFormDeleteButton) {
        localStorage.removeItem(cellDate);
        createTable(cellDate);
    };

    editElementForm.classList.toggle('hidden');
});

// Функция для позиционирования форм
function positionAt(anchor, position, elem) {
    let anchorCoords = anchor.getBoundingClientRect();
    let allWidth = document.documentElement.clientWidth - (anchorCoords.left + anchor.offsetWidth + 340 + 10);
    let allHeight = document.documentElement.clientHeight - (anchorCoords.top + anchor.offsetHeight + 418 + 10);

    switch (position) {
      case "around":
        if (allWidth >= 0) {
            if (allHeight >= 0) {
                elem.style.left = anchorCoords.left + anchor.offsetWidth + 10 + "px";
                elem.style.top = anchorCoords.top - 20 + "px";
            } else {
                elem.style.left = anchorCoords.left + anchor.offsetWidth + 10 + "px";
                if (anchorCoords.bottom < (document.documentElement.clientHeight - anchor.offsetHeight * 2 + 10)) {
                    elem.style.top = anchorCoords.top - 20 + "px"; 
                } else {
                    elem.style.bottom = document.documentElement.clientHeight - anchorCoords.bottom - 20  + "px";
                    let styleElem = document.head.appendChild(document.createElement('style'));
                    styleElem.innerHTML = ".create-element-form:after, .create-element-form:before, .edit-element-form:after,.edit-element-form:before { top: 370px;}";
                }
            }
        } else {
            let styleElem = document.head.appendChild(document.createElement('style'));
            styleElem.innerHTML = ".create-element-form:after, .create-element-form:before, .edit-element-form:after,.edit-element-form:before { left: 342px; top: 30px; box-shadow: 4px -4px 7px -3px rgba(0, 0, 0, 0.3);}";
            if (allHeight >= 0) {
                elem.style.right = document.documentElement.clientWidth - anchorCoords.left + 10 + "px";
                elem.style.top = anchorCoords.top - 20 + "px"; 
            } else {
                elem.style.right = document.documentElement.clientWidth - anchorCoords.left + 10 + "px";
                if (anchorCoords.bottom < (document.documentElement.clientHeight - anchor.offsetHeight * 2 + 10)) {
                    elem.style.top = anchorCoords.top - 20 + "px"; 
                } else {
                    elem.style.bottom = document.documentElement.clientHeight - anchorCoords.bottom - 20 + "px";
                    let styleElem = document.head.appendChild(document.createElement('style'));
                    styleElem.innerHTML = `.create-element-form:after, .create-element-form:before, .edit-element-form:after,.edit-element-form:before { top: 370px;}`;
                }
            }
        }
        break;

        case "bottom":
            elem.style.left = anchorCoords.left + "px";
            elem.style.top = anchorCoords.top + anchor.offsetHeight + 16 + "px";
            break;
    }
}

// Выбираем, какое из форм открывать при клике на таблице

calendarTable.addEventListener('click', (e) => {
    let target = e.target;
    closeAndClearDivs();
    while (target.tagName != 'TABLE') {
        if (target.tagName == 'TD'){
            createElementForm.style.cssText = `
            z-index: 2;
            position: absolute;
            `;
            positionAt(target, "around", createElementForm); 

            editElementForm.style.cssText = `
            z-index: 2;
            position: absolute;
            `;
            positionAt(target, "around", editElementForm);

            if (target.lastElementChild.classList.contains('hidden')) {
                if (editElementForm.classList.contains('hidden')) {
                    fillOutTheCreateForm(target);
                    createElementForm.classList.toggle('hidden');              
                }
            } else {
                if (createElementForm.classList.contains('hidden')) {
                    fillOutTheEditForm(target);
                    editElementForm.classList.toggle('hidden');
                }
            }
        }
        target = target.parentNode;
    };
})

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
                return `<p><span class="tdTaskHeader">${taskInfo.task}</span><br>${taskInfo.names}<br>${taskInfo.description}</p>`;
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
    
    const myDate = new Date(null);
    myDate.setMilliseconds(+shortFormDate(dateInfo));
    createTable(myDate);
});

searchPanel.addEventListener('input', () => {
    let substringForSearching = searchPanel.value;
    foundTasksListWrapper.classList.remove('hidden');
    foundTasksListWrapper.innerHTML = "";
    resultsSearch(substringForSearching);
    positionAt(searchPanel, "bottom", foundTasksListWrapper);

    if ((searchPanel.value === "")||(foundTasksListWrapper.firstChild.children.length < 1)) {
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