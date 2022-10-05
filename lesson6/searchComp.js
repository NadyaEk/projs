Vue.component('search',{
  props: ["searchString"],
  
  template: 
    `<form class="search" @submit.prevent="$parent.filterGoods">
        <input type="text" class="search-input" v-model="$parent.searchString">
        <button class="search-button" type="submit">&#128269</button>
    </form>
    `
    // `
    // <div class="search">
    //     <input type="text" class="search-input" v-model="$parent.search-string">
    //     <button class="search-button" type="button" @click="$parent.filterGoods">&#128269</button>
    //   </div>
    // `
});