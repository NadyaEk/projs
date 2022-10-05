'use strict';



Vue.component('cart-list', {
  props: ['items','show'],
  
  template:`
      <div class="cart" v-show="show">
        <div class="cart-header" v-if="$root.cartGoods.length">
          <div>Название товара</div>
          <div>Стоимость товара</div>
          <div>Количество</div>
          <div>Общая стоимость</div>
        </div>
        <div class="cart-empty" v-if="!$root.cartGoods.length">Корзина пуста</div>
        <cart-item class="cart-info" v-for="item of items" :key="item.id_product"></cart-item>
      </div>
  `
});

Vue.component('cart-item',{
  props:['item'],
  
  template:`
    <div class="cart-item" :key="item.id_product">
            <div>{{ item.product_name }}</div>
            <div>{{ item.price }}</div>
            <div>{{ item.quantity }}</div>
            <div>{{ item.price*item.quantity }}</div>
            <button class="cart-del" @click="$root.removeGood(item)">x</button>
    </div>
  `
});