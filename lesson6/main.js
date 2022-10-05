'use strict';

const API = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
  el: "#app",
  data: {
    catalogUrl: '/catalogData.json',
    imgCatalog: "https://placeimg.com/200/200/people",
    cartUrl: '/getBasket.json',
    goods: [],
    cartGoods: [],
    filteredGoods: [],
    show: false,
    searchString: "",
    // allGoods: [], 
    },
  methods:{
    addGood(good){
      this.getJson(`${API}/addToBasket.json`)
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
      this.getJson(`${API}/deleteFromBasket.json`)
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
    },
    getJson(url){
      return fetch(url)
            .then (result => result.json())
            .catch (error => console.log(error))
    },
    handleData(data){ 
      // принимает данные после функции json
      this.goods = data;
      this.filteredGoods = data;
    },
    
    filterGoods(){
      const regexp = new RegExp(this.searchString, 'i');
      this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
    },
  },
  
  mounted(){
  
    this.getJson(`${API + this.catalogUrl}`) 
      .then(data =>{
        //data => this.handleData(data)
        for (let el of data) {
          this.goods.push(el); //this.$data.goods.push(el);
          this.filteredGoods.push(el); // this.$data.filteredGoods.push(el);
        }
      } 
    ),
    // this.getJson(`getProducts.json`) //  у меня в хроме не работает! :(
    //   .then(data =>{
    //     //data => this.handleData(data)
    //     for (let el of data) {
    //       this.goods.push(el);
    //       this.filteredGoods.push(el);
    //     }
    //   } 
    // )
    this.getJson(`${API + this.cartUrl}`) 
      .then(data =>{
        //data => this.handleData(data)
        for (let el of data.contents) {
          this.cartGoods.push(el);
        }
      } 
    )
  }
})
