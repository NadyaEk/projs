Vue.component('search',{
  props: ["searchString"],
  
  template: 
    `<form class="search" @input.prevent="$parent.filterGoods">
        <input type="text" class="search-input" v-model="$parent.searchString">
        <button class="search-button" type="input">&#128269</button>
    </form>
    `
});