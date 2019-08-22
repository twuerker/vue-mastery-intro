var eventBus = new Vue()

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      
      <div class="product-image">
        <img v-bind:src="image" :alt="imageText">
      </div>
      
      <div class="product-info">
        <h1>{{ title }}</h1>

        <p>{{ description }}</p>

        <p v-if="inStock">In Stock</p>
        <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>

        <div class="color-box"
            v-for="(variant, index) in variants"
            :key="variant.id"
            :style="{ backgroundColor: variant.color }"
            @mouseover="updateProduct(index)">
        </div>

        <button v-on:click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }">
            Add to Cart
        </button>

      </div>

      <product-tabs
          :details="details"
          :premium="premium"
          :reviews="reviews">
      </product-tabs>

    </div>
  `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      description: 'A pair of warm, fuzzy socks',
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        { 
          id: 2234, color: "green",
          image: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          imageText: "Green Socks",
          stock: 10
        },{ 
          id: 2235, color: "blue",
          image: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          imageText: "Blue Socks",
          stock: 0
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].image
    },
    imageText() {
      return this.variants[this.selectedVariant].imageText
    },
    inStock() {
      return this.variants[this.selectedVariant].stock > 0
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})



Vue.component('product-tabs', {
  props: {
    details: {
      type: Array,
      required: true
    },
    reviews: {
      type: Array,
      required: true
    },
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div>
      <span class="tab"
          :class="{ activeTab: selectedTab === tab}"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="selectedTab = tab">
        {{ tab }}
      </span>

      <product-details v-show="selectedTab === 'Details'"
          :details="details">
      </product-details>

      <product-shipping v-show="selectedTab === 'Shipping'"
          :premium="premium">
      </product-shipping>

      <product-reviews v-show="selectedTab === 'Reviews'"
          :reviews="reviews">
      </product-reviews>

      <product-review v-show="selectedTab === 'Write a Review'">
      </product-review>

    </div>
  `,
  data() {
    return {
      tabs: ['Details', 'Shipping', 'Reviews', 'Write a Review'],
      selectedTab: 'Details'
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product-shipping', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <p>
      Shipping: {{ shipping }}
    </p>
  `,
  computed: {
    shipping() {
      if (this.premium) {
        return "Free"
      } else {
        return "$2.99"
      }
    }
  }
})

Vue.component('product-reviews', {
  props: {
    reviews: {
      type: Array,
      required: true,
    }
  },
  template: `
    <div>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
        </li>
      </ul>
    </div>
  `
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
        <input type="submit" value="Submit">  
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
      } else {
        if(!this.name) this.errors.push("Name required.")
        if(!this.review) this.errors.push("Review required.")
        if(!this.rating) this.errors.push("Rating required.")
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    }
  }
})