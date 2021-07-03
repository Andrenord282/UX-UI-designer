

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";


function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

console.log ('work'); ;

// Бургер навигация по сайту

const btnBurgerNavigation = document.querySelector('.burger-header');
const navigationBody = document.querySelector('.nav');
const body = document.querySelector('body');

btnBurgerNavigation.addEventListener('click', () =>{
    btnBurgerNavigation.classList.toggle('active');
    navigationBody.classList.toggle('active');
	body.classList.toggle('no-scroll');

})

// Работа якоря

function anchors() {
    const anchors = document.querySelectorAll('a[href*="#"]');
    
        for (let anchor of anchors){
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const anchorID = anchor.getAttribute('href').substr(1);
                document.getElementById(anchorID).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
                btnBurgerNavigation.classList.remove('active');
                navigationBody.classList.remove('active');
            });
        };
    };
    
anchors();

// Табы в портфолио

const tabsNavPerent = document.querySelector('.tabs__nav');
const tabsNavBody = document.querySelectorAll('.tabs__item-nav');
const tabsContent = document.querySelectorAll('.tabs__item-content');


function clearActiveClass(el){
	el.classList.remove('active');
}

tabsNavPerent.addEventListener('click', (e) => {
	const btnTab = e.target;

	if (btnTab.classList.contains('tabs__btn')){
		
		let tabBtnIndex = btnTab.dataset.btn_index;
		tabsContent.forEach((item, i) => {
			if (item[i] != tabBtnIndex)
				item.classList.remove('active');
		});

		tabsNavBody.forEach((item, i) => {
			if (item[i] != tabBtnIndex)
				item.classList.remove('active');
		});

		tabsNavBody[tabBtnIndex].classList.add('active');
		tabsContent[tabBtnIndex].classList.add('active');
	}
})



// Анимация

const header = document.querySelector('.header'); // Секция шапка
const homeSection = document.querySelector('.home'); // Секция мейн
const homeItem = document.querySelector('.home__top'); // Секция мейн верхний блок секции, нужен для фиксации шапки
const contactsSection = document.querySelector('.contacts'); // Секция контакты
const footerSection = document.querySelector('.footer'); // Секция футер

let documentBodyScrollTop = document.body.scrollTop;
let homeBottomPosition;
const headerHeigth = header.offsetHeight;
let innerWidthUser = window.innerWidth;
let innerHeigthUser = window.innerHeight;
let percentRatio;


// Фиксация шапки

const headerFixed = () => {
	homeBottomPosition = homeItem.getBoundingClientRect().bottom + documentBodyScrollTop;
	// const homeTopHeigth = homeTop.offsetHeight;
	let scrollTop = window.scrollY;
	if (scrollTop <= headerHeigth && innerWidthUser > 600) {
		header.classList.remove('header-hidden');
	}

	if (scrollTop >= headerHeigth && innerWidthUser > 600) {
		header.classList.add('header-hidden');
	}

	if (scrollTop >= homeBottomPosition && innerWidthUser > 600) {
		header.classList.remove('header-hidden');
		header.classList.add('fixed');
		homeSection.style.paddingTop = `${headerHeigth}px`;
	} else {
		header.classList.remove('fixed');
		homeSection.style.paddingTop = `0`;
	}
};

// Прогресс бар

const progressBarNav = () => {
	const progressBar = document.querySelector('.nav__list');
	const lastSectionTop = Math.floor((contactsSection.getBoundingClientRect().top + pageYOffset) - (contactsSection.offsetHeight + footerSection.offsetHeight));
	let scrollTop = window.scrollY;
	// const percentHeigthDocument = Math.floor(lastSectionTop * (1/100));
	percentRatio = Math.floor((scrollTop / lastSectionTop) * 100);

	if (percentRatio >=100) {
		percentRatio = 100;
	}
	let anime = document.querySelector('.anime');
	anime.innerHTML = percentRatio;
	progressBar.style.setProperty('--width-before', `${percentRatio}%`);
};

//Анимация блоков

const animationItems = () => {
	const animItem = document.querySelectorAll('.anim-item');
	console.log(innerWidthUser);



	if(animItem){
		let pointAnimation;

		animItem.forEach((item, i) => {
			if (innerWidthUser >= 1000){
				pointAnimation = item.dataset.anim_desktop;
			}

			if (innerWidthUser >= 600 && innerWidthUser < 1000){
				pointAnimation = item.dataset.anim_tablet;
			}

			if (innerWidthUser < 600){
				pointAnimation = item.dataset.anim_phone;
			}

			const pelayAnimation = item.dataset.anim_delay;
			item.style.setProperty('--animation-delay', `${pelayAnimation}`);
			if (percentRatio >= pointAnimation) {
				item.classList.remove('hidden-animation');
				item.classList.add('show-animation');
				item.classList.add('active');

			}
		})
	}

};



headerFixed();
progressBarNav();
animationItems();

window.addEventListener('scroll', () => {
	headerFixed();
	progressBarNav();
	animationItems()

});

    

