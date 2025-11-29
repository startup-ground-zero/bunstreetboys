let cart = [];

function addToCart(itemName, price) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    alert(`${itemName} added to cart!`);
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalElement.textContent = '0.00';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <span class="cart-item-name">${item.name} x${item.quantity}</span>
                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">Remove</button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    totalElement.textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order Total: $${total.toFixed(2)}\n\nPlease fill in your delivery information and click "Place Order"`);
}

function scrollToMenu() {
    const menuSection = document.getElementById('menu');
    menuSection.scrollIntoView({ behavior: 'smooth' });
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.order-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Please add items to your cart!');
                return;
            }
            
            const formData = {
                name: form.querySelector('input[placeholder="Full Name"]').value,
                email: form.querySelector('input[placeholder="Email Address"]').value,
                phone: form.querySelector('input[placeholder="Phone Number"]').value,
                address: form.querySelector('textarea').value,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            
            console.log('Order placed:', formData);
            alert(`✅ Order Confirmed!\n\nThank you for your order!\nTotal: €${formData.total.toFixed(2)}\n\nYour food will be delivered to:\n${formData.address}`);
            
            // Clear cart and form
            cart = [];
            updateCart();
            form.reset();
        });
    }
});
