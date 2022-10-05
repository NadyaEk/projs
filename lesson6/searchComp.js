Vue.component('search',{
  props: ["searchString"],
  
  template: 
    `<form class="search" @submit.prevent="$parent.filterGoods">
        <input type="text" class="search-imput" v-model="$parent.searchString">
        <button class="search-button" type="submit">&#128269</button>
    </form>`
});