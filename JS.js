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
view.displayMiss('55');
view.displayHit('12');
view.displayMiss('25');
view.displayHit('26');
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
					this.ship.Sunk++;
				}
				return true;				
			}
		}
		view.displayMiss(guess);
		view.displayMessage ('You missed.');
		return false;
	},
	inSunk: function (ship) { // метод на проверку потоплен ли корабль
		for (var i = 0; i <this.shipLength;i++) { // проверка длины коробля
			if (ship.hits[i] !== 'hit') { //вернет true когда все 3 клетки будут hit
				return false;
			}
		}
		return true;
	},
}
// проверка объекта model
/*model.fire('53');
model.fire('06');*/


