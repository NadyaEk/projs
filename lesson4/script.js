'use strict';

const API = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";


/**
 *  Базовый класс для списков продуктов и корзины
 * @param url - путь к  json, где будем брать товары
 * @param container - имя блока куда выводим товары (каталог или корзина)
 * @param list - параметр определяющий, выводим товары каталога или корзины
 * 
 */
class List {
  constructor(url,container,list = listAll){
    this.url = url;
    this.container = container;
    this.list = list; // объект, содержащий названия классов каталога и корзины
    this.goods = []; // массив для json
    this.filteredGoods = [];// массив для фильтрованных товаров
    this.allGoods = []; // массив товаров
    this._init(); //  инициализация и заполнение продуктами массива
  }
  getJson(url){
    return fetch(url ? url : `${API+ this.url}`)
            .then (result => result.json())
            .catch (error => console.log(error))
  }

  handleData(data){ // принимает данные после функции json?
    this.goods = data;
    this.filteredGoods = data;
    this.render(); // общий вывод товаров корзины или каталога на экран 
  }

  render(){
    const block = document.querySelector(this.container);
    
    let arr = [];
    if (this.constructor.name === "CartList") {
      arr = this.goods;
    } else { 
      arr = this.filteredGoods;
      block.textContent = '';
    }
    for (let el of arr) {
      let goodsEl = new this.list[this.constructor.name](el);
      this.allGoods.push(el);
      block.insertAdjacentHTML('beforeend',goodsEl.render());
    }
  }

  getTotalPrice(){
    return (this.allGoods.reduce((sum,item) => sum + item.price,0));
  }

}
// Базовый класс для товара каталога или корзины
class Item {
  constructor (el,img = `https://placeimg.com/200/200/people`){
    this.id = el.id_product;
    this.title = el.product_name;
    this.price = el.price;
    this.img = img;
  }
  
  render() {
    return `<div class="goods-item" data-productId = "${this.id}">
              <img src="${this.img}" alt="clothes">
              <h3>${this.title}</h3>
              <p>${this.price}</p>
              <button class="button-buy" 
                data-productId="${this.id}" 
                data-name='${this.title}'
                data-price='${this.price}'>Купить</button>
            </div>`
  };
}

class GoodsList extends List {
  constructor(cart,url = `/catalogData.json`,container = '.goods-list'){
    super (url,container);
    this.cart = cart;
    this.getJson()
        .then (data => this.handleData(data));
    
  }
  filterGoods(value) {
    const regexp = new RegExp(value, 'i');
    
    this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
    this.render();
  }
  _init(){
     document.querySelector(this.container).addEventListener('click', event => {
      if (event.target.tagName !== "BUTTON") {
        return;
      }
      const productEl = event.target; 
      this.cart.addGood(productEl);
    })
    document.querySelector('.search').addEventListener('input', (e) => {
      const value = document.querySelector('.search-imput').value;
      if (value) {
        //console.log(value);
        this.filterGoods(value);
      } else {
        this.filteredGoods = this.goods;
        this.render();
      }
    });
  }
}

class GoodsItem extends Item {}

class CartList extends List {
  constructor(url = `/getBasket.json`,container = '.cart'){
    super (url,container);
    this.getJson()
        .then (data => this.handleData(data.contents));
  }

  addGood(element){
    this.getJson(`${API}/addToBasket.json`)
        .then (data =>{
          if (data.result === 1){
            const elementId = +element.dataset['productid'];
            let find = this.allGoods.find(product => product.id_product === elementId);
            if (find) {
              find.quantity++;
              this._changeCart(find);
            } else {
              let product = {
                id_product: elementId,
                price: +element.dataset['price'],
                product_name: element.dataset['name'],
                quantity: 1
              }
            document.querySelector('.cart-empty').classList.add('hidden');
            document.querySelector('.cart-header').classList.remove('hidden');
            this.goods=[product];
            this.render();
            }
          } else { alert('Доступ запрещен!')}
        }) 
  }

  removeGood(element){
    this.getJson(`${API}/deleteFromBasket.json`) 
      .then (data => {
        if (data.result === 1){
          const elementId = +element.dataset['productid'];
          let find = this.allGoods.find(product => product.id_product === elementId);
          if (find.quantity > 1) {
            find.quantity--;
            this._changeCart(find);
          } else {
            this.allGoods.splice(this.allGoods.indexOf(find),1);
            document.querySelector(`.cart-item[data-productid = "${elementId}"]`).remove();
            if (this.allGoods.length === 0) {
              document.querySelector('.cart-empty').classList.remove('hidden');
              document.querySelector('.cart-header').classList.add('hidden');
            }
          }
        } else { alert('Доступ запрещен!')}
      })  
  }

  _changeCart(product){
    const cartItem = document.querySelector(`.cart-item[data-productId = "${product.id_product}"]`);
    cartItem.querySelector(`div[data-quantity]`).textContent = `${product.quantity}`;
    cartItem.querySelector(`div[data-total]`).textContent = `${product.quantity*product.price}`;
  }
  
  _init(){ 
    // вешаем обработчик события клик на кнопку открытия-закрытия корзины
    document.querySelector('.cart-button').addEventListener('click',() => {
      document.querySelector(this.container).classList.toggle('hidden');
    });
    // вешаем обработчики событий на кнопку  "Удалить"
    document.querySelector(this.container).addEventListener('click', event => {
        if (event.target.tagName !== "BUTTON") {
          return;
        }
        const productEl = event.target.closest('.cart-item');
        this.removeGood(productEl);
    })
  }
}

