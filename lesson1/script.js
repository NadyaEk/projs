'use strict';

const goods = [
{ title: 'Shirt', price: 150 },
{ title: 'Socks', price: 50 },
{ title: 'Jacket', price: 350 },
{ title: 'Shoes', price: 250 },
];

const renderGoodsItem = (title, price,img = "https://placeimg.com/200/200/people") => {
return `<div class="goods-item">
  <img src="${img}" alt="clothes">
  <h3>${title}</h3>
  <p>${price}</p></div>`;
};

const renderGoodsList = (list) => {
let goodsList = list.map(item => renderGoodsItem(item.title, item.price)).join("");
document.querySelector('.goods-list').insertAdjacentHTML("beforeend", goodsList);
}
renderGoodsList(goods);