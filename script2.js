// Photo Data
const photos = [
    { title: "Roos Mob", thumb: "images/thumbs/roosmob-thumb.JPG", full: "images/roosmob.JPG" },
    { title: "Butterfly - Seaford Rise, SA", thumb: "images/thumbs/butterfly-thumb.jpg", full: "images/butterfly.jpg" },
    { title: "Waterfall - Ingalalla Falls", thumb: "images/thumbs/waterfall-thumb.JPG", full: "images/waterfall.JPG" }
];

let cart = [];
let total = 0;

// Disable right-click on the page
document.addEventListener('contextmenu', (event) => event.preventDefault());

// Generate photo cards
function generatePhotoCards() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = photos.map(photo => `
        <div class="photo-card" data-title="${photo.title}">
            <img src="${photo.thumb}" alt="${photo.title}" class="thumbnail">
            <p>${photo.title}</p>
            <button class="add-to-cart-button">Add to Cart - $15</button>
        </div>
    `).join('');

    attachAddToCartListeners();
    attachThumbnailListeners();
}

// Add to cart
function attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.photo-card');
            const title = card.dataset.title;

            if (cart.some(item => item.title === title)) {
                alert(`${title} is already in the cart.`);
                return;
            }

            const price = 15;
            cart.push({ title, price });
            total += price;

            updateCart();
            updateCartCount();
        });
    });
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <li>
            ${item.title} - $${item.price}
            <button class="remove-item-button" data-index="${index}">Remove</button>
        </li>
    `).join('');

    document.getElementById('cart-total').textContent = total.toFixed(2);
    attachRemoveListeners();
    renderPayPalButton();
}

// Remove item from cart
function attachRemoveListeners() {
    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            const item = cart.splice(index, 1)[0];
            total -= item.price;

            updateCart();
            updateCartCount();
        });
    });
}

// Update cart count
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Render PayPal button
function renderPayPalButton() {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';

    if (cart.length === 0) return;

    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{ amount: { value: total.toFixed(2) } }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
                alert('Transaction successful!');
                clearCart();
            });
        }
    }).render('#paypal-button-container');
}

// Clear cart
function clearCart() {
    cart = [];
    total = 0;
    updateCart();
    updateCartCount();
}

// Attach thumbnail click listeners
function attachThumbnailListeners() {
    document.querySelectorAll('.thumbnail').forEach((img, index) => {
        img.addEventListener('click', () => openImagePopup(photos[index].full));
    });
}

// Open image popup
function openImagePopup(src) {
    const popup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    popupImage.src = src;
    popup.classList.add('visible');
}

// Close popup
document.querySelector('.close-popup-button').onclick = () => {
    document.getElementById('image-popup').classList.remove('visible');
};

// Toggle cart visibility
document.getElementById('cart-button').addEventListener('click', () => {
    document.getElementById('cart').classList.toggle('visible');
});

// Initialize page
window.onload = generatePhotoCards;

