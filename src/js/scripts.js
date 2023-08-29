let menuBtn = document.querySelector('.menu_btn');
let menuList = document.querySelector('.menu_list');

menuBtn.addEventListener('click', function(e){
	e.preventDefault();
	menuBtn.classList.toggle('active');
	menuList.classList.toggle('active');
});