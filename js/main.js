/**
 * RESPONSIVE PHOTOGRAPHY PORTFOLIO — ZERO-GAP JUSTIFIED MASONRY SYSTEM
 * Vanilla JavaScript (High Performance, No External Libraries)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Data Model: 8 Gallery Images & Exact Specifications
  // ==========================================================================
  const GALLERY_DATA = [
    {
      id: 'symbol-of-memory',
      file: 'Symbol of Memory.jpg',
      title: 'Symbol of Memory',
      width: 3072,
      height: 4096,
      ratio: 3072 / 4096, // 0.75
      alt: "Symbol of Memory — Monument commémoratif majestueux s'élevant vers le ciel"
    },
    {
      id: 'horizon-sand-sea',
      file: 'The Horizon of Sand and Sea.jpg',
      title: 'The Quiet Dunes',
      width: 3072,
      height: 4096,
      ratio: 3072 / 4096, // 0.75
      alt: "The Horizon of Sand and Sea — Bateau de pêche à l'aube sur les eaux calmes au crépuscule doré"
    },
    {
      id: 'mountain-peak',
      file: '1746104395630.jpg',
      title: 'Ampsaga River',
      width: 1536,
      height: 2048,
      ratio: 1536 / 2048, // 0.75
      alt: "Mountain Peak — Vue panoramique de crêtes rocheuses et forêts verdoyantes dans la vallée"
    },
    {
      id: 'desert-dreams',
      file: '1746199967050.jpg',
      title: 'Fatimid Cradle',
      width: 1639,
      height: 2048,
      ratio: 1639 / 2048, // 0.8003
      alt: "Desert Dreams — Paysage vallonné spectaculaire illuminé par la lumière du désert"
    },
    {
      id: 'urban-landscape',
      file: '1786046552094 (1).jpg',
      title: '37th Minute',
      width: 4607,
      height: 6144,
      ratio: 4607 / 6144, // 0.75
      alt: "Urban Landscape — Sculpture monumentale entourée de végétation et palmiers urbains"
    },
    {
      id: 'coastal-journey',
      file: '1788987631135.jpg',
      title: 'Coastal Journey',
      width: 1188,
      height: 896,
      ratio: 1188 / 896, // 1.3259
      alt: "Coastal Journey — Vue panoramique côtière avec jetée s'étendant dans une brume poétique"
    },
    {
      id: 'algiers-from-above',
      file: 'Algiers from Above.jpg',
      title: 'Algiers the White',
      width: 4096,
      height: 4095,
      ratio: 4096 / 4095, // 1.0002
      alt: "Algiers from Above — Vue aérienne géométrique plongeante sur la baie et les toitures blanches d'Alger"
    },
    {
      id: 'evening-light',
      file: 'IMG20240418171554.jpg',
      title: 'Naili Statue',
      width: 2783,
      height: 3700,
      ratio: 2783 / 3700, // 0.7522
      alt: "Evening Light — Éclairage crépusculaire doré sur architecture et ciel nuageux"
    }
  ];

  // ==========================================================================
  // 2. DOM Elements & State
  // ==========================================================================
  const container = document.getElementById('galleryContainer');
  const btnShuffle = document.getElementById('btnShuffle');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const photoCounter = document.getElementById('photoCounter');

  // Header & Mobile Navigation
  const siteHeader = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navBackdrop = document.getElementById('navBackdrop');
  const themeToggle = document.getElementById('themeToggle');
  const themeMeta = document.getElementById('themeColorMeta');

  // Lightbox Modal
  const lightbox = document.getElementById('lightboxModal');
  const lightboxStage = document.getElementById('lightboxStage');
  const lightboxImageContainer = document.getElementById('lightboxImageContainer');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxSwipeHint = document.getElementById('lightboxSwipeHint');

  // Current State
  let currentItemsOrder = [];
  let currentFilter = 'all';
  let currentActiveLightboxIndex = -1;
  let currentlyDisplayedItems = [];

  // ==========================================================================
  // 3. Fisher-Yates Random Shuffle (Requirement 3)
  // ==========================================================================
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  // ==========================================================================
  // 4. Justified Row Partitioning & Dynamic Row Height Calculation
  //    (Requirements 1, 2, 5 & 7)
  // ==========================================================================
  /**
   * Partitions items according to responsive breakpoints:
   * - Mobile (< 480px): 1-2 images per row, full-width
   * - Tablet (480px - 1024px): 2-3 images per row
   * - Desktop (> 1024px): 3-4 images per row, fully justified
   */
  function partitionItems(items, containerWidth) {
    const total = items.length;
    if (total === 0) return [];

    let rows = [];

    if (containerWidth < 480) {
      // Mobile: 1-2 images per row
      if (total <= 2) {
        rows.push(items);
      } else if (total === 3) {
        rows.push(items.slice(0, 1));
        rows.push(items.slice(1, 3));
      } else if (total === 4) {
        rows.push(items.slice(0, 2));
        rows.push(items.slice(2, 4));
      } else if (total <= 6) {
        // Pairs
        for (let i = 0; i < total; i += 2) {
          rows.push(items.slice(i, Math.min(i + 2, total)));
        }
      } else {
        // 8 items: [2, 2, 2, 2]
        for (let i = 0; i < total; i += 2) {
          rows.push(items.slice(i, Math.min(i + 2, total)));
        }
      }
    } else if (containerWidth <= 1024) {
      // Tablet (480px - 1024px): 2-3 images per row
      if (total <= 3) {
        rows.push(items);
      } else if (total === 4) {
        rows.push(items.slice(0, 2));
        rows.push(items.slice(2, 4));
      } else if (total === 5) {
        rows.push(items.slice(0, 3));
        rows.push(items.slice(3, 5));
      } else if (total === 6) {
        rows.push(items.slice(0, 3));
        rows.push(items.slice(3, 6));
      } else if (total === 7) {
        rows.push(items.slice(0, 3));
        rows.push(items.slice(3, 5));
        rows.push(items.slice(5, 7));
      } else {
        // 8 items: 3, 3, 2
        rows.push(items.slice(0, 3));
        rows.push(items.slice(3, 6));
        rows.push(items.slice(6, 8));
      }
    } else {
      // Desktop (> 1024px): 3-4 images per row, fully justified
      if (total <= 4) {
        rows.push(items);
      } else if (total <= 6) {
        const half = Math.ceil(total / 2);
        rows.push(items.slice(0, half));
        rows.push(items.slice(half));
      } else if (total === 7) {
        rows.push(items.slice(0, 4));
        rows.push(items.slice(4, 7));
      } else {
        // 8 items on desktop: 2 rows of 4 images (each row has 4 images, fully justified!)
        rows.push(items.slice(0, 4));
        rows.push(items.slice(4, 8));
      }
    }

    return rows;
  }

  /**
   * Renders the justified zero-gap layout into #galleryContainer.
   * Calculates row height: H = W / sum(aspect_ratios)
   * Calculates item width: w_i = H * r_i
   * Flexbox ensures pixel-perfect flush rendering with ZERO gaps!
   */
  function renderJustifiedGallery() {
    if (!container) return;

    // Filter items based on current active filter
    let visibleData = currentItemsOrder;
    if (currentFilter !== 'all') {
      visibleData = currentItemsOrder.filter(item => item.id === currentFilter);
    }
    currentlyDisplayedItems = visibleData;

    // Update photo counter badge
    if (photoCounter) {
      photoCounter.textContent = visibleData.length === 1 ? '1 Photo' : visibleData.length + ' Photos';
    }

    // Get current container width
    const containerWidth = container.clientWidth || window.innerWidth;
    if (containerWidth <= 0) return;

    // Partition into responsive rows
    const rows = partitionItems(visibleData, containerWidth);

    // Build DOM cleanly
    container.innerHTML = '';

    rows.forEach((rowItems, rowIndex) => {
      // Calculate sum of ratios for this row
      const ratioSum = rowItems.reduce((sum, item) => sum + item.ratio, 0);

      // Exact row height so that sum(H * r_i) = containerWidth
      const rowHeight = Math.round(containerWidth / ratioSum);

      const rowEl = document.createElement('div');
      rowEl.className = 'gallery-row';
      rowEl.style.height = rowHeight + 'px';

      rowItems.forEach((item, itemIndex) => {
        // Exact proportional width
        const itemWidth = (item.ratio / ratioSum) * 100;

        const article = document.createElement('article');
        article.className = 'gallery-item';
        article.setAttribute('data-id', item.id);
        article.setAttribute('tabindex', '0');
        article.setAttribute('role', 'button');
        article.setAttribute('aria-haspopup', 'dialog');
        article.setAttribute('aria-label', item.title);

        // Proportional flex styling with zero gaps
        article.style.flex = item.ratio + ' ' + item.ratio + ' 0%';
        article.style.width = itemWidth + '%';
        article.style.height = '100%';

        article.innerHTML = `
          <figure class="gallery-figure">
            <img class="gallery-img"
                 src="images/opt/${item.file}"
                 data-full="images/${item.file}"
                 alt="${item.alt}"
                 width="${item.width}"
                 height="${item.height}"
                 loading="eager"
                 fetchpriority="high"
                 decoding="async">
            <div class="gallery-overlay" aria-hidden="true">
              <h2 class="gallery-title">${item.title}</h2>
            </div>
          </figure>
        `;

        // Attach event listeners for click/tap/keyboard
        attachItemEvents(article, item);

        rowEl.appendChild(article);
      });

      container.appendChild(rowEl);
    });
  }

  // ==========================================================================
  // 5. Touch & Tap Handling (Requirement 4)
  //    - First tap on mobile: reveals semi-transparent overlay with image title
  //    - Second tap on revealed image: opens fullscreen lightbox
  //    - Tap outside: closes revealed overlay
  // ==========================================================================
  function attachItemEvents(article, itemData) {
    let touchMoved = false;

    article.addEventListener('touchstart', () => {
      touchMoved = false;
    }, { passive: true });

    article.addEventListener('touchmove', () => {
      touchMoved = true;
    }, { passive: true });

    article.addEventListener('touchend', (e) => {
      if (touchMoved) return;

      const wasActive = article.classList.contains('is-active');

      if (!wasActive) {
        // First tap: reveal title overlay
        e.preventDefault();
        document.querySelectorAll('.gallery-item.is-active').forEach(el => {
          el.classList.remove('is-active');
        });
        article.classList.add('is-active');
      } else {
        // Second tap: open lightbox
        openLightboxForItem(itemData);
      }
    });

    // Mouse click (desktop)
    article.addEventListener('click', (e) => {
      if (e.pointerType === 'touch') return;
      openLightboxForItem(itemData);
    });

    // Keyboard navigation (Enter or Space)
    article.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightboxForItem(itemData);
      } else if (e.key === 'Escape') {
        article.classList.remove('is-active');
      }
    });
  }

  // Tap or click outside dismisses active overlays
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.gallery-item')) {
      document.querySelectorAll('.gallery-item.is-active').forEach(el => {
        el.classList.remove('is-active');
      });
    }
  });

  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.gallery-item')) {
      document.querySelectorAll('.gallery-item.is-active').forEach(el => {
        el.classList.remove('is-active');
      });
    }
  }, { passive: true });

  // ==========================================================================
  // 6. Fullscreen Lightbox Modal Dialog & Gestures
  // ==========================================================================
  const SWIPE_HINT_KEY = 'lightbox_swipe_hint_seen';
  let swipeHintTimer = null;

  function showSwipeHintIfNeeded() {
    if (!lightboxSwipeHint) return;
    try {
      const alreadySeen = localStorage.getItem(SWIPE_HINT_KEY);
      if (!alreadySeen) {
        // Show after brief entrance delay for smooth discovery
        setTimeout(() => {
          if (lightbox && lightbox.classList.contains('is-open')) {
            lightboxSwipeHint.classList.add('is-visible');
            clearTimeout(swipeHintTimer);
            swipeHintTimer = setTimeout(dismissSwipeHint, 3600);
          }
        }, 280);
      }
    } catch (e) {
      // Graceful fallback if localStorage is blocked
    }
  }

  function dismissSwipeHint() {
    if (!lightboxSwipeHint) return;
    clearTimeout(swipeHintTimer);
    if (lightboxSwipeHint.classList.contains('is-visible')) {
      lightboxSwipeHint.classList.remove('is-visible');
    }
    try {
      localStorage.setItem(SWIPE_HINT_KEY, 'true');
    } catch (e) {}
  }

  if (lightboxSwipeHint) {
    lightboxSwipeHint.addEventListener('click', dismissSwipeHint);
    lightboxSwipeHint.addEventListener('touchstart', dismissSwipeHint, { passive: true });
  }

  function openLightboxForItem(itemData) {
    if (!lightbox || !lightboxImg) return;

    currentActiveLightboxIndex = currentlyDisplayedItems.indexOf(itemData);
    if (currentActiveLightboxIndex === -1) {
      currentActiveLightboxIndex = 0;
    }

    showLightboxCurrent();
  }

  // ==========================================================================
  // Image Preloading Cache for Zero-Lag Lightbox Navigation
  // ==========================================================================
  const preloadedImageCache = new Map();
  function preloadImage(file) {
    if (!file || preloadedImageCache.has(file)) return;
    const img = new Image();
    img.src = 'images/opt/' + file;
    preloadedImageCache.set(file, img);
  }

  function preloadAdjacentImages(currentIndex) {
    if (!currentlyDisplayedItems || currentlyDisplayedItems.length <= 1) return;
    const len = currentlyDisplayedItems.length;
    const nextIdx = (currentIndex + 1) % len;
    const prevIdx = (currentIndex - 1 + len) % len;
    preloadImage(currentlyDisplayedItems[nextIdx].file);
    preloadImage(currentlyDisplayedItems[prevIdx].file);
  }

  function showLightboxCurrent(animDirection) {
    if (currentActiveLightboxIndex < 0 || currentActiveLightboxIndex >= currentlyDisplayedItems.length) return;
    const item = currentlyDisplayedItems[currentActiveLightboxIndex];
    const isFirstOpen = !lightbox.classList.contains('is-open');

    // Preload next & previous images into memory for instantaneous 0ms lag transitions
    preloadAdjacentImages(currentActiveLightboxIndex);

    if (animDirection && !isFirstOpen) {
      // Directional slide transition for next/previous without layout thrashing
      const entryOffset = animDirection === 'next' ? '32px' : '-32px';
      lightboxImg.style.transition = 'none';
      lightboxImg.style.transform = `translateX(${entryOffset})`;
      lightboxImg.style.opacity = '0';

      lightboxImg.src = 'images/opt/' + item.file;
      lightboxImg.alt = item.alt;
      if (lightboxTitle) lightboxTitle.textContent = item.title;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lightboxImg.style.transition = 'transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.24s ease';
          lightboxImg.style.transform = 'translateX(0) rotate(0deg)';
          lightboxImg.style.opacity = '1';
        });
      });
    } else {
      lightboxImg.style.transition = 'none';
      lightboxImg.style.transform = 'none';
      lightboxImg.style.opacity = '1';

      lightboxImg.src = 'images/opt/' + item.file;
      lightboxImg.alt = item.alt;
      if (lightboxTitle) lightboxTitle.textContent = item.title;
    }
    if (!lightbox.open) {
      lightbox.showModal();
    } 
    if (isFirstOpen) {
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (lightboxClose) lightboxClose.focus();
      showSwipeHintIfNeeded();
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    dismissSwipeHint();

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightbox.open) {
      lightbox.close();
    }
    document.body.style.overflow = '';

    if (lightboxImg) {
      lightboxImg.style.transform = 'none';
      lightboxImg.style.opacity = '1';
    }

    // Return focus to active item in gallery
    const currentItemData = currentlyDisplayedItems[currentActiveLightboxIndex];
    if (currentItemData) {
      const activeEl = document.querySelector(`.gallery-item[data-id="${currentItemData.id}"]`);
      if (activeEl) activeEl.focus();
    }
    currentActiveLightboxIndex = -1;
  }

  function showNextLightbox(animDirection = 'next') {
    if (currentlyDisplayedItems.length === 0) return;
    dismissSwipeHint();
    currentActiveLightboxIndex = (currentActiveLightboxIndex + 1) % currentlyDisplayedItems.length;
    showLightboxCurrent(animDirection);
  }

  function showPrevLightbox(animDirection = 'prev') {
    if (currentlyDisplayedItems.length === 0) return;
    dismissSwipeHint();
    currentActiveLightboxIndex = (currentActiveLightboxIndex - 1 + currentlyDisplayedItems.length) % currentlyDisplayedItems.length;
    showLightboxCurrent(animDirection);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', () => showNextLightbox('next'));
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showPrevLightbox('prev'));

  // Close on backdrop / stage background click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxStage || e.target.classList.contains('lightbox-media-wrapper')) {
        closeLightbox();
      }
    });
  }

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('is-open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextLightbox('next');
      if (e.key === 'ArrowLeft') showPrevLightbox('prev');
    } else if (document.body.classList.contains('nav-open')) {
      if (e.key === 'Escape') closeMobileMenu();
    }
  });

  // ==========================================================================
  // Interactive Fluid Touch Swipe Gestures (Mobile & Touch Devices)
  // ==========================================================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isDragging = false;
  let isSwipingHorizontal = null;
  let lastDeltaX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.touches.length !== 1) return;

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      isDragging = true;
      isSwipingHorizontal = null;
      lastDeltaX = 0;

      if (lightboxImg) {
        lightboxImg.style.transition = 'none';
      }
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
      if (!isDragging || !lightboxImg || e.touches.length !== 1) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;
      lastDeltaX = deltaX;

      // Lock direction after slight movement
      if (isSwipingHorizontal === null) {
        if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
          isSwipingHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
        }
      }

      if (isSwipingHorizontal) {
        if (e.cancelable) e.preventDefault();

        // Smooth drag with tactile resistance & slight 3D rotation
        const damp = 0.78;
        const translateX = deltaX * damp;
        const rotate = deltaX * 0.015;
        const opacity = Math.max(0.6, 1 - Math.abs(deltaX) / 750);

        lightboxImg.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`;
        lightboxImg.style.opacity = opacity;
      }
    }, { passive: false });

    function handleTouchEnd() {
      if (!isDragging || !lightboxImg) return;
      isDragging = false;

      dismissSwipeHint();

      lightboxImg.style.transition = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.28s ease';

      if (isSwipingHorizontal) {
        const deltaTime = Math.max(Date.now() - touchStartTime, 1);
        const velocity = Math.abs(lastDeltaX) / deltaTime;
        const isSwipeTriggered = Math.abs(lastDeltaX) > 48 || (Math.abs(lastDeltaX) > 22 && velocity > 0.35);

        if (isSwipeTriggered) {
          if (lastDeltaX < 0) {
            // Swiped Left -> Next Photo
            lightboxImg.style.transform = 'translateX(-115%) rotate(-4deg)';
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
              showNextLightbox('next');
            }, 140);
          } else {
            // Swiped Right -> Previous Photo
            lightboxImg.style.transform = 'translateX(115%) rotate(4deg)';
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
              showPrevLightbox('prev');
            }, 140);
          }
        } else {
          // Snap back smoothly to center
          lightboxImg.style.transform = 'translateX(0) rotate(0deg)';
          lightboxImg.style.opacity = '1';
        }
      } else {
        lightboxImg.style.transform = 'translateX(0) rotate(0deg)';
        lightboxImg.style.opacity = '1';
      }

      isSwipingHorizontal = null;
      lastDeltaX = 0;
    }

    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    lightbox.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  }

  // ==========================================================================
  // 7. Filter Tabs & Photo Counter
  // ==========================================================================
  function setFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    renderJustifiedGallery();
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      setFilter(filter);
    });
  });

  // Shuffle Button
  if (btnShuffle) {
    btnShuffle.addEventListener('click', () => {
      currentItemsOrder = shuffleArray(currentItemsOrder);
      renderJustifiedGallery();
    });
  }

  // ==========================================================================
  // 8. Sticky Header & Scroll Handling (Throttled with requestAnimationFrame)
  // ==========================================================================
  let scrollTicking = false;
  function handleScroll() {
    if (!siteHeader) return;
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  function openMobileMenu() {
    document.body.classList.add('nav-open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Fermer le menu');
    }
    if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    document.body.classList.remove('nav-open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    }
    if (mobileDrawer) mobileDrawer.setAttribute('aria-hidden', 'true');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (document.body.classList.contains('nav-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ==========================================================================
  // 9. Theme Switcher (Dark Mode #1a1a1a Default)
  // ==========================================================================
  const THEME_KEY = 'portfolio-theme-preference';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#f7f8fa');
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
      themeToggle.title = theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ==========================================================================
  // 10. Responsive Resize Observer & Initialization
  // ==========================================================================
  let resizeTimeout = null;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      renderJustifiedGallery();
      if (window.innerWidth > 768 && document.body.classList.contains('nav-open')) {
        closeMobileMenu();
      }
    }, 60);
  }

  window.addEventListener('resize', handleResize, { passive: true });

  // Initialize gallery on page load with random shuffle (Requirement 3)
  function initGallery() {
    currentItemsOrder = shuffleArray(GALLERY_DATA);
    renderJustifiedGallery();
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }

})();
