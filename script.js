// =========================================
// TECHHOUSE - PROFESSIONAL E-COMMERCE JS
// =========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE ---
  let cart = [];
  
  // --- DOM ELEMENTS ---
  const cartBtn = document.getElementById('cartBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');

  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const qvOverlay = document.getElementById('qvOverlay');
  const qvModal = document.getElementById('qvModal');
  const closeQvBtn = document.getElementById('closeQvBtn');
  const toastContainer = document.getElementById('toastContainer');
  
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  // =========================================
  // 1. NAVBAR & MOBILE MENU
  // =========================================
  
  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('scrolled'); // Always keep scrolled style for clean look
    }
  });
  // Trigger once on load
  navbar.classList.add('scrolled');

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // =========================================
  // 2. CART LOGIC
  // =========================================

  function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
  }

  cartBtn.addEventListener('click', toggleCart);
  closeCartBtn.addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);

  function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.qty += product.qty;
    } else {
      cart.push(product);
    }
    updateCartUI();
    showToast(`${product.title} ajouté au panier !`);
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;
    
    // Animate badge
    cartBadge.style.transform = 'scale(1.2)';
    setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);

    // Update Items
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Votre panier est vide.</div>';
      cartSubtotal.textContent = '0 DH';
      cartTotal.textContent = '0 DH';
      return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="cart-item-img" />
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price} DH x ${item.qty}</div>
          <button class="cart-item-remove" data-id="${item.id}">Retirer</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    // Update Totals
    cartSubtotal.textContent = `${total} DH`;
    cartTotal.textContent = `${total} DH`;

    // Attach remove events
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        removeFromCart(e.target.getAttribute('data-id'));
      });
    });
  }

  // Bind Add to Cart buttons on homepage
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const id = card.querySelector('.product-name').textContent; 
      const title = card.querySelector('.product-name').textContent;
      const priceText = card.querySelector('.price-current').textContent;
      const price = parseInt(priceText.replace(/\D/g, ''));
      const img = card.querySelector('.product-img-wrap img').src;

      addToCart({ id, title, price, img, qty: 1 });
    });
  });

  // =========================================
  // 3. QUICK VIEW MODAL
  // =========================================

  function openQuickView(productData) {
    document.getElementById('qvTitle').textContent = productData.title;
    document.getElementById('qvCurrentPrice').textContent = productData.price + ' DH';
    document.getElementById('qvOldPrice').textContent = (productData.price + 50) + ' DH';
    document.getElementById('qvImage').src = productData.img;
    document.getElementById('qvQty').value = 1;
    
    // Store active product for Add to cart button inside modal
    document.getElementById('qvAddBtn').setAttribute('data-id', productData.title);
    document.getElementById('qvAddBtn').setAttribute('data-price', productData.price);
    document.getElementById('qvAddBtn').setAttribute('data-img', productData.img);
    
    qvOverlay.classList.add('active');
    qvModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
  }

  function closeQuickView() {
    qvOverlay.classList.remove('active');
    qvModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeQvBtn.addEventListener('click', closeQuickView);
  qvOverlay.addEventListener('click', closeQuickView);

  // Bind Quick View Buttons
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      const title = card.querySelector('.product-name').textContent;
      const priceText = card.querySelector('.price-current').textContent;
      const price = parseInt(priceText.replace(/\D/g, ''));
      const img = card.querySelector('.product-img-wrap img').src;

      openQuickView({ title, price, img });
    });
  });

  // Quantity selectors inside Quick View
  document.getElementById('qvQtyMinus').addEventListener('click', () => {
    const input = document.getElementById('qvQty');
    if (input.value > 1) input.value = parseInt(input.value) - 1;
  });
  document.getElementById('qvQtyPlus').addEventListener('click', () => {
    const input = document.getElementById('qvQty');
    if (input.value < 10) input.value = parseInt(input.value) + 1;
  });

  // Add to cart from Quick View
  document.getElementById('qvAddBtn').addEventListener('click', (e) => {
    const btn = e.target;
    const qty = parseInt(document.getElementById('qvQty').value);
    addToCart({
      id: btn.getAttribute('data-id'),
      title: btn.getAttribute('data-id'),
      price: parseInt(btn.getAttribute('data-price')),
      img: btn.getAttribute('data-img'),
      qty: qty
    });
    closeQuickView();
  });

  // =========================================
  // 4. SEARCH OVERLAY
  // =========================================

  function toggleSearch() {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
      setTimeout(() => searchInput.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  searchBtn.addEventListener('click', toggleSearch);
  closeSearchBtn.addEventListener('click', toggleSearch);
  
  // Live Search Logic (Filters products on homepage)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const allProducts = Array.from(document.querySelectorAll('.product-card'));
    
    searchResults.innerHTML = ''; 
    
    if (query.length < 2) return;

    const matches = allProducts.filter(card => {
      const title = card.querySelector('.product-name').textContent.toLowerCase();
      return title.includes(query);
    });

    if (matches.length === 0) {
      searchResults.innerHTML = '<p style="color: #666; font-size: 1.2rem;">Aucun produit trouvé.</p>';
      return;
    }

    matches.forEach(card => {
      const clone = card.cloneNode(true);
      clone.style.animation = 'none';
      clone.style.opacity = '1';
      clone.classList.remove('hidden');
      searchResults.appendChild(clone);
    });
  });

  // =========================================
  // 5. TOAST NOTIFICATIONS
  // =========================================

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // =========================================
  // 6. CATEGORY FILTERING (Preserved & enhanced)
  // =========================================
  const filterChips = document.querySelectorAll('.filter-chip');
  const productCards = document.querySelectorAll('.product-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active state
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const category = chip.getAttribute('data-category');

      // Filter products
      productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.animation = 'none';
          card.offsetHeight; /* trigger reflow */
          card.style.animation = null;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
  
  // =========================================
  // 7. COLOR SWATCHES (Clean logic)
  // =========================================
  document.querySelectorAll('.product-colors').forEach(container => {
    container.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', function (e) {
        e.stopPropagation(); 
        container.querySelectorAll('.color-swatch').forEach(s => {
          s.style.borderColor = 'rgba(0,0,0,0.1)';
          s.style.boxShadow = 'none';
        });
        this.style.borderColor = '#000';
        this.style.boxShadow = '0 0 0 1px #000';
      });
    });
  });

});
