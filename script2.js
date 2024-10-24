// Photo Data
const photos = [
    { title: "Roos Mob", thumb: "images/thumbs/roosmob-thumb.JPG", full: "images/roosmob.JPG" },
    { title: "Butterfly - Seaford Rise, SA", thumb: "images/thumbs/butterfly-thumb.jpg", full: "images/butterfly.jpg" },
    { title: "Waterfall - Ingalalla Falls in Normanville, SA", thumb: "images/thumbs/waterfall-thumb.JPG", full: "images/waterfall.JPG" },
    { title: "Rainbow - Seaford Rise, SA", thumb: "images/thumbs/Rainbow-thumb.jpg", full: "images/rainbow.JPG" },
    { title: "Historic Church - Old Noarlunga, SA", thumb: "images/thumbs/HistoricChurchNoarlunga-thumb.JPG", full: "images/HistoricChurchNoarlunga.JPG" }
];

// Cart Data
let cart = [];
let total = 0;
let selectedDigitalTitle = null; // Track if any digital image has been selected

/* Disable right-click on the entire page */
document.addEventListener('contextmenu', (event) => event.preventDefault());

/* Generate Photo Cards */
function generatePhotoCards() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = photos.map(photo => `
        <div class="photo-card" data-title="${photo.title}">
            <img src="${photo.thumb}" alt="${photo.title}" class="thumbnail">
            <p>${photo.title}</p>
            <div class="dropdown-container">
                <select class="type-dropdown">
                    <option value="digital">Digital Download - $15</option>
                    <option value="real">Real Copy</option>
                </select>
                <select class="quantity-dropdown">
                    ${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                </select>
                <select class="size-dropdown" disabled>
                    <option value="">Select Size</option>
                    <option value="XS">XS - $1</option>
                    <option value="S">S - $2</option>
                    <option value="M">M - $3</option>
                    <option value="L">L - $4</option>
                    <option value="XL">XL - $5</option>
                </select>
            </div>
            <button class="add-to-cart-button">Add to Cart</button>
        </div>
    `).join('');

    attachDropdownListeners();
    attachThumbnailListeners();
    attachAddToCartListeners();
}

/* Attach Listeners to Type Dropdowns */
function attachDropdownListeners() {
    document.querySelectorAll('.type-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', (event) => {
            const card = event.target.closest('.photo-card');
            const sizeDropdown = card.querySelector('.size-dropdown');
            const quantityDropdown = card.querySelector('.quantity-dropdown');
            const title = card.dataset.title;

            if (event.target.value === 'real') {
                // Enable size and quantity for Real Copy
                sizeDropdown.disabled = false;
                quantityDropdown.disabled = false;
                sizeDropdown.value = "";

                // Clear digital selection if this was the selected card
                if (selectedDigitalTitle === title) {
                    selectedDigitalTitle = null;
                }
            } else {
                // Prevent multiple digital selections
                if (selectedDigitalTitle && selectedDigitalTitle !== title) {
                    alert("Only one digital download can be selected from the entire gallery.");
                    event.target.value = 'real';
                    return;
                }

                // Disable size and quantity for Digital Download
                sizeDropdown.disabled = true;
                quantityDropdown.disabled = true;
                sizeDropdown.value = "";
                quantityDropdown.value = 1;

                // Track the selected digital title
                selectedDigitalTitle = title;
            }
        });
    });
}

/* Attach Click Listeners to Thumbnails */
function attachThumbnailListeners() {
    document.querySelectorAll('.thumbnail').forEach((img, index) => {
        img.addEventListener('click', () => openImagePopup(photos[index].full));
    });
}

/* Open Image Popup */
function openImagePopup(src) {
    const popup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    popupImage.src = src;
    popup.classList.add('visible');

    popup.addEventListener('contextmenu', (event) => event.preventDefault());

    const closeBtn = popup.querySelector('.close-popup-button');
    closeBtn.onclick = () => {
        popup.classList.remove('visible');
    };
}

/* Add Items to Cart */
function attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.photo-card');
            const title = card.dataset.title;
            const type = card.querySelector('.type-dropdown').value;
            const quantity = parseInt(card.querySelector('.quantity-dropdown').value);
            const size = card.querySelector('.size-dropdown').value;
            let price = 0;

            if (type === 'digital') {
                if (cart.some(item => item.title === title && item.type === 'digital')) {
                    alert(`"${title}" is already in the cart as a digital copy.`);
                    return;
                }
                price = 15;
            } else if (type === 'real') {
                if (size) {
                    price = getSizePrice(size) * quantity;
                } else {
                    alert("Please select a size for the Real Copy.");
                    return;
                }
            }

            cart.push({ title, type, size, quantity, price });
            total += price;
            updateCart();
            updateCartCount();
        });
    });
}

/* Get Price Based on Size */
function getSizePrice(size) {
    switch (size) {
        case 'XS': return 1;
        case 'S': return 2;
        case 'M': return 3;
        case 'L': return 4;
        case 'XL': return 5;
        default: return 0;
    }
}

/* Update Cart Display */
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <li class="cart-item">
            <span class="cart-item-title">${item.title} (${item.type}${item.type === 'real' ? `, Size: ${item.size}` : ''})</span>
            <div class="cart-item-controls">
                <span class="cart-item-price">Unit Price: $${(item.price / item.quantity).toFixed(2)}</span>
                <input type="number" class="quantity-input" data-index="${index}" min="1" max="${item.type === 'digital' ? 1 : 20}" value="${item.quantity}">
                <span class="item-total-price">= $${item.price.toFixed(2)}</span>
                <button class="remove-item-button" data-index="${index}">Remove</button>
            </div>
        </li>
    `).join('');

    attachRemoveListeners();
    attachQuantityChangeListeners();
    renderPayPalButton(); // Render PayPal button
}

/* Render PayPal Button */
function renderPayPalButton() {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = ''; // Clear existing button

    paypal.Buttons({
        createOrder: function () {
            return new Promise(resolve => {
                resolve('ORDER-ID');
            });
        },
        onApprove: function () {
            alert('Payment Successful!');
        }
    }).render(paypalContainer);
}

/* Attach Quantity Change Listeners */
function attachQuantityChangeListeners() {
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const index = event.target.dataset.index;
            const newQuantity = parseInt(event.target.value);
            if (newQuantity <= 0) return;

            const item = cart[index];
            const pricePerUnit = item.price / item.quantity;
            item.quantity = newQuantity;
            item.price = pricePerUnit * newQuantity;

            total = cart.reduce((sum, item) => sum + item.price, 0);
            updateCart();
            updateCartCount();
        });
    });
}

/* Update Cart Count */
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

/* Attach Remove Listeners */
function attachRemoveListeners() {
    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            removeFromCart(index);
        });
    });
}

/* Remove Item from Cart */
function removeFromCart(index) {
    const item = cart.splice(index, 1)[0];
    total -= item.price;
    if (item.type === 'digital') selectedDigitalTitle = null;
    updateCart();
    updateCartCount();
}

/* Initialize Page */
window.onload = generatePhotoCards;
