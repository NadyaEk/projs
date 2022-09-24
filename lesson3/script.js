'use strict';

const API = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

class GoodsItem {
  constructor (id,title,price){
    this.id = id
    this.title = title
    this.price = price
  }
  
  renderGoodsItem () {
    return `<div class="goods-item" data-productId = "${this.id}">
              <img src="https://placeimg.com/200/200/people" alt="clothes">
              <h3>${this.title}</h3>
              <p>${this.price}</p>
              <button class="button-buy">Купить</button>
            </div>`
  };
}

class GoodsList {
  constructor(container = '.goods-list') {
    this.container = container;
    this.goods = [];
    this._getGoods()
      .then(data =>{
        this.goods = data;
        this._renderGoodsList();
      })
  }

  _getGoods(){
      return fetch(`${API}/catalogData.json`)
        .then(result => result.json())
        .catch(error => console.log(error))
  } 

  _renderGoodsList() {
    let list = "";
    this.goods.forEach(el => {
      let listEl = new GoodsItem(el.id_product,el.product_name,el.price) ;
      list += listEl.renderGoodsItem();
    })
    document.querySelector(this.container).innerHTML = list;
  }

  getTotalPrice(){
    return (this.goods.reduce((sum,item) => sum + item.price,0));
  }
}

let products = new GoodsList;


// открытие-закрытие корзины
let cartList = document.querySelector('.cart');
document.querySelector('.cart-button').addEventListener('click',(event) => {
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
              <div data-price>${this.price}</div>
              <div data-quantity>${this.quantity}</div>
              <div data-total>${this.price*this.quantity}</div>
              
              <button class="cart-del">x</button>
            </div>`
  };
}

class CartList {
  constructor(container = '.cart-header'){
    this.container = container;
    this.list = [];
    this._getCart()
      .then(data => {
        this.list = data.contents;
        console.log(this.list);
        this.renderCartList();
      })
  }

  _getCart() {
    return fetch(`${API}/getBasket.json`)
      .then(result => result.json())
      .catch(error => console.log(error));
  }

  renderCartList() {
    let cartList = "";
    this.list.forEach(el => {
      let listEl = new CartItem(el.id_product,el.product_name,el.price,el.quantity) ;
      cartList += listEl.renderNewCartItem();
    })
    document.querySelector(this.container).insertAdjacentHTML("afterend", cartList);

    document.querySelectorAll('.goods-item').forEach(el => {
      el.addEventListener('click', event => {
        if (event.target.tagName !== "BUTTON") {
          return;
        }
        const productEl = +event.target.closest('.goods-item').dataset.productid;
        this._addGood(productEl);
      })
    })
  }

  _addGood(id){
      const cartItem = document.querySelector(`.cart-item[data-productId = "${id}"]`);
      let quantity = +cartItem.querySelector(`div[data-quantity]`).textContent;
      const price = +cartItem.querySelector(`div[data-price]`).textContent;
      
      quantity++;
      console.log(quantity);
      cartItem.querySelector(`div[data-quantity]`).textContent = `${quantity}`;
      cartItem.querySelector(`div[data-total]`).textContent = `${quantity*price}`;
      

    // надо проверить, если товар с таким id уже есть в корзине, 
    //то надо просто увеличить количество товара
    // если нет товара, то вызвать метод renderNewCartItem() и добавить элемент
  } 


  removeGood(){}
    // если количество товара в корзине равно 1, то удалить товар полностью
    // если нет, то уменьшить количество этого товара в корзине
  
  changeGood(){}
  

  
  setCartTotal() {
    // размещает итоговую сумму всех товаров в корзине, подсчитывая сумму с
    // помощью метода getTotalPrice();
  }
}

let cart = new CartList;



 