//Объявление счетчика ходов, счетчика времени, инициализация массива игровых клеток;
var COUNT;
var TIME;
var cell = document.getElementsByClassName('cell_game');
var Timer;
var Modal = true;
var PLAYER2; //Противник ПК (false/[undefined]) или человек (true)
var valueX = '🞪';
var valueO = '🞅';

//initGame();
document.getElementById('Reset').onclick = initGame;
document.getElementById('opponentPerson').onclick = initGame;
document.getElementById('opponentPC').onclick = initGame;

//Инициализация игрового поля: инициализация массива значений, заполнение клеток случайными елементами массива значений, добавление data-* атрибутов;
function initGame() {
	
	clearInterval(Timer);
	
	//сброс ячеек игры
	for (let item of cell) {
		item.innerText = '';
		item.style = '';
		item.setAttribute('data-empty', 'true');
		item.onclick = clickCell;
	}
 	 
	//Отображение приветствия
	if(Modal) {
		document.getElementById('Setting').style.display = 'none';
		Modal = false;
		Timer = setInterval( spendTime, 1000 );
	} else {
		document.getElementById('Setting').style.display = 'flex';
		Modal = true;
	}
	
	//Установка противника (человек/ПК)
	if (this.id == 'opponentPerson') { 
		PLAYER2 = true; 
	} else {
		PLAYER2 = false;
	}
	
	//Присвоение начальных значений счетчикам
	TIME = 0;
	COUNT = 0;
	
	document.getElementById('Count').innerText = 'COUNT: ' + COUNT;
}
//Конец инициализация

//Получение индексов пустых ячеек
function getEmptyCells() {
	
	let emptyArr = [];
	for (let i = 0; i < cell.length; ++i) {
		if (cell[i].dataset.empty == 'true') {
			emptyArr.push(i);
		}
	}
	
	return emptyArr;
}

//Установка заничения ячейки
function clickCell() {
	
	if (COUNT > 8 || this.dataset.empty == 'false') {
		clearInterval(Timer);
		return;
	}
	
	//Второй игрок - человек
	if (PLAYER2 == true) {
		
		if (COUNT % 2 == 0) {
			this.innerText = valueX;
		} else {
			this.innerText = valueO;
		}
	
		COUNT++;
		
	} 
	
	//Второй игрок - ПК
	if (PLAYER2 == false) {
		
		if (COUNT % 2 == 0) {
			this.innerText = valueX;
			COUNT++;
			this.dataset.empty = 'false';
		}
		
		//ход ПК
		//Вынести отдельно
		if (COUNT < 8) {
			//Получаем массив пустых ячеек
			let emptyArr = getEmptyCells();
			//Получаем случайное значение из массива
			let randomIndex = emptyArr.splice(Math.floor(0 + (Math.random() * emptyArr.length)), 1);
		
			cell[randomIndex].innerText = valueO;
			cell[randomIndex].dataset.empty = 'false';
			COUNT++;
		} else {
			clearInterval(Timer);
		}
		
		//Проверка на выигрыш
		if (!checkWin(valueX)) {
			checkWin(valueO);
		}
	}
	
	this.dataset.empty = 'false';
	document.getElementById('Count').innerText = 'COUNT: ' + COUNT;
	
	//Проверка на выигрыш
	if (!checkWin(valueX)) {
		checkWin(valueO);
	}
}


function checkWin(symbol) {

	//Проверка совпадений по строкам
	for( let i = 0; i < 9; i+=3 ) {
	
		if ( cell[i].innerText == cell[i+1].innerText 
			&& cell[i+1].innerText == cell[i+2].innerText 
			&& cell[i+2].innerText == symbol) {
			
			clearInterval(Timer);
			setWinnerStyle(i, i+1, i+2);
			return true;
		}
	}
	
	//Проверка совпадений по столбцам
	for( let i = 0; i < 3; i++ ) {
	
		if ( cell[i].innerText == cell[i+3].innerText 
			&& cell[i+3].innerText == cell[i+6].innerText 
			&& cell[i+6].innerText == symbol) {
			
			clearInterval(Timer);
			setWinnerStyle(i, i+3, i+6);
			return true;
		}
	}
	
	//Проверка побочной диагонали матрицы
	if ( cell[2].innerText == cell[4].innerText 
		&& cell[4].innerText == cell[6].innerText 
		&& cell[6].innerText == symbol ) {
		
		clearInterval(Timer);
		setWinnerStyle(2, 4, 6);
		return true;
	}
	
	//Проверка главной диагонали матрицы
	if ( cell[0].innerText == cell[4].innerText 
		&& cell[4].innerText == cell[8].innerText 
		&& cell[8].innerText == symbol ) {
		
		clearInterval(Timer);
		setWinnerStyle(0, 4, 8);
		return true;
	}
	
	//Если нет совпадений
	return false;
	
	//Установка стилей для выигрышных ячеек
	function setWinnerStyle(i1, i2, i3) {
		
		for (item of cell) {
			item.dataset.empty = 'false';
			item.style.textShadow = '0px 0px 5px gray';
		}
		cell[i1].style.color = cell[i2].style.color = cell[i3].style.color = 'green';
		cell[i1].style.animation = cell[i2].style.animation = cell[i3].style.animation = 'win 0.75s infinite';
	}
	
}

//Отсчет игрового времени
function spendTime() {
	 //console.log(TIME);
	document.getElementById('Spend').innerText = 'TIME: ' + Math.floor(TIME/60) + ':' + (TIME%60<10?'0'+TIME%60:TIME%60);
	TIME++;

}
