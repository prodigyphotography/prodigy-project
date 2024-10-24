// Photo Data
const photos = [
    { title: "Roos Mob", thumb: "images/thumbs/roosmob-thumb.JPG", full: "images/roosmob.JPG" },
    { title: "Butterfly - Seaford Rise, SA", thumb: "images/thumbs/butterfly-thumb.jpg", full: "images/butterfly.jpg" },
    { title: "Waterfall - Ingalalla Falls in Normanville, SA", thumb: "images/thumbs/waterfall-thumb.JPG", full: "images/waterfall.JPG" },
    { title: "Rainbow - Seaford Rise, SA", thumb: "images/thumbs/Rainbow-thumb.jpg", full: "images/rainbow.JPG" },
    { title: "Historic Church - Old Noarlunga, SA", thumb: "images/thumbs/HistoricChurchNoarlunga-thumb.JPG", full: "images/HistoricChurchNoarlunga-thumb.JPG" },
];

// Cart Data
let cart = [];
let total = 0;

// Disable right-click on the entire page
document.addEventListener('contextmenu', (event) => event.preventDefault());

// Generate Photo Cards
function generatePhotoCards() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = photos.map(photo => `
        <div class="photo-card" data-title="${photo.title}">
            <img src="${photo.thumb}" alt="${photo.title}" class="thumbnail">
            <p>${photo.title}</p>
            <div class="dropdown-container">
                <select class="type-dropdown">
                    <option value="digital" selected>Digital Download - $15</option>
                    <option value="real">Real Copy</option>
                </select>
                <select class="quantity-dropdown" disabled>
                    <option value="1" selected>1</option> 
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

// Attach Listeners to Type Dropdowns
function attachDropdownListeners() {
    document.querySelectorAll('.type-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', (event) => {
            const card = event.target.closest('.photo-card');
            const sizeDropdown = card.querySelector('.size-dropdown');
            const quantityDropdown = card.querySelector('.quantity-dropdown');

            if (event.target.value === 'real') {
                sizeDropdown.disabled = false;
                quantityDropdown.disabled = false;
            } else {
                sizeDropdown.disabled = true;
                quantityDropdown.disabled = true;
                quantityDropdown.value = 1;
            }
        });
    });
}

// Attach Click Listeners to Thumbnails
function attachThumbnailListeners() {
    document.querySelectorAll('.thumbnail').forEach((img, index) => {
        img.addEventListener('click', () => openImagePopup(photos[index].full));
    });
}

// Open Image Popup
function openImagePopup(src) {
    const popup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    popupImage.src = src;
    popup.classList.add('visible');

    popup.addEventListener('contextmenu', (event) => event.preventDefault());

    const closeBtn = popup.querySelector('.close-popup-button');
    closeBtn.onclick = () => popup.classList.remove('visible');
}

// Add Items to Cart
function attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.photo-card');
            const title = card.dataset.title;
            const type = card.querySelector('.type-dropdown').value;
            const quantity = 1; // Fixed to 1 for digital items
            const size = card.querySelector('.size-dropdown').value;
            let price = type === 'digital' ? 15 : getSizePrice(size);

            // Prevent duplicate digital items in the cart
            if (type === 'digital' && cart.some(item => item.title === title && item.type === 'digital')) {
                alert(`"${title}" is already in the cart as a digital copy.`);
                return;
            }

            if (type === 'real' && !size) {
                alert("Please select a size for the Real Copy.");
                return;
            }

            cart.push({ title, type, size, quantity, price });
            total += price;
            updateCart();
            updateCartCount();
        });
    });
}

// Get Price Based on Size
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

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <li class="cart-item">
            <span>${item.title} (${item.type}${item.size ? `, Size: ${item.size}` : ''})</span>
            <span>Price: $${item.price}</span>
            <button class="remove-item-button" data-index="${index}">Remove</button>
        </li>
    `).join('');
    attachRemoveListeners();
    renderPayPalButton();
}

// Attach Remove Listeners
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

// Update Cart Count
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Render PayPal Button
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

// Clear Cart
function clearCart() {
    cart = [];
    total = 0;
    updateCart();
    updateCartCount();
}

// Initialize Page
window.onload = generatePhotoCards;
