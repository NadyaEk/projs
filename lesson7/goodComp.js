// задаем компоненты с помощью const

// Вложенный компонент в goods_list
const good_item = {
  props: ['img','good'],

  template: `
    <div class="goods-item" :key="good.id_product">
      <img :src="img" :alt="good.product_name">
      <h3>{{ good.product_name }}</h3>
      <p>{{ good.price }}</p>
      <button class="button-buy" @click="$root.$refs.cart_list.addGood(good)">Купить</button>
    </div>
  `
// @click="$parent.$emit('add-good',good)" - меняем на 
// @click="$root.$refs.cart_list.addGood(good)" 
// обращаемся к методу по ссылке $refs.cart_list.addGood к методу addGood компонента cart_list
}

const goods_list = {
  components: {good_item}, // так включаем в goods_list вложенный компонент good
  data() {
    return {
      catalogUrl: '/catalogData.json',
      imgCatalog: "https://placeimg.com/200/200/people",
      goods: [],
      filteredGoods: [],
    }
  },
  mounted() {
    this.$parent.getJson(`${API + this.catalogUrl}`) 
      .then(data =>{
        for (let el of data) {
          this.goods.push(el); //this.$data.goods.push(el);
          this.filteredGoods.push(el); // this.$data.filteredGoods.push(el);
        }
      } 
    )
  },
  methods: {
    filterGoods(string){
      const regexp = new RegExp(string, 'i');
      this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
    },
  },

  template: `
    <div class="goods-list">
      <good_item v-for="good in filteredGoods" 
      :img="imgCatalog" 
      :good="good" 
      :key="good.id_product">
      </good_item>
    </div>
    `

}