class CartItem extends Item {
  constructor(el,img = ""){
    super(el,img);
    this.quantity=el.quantity;
  }
  render(){
    return `<div class="cart-item" data-productId = "${this.id}">
              <div>${this.title}</div>
              <div data-price>${this.price}</div>
              <div data-quantity>${this.quantity}</div>
              <div data-total>${this.price*this.quantity}</div>
              <button class="cart-del">x</button>
            </div>`
  }
}

const listAll = {
  GoodsList: GoodsItem,
  CartList: CartItem
}

let cart = new CartList();
let products = new GoodsList(cart);

//------------------------------------------------------------------------------



// class GoodsItem {
//   constructor (id,title,price){
//     this.id = id
//     this.title = title
//     this.price = price
//   }
  
//   renderGoodsItem() {
//     return `<div class="goods-item" data-productId = "${this.id}">
//               <img src="https://placeimg.com/200/200/people" alt="clothes">
//               <h3>${this.title}</h3>
//               <p>${this.price}</p>
//               <button class="button-buy" 
//                 data-productId = "${this.id}" 
//                 data-name = '${this.title}'
//                 data-price= '${this.price}'>Купить</button>
//             </div>`
//   };
// }

// class GoodsList {
//   constructor(cart, container = '.goods-list') {
//     this.container = container;
//     this.cart = cart;
//     this.goods = [];
//     this.allGoods = [];
//     this._getGoods()
//       .then(data =>{
//         this.goods = data;
//         this._renderGoodsList();
//       })
//   }

//   _getGoods(){
//       return fetch(`${API}/catalogData.json`)
//         .then(result => result.json())
//         .catch(error => console.log(error))
//   } 

//   _renderGoodsList() {
//     const block = document.querySelector(this.container);
//     for (let el of this.goods) {
//       let goodsEl = new GoodsItem(el.id_product,el.product_name,el.price);
//       this.allGoods.push(el);
//       block.insertAdjacentHTML('beforeend',goodsEl.renderGoodsItem());
//     }

//     document.querySelectorAll('.goods-item').forEach(el => {
//       el.addEventListener('click', event => {
//         if (event.target.tagName !== "BUTTON") {
//           return;
//         }
//         const productEl = event.target; //.closest('.goods-item');
//         this.cart.addGood(productEl);
//       })
//     })  
//   }

//   getTotalPrice(){
//     return (this.allGoods.reduce((sum,item) => sum + item.price,0));
//   }
// }

// class CartItem extends GoodsItem {
//   constructor (id,title,price,quantity){
//     super(id,title,price);
//     this.quantity = quantity; 
//   }
  
//   renderNewCartItem () {
//     return `<div class="cart-item" data-productId = "${this.id}">
//               <div>${this.title}</div>
//               <div data-price>${this.price}</div>
//               <div data-quantity>${this.quantity}</div>
//               <div data-total>${this.price*this.quantity}</div>
//               <button class="cart-del">x</button>
//             </div>`
//   };
// }

// class CartList {
//   constructor(container = '.cart'){
//     this.container = container;
//     this.goods = [];
//     this.allGoods = [];
//     this._openCart();
//     this._getCart()
//       .then(data => {
//         this.goods = data.contents;
//         this.renderCartList();
//       })
//   }

//   _getCart() {
//     return fetch(`${API}/getBasket.json`)
//       .then(result => result.json())
//       .catch(error => console.log(error));
//   }

//   renderCartList() {
//     for (let el of this.goods) {
//       let cartListEl = new CartItem(el.id_product,el.product_name,el.price,el.quantity);
//       this.allGoods.push(el);
//       document.querySelector(`${this.container}-info`).insertAdjacentHTML("beforeend",`${cartListEl.renderNewCartItem()}`);
//     } 
//     document.querySelector(this.container).addEventListener('click', event => {
//         if (event.target.tagName !== "BUTTON") {
//           return;
//         }
//         const productEl = event.target.closest('.cart-item');
//         this.removeGood(productEl);
//       })
//   }
  
//   addGood(element){
//       const elementId = +element.dataset['productid'];
//       let find = this.allGoods.find(product => product.id_product === elementId);
//       if (find) {
//         find.quantity++;
//         this._changeCart(find);
//       } 
//       else {
//         let product = {
//           id_product: elementId,
//           price: +element.dataset['price'],
//           product_name: element.dataset['name'],
//           quantity: 1
//         }
//       this.goods=[product];
//       this.renderCartList();
//     }
//   }

//   removeGood(element){
//       const elementId = +element.dataset['productid'];
//       let find = this.allGoods.find(product => product.id_product === elementId);
//       if (find.quantity > 1) {
//         console.log(find.quantity--);
//         this._changeCart(find);
//       } 
//       else {
//         this.allGoods.splice(this.allGoods.indexOf(find),1);
//         document
//         .querySelector(`.cart-item[data-productid = "${elementId}"]`).remove();
//       }
//   }
  
//   _changeCart(product){
//     const cartItem = document.querySelector(`.cart-item[data-productId = "${product.id_product}"]`);
//     cartItem.querySelector(`div[data-quantity]`).textContent = `${product.quantity}`;
//     cartItem.querySelector(`div[data-total]`).textContent = `${product.quantity*product.price}`;
//   }
//   _openCart() {
//     document.querySelector('.cart-button').addEventListener('click',() => {
//       document.querySelector(this.container).classList.toggle('hidden');
//     });
//   }
//   setCartTotal() {
//     // размещает итоговую сумму всех товаров в корзине, подсчитывая сумму с
//     // помощью метода getTotalPrice();
//   }
// }
// let cart = new CartList();
// let products = new GoodsList(cart);