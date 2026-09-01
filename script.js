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
  // =========================================
  // 6. CATEGORY FILTERING & WISHLIST
  // =========================================
  const categoryCards = document.querySelectorAll('.cat-feature-btn');
  const productCards = document.querySelectorAll('.product-card');

  categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const category = card.getAttribute('data-category');

      // Filter products
      let found = false;
      productCards.forEach(pCard => {
        if (!category || category === 'all' || pCard.getAttribute('data-category') === category) {
          pCard.classList.remove('hidden');
          // Re-trigger animation
          pCard.style.animation = 'none';
          pCard.offsetHeight; /* trigger reflow */
          pCard.style.animation = null;
          found = true;
        } else {
          pCard.classList.add('hidden');
        }
      });
      
      // Smooth scroll to products section
      const productsSection = document.getElementById('produits');
      if(productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      if(category) {
        showToast(`Filtre appliqué : ${category.charAt(0).toUpperCase() + category.slice(1)}`);
      }
    });
  });

  // WISHLIST LOGIC
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const svg = btn.querySelector('svg');
      const isLiked = btn.classList.toggle('active-wishlist');
      
      if (isLiked) {
        svg.style.fill = 'var(--accent-primary)';
        svg.style.color = 'var(--accent-primary)';
        showToast('Ajouté aux favoris ! ❤️');
      } else {
        svg.style.fill = 'none';
        svg.style.color = 'currentColor';
        showToast('Retiré des favoris.');
      }
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

  // =========================================
  // 8. SCROLL ANIMATIONS (Reveal on scroll)
  // =========================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
  }
});
