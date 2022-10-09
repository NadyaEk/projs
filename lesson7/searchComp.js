const search = {
  data() {
    return{
      searchString: "",
    }
  },
  template: 
    `<form class="search" @input.prevent="$root.$refs.goods_list.filterGoods(searchString)">
        <input type="text" class="search-input" v-model="searchString">
        <button class="search-button" type="input">&#128269</button>
    </form>
    `
}