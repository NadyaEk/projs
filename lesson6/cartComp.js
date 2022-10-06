Vue.component('cart-list', {
  props: ['items','show'],
  
  template:
  `
      <div class="cart" v-show="show">
        <div class="cart-header" v-if="items.length">
          <div>Название товара</div>
          <div>Стоимость товара</div>
          <div>Количество</div>
          <div>Общая стоимость</div>
        </div>
        <div class="cart-empty" v-if="!items.length">Корзина пуста</div>
        <div class="cart-info">
          <cart-item class="cart-item" :item="item" v-for="item of items"></cart-item>
        </div>
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
            <button class="cart-del" @click="$parent.$emit('remove-good',item)">x</button>
    </div>
  `
});
// "$root.removeGood(item)"