// variables
const openCart = document.querySelector(".open-cart");
const closeCart = document.querySelector(".close__cart");
const clearCart = document.querySelector(".clear__cart");
const cartTotal = document.querySelector(".cart__total");
const cartContent = document.querySelector(".cart__centent");
const productDom = document.querySelector(".productDom");
const menuDom = document.querySelector(".menu-dom");
const cartOverlay = document.querySelector(".cart__overlay");
const cartDom = document.querySelector(".cart");
const itemsTotal = document.querySelector(".cart-item-total");


// navbar active

let navbar = document.querySelector(".navbar");
document.querySelector("#bars-btn").onclick = () => {
  navbar.classList.toggle("active");
  search.classList.remove("active");
  cartOverlay.classList.remove("show");
  cartDom.classList.remove("show");};
// search active
let search = document.querySelector(".search-form");
document.querySelector("#search-btn").onclick = () => {
  search.classList.toggle("active");
  navbar.classList.remove("active");
  cartOverlay.classList.remove("show");
  cartDom.classList.remove("show");};
// cart items active
document.querySelector("#cart-btn").onclick = () => {
  cartOverlay.classList.toggle("show");
  cartDom.classList.toggle("show");
  navbar.classList.remove("active");
  search.classList.remove("active");
};
 
// remove active on scroll

window.onscroll = () => {
  navbar.classList.remove("active");
  search.classList.remove("active");
  cartOverlay.classList.remove("show");
  cartDom.classList.remove("show");

};


// cart
let cart = [];
let buttonDom = [];
let iconsDom = [];


class UI {
  // displayProudcts
  displayProudcts(obj) {
    let result = "";
    let result2 = "";

    obj.forEach(({ image, title, id, price }) => {
      if (id <= 6) {
        result += `      
        <div class="box">
          <img src=${image} alt="">
          <h3>${title}</h3>
         <div class="price"> $${price} <span>$20.99</span> </div>
          <button class="btn addToCart"  data-id=${id}> add to cart</button>
      </div>`;
      }

      if (id > 6) {
        result2 += `
        <div class="box">
        <div class="icons">
            <a class="fas fa-shopping-cart addcart" data-id=${id}></a>
            <a class="fas fa-heart"></a>
            <a class="fas fa-eye"></a>

        </div>
        <div class="image">
            <img src=${image} alt="">
        </div>
        <div class="content">
            <h3>${title}</h3>
            <div class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>

            </div>
            <div class="price"> $${price} <span>$20.99</span> </div>

        </div>
    </div>
        `;
      }
    });
    menuDom.innerHTML = result;
    productDom.innerHTML = result2;
  }
  // getButtons
  getButtons() {
    const buttons = [...document.querySelectorAll(".addToCart")];
    buttonDom = buttons;
    buttons.forEach((button) => {
      const id = button.dataset.id;
      const inCart = cart.find((item) => item.id == id, 10);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        // get product from products
        const cartItem = { ...Storage.getProudcts(id), amount: 1 };
        // add product to cart
        cart = [...cart, cartItem];
        // store the product in local storage
        Storage.saveCart(cart);
        // setItems
        this.setItemsValue(cart);
        // display the item in cart
        this.addToCart(cartItem);
      });
    });
  }
    // getButtons
    geticons() {
        const icons = [...document.querySelectorAll(".addcart")];
        iconsDom = icons;
        icons.forEach((button) => {
          const id = button.dataset.id;
          const inCart = cart.find((item) => item.id === id, 10);
          if (inCart) {
            button.disabled = true;
          }
          button.addEventListener("click", (e) => {
            e.preventDefault();
            e.target.disabled = true;
            // get product from products
            const cartItem = { ...Storage.getProudcts(id), amount: 1 };
            // add product to cart
            cart = [...cart, cartItem];
            // store the product in local storage
            Storage.saveCart(cart);
            // setItems
            this.setItemsValue(cart);
            // display the item in cart
            this.addToCart(cartItem);
          });
        });
      }
  // setItemsValue
  setItemsValue(cart) {
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemTotal += item.amount;
    });
    itemsTotal.innerText = itemTotal;
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  }
  // addToCart
  addToCart({ title, price, id, image }) {
    let div = document.createElement("div")
    div.classList.add("cart__item")
    div.innerHTML = `
    
    
    <img src=${image} alt="">
    <div>
      <h3>${title}</h3>
      <h3 class="price">$${price}</h3>
    </div>
    <div>
      <span class="increase" data-id=${id}> <i class="fa fa-chevron-up"></i></span>

      <p>1</p>
      <span class="decrease" data-id=${id}> <i class="fa fa-chevron-down"></i></span>

    </div>

    <div>
      <span class="remove__item" data-id=${id}>
       <i  class="fa fa-trash"></i>
      </span>
    </div>
    
    
    `
    cartContent.appendChild(div)
  }
  // show
      show() {
      cartDom.classList.add("show");
      cartOverlay.classList.add("show");
    } 
  // hide
      hide() {
      cartDom.classList.remove("show");
      cartOverlay.classList.remove("show");
    } 
  // populate
     populate(cart) {
      cart.forEach(item => this.addToCart(item));
    } 
  // setApp
     setApp() {
      cart = Storage.getCart();
      this.setItemsValue(cart);
      this.populate(cart);
      openCart.addEventListener("click", this.show)
      closeCart.addEventListener("click", this.hide)
  
  
    } 
  // cartLogic
       cartLogic() {
      // Clear Cart
      clearCart.addEventListener("click", () => {
        this.clearCart();
        this.hide();
      });
  
      // Cart Functionality
      cartContent.addEventListener("click", e => {
        const target = e.target.closest("span");
        const targetElement = target.classList.contains("remove__item");
        if (!target) return;
  
        if (targetElement) {
          const id = parseInt(target.dataset.id);
          this.removeItem(id);
          cartContent.removeChild(target.parentElement.parentElement);
        } else if (target.classList.contains("increase")) {
          const id = parseInt(target.dataset.id, 10);
          let tempItem = cart.find(item => item.id === id);
          tempItem.amount++;
          Storage.saveCart(cart);
          this. setItemsValue(cart);
          target.nextElementSibling.innerText = tempItem.amount;
        } else if (target.classList.contains("decrease")) {
          const id = parseInt(target.dataset.id, 10);
          let tempItem = cart.find(item => item.id === id);
          tempItem.amount--;
  
          if (tempItem.amount > 0) {
            Storage.saveCart(cart);
            this. setItemsValue(cart);
            target.previousElementSibling.innerText = tempItem.amount;
          } else {
            this.removeItem(id);
            cartContent.removeChild(target.parentElement.parentElement);
          }
        }
      });
    } 
  // clearCart
    clearCart() {
      const cartItems = cart.map(item => item.id);
      cartItems.forEach(id => this.removeItem(id));
  
      while (cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0]);
      }
    } 
  // removeItem
      removeItem(id) {
      cart = cart.filter(item => item.id !== id);
      this.setItemsValue(cart);
      Storage.saveCart(cart);
  
      let button = this.singleButton(id);
      button.disabled = false;
      button.innerText = "Add to Cart";
    } 
  // singleButton
    singleButton(id) {
      return buttonDom.find(button => parseInt(button.dataset.id) === id);
    } 
}
// products

class Products {
  async getProducts() {
    try {
      const results = await fetch("products.json");
      const data = await results.json();
      let product = data.items;
      return product;
    } catch (error) {
      console.log(err);
    }
  }
}

// storage

class Storage {
  static saveProduct(obj) {
    localStorage.setItem("proudcts", JSON.stringify(obj));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getProudcts(id) {
    const proudcts = JSON.parse(localStorage.getItem("proudcts"));
    return proudcts.find((item) => item.id === parseInt(id));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = new Products();
  const ui = new UI();
   ui.setApp()
  const productObje = await products.getProducts();
  ui.displayProudcts(productObje);
  Storage.saveProduct(productObje);
  ui.getButtons();
  ui.geticons();

   ui.cartLogic()
});
