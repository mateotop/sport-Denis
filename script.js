let totalPullUps = 0;
let setNumber = 0;
let startTime = Date.now();
let lastSetTime = startTime;
let dataSet = JSON.parse(localStorage.getItem('dataSet')) || [];




function formatTime(timeInMs) {
    let timeInSeconds = Math.floor(timeInMs / 1000);
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    let seconds = timeInSeconds - (hours * 3600) - (minutes * 60);
    return `${hours}:${minutes}:${seconds}`;
}

function logPullUps() {
    let pullUps = parseInt(document.getElementById('input-pull-ups').value);
    totalPullUps += pullUps;
    setNumber += 1;

    let currentTime = Date.now();
    let timeSinceStart = currentTime - startTime;
    let timeForSet = currentTime - lastSetTime;

    let data = {
        setNumber: setNumber,
        pullUps: pullUps,
        totalPullUps: totalPullUps,
        timeSinceStart: timeSinceStart,
        timeForSet: timeForSet,
        fullTime: currentTime,
    };
    dataSet.push(data);
    localStorage.setItem('dataSet', JSON.stringify(dataSet));
    renderTable();

    lastSetTime = currentTime;
}


// ================Input Field. Minus, Plus=======================

function btnMinus() {
    let input = document.getElementById('input-pull-ups')
    let count = parseInt(input.value) - 1
    // count = count < 1 ? 1 : count
    input.value = count;
}

function btnPlus() {
    let input = document.getElementById('input-pull-ups')
    let count = parseInt(input.value) + 1
    // count = count > parseInt(input.data('max-count')) ? parseInt(input.data('max-count')) : count;
    input.value = count;
}

// Forbid type text in input field. Only numbers. 
// Get the input field element
let inputField = document.getElementById('input-pull-ups');

// Add an input event listener to validate the input
inputField.addEventListener('input', function() {
  let inputValue = inputField.value.trim();
  
  // Use a regular expression to check if the input matches the desired pattern
  let numberPattern = /^-?\d*$/;
  let isValid = numberPattern.test(inputValue);
  
  // If the input is not valid, remove the last entered character
  if (!isValid) {
    inputField.value = inputValue.slice(0, -1);
  }
});




// ================Menu=======================

// function toggleMenu() {
//     var menuIcon = document.getElementById("menu-icon");
//     var sidebar = document.getElementById("sidebar");
//     menuIcon.classList.toggle("open");
//     sidebar.style.left = sidebar.style.left === "0px" ? "-200px" : "0px";
// }

// window.addEventListener("click", function (event) {
//     var sidebar = document.getElementById("sidebar");
//     if (event.target !== sidebar && !sidebar.contains(event.target)) {
//         var menuIcon = document.getElementById("menu-icon");
//         if (menuIcon.classList.contains("open")) {
//             menuIcon.classList.remove("open");
//             sidebar.style.left = "-200px";
//         }
//     }
// });

// =======================================



function downloadData() {
    let json = JSON.stringify(dataSet, null, 2);
    let blob = new Blob([json], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.download = 'data.json';
    a.href = url;
    a.click();
}

function clearData() {
    if (confirm(document.getElementById('language').value == 'en' ? 'Are you sure you want to clear all data and start a new session?' : 'Удалить данные и начать новую серию?')) {
        totalPullUps = 0;
        setNumber = 0;
        startTime = Date.now();
        lastSetTime = startTime;
        dataSet = [];
        localStorage.setItem('dataSet', JSON.stringify(dataSet));
        renderTable();
    }
}

function cancelLast() {
    if (confirm(document.getElementById('language').value == 'en' ? 'Are you sure you want to cancel the last log?' : 'Удалить послднее введенное значение?')) {
        dataSet.pop();
        localStorage.setItem('dataSet', JSON.stringify(dataSet));
        renderTable();
    }
}

function importData() {
    var file = document.getElementById('import-file').files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            var importedData = JSON.parse(contents);
            dataSet = importedData;
            renderTable();
        };
        reader.readAsText(file);
    }
}

function changeLanguage(lang = '') {
    lang = lang.length > 0 ? lang : document.getElementById('language').value;

  document.getElementById('language').value = lang;
  localStorage.setItem('langSave', lang);

    if (lang === 'en') {
        document.getElementById('language-selector-label').innerText = "Language: ";
        document.getElementById('title').innerText = "Pull Ups Logger";
        // document.getElementById('logged-sets').innerText = "Logged Sets";
        document.getElementById('pull-ups-label').innerText = "Pull ups current set:";
        document.getElementById('log-button').innerText = "Log";
        document.getElementById('clear-button').innerText = "Clear Table";
        document.getElementById('cancel-button').innerText = "Cancel Last Row";
        document.getElementById('download-button').innerText = "Download Table";
        document.getElementById('importt').innerText = "Import Table";
    } else {
        document.getElementById('language-selector-label').innerText = "Язык: ";
        document.querySelector('h1#title').innerText = "Журнал подтягиваний";
        // document.getElementById('logged-sets').innerText = "Всего подходов";
        document.getElementById('pull-ups-label').innerText = "Подтягивания в этом подходе:";
        document.getElementById('log-button').innerText = "Записать";
        document.getElementById('importt').innerText = "Загрузить таблицу";
        document.getElementById('download-button').innerText = "Скачать таблицу";
        document.getElementById('clear-button').innerText = "Очистить таблицу";
        document.getElementById('cancel-button').innerText = "Удалить строку";

    }
    renderTable();
}

function renderTable() {
    document.getElementById('log-table').innerHTML = `<tr>
        <th>${document.getElementById('language').value === 'en' ? 'Set' : 'Подход'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Set Time' : 'Время подхода'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Pull Ups' : 'Подтягивания'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Total Pull Ups' : 'Всего подтягиваний'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Total Time' : 'Время всего'}</th>
    </tr>`;
    dataSet.forEach(data => {
        let row = document.createElement('tr');
        row.innerHTML = `\
                        <td>${data.setNumber}</td>\
                        <td>${formatTime(data.timeForSet)}</td>\
                        <td>${data.pullUps}</td>\
                        <td>${data.totalPullUps}</td>\
                        <td>${formatTime(data.timeSinceStart)}</td>\
                        `;
        document.getElementById('log-table').appendChild(row);
        row.scrollIntoView();
        totalPullUps = data.totalPullUps;
        setNumber = data.setNumber;
        lastSetTime = data.timeForSet + lastSetTime;
    });
}
// Get the saved language option from localStorage or use the default value
let langSave = localStorage.getItem('langSave');

// Check if it's the user's first visit and set language based on browser settings
if (!langSave) {
    let browserLang = window.navigator.language || window.navigator.browserLanguage;
    langSave = browserLang;
    localStorage.setItem('langSave', browserLang);
  }


// Check the saved language option and call changeLanguage accordingly
if (langSave === 'ru') {
  changeLanguage('ru');
} else {
  changeLanguage('en');
}

renderTable();
