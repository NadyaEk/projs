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
    this.render(); // общий вывод товаров корзины или каталога на экран 
  }

  render(){
    const block = document.querySelector(this.container);
    for (let el of this.goods) {
      let goodsEl = new this.list[this.constructor.name](el);
      this.allGoods.push(el);
      block.insertAdjacentHTML('beforeend',goodsEl.render());
    }
    //console.log(this.allGoods);
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

  _init(){
     document.querySelector(this.container).addEventListener('click', event => {
      if (event.target.tagName !== "BUTTON") {
        return;
      }
      const productEl = event.target; //.closest('.goods-item');
      this.cart.addGood(productEl);
    })
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
          }
        } else { alert('Доступ запрещен!')}
      })  
  }

  _changeCart(product){
    const cartItem = document.querySelector(`.cart-item[data-productId = "${product.id_product}"]`);
    cartItem.querySelector(`div[data-quantity]`).textContent = `${product.quantity}`;
    //cartItem.querySelector(`div[data-price]`).textContent = `${product.price}`;
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
//   constructor(container = '.goods-list') {
//     this.container = container;
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
//       this.allGoods.push(goodsEl);
//       block.insertAdjacentHTML('beforeend',goodsEl.renderGoodsItem());
//     }

//     document.querySelectorAll('.goods-item').forEach(el => {
//       el.addEventListener('click', event => {
//         if (event.target.tagName !== "BUTTON") {
//           return;
//         }
//         const productEl = event.target; //.closest('.goods-item');
//         this._addGood(productEl);
//       })
//     })  

    // let list = "";
    // this.goods.forEach(el => {
    //   let listEl = new GoodsItem(el.id_product,el.product_name,el.price) ;
    //   list += listEl.renderGoodsItem();
    // })
    // document.querySelector(this.container).innerHTML = list;
  //}

//   getTotalPrice(){
//     return (this.goods.reduce((sum,item) => sum + item.price,0));
//   }
// }

// class CartItem extends GoodsItem {
//   constructor (id,title,price,quantity){
//     super(id,title,price);
//     this.quantity = quantity; 
//     //this._renderNewCartItem;
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
//     this.list = [];
//     this._openCart();
//     this._getCart()
//       .then(data => {
//         this.list = data.contents;
//         console.log(this.list);
//         this.renderCartList();
//       })
//   }

//   _openCart() {
//     document.querySelector('.cart-button').addEventListener('click',() => {
//       document.querySelector(this.container).classList.toggle('hidden');
//     });
//   }

//   _getCart() {
//     return fetch(`${API}/getBasket.json`)
//       .then(result => result.json())
//       .catch(error => console.log(error));
//   }

//   renderCartList() {
//     //let cartList = "";
//     for (let el of this.list) {
//       let cartListEl = new CartItem(el.id_product,el.product_name,el.price,el.quantity);
//       document.querySelector(`${this.container}-info`).insertAdjacentHTML("beforeend",`${cartListEl.renderNewCartItem()}`);
//     } 
//   }
//   _addGood(element){
//     //this.get
//       const elementId = +element.dataset['productid'];
//       let find = this.list.find(product => product.id_product === elementId);
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
//       console.log(this.list);
//       this.list.push(product);
//       this.renderCartList();
//     }
//   }

//   _removeGood(element){
//       const elementId = +element.dataset['productid'];
//       let find = this.list.find(product => product.id_product === elementId);
//       if (find.quantity > 1) {
//         console.log(find.quantity--);
//         this._changeCart(find);
//       } 
//       else {
//         this.list.splice(this.list.indexOf(find),1);
//         document
//         .querySelector(`.cart-item[data-productid = "${elementId}"]`).remove();
//       }
//       console.log(this.list);
//   }
  
//   _changeCart(product){
//     const cartItem = document.querySelector(`.cart-item[data-productId = "${product.id_product}"]`);
//     cartItem.querySelector(`div[data-quantity]`).textContent = `${product.quantity}`;
//     cartItem.querySelector(`div[data-price]`).textContent = `${product.price}`;
//     cartItem.querySelector(`div[data-total]`).textContent = `${product.quantity*product.price}`;
//   }
  
//   setCartTotal() {
//     // размещает итоговую сумму всех товаров в корзине, подсчитывая сумму с
//     // помощью метода getTotalPrice();
//   }
// }

// let products = new GoodsList;
// let cart = new CartList;

// document.querySelectorAll('.goods-item').forEach(el => {
    //   el.addEventListener('click', event => {
    //     if (event.target.tagName !== "BUTTON") {
    //       return;
    //     }
    //     const productEl = event.target; //.closest('.goods-item');
    //     this._addGood(productEl);
    //   })
    // })
  //   document.querySelectorAll('.cart-item').forEach(el => {
  //     el.addEventListener('click', event => {
  //       if (event.target.tagName !== "BUTTON") {
  //         return;
  //       }
  //       const productEl = event.target.closest('.cart-item');
  //       this._removeGood(productEl);
  //     })
  // })

 