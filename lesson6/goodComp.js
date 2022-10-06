Vue.component('goods-list', {
  props: ['goods','img'],
  
  template: `
    <div class="goods-list">
      <good-item v-for="good in goods" :img="img" :good="good" :key="good.id_product">
      </good-item>
    </div>
    `
});

Vue.component('good-item', {
  props: ['good','img'],

  template: `
    <div class="goods-item" :key="good.id_product">
      <img :src="img" :alt="good.product_name">
      <h3>{{ good.product_name }}</h3>
      <p>{{ good.price }}</p>
      <button class="button-buy" @click="$parent.$emit('add-good',good)">Купить</button>
    </div>
  `
  //"$root.addGood(good)" для высоко нагруженных систем
}); 
