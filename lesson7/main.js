const API = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
  el: "#app",
  data: {
    catalogUrl: '/catalogData.json',
    imgCatalog: "https://placeimg.com/200/200/people",
    goods: [],
    filteredGoods: [],
    show: false,
    },
  components: {cart_list,goods_list,search }, //
  methods:{ 
    getJson(url){
      return fetch(url)
            .then (result => result.json())
            .catch (error => console.log(error))
    }, 
   
  },
})

