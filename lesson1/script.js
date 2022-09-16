'use strict';

const goods = [
{ id:1, title: 'Shirt', price: 150 },
{ id:2, title: 'Socks', price: 50 },
{ id:3, title: 'Jacket', price: 350 },
{ id:4, title: 'Shoes', price: 250 },
];

const renderGoodsItem = (product,img = "https://placeimg.com/200/200/people") => {
return `<div class="goods-item">
          <img src="${img}" alt="clothes">
          <h3>${product.title}</h3>
          <p>${product.price}</p>
          <button class="button-buy">Купить</button>
        </div>`
};

const renderGoodsList = (list) => {
// let goodsList = list.map(item => renderGoodsItem(item)).join("");
document.querySelector('.goods-list').innerHTML =  
  list.map(item => renderGoodsItem(item)).join("");
}
renderGoodsList(goods);