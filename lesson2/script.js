'use strict';

//const goods = 

class GoodsItem {
  constructor (id,title,price){
    this.id = id
    this.title = title
    this.price = price
  }
  
  renderGoodsItem () {
    return `<div class="goods-item">
              <img src="https://placeimg.com/200/200/people" alt="clothes">
              <h3>${this.title}</h3>
              <p>${this.price}</p>
              <button class="button-buy">Купить</button>
            </div>`
  };
}

  class GoodsList {
    constructor() {
      this.goods = [];
    }

  fetchGoods() {
    this.goods = [
      { id:1, title: 'Shirt', price: 150 },
      { id:2, title: 'Socks', price: 50 },
      { id:3, title: 'Jacket', price: 350 },
      { id:4, title: 'Shoes', price: 250 },
    ];
  } 
  renderGoodsList() {
    let list = "";
    this.goods.forEach(el => {
      let listEl = new GoodsItem(el.id,el.title,el.price) ;
      list += listEl.renderGoodsItem();
    })
    document.querySelector('.goods-list').innerHTML = list;
  }

  getTotalPrice(){
    return (this.goods.reduce((sum,item) => {return(sum + item.price)},0));
  }

  }
  

let products = new GoodsList;
products.fetchGoods();
products.renderGoodsList();
console.log(products.getTotalPrice());

// 1.Добавьте пустые классы для Корзины товаров и Элемента корзины товаров. Продумайте,
// какие методы понадобятся для работы с этими сущностями.
// 2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров

// открытие-закрытие корзины
let cartList = document.querySelector('.cart');
document.querySelector('.cart-button').addEventListener('click',(event) => { 
  //console.log(event.target);
  cartList.classList.toggle('hidden');
});

//let cart = {};

class CartItem extends GoodsItem {
  constructor (id,title,price,quantity){
    super(id,title,price);
    this.quantity = quantity; 
  }
  
  renderNewCartItem () {
    return `<div class="cart-item" data-productId = "${this.id}">
              <div>${this.title}</div>
              <div>${this.price}</div>
              div>${this.quantity}</div>
              div>${this.price*this.quantity}</div>
              <button class="cart-add">Добавить</button>
              <button class="cart-del">Удалить</button>
            </div>`
  };
}

class CartList {
  constructor(){
    this.list = [];
  }
  fetchCart(){
    this.list = [
      // получаем товары, отложенные в корзину
    ]
  }

  renderCartList() {
    let cartList = "";
    this.list.forEach(el => {
      let listEl = new CartItem(el.id,el.title,el.price,el.quantity) ;
      cartList += cartList.renderGoodsItem();
    })
    document.querySelector('.cart-header').insertAdjacentText("beforeend", cartList);
  }
  addToCart(){
    // надо проверить, если товар с таким id уже есть в корзине, 
    //то надо просто увеличить количество товара
    // если нет товара, то вызвать метод renderNewCartItem() и добавить элемент
  } 


  delFromCart(){}
    // если количество товара в корзине равно 1, то удалить товар полностью
    // если нет, то уменьшить количество этого товара в корзине
  
  setCartTotal() {
    // размещает итоговую сумму всех товаров в корзине, подсчитывая сумму с
    // помощью метода getTotalPrice();
  }
}

 