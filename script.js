'use strict';

// оголошуємо змінні з якими будемо працювати

const form = document.querySelector('.create-task-form');
const taskList = document.querySelector('.collection');
const filter = document.querySelector('.filter-input');
const clearBtn = document.querySelector('.clear-tasks');
const taskInput = document.querySelector('.task-input');

// CRUD
taskList.addEventListener('click', editTask);

// оновити якусь таску

function editTask(event) {

	// створити масив з усіх завдань, доданих до переліку, для присвоєння індексу кожному завданню
	let tasksArray = Array.from(taskList.childNodes);
	
	let iconContainter = event.target.parentElement;
	// якщо ми клікнули по edit іконці  - тоді
	if (iconContainter.classList.contains('edit-item')) {

		// отримати індекс завдання, яке містить настиснуту іконку edit
		let taskByIndex = tasksArray.indexOf(iconContainter.closest('li'));

		// викликаємо діалогове вікно для редагування таски
		const editedTask = prompt('Виправити назву завдання');

		// вставляємо назву завдання з діалогового вікна замість старої назви завдання, яка міститься в елементі переліку, в якому знаходиться іконка edit
		if (editedTask) {
			iconContainter.closest('li').firstChild.textContent = editedTask;
		}

		editTaskInLocalStorage(taskByIndex, editedTask)
	}
}

function editTaskInLocalStorage(taskByIndex, editedTask) {

	//оголошуємо змінну яка буде використовуватись для списку завдань
	let tasks;

	// перевіряємо чи є у ЛокалСтораджі вже якісь данні завдань
	if (localStorage.getItem('tasks') !== null) {
		// якщо вони там є - витягуємо їх і присвоюємо змінній
		tasks = JSON.parse(localStorage.getItem('tasks'));
	} else {
		// якщо їх там нема - присвоюємо змінній значення порожнього масиву
		tasks = [];
	}
	
	if(editedTask) {
		tasks.splice(taskByIndex, 1, editedTask);
	}

	localStorage.setItem('tasks', JSON.stringify(tasks));
}


// побачити всі таски +
document.addEventListener('DOMContentLoaded', loadTasks);
form.addEventListener('submit', createTask);
taskList.addEventListener('click', removeTask);
clearBtn.addEventListener('click', removeAllTasks);
filter.addEventListener('keyup', filterItems);

function loadTasks() {
	// оголошуємо змінну яка буде використовуватись для списку завдань
	let tasks;

	// перевіряємо чи є у ЛокалСтораджі вже які данні завдань
	if(localStorage.getItem('tasks') !== null) {
		// якщо вони там є - витягуємо їх і присвоюємо змінній
		tasks = JSON.parse(localStorage.getItem('tasks'));
	} else {
		// якщо їх там нема - присвоюємо змінній значення порожнього масиву
		tasks = [];
	}

	// для кожної задачі яка є
	tasks.forEach(function(task) {
		// створюємо елемент списку
		const li = document.createElement('li');
		// додаємо йому класс
		li.className = 'collection-item';
		// всередині цього елементу списку створюємо текстову ноду з описом завдання
		li.appendChild(document.createTextNode(task));

		const bothIconsContainer = document.createElement('div');
		bothIconsContainer.className = 'both-icons-container';
		bothIconsContainer.style.minWidth = '50px';
		li.appendChild(bothIconsContainer);

		const editElement = document.createElement('span');
		editElement.className = 'edit-item';
		editElement.innerHTML = '<i class="fa fa-edit"></i>';
		bothIconsContainer.appendChild(editElement);	

		const deleteElement = document.createElement('span');
		deleteElement.className = 'delete-item';
		deleteElement.innerHTML = '<i class="fa fa-remove"></i>';
		bothIconsContainer.appendChild(deleteElement);

		// запихуємо цей елемент списку в список
		taskList.appendChild(li);
	})
}


