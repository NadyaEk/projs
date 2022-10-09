//
const cartItem = {
  props:['item'],
  
  template:`
      <div class="cart-item" :key="item.id_product">
            <div>{{ item.product_name }}</div>
            <div>{{ item.price }}</div>
            <div>{{ item.quantity }}</div>
            <div>{{ item.price*item.quantity }}</div>
            <button class="cart-del" @click="$parent.removeGood(item)">x</button>
    </div>
  `
}

const cart_list = {
  props: ['show'],
  components: {'cart-item':cartItem},
  data() {
    return {
      cartUrl: '/getBasket.json',
      cartGoods: [],
    }    
  },
  mounted(){
    this.$parent.getJson(`${API + this.cartUrl}`) 
      .then(data =>{
        for (let el of data.contents) {
          this.cartGoods.push(el);
        }
      } 
    )
  },
  methods: {
    addGood(good){
      this.$parent.getJson(`${API}/addToBasket.json`)
        .then (data =>{
          if (data.result === 1){
            let find = this.cartGoods.find(el => el.id_product === good.id_product);
              if (find){
                find.quantity++;
              } else {
                // старая версия
                this.$set(good,'quantity',1);
                this.cartGoods.push(good);
                // const cartItem = Object.assign({quantity: 1},good)
                // this.cartGoods.push(cartItem); Новая версия
              }
          } else { 
              alert ('доступ запрещен')
            }})
    },
    removeGood(item){
      this.$parent.getJson(`${API}/deleteFromBasket.json`)
        .then (data => {
          if (data.result === 1){
            let find = this.cartGoods.find(el => el.id_product === item.id_product);
        if (find.quantity > 1){
          find.quantity--;
        } else {
          this.cartGoods.splice(this.cartGoods.indexOf(find),1);
        }
          } else { alert('Доступ запрещен!')}
        }) 
    }
  },
  template: `
    <div class="cart" v-show="$parent.show">
        <div class="cart-header" v-if="cartGoods.length">
          <div>Название товара</div>
          <div>Стоимость товара</div>
          <div>Количество</div>
          <div>Общая стоимость</div>
        </div>
        <div class="cart-empty" v-if="!cartGoods.length">Корзина пуста</div>
        <div class="cart-info">
          <cart-item class="cart-item" v-for="item of cartGoods"
          :key="item.id_product"
          :item="item"></cart-item>
        </div>
      </div>
  `
}
// "$root.removeGood(item)"