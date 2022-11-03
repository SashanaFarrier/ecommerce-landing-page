const header = document.querySelector("header");
const toggleMenu = document.querySelector(".toggle-menu");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navCloseBtn = document.querySelector("header .close-btn");
const navbar = document.querySelector(".navbar");
const navOverlay = document.querySelector("header .overlay");
const popupOverlay = document.querySelector(".popup-overlay");
const popup = document.querySelector(".popup");
const popupCloseBtn = document.querySelector(".popup .close-btn");

const prevBtns = document.querySelectorAll(".prevBtn");
const nextBtns = document.querySelectorAll(".nextBtn");
const mainSlides = document.querySelectorAll(".main__gallery .slide");
const popupSlides = document.querySelectorAll(".popup .slide");
const galleryThumbnail = document.querySelectorAll(".gallery--thumbnail");
const quantityInput = document.getElementById("quantity");
const decrementBtn = document.querySelector(".decrementBtn");
const incrementBtn = document.querySelector(".incrementBtn");

const cart = document.querySelector(".cart");
const cartLabel = document.querySelector(".cart-label");
const cartItemsContainer = document.querySelector(".cart-items__container");
const addToCartBtn = document.querySelector("#add-to-cart-btn");
const checkoutBtn = document.querySelector(".checkout-btn");

const currItemPrice = document.querySelector(".curr-item-price").textContent;
const cartContainer = document.querySelector(".cart__container");

// let counter = +quantityInput.value;
let counter = 1;

mobileToggleNav();
popupToggle();
moveSlides();
getQuantity();
showCart();

addToCartBtn.addEventListener("click", addToCart);

function mobileToggleNav() {
  hamburgerMenu.addEventListener("click", function () {
    navbar.classList.toggle("active");
    hamburgerMenu.classList.toggle("hidden");
    navCloseBtn.classList.toggle("hidden");
    navOverlay.classList.toggle("hidden");
  });

  navCloseBtn.addEventListener("click", function () {
    navbar.classList.toggle("active");
    navCloseBtn.classList.toggle("hidden");
    hamburgerMenu.classList.toggle("hidden");
    navOverlay.classList.toggle("hidden");
  });

  navOverlay.addEventListener("click", function () {
    navbar.classList.toggle("active");
    closeBtn.classList.toggle("hidden");
    hamburgerMenu.classList.toggle("hidden");
    navOverlay.classList.toggle("hidden");
  });
}

function popupToggle() {
  popupCloseBtn.addEventListener("click", function () {
    popup.classList.toggle("hidden");
    popupOverlay.classList.toggle("hidden");
  });
}

// SLIDER

let currentSlidePosition = 0;

function moveSlides() {
  const goToSlide = (slide) => {
    mainSlides.forEach(
      (s) => (s.style.transform = `translateX(-${100 * slide}%)`)
    );

    popupSlides.forEach(
      (s) => (s.style.transform = `translateX(-${100 * slide}%)`)
    );
  };

  const gotToThumbnail = () => {
    galleryThumbnail.forEach((thumbnail) => {
      thumbnail.addEventListener("click", (e) => {
        const selected = e.target;
        if (selected.parentElement.classList.contains("thumbnail")) {
          popup.classList.remove("hidden");
          popupOverlay.classList.remove("hidden");
          currentSlidePosition = Number(selected.dataset.id - 1);
          goToSlide(currentSlidePosition);
        }
      });
    });
  };

  const nextSlide = () => {
    if (currentSlidePosition === mainSlides.length - 1) {
      currentSlidePosition = 0;
    } else {
      currentSlidePosition++;
    }
    goToSlide(currentSlidePosition);
    gotToThumbnail();
    counter = 1;
    quantityInput.value = counter;
  };

  const prevSlide = () => {
    if (currentSlidePosition === 0) {
      currentSlidePosition = mainSlides.length - 1;
    } else {
      currentSlidePosition--;
    }

    goToSlide(currentSlidePosition);
    counter = 1;
    quantityInput.value = counter;
  };

  nextBtns.forEach((btn) => btn.addEventListener("click", nextSlide));
  prevBtns.forEach((btn) => btn.addEventListener("click", prevSlide));

  gotToThumbnail();
}

function getQuantity() {
  decrementBtn.addEventListener("click", function () {
    if (counter > 1) {
      counter--;
    } else {
      return;
    }
    quantityInput.value = counter;
  });

  incrementBtn.addEventListener("click", function () {
    counter++;
    quantityInput.value = counter;
  });
}

// UPDATE CART

let itemsInCart = JSON.parse(localStorage.getItem("data")) || [];

function updateCartHTML() {
  const HTML = itemsInCart
    .map((item) => {
      const { id, src, price, quantity } = item;
      return `<div
    class="cart__column | d-flex justify-content-sb align-items-center" data-product="product-${id}"
  >
    <div class="column__left | d-flex align-items-center">
      <img
        class="thumbnail"
        src="${src}"
        alt="" data-id=${id}
      />
      <div class="column__left-text">
        <p>Autumn Limited Edition...</p>
        <span>$${price}</span>
        <span>x ${quantity}</span>
        <span class="fw-bold">$${price * quantity}</span>
      </div>
    </div>
    <div class="column__right">
      <img class="delete-btn" src="images/icon-delete.svg" alt="" />
    </div>
  </div>`;
    })
    .join("");

  cartItemsContainer.innerHTML = HTML;
}

function checkInCart(product) {
  for (let i = 0; i < itemsInCart.length; i++) {
    if (itemsInCart[i].id == product.id) {
      itemsInCart[i].quantity += counter;
      return;
    }
  }

  itemsInCart.push(product);
}

// addToCartBtn.addEventListener("click", addToCart);

function addToCart() {
  let currentProduct =
    mainSlides[currentSlidePosition].children[0].getAttribute("src");
  let productID = mainSlides[currentSlidePosition].children[0].dataset.id;
  let productPrice = +currItemPrice.slice(1, 4);
  // let ProductQuantity = +quantityInput.value;
  // console.log(ProductQuantity);
  const cartItems = {
    id: productID,
    src: currentProduct,
    price: productPrice,
    quantity: counter,
  };
  // counter = 1;
  // let getQuantity = localStorage.getItem("quantity");

  checkInCart(cartItems);
  localStorage.setItem("data", JSON.stringify(itemsInCart));
  // console.log(itemsInCart);
  updateCartHTML();

  // cartLabel.innerText = calculations();
  calculations();
}

function calculations() {
  const totalQuantity = itemsInCart
    .map((item) => item.quantity)
    .reduce((x, y) => {
      return x + y;
    }, 0);

  cartLabel.innerText = totalQuantity;
}
calculations();

// SHOW CART

function showCart() {
  const emptyMessage = document.createElement("p");
  emptyMessage.innerText = "Your cart is empty.";
  emptyMessage.classList.add("empty-mesage");

  cart.addEventListener("click", function () {
    cartContainer.classList.toggle("hidden");

    updateCartHTML();

    if (itemsInCart.length === 0) {
      cartItemsContainer.append(emptyMessage);
      checkoutBtn.classList.add("hidden");
    } else if (itemsInCart.length > 0) {
      checkoutBtn.classList.remove("hidden");
      cartContainer.addEventListener("click", function (e) {
        const clicked = e.target;
        if (clicked.classList.contains("delete-btn")) {
          let ID;

          // Get parent container to be deleted
          let currTarget =
            e.target.parentElement.previousElementSibling.firstElementChild
              .dataset;

          for (const val in currTarget) {
            ID = currTarget[val];
          }

          //  Filter basket to remove item with ID

          let currCartItems = itemsInCart.filter((item) => item.id !== ID);

          localStorage.setItem("data", JSON.stringify(currCartItems));
          itemsInCart = JSON.parse(localStorage.getItem("data")) || [];

          clicked.parentElement.parentElement.remove();
          calculations();
          if (itemsInCart.length === 0) {
            cartItemsContainer.append(emptyMessage);
            checkoutBtn.classList.add("hidden");
          }
        }
      });
    }
  });
}
