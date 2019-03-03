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
		 { locations: [ '0','0','0'], hits: ['', '', ''] }, 
	    { locations: [ '0','0','0'], hits: ['', '', ''] },
		{ locations: [ '0','0','0'], hits: ['', '', ''] }
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
	
	generateShipLocations: function(){
		var locations;
		for (var i = 0; i < this.numShips; i++) { // для каждого корабля генерируется набор позиций (клеток)
			do {
				locations = this.generateShip(); // генерирует новый набор позиций
			} while (this.collision(locations)); // проверяем, перекрываются ли эти позиции с существ.-ми кораблями
			this.ships[i].locations = locations; // полученные позиции без перекрытий сохраняются в свойстве location в массиве model.ships
		}
	},
	
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2); // генерируем число от 0 до 1 и * 2, что бы получить число в диапазоне от 0 до 2 (не включая 2), затем Math.floor преобразует в 0 или 1
		var row, col;		
		if (direction === 1) { // если значение = 1, то создается горизонтальный корабль
			row = Math.floor(Math.random() * this.boardSize); //генерирует начальную позицию коробля на игровом поле
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else { // если значение = 0, то создается вертикальный корабль
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = []; // набор позиций нового корабля в кот. последовательно добавляются элементы
		for (var i = 0; i < this.shipLength; i++) { // в цикле до кол-ва позиций в корабле
			if (direction === 1) { // при каждой итерации новая позиция добавляется  в массив newShipsLocations
				newShipLocations.push(row + '' + (col + i)); // 0 1+0, 
			} else {
				newShipLocations.push((row + i) + '' + col);
			}
		}
		return newShipLocations; // когда позиции сгенерированы, метод возвращает массив
	},
	
	collision: function(locations) { // массив позиций нового корабля
		for (var i = 0; i < this.numShips; i++) { // перебирает все корабли в модели
			var ship = model.ships[i]; // для каждого корабля, уже находящегося на поле
			for (var j = 0; j < locations.length; j++) { // перебирает  все позиции, проверяемые на перекрытие 
				if (ship.locations.indexOf(locations[j]) >= 0) { // метод indexOf присутствует ли заданная позиция в массиве, если индекс больше 0, то клетка занята и вернет true (перекрытие обнаружено).
					return true;
				}
			}
		}
		return false; // перекрытие отсутствует
	}
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
	guessInput.onkeypress = handleKeyPress; // обнавляем новый обработчик
	
	model.generateShipLocations();
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
























