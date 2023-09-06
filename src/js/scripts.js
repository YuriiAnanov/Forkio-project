let menuBtn = document.querySelector('.menu_btn');
let menuList = document.querySelector('.menu_list');
let body = document.querySelector ('.hero_container')

menuBtn.addEventListener('click', function(e){
	e.stopPropagation();
	menuBtn.classList.toggle('active');
	menuList.classList.toggle('active');
});

body.addEventListener ('click', function(e){
	menuList.classList.contains ('active');

	if (menuList.classList.contains ('active') === true) {
		menuList.classList.remove ('active')
		menuBtn.classList.remove ('active')
	}
});