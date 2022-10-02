'use strict';

// Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить.
// При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
// a. Имя содержит только буквы.
// b. Телефон имеет вид +7(000)000-0000.
// c. E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
// d. Текст произвольный.
// e. Если одно из полей не прошло валидацию, необходимо выделить это поле красной рамкой
// и сообщить пользователю об ошибке.
   
const inputs = document.querySelectorAll('input');
const btnSubmit = document.querySelector('input[type="submit"]');

// class Validation {
//   constructor(form){

//   }
  
// }
    

function validation(form){
  const pattern = {
    name: /^[a-zа-я]+$/gi, 
    phone: /^\+\d{1}\(\d{3}\)\d{3}\-\d{4}$/,
    email: /^([\w\.-]+)@([\w\.-]+)\.([a-z\.]{2,6})$/i
    
  }
  form.forEach(el => {
    let regexp = pattern[el.name];
    //let bool = pattern[el.name].test(el.value);
    console.log(regexp.test(el.value));
  }) 
};

btnSubmit.addEventListener('click', (event)=>{
  event.preventDefault();
  validation(inputs);
})
  