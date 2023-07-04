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
    let pullUps = parseInt(document.getElementById('pull-ups').value);
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
        timeForSet: timeForSet
    };
    dataSet.push(data);
    localStorage.setItem('dataSet', JSON.stringify(dataSet));
    renderTable();

    lastSetTime = currentTime;
}

function downloadData() {
    let json = JSON.stringify(dataSet, null, 2);
    let blob = new Blob([json], {type: "application/json"});
    let url  = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.download = 'data.json';
    a.href = url;
    a.click();
}

function clearData() {
    if (confirm(document.getElementById('language').value == 'en' ?'Are you sure you want to clear all data and start a new session?' : 'Удалить данные и начать новую серию?')) {
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
    if (confirm(document.getElementById('language').value == 'en' ? 'Are you sure you want to cancel the last log?' : 'Удалить послднее введение значение?')) {
        dataSet.pop();
        localStorage.setItem('dataSet', JSON.stringify(dataSet));
        renderTable();
    }
}

function importData() {
    var file = document.getElementById('import-file').files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            var importedData = JSON.parse(contents);
            dataSet = importedData;
            renderTable();
        };
        reader.readAsText(file);
    }
}

function changeLanguage() {
    let lang = document.getElementById('language').value;
    if (lang === 'en') {
        document.getElementById('language-selector-label').innerText = "Language: ";
        document.getElementById('title').innerText = "Pull Ups Logger";
        document.getElementById('logged-sets').innerText = "Logged Sets";
        document.getElementById('pull-ups-label').innerText = "Pull ups current set:";
        document.getElementById('log-button').innerText = "Log Pull Ups";
        document.getElementById('download-button').innerText = "Download Data";
        document.getElementById('clear-button').innerText = "Clear Data";
        document.getElementById('cancel-button').innerText = "Cancel Last";
    } else {
        document.getElementById('language-selector-label').innerText = "Язык: ";
        document.getElementById('title').innerText = "Журнал подтягиваний";
        document.getElementById('logged-sets').innerText = "Всего подходов";
        document.getElementById('pull-ups-label').innerText = "Подтягивания в этом подходе:";
        document.getElementById('log-button').innerText = "Записать подтягивания";
        document.getElementById('download-button').innerText = "Скачать данные";
        document.getElementById('clear-button').innerText = "Очистить данные";
        document.getElementById('cancel-button').innerText = "Отменить последнее";
    }
    renderTable();
}

function renderTable() {
    document.getElementById('log-table').innerHTML = `<tr>
        <th>${document.getElementById('language').value === 'en' ? 'Set Number' : 'Номер набора'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Pull Ups' : 'Подтягивания'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Total Pull Ups' : 'Всего подтягиваний'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Time Since Start' : 'Время с начала'}</th>
        <th>${document.getElementById('language').value === 'en' ? 'Time For Set' : 'Время для набора'}</th>
    </tr>`;
    dataSet.forEach(data => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${data.setNumber}</td><td>${data.pullUps}</td><td>${data.totalPullUps}</td><td>${formatTime(data.timeSinceStart)}</td><td>${formatTime(data.timeForSet)}</td>`;
        document.getElementById('log-table').appendChild(row);
        totalPullUps = data.totalPullUps;
        setNumber = data.setNumber;
        lastSetTime = data.timeForSet + lastSetTime;
    });
}

renderTable();