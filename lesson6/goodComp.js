Vue.component('goods-list', {
  props: ['goods','img'],
  
  template: `
    <div class="goods-list">
    <goods-item v-for="good in goods" 
      :img="img" 
      :good="good" 
      :key="good.id_product">
    </goods-item>
    </div>
    `
});

Vue.component('goods-item', {
  props: ['good','img'],
  template: `
    <div class="goods-item" :key="good.id_product">
      <img :src="img" :alt="good.product_name"></div>
      <h3>{{ good.product_name }}</h3>
      <p>{{ good.price }}</p>
      <button class="button-buy" @click="$root.addGood(good)">Купить</button>
    </div>
  `
  //"$parent.$emit('add-good',good) для высоко нагруженных систем
}); 