// створити таску +
function createTask(event) {

	// якщо значення в інпуті порожнє  - то не додаємо нове завдання і не даємо виконатись дефолтній поведінці
	if (taskInput.value.trim() === '') {
		event.preventDefault();
		return null;
	}

	// створюємо елемент списку
	const li = document.createElement('li');
	// додаємо йому класс
	li.className = 'collection-item';
	// всередині цього елементу списку створюємо текстову ноду з описом завдання
	li.appendChild(document.createTextNode(taskInput.value));

	const bothIconsContainer = document.createElement('div');
	bothIconsContainer.className = 'both-icons-container';
	bothIconsContainer.style.minWidth = '50px';
	li.appendChild(bothIconsContainer);

	const editElement = document.createElement('span');
	editElement.className = 'edit-item';
	editElement.innerHTML = '<i class="fa fa-edit"></i>';
	bothIconsContainer.appendChild(editElement);	

	const deleteElement = document.createElement('span');
	deleteElement.className = 'delete-item';
	deleteElement.innerHTML = '<i class="fa fa-remove"></i>';
	bothIconsContainer.appendChild(deleteElement);

	// запихуємо цей елемент списку в список
	taskList.appendChild(li);

	// викликаємо функцію яка буде додавати завдання до ЛокалСтораджа
	storeTaskInLocalStorage(taskInput.value);

	// очищуємо вміст інпуту для створення завдання
	taskInput.value = '';

	// блокуємо дефолтну поведінку сабміта
	event.preventDefault();
}

function storeTaskInLocalStorage(task) {
	// оголошуємо змінну яка буде використовуватись для списку завдань
	let tasks;

	// перевіряємо чи є у ЛокалСтораджі вже які данні завдань
	if(localStorage.getItem('tasks') !== null) {
		// якщо вони там є - витягуємо їх і присвоюємо змінній
		tasks = JSON.parse(localStorage.getItem('tasks'));
	} else {
		// якщо їх там нема - присвоюємо змінній значення порожнього масиву
		tasks = [];
	}

	// додаємо до списку нове завдання
	tasks.push(task);

	// зберігаємо список завданнь в ЛокалСТорадж
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// видалити якусь конкретну таску
function removeTask(event) {

	// створити масив з усіх завдань, доданих до переліку, для присвоєння індексу кожному завданню
	let tasksArray = Array.from(taskList.childNodes);
	
	let iconContainter = event.target.parentElement;
	// якщо ми клікнули по хрестику  - тоді
	if(iconContainter.classList.contains('delete-item')) {  
		// пересвідчемось чи юзер справді хоче видалити цей елемент
		if(confirm('Ви впевнені що хочете видали саме це завдання?')){			

			// отримати індекс завдання, яке містить настиснутий хрестик
			let taskByIndex = tasksArray.indexOf(iconContainter.closest('li'));

			// видаляємо цей елемент переліку, в якому знаходиться хрестик
			iconContainter.closest('li').remove();

			// викликаємо функцію яка буде видаляти завдання з ЛокалСтораджа
			removeTaskFromLocalStorage(taskByIndex);
		}
	}
}

function removeTaskFromLocalStorage(taskByIndex) {
	// оголошуємо змінну яка буде використовуватись для списку завдань
	let tasks;

	// перевіряємо чи є у ЛокалСтораджі вже якісь данні завдань
	if(localStorage.getItem('tasks') !== null) {
		// якщо вони там є - витягуємо їх і присвоюємо змінній
		tasks = JSON.parse(localStorage.getItem('tasks'));
	} else {
		// якщо їх там нема - присвоюємо змінній значення порожнього масиву
		tasks = [];
	}

	// видалити з масиву у localStorage завдання, відповідне індексу видаленого з переліку завдання
	tasks.splice(taskByIndex, 1);

	localStorage.setItem('tasks', JSON.stringify(tasks));
}


// видалити всі таски
function removeAllTasks() {
	if(confirm('Ви впевнені що хочете видали всі завдання?')){
		// видаляємо весь контент всередині списку
		taskList.innerHTML = '';
		// видалити всі елементи з ЛокалСтораджа
		removeAllTasksFromLocalStorage();
	}
}

function removeAllTasksFromLocalStorage() {
	// 
	localStorage.clear();
}

function filterItems(event) {
	// оголосимо змінну яка буде в себе приймати значення по якому юзер фільтрує
	const filterQuery = event.target.value.toLowerCase();
	// знайти всі елементи завдань на сторінці
	document.querySelectorAll('.collection-item').forEach(function(taskHTMLElement){
		// знаходимо текст всередині li
		const taskText = taskHTMLElement.firstChild.textContent.toLowerCase();
		// якщо пошукова строка є в складі тексту з ls
		if(taskText.includes(filterQuery)) {
			// показуємо цей елемент списку
			taskHTMLElement.style.display = 'block';
		} else { // якщо немає
			// не показуємо цей елемент списку
			taskHTMLElement.style.display = 'none';
		}
	})
}

