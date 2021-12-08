'use strict'

// SPOLLERS
let _slideUp = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide')
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide')
      }, duration);
   }
}
let _slideDown = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide')
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide')
      }, duration);
   }
}
let _slideToggle = (target, duration = 500) => {
   if (target.hidden) {
      return _slideDown(target, duration);
   } else {
      return _slideUp(target, duration);
   }
}

const spollersArray = document.querySelectorAll('[data-spollers]');

if (spollersArray.length > 0) {
   const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(',')[0];
   });

   if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
   }

   const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(',')[0];
   });

   if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach(item => {
         const params = item.dataset.spollers
         const breakpoint = {};
         const paramsArray = params.split(',');
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
         breakpoint.item = item;
         breakpointsArray.push(breakpoint);
      });

      let mediaQueries = breakpointsArray.map(function (item) {
         return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
      });
      mediaQueries = mediaQueries.filter(function (item, index, self) {
         return self.indexOf(item) === index;
      });

      mediaQueries.forEach(breakpoint => {
         const paramsArray = breakpoint.split(',');
         const mediaBreakpoint = paramsArray[1];
         const mediaType = paramsArray[2];
         const matchMedia = window.matchMedia(paramsArray[0]);
         const spollersArray = breakpointsArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType) {
               return true;
            }
         });
         matchMedia.addListener(function () {
            initSpollers(spollersArray, matchMedia);
         });
         initSpollers(spollersArray, matchMedia);
      });
   }

   function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
         spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
         if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add('_init');
            initSpollersBody(spollersBlock);
            spollersBlock.addEventListener('click', setSpollerAction);
         } else {
            spollersBlock.classList.remove('_init');
            initSpollersBody(spollersBlock, false);
            spollersBlock.removeEventListener('click', setSpollerAction);
         }
      });
   }


   function initSpollersBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length > 0) {
         spollerTitles.forEach(spollerTitle => {
            if (hideSpollerBody) {
               spollerTitle.removeAttribute('tabindex');
               if (!spollerTitle.classList.contains('_active')) {
                  spollerTitle.nextElementSibling.hidden = true;
               }
            } else {
               spollerTitle.setAttribute('tabindex', '-1');
               spollerTitle.nextElementSibling.hidden = false;
            }
         });
      }
   }

   function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute('data-spoller') || el.closest('data-spoller')) {
         const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
         const spollersBlock = spollerTitle.closest('[data-spollers]');
         const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
         if (!spollersBlock.querySelectorAll('._slide').length) {
            if (oneSpoller && !spollerTitle.classList.contains('_active')) {
               hideSpollerBody(spollersBlock);
            }
            spollerTitle.classList.toggle('_active');
            _slideToggle(spollerTitle.nextElementSibling, 500);
            if (el === schedulingTodayTitle) {
               schedulingTodayItem.classList.toggle('now')
               if (!schedulingTodayItem.classList.contains('now')) {
                  pickerLessons('add')
               } else { pickerLessons('remove') }
            }
            
         }
         e.preventDefault;
      }
      function hideSpollerBody(spollersBlock) {
         const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
         if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
         }
      }
   }
}

// Header
const headerElem = document.documentElement.querySelector('.header');
window.addEventListener('scroll', function (e) {
   if (window.scrollY >= 1) {
      headerElem.classList.add('_active');
   } else {
      headerElem.classList.remove('_active');
   }
});

// Scroll to 
const links = document.querySelectorAll('.scroll-link');
if (links.length > 0) {
   for (let i = 0; i < links.length; i++) {
      const link = links[i];
      link.addEventListener('click', function (e) {
         toggleClsasHeaderMenu();
         body.classList.remove('lock');
         for (let i = 0; i < links.length; i++) {
            links[i].classList.remove('_active');
         }
         e.preventDefault();
         link.classList.add('_active');
         const scrollToElem = document.querySelector(link.getAttribute('data-scrollTo'));
         if (scrollToElem) {
            if (scrollToElem.offsetHeight > window.innerHeight) {
               e.preventDefault();
               scrollToElem.scrollIntoView({
                  block: "start",
                  inline: "nearest",
                  behavior: "smooth"
               });
            } else {
               e.preventDefault();
               scrollToElem.scrollIntoView({
                  block: "center",
                  inline: "nearest",
                  behavior: "smooth"
               });
            }
         }
      });
   }
}
// Header menu
const burgerElem = document.documentElement.querySelector('.menu__burger')
const menuElem = document.documentElement.querySelector('.header__nav-menu')
const body = document.documentElement.querySelector('body')

burgerElem.addEventListener('click', toggleClsasHeaderMenu)

// Change header classes 
function toggleClsasHeaderMenu() {
   burgerElem.classList.toggle('_active')
   menuElem.classList.toggle('_active')
   body.classList.add('toggle')
}

/***** Controll date *****/
const days = [
   'Воскресенье',
   'Понедельник',
   'Вторник',
   'Среда',
   'Четверг',
   'Пятница',
   'Суббота'
]
// Data date
const schedulingTimes = [
   {from: 9, to: 10, lessonCount: 5},
   {from: 10, to: 11, lessonCount: 4},
   {from: 12, to: 13, lessonCount: 3},
   {from: 13, to: 15, lessonCount: 4},
   {from: 15, to: 16, lessonCount: 3},
]

const date = new Date()
const todayIndex = date.getDay()
const dayOfTheWeek = days[todayIndex]

const schedulingTitles = document.querySelectorAll('.scheduling__title')
let schedulingTodayItem
let schedulingTodayRow
let schedulingTodayTitle
let nowLessonIndex

function pickerLessons(classAciton) {
   for (let index = 0; index < schedulingTimes.length; index++) {
      if (schedulingTimes[index].from <= date.getHours() && date.getHours() <=schedulingTimes[index].to) {
         console.log(schedulingTimes[index]);
         if (schedulingTimes[index].lessonCount > index) {
            nowLessonIndex = index + 1 
         }
         console.log(nowLessonIndex);
      }
   }
   if (classAciton) {
      schedulingTodayRow = document.querySelector(`.scheduling:nth-child(${todayIndex + 1}) 
      table tbody tr:nth-child(${nowLessonIndex})`).classList.add('now')
   } else {
      schedulingTodayRow = document.querySelector(`.scheduling:nth-child(${todayIndex + 1}) 
      table tbody tr:nth-child(${nowLessonIndex})`).classList.remove('now')
   }
}

// Set day of the week
for (let index = 0; index < schedulingTitles.length; index++) {
   const titleText = schedulingTitles[index].textContent
   if (titleText === dayOfTheWeek) {
      schedulingTodayItem = document.querySelectorAll('.scheduling__item')[index]
      schedulingTodayTitle = document.querySelectorAll('.scheduling__item button')[index]
      schedulingTodayItem.classList.add('now')
   }
}