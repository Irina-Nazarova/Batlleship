//проверка кода
var view = { // объект представление -обновляет изображение маркерами попаданий и промахов, а так же сообщениями для пользователей
	displayMessage: function(msg) { // метод получает один аргумент-текст сообщения
		var messageArea = document.getElementById('messageArea'); // получаем элемент messageArea из страницы
		messageArea.innerHTML = msg;// обновляем текст элемента messageArea, задавая его свойству содержимое msg
	},
	displayHit: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');// элементу назначается класс hit
	},
	displayMiss: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');// элементу назначается класс miss
	},
}
// проверка объекта view
/*view.displayMiss('00');
view.displayHit('34');
view.displayMessage('tap tap, is this thing on?');*/

var model = {
	boardSize: 7,//размер сетки игрового поля	
	numShips: 3, //кол-во кораблей в игре
	shipLength: 3, //длина каждогоо корабля
	shipsSunk: 0, // кол-во потопленных кораблей
	ships:  [ //массив, каждый элемент кот.содержит корабль
		{ locations: [ '06','16','26'], hits: ['', '', ''] }, 
	    { locations: [ '24','34','44'], hits: ['', '', ''] },
		{ locations: [ '10','11','12'], hits: ['', '', ''] }
	],
	
	fire: function (guess) { //метод получает координы выстрелов
		for (var i= 0; i< this.numShips; i++) { //перебираем массив , проверяя каждый корабль
			var ship = this.ships [i]; //получаем объект коробля для проверки (от0до2)
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = 'hit';
				view.displayHit(guess);
				view.displayMessage ('HIT!');
				if (this.isSunk (ship)) {
					view.displayMessage ('You sank my battleship!');
					this.shipsSunk++;
				}
				return true;				
			}
		}
		view.displayMiss(guess);
		view.displayMessage ('You missed.');
		return false;
	},
	isSunk: function (ship) { // метод на проверку потоплен ли корабль
		for (var i = 0; i <this.shipLength;i++) { // проверка длины коробля
			if (ship.hits[i] !== 'hit') { //вернет true когда все 3 клетки будут hit
				return false;
			}
		}
		return true;
	},
};
// проверка объекта model
/*model.fire('53');
model.fire('06');*/


//реализация контроллера

var controller = {
	guesses: 0, //кол-во выстрелов
	processGuess: function (guess) { // метод, получающий координаты в формате "А0"
	var location = parseGuess(guess); // проверка введенных данных 
		if (location) {	// если  метод не вернул null, значит, был получен действительный объект location	
			this.guesses++; 
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage('You sank all my battleships, in ' + this.guesses + 'guesses');
			}
		}
	}
};
// проверка
/*controller.processGuess ('A0');
controller.processGuess ('A6');
controller.processGuess ('B6');
controller.processGuess ('C6');
controller.processGuess ('C4');
controller.processGuess ('D4');
controller.processGuess ('E4');
controller.processGuess ('B0');
controller.processGuess ('B1');
controller.processGuess ('B2');*/
			
function parseGuess (guess) {
	var alphabet = ['A','B','C','D','E','F','G'];
	if (guess === null || guess.length !== 2) { // проверка на не корректный ввод данных пользователем (отправил пустую строку или больше двух символов)
		alert ('Oops, please enter a letter and  namber on the board.');
	} else {
		firstChar = guess.charAt (0); // извлекает первый символ строки
		var row = alphabet.indexOf(firstChar);// проверяем на наличие буквы в массиве alphabet
		var column = guess.charAt (1); // получаем номер столбца
		if (isNaN(row) || isNaN(column)) { // проверка, что в row  column нет букв и других символов кроме чисел
			alert ('Oops,that is not on the board.'); // этот блок выполнися если хотя бы один isNan вернет true
		} else if (row < 0 || row >= model.boardSize || column <0 || column >= model.boardSize) { // проверка пользоват.ввода в пределах игоровой доски
			alert ('Oops,that is off the board!');
		} else {
			return row + column; 
		}
	}
	return null;
};
//проверка
/*console.log (parseGuess ('A0'));
console.log (parseGuess ('Н0'));*/

function init() {
	var fireButton = document.getElementById('fireButton');
	fireButton.onclick = handleFireButton; //ссылка на кнопку Fire!
	var guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress; // обавляем новый обработчик
}

function handleKeyPress (e) { // обработчик нажатий клавиши 
	var fireButton = document.getElementById('fireButton');
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleFireButton () { //функция вызывается при каждом нажатии кнопки Fire!
	var guessInput = document.getElementById ('guessInput');
	var guess = guessInput.value; // получаем координаты введенные пользователем
	controller.processGuess(guess);
	guessInput.value = '';
}

window.onload = init;
































