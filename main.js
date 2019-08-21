var app = new Vue({
  el: '#app',
  data: {
    product: 'Socks',
    description: 'A pair of warm, fuzzy socks',
    image: './assets/vmSocks-green.png',
    imageText: 'Green Socks',
    inStock: true,
    details: ["80% cotton", "20% polyester", "Gender-neutral"],
    variants: [
      { 
        id: 2234, color: "green",
        image: './assets/vmSocks-green.png',
        imageText: "Green Socks"
      },{ 
        id: 2235, color: "blue",
        image: './assets/vmSocks-blue.png',
        imageText: "Blue Socks"
      }
    ],
    cart: 0
  },
  methods: {
    addToCart: function() {
      this.cart += 1
    },
    removeFromCart: function() {
      this.cart -= 1
    },
    updateProduct: function(variant) {
      this.image = variant.image
      this.imageText = variant.imageText
    }
  }
})