/**
 * VERONA TILES & SANITARYWARE - CORE CONTROLLER
 * Vanilla JavaScript Architecture
 * High-performance, zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initNavigation();
  initFormValidation();
  initProductFilter();
  initVisualizer();
  initAccordions();
  initBeforeAfter();
  initLightingSimulator();
  initModalTriggers();
  initWhitepaperDownloads();
});

/* ==========================================================================
   1. DARK / LIGHT THEME CONTROLLER
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const html = document.documentElement;
  
  // Retrieve saved preference or default to light
  const savedTheme = localStorage.getItem('verona_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  updateThemeIcons();

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      html.classList.toggle('dark');
      const isDark = html.classList.contains('dark');
      localStorage.setItem('verona_theme', isDark ? 'dark' : 'light');
      updateThemeIcons();
    });
  });
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('.sun-icon').forEach(icon => {
    icon.classList.toggle('hidden', !isDark);
  });
  document.querySelectorAll('.moon-icon').forEach(icon => {
    icon.classList.toggle('hidden', isDark);
  });
}

/* ==========================================================================
   2. RTL / LTR DIRECTION CONTROLLER (DOUBLE ARROW ONLY - NO TEXT LABELS)
   ========================================================================== */
function initDirection() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const html = document.documentElement;

  const savedDir = localStorage.getItem('verona_dir') || 'ltr';
  html.setAttribute('dir', savedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = html.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      html.setAttribute('dir', newDir);
      localStorage.setItem('verona_dir', newDir);
    });
  });
}

/* ==========================================================================
   3. NAVIGATION & MOBILE MENU CONTROLLER
   ========================================================================== */
function initNavigation() {
  // Desktop Home Dropdown
  const homeDropdownBtn = document.getElementById('home-dropdown-btn');
  const homeDropdownMenu = document.getElementById('home-dropdown-menu');
  const homeDropdownContainer = document.getElementById('home-dropdown-container');

  if (homeDropdownBtn && homeDropdownMenu) {
    homeDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = homeDropdownBtn.getAttribute('aria-expanded') === 'true';
      homeDropdownBtn.setAttribute('aria-expanded', !isExpanded);
      homeDropdownMenu.classList.toggle('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (homeDropdownContainer && !homeDropdownContainer.contains(e.target)) {
        homeDropdownMenu.classList.add('hidden');
        homeDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Desktop hover support
    if (homeDropdownContainer) {
      homeDropdownContainer.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) {
          homeDropdownMenu.classList.remove('hidden');
          homeDropdownBtn.setAttribute('aria-expanded', 'true');
        }
      });
      homeDropdownContainer.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
          homeDropdownMenu.classList.add('hidden');
          homeDropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenuDrawer = document.getElementById('mobile-menu');
  const mobileHomeDropdownBtn = document.getElementById('mobile-home-dropdown-btn');
  const mobileHomeDropdownMenu = document.getElementById('mobile-home-dropdown-menu');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileMenuCloseBtn && mobileMenuDrawer) {
    mobileMenuCloseBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  if (mobileHomeDropdownBtn && mobileHomeDropdownMenu) {
    mobileHomeDropdownBtn.addEventListener('click', () => {
      mobileHomeDropdownMenu.classList.toggle('hidden');
      const chevron = mobileHomeDropdownBtn.querySelector('.mobile-home-chevron');
      if (chevron) {
        chevron.classList.toggle('rotate-180');
      }
    });
  }

  // Highlight active navigation links based on current pathname
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a[href]').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('text-[#C5A880]', 'font-bold');
    }
  });
}

/* ==========================================================================
   4. STRICT FORM VALIDATION (STRICT REQUIREMENTS)
   - Name field: Block all numbers (realtime keydown + input sanitization)
   - Phone field: Block all letters (realtime keydown + input sanitization)
   - Email field: Strict regex validation before submission
   ========================================================================== */
function initFormValidation() {
  const quoteForm = document.getElementById('quote-form') || document.querySelector('.quote-validation-form');
  if (!quoteForm) return;

  const nameInput = quoteForm.querySelector('input[name="full_name"]') || quoteForm.querySelector('#form-name');
  const phoneInput = quoteForm.querySelector('input[name="phone"]') || quoteForm.querySelector('#form-phone');
  const emailInput = quoteForm.querySelector('input[name="email"]') || quoteForm.querySelector('#form-email');

  // 1. Strict Name Field: Block all numbers
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return;
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
        showInputError(nameInput, 'Numbers are strictly prohibited in the Name field.');
      }
    });

    nameInput.addEventListener('input', () => {
      if (/[0-9]/.test(nameInput.value)) {
        nameInput.value = nameInput.value.replace(/[0-9]/g, '');
        showInputError(nameInput, 'Numbers were automatically removed from Name.');
      } else {
        clearInputError(nameInput);
      }
    });
  }

  // 2. Strict Phone Field: Block all letters
  if (phoneInput) {
    phoneInput.addEventListener('keydown', (e) => {
      if (['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return;
      if (!/[0-9+\s()-]/.test(e.key)) {
        e.preventDefault();
        showInputError(phoneInput, 'Letters and symbols are blocked. Only digits and phone symbols (+, -, ()) are allowed.');
      }
    });

    phoneInput.addEventListener('input', () => {
      if (/[a-zA-Z]/.test(phoneInput.value)) {
        phoneInput.value = phoneInput.value.replace(/[a-zA-Z]/g, '');
        showInputError(phoneInput, 'Letters were automatically removed from Phone.');
      } else {
        clearInputError(phoneInput);
      }
    });
  }

  // 3. Strict Form Submission Validation
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Name check
    if (nameInput && (!nameInput.value.trim() || /[0-9]/.test(nameInput.value))) {
      showInputError(nameInput, 'Please provide a valid full name (letters only).');
      isValid = false;
    }

    // Phone check
    if (phoneInput && (!phoneInput.value.trim() || phoneInput.value.trim().length < 7)) {
      showInputError(phoneInput, 'Please provide a valid phone number (digits only, at least 7 digits).');
      isValid = false;
    }

    // Email strict regex check
    if (emailInput) {
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showInputError(emailInput, 'Invalid email address format. Example: architect@studio.com');
        isValid = false;
      } else {
        clearInputError(emailInput);
      }
    }

    if (isValid) {
      const name = nameInput ? nameInput.value.trim() : 'Valued Client';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const surfaceType = quoteForm.querySelector('select[name="surface_type"]') ? quoteForm.querySelector('select[name="surface_type"]').value : 'Porcelain Slabs & Sanitaryware';
      const area = quoteForm.querySelector('input[name="project_sqft"]') ? quoteForm.querySelector('input[name="project_sqft"]').value : '500';

      showSuccessConfirmationModal({ name, email, phone, surfaceType, area });
      quoteForm.reset();
    }
  });
}

function showInputError(inputEl, msg) {
  inputEl.classList.add('border-red-500', 'focus:border-red-500');
  inputEl.classList.remove('border-neutral-300', 'dark:border-neutral-700');
  let errEl = inputEl.parentElement.querySelector('.input-error-msg');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'input-error-msg text-xs text-red-500 mt-1 font-medium';
    inputEl.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
}

function clearInputError(inputEl) {
  inputEl.classList.remove('border-red-500', 'focus:border-red-500');
  inputEl.classList.add('border-neutral-300', 'dark:border-neutral-700');
  const errEl = inputEl.parentElement.querySelector('.input-error-msg');
  if (errEl) {
    errEl.remove();
  }
}

function showSuccessConfirmationModal(data) {
  // Remove any existing modal first
  let oldModal = document.getElementById('quote-success-modal');
  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'quote-success-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 flat-modal-backdrop';
  document.body.appendChild(modal);

  modal.innerHTML = `
    <div class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 max-w-lg w-full p-8 shadow-2xl relative text-left" role="dialog" aria-modal="true">
      <div class="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span class="subheading-luxury">Quotation Concierge</span>
          <h3 class="text-xl font-bold mt-1 text-neutral-900 dark:text-white">Request Confirmed</h3>
        </div>
        <button type="button" id="close-modal-btn" class="text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-2 focus:outline-none" aria-label="Close Modal">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="py-6 space-y-4">
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          Thank you, <strong class="text-neutral-900 dark:text-neutral-100">${escapeHtml(data.name)}</strong>. Your project specification has been routed directly to our Lead Materials Architect.
        </p>
        <div class="bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
          <div class="flex justify-between"><span class="text-neutral-500">Target Surface:</span><span class="font-semibold text-neutral-900 dark:text-neutral-200">${escapeHtml(data.surfaceType)}</span></div>
          <div class="flex justify-between"><span class="text-neutral-500">Estimated Area:</span><span class="font-semibold text-neutral-900 dark:text-neutral-200">${escapeHtml(data.area)}</span></div>
          <div class="flex justify-between"><span class="text-neutral-500">Contact Email:</span><span class="font-semibold text-neutral-900 dark:text-neutral-200">${escapeHtml(data.email)}</span></div>
          <div class="flex justify-between"><span class="text-neutral-500">Telephone:</span><span class="font-semibold text-neutral-900 dark:text-neutral-200">${escapeHtml(data.phone)}</span></div>
        </div>
        <p class="text-xs text-neutral-500">
          A physical sample package tracking number and formal BIM specification dossier will be dispatched to your registered address within 24 hours.
        </p>
      </div>

      <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
        <button type="button" id="modal-ok-btn" class="px-6 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A880] dark:hover:bg-[#C5A880] transition-colors focus:outline-none border-sharp">
          Acknowledge & Close
        </button>
      </div>
    </div>
  `;

  const closeModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    modal.style.display = 'none';
    modal.classList.add('hidden');
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
    document.body.style.overflow = '';
  };

  const handleAcknowledge = (e) => {
    closeModal(e);
    showToast(
      'Specification Request Acknowledged',
      'Your swatch request has been logged. Physical samples and BIM dossiers are queued for 24h dispatch.'
    );
  };

  const okBtn = modal.querySelector('#modal-ok-btn');
  const closeBtn = modal.querySelector('#close-modal-btn');
  if (okBtn) {
    okBtn.onclick = handleAcknowledge;
    okBtn.addEventListener('click', handleAcknowledge);
  }
  if (closeBtn) {
    closeBtn.onclick = closeModal;
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(e);
    }
  });

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal(e);
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);

  document.body.style.overflow = 'hidden';
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ==========================================================================
   5. PRODUCT FILTERING SYSTEM (PRODUCTS PAGE)
   ========================================================================== */
function initProductFilter() {
  const filterTypeBtns = document.querySelectorAll('[data-filter-type]');
  const filterRoomBtns = document.querySelectorAll('[data-filter-room]');
  const productCards = document.querySelectorAll('.product-card');
  const countBadge = document.getElementById('product-count');
  const emptyState = document.getElementById('no-products-found');

  if (productCards.length === 0) return;

  let activeType = 'all';
  let activeRoom = 'all';

  function applyFilters() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardType = card.getAttribute('data-type') || '';
      const cardRoom = card.getAttribute('data-room') || '';

      const matchType = (activeType === 'all' || cardType.toLowerCase().includes(activeType.toLowerCase()));
      const matchRoom = (activeRoom === 'all' || cardRoom.toLowerCase().includes(activeRoom.toLowerCase()));

      if (matchType && matchRoom) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (countBadge) {
      countBadge.textContent = `${visibleCount} Specifications Found`;
    }

    if (emptyState) {
      emptyState.classList.toggle('hidden', visibleCount > 0);
    }
  }

  filterTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTypeBtns.forEach(b => {
        b.classList.remove('bg-neutral-900', 'text-white', 'dark:bg-white', 'dark:text-neutral-900');
        b.classList.add('bg-neutral-100', 'text-neutral-700', 'dark:bg-neutral-800', 'dark:text-neutral-300');
      });
      btn.classList.add('bg-neutral-900', 'text-white', 'dark:bg-white', 'dark:text-neutral-900');
      btn.classList.remove('bg-neutral-100', 'text-neutral-700', 'dark:bg-neutral-800', 'dark:text-neutral-300');

      activeType = btn.getAttribute('data-filter-type');
      applyFilters();
    });
  });

  filterRoomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterRoomBtns.forEach(b => {
        b.classList.remove('border-[#C5A880]', 'text-[#C5A880]', 'font-bold');
        b.classList.add('border-transparent', 'text-neutral-600', 'dark:text-neutral-400');
      });
      btn.classList.add('border-[#C5A880]', 'text-[#C5A880]', 'font-bold');
      btn.classList.remove('border-transparent', 'text-neutral-600', 'dark:text-neutral-400');

      activeRoom = btn.getAttribute('data-filter-room');
      applyFilters();
    });
  });
}

/* ==========================================================================
   6. VISUALIZER INTERACTIVE ROOM & FINISH SWITCHER
   ========================================================================== */
function initVisualizer() {
  const switchBtns = document.querySelectorAll('.visualizer-swatch-btn');
  const mainImage = document.getElementById('visualizer-main-img');
  const mainTitle = document.getElementById('visualizer-title');
  const mainDesc = document.getElementById('visualizer-desc');
  const mainFormat = document.getElementById('visualizer-format');
  const mainFinish = document.getElementById('visualizer-finish');
  const mainAbsorption = document.getElementById('visualizer-absorption');

  if (!switchBtns.length || !mainImage) return;

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('border-2', 'border-[#C5A880]', 'scale-105'));
      btn.classList.add('border-2', 'border-[#C5A880]', 'scale-105');

      const imgUrl = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const format = btn.getAttribute('data-format');
      const finish = btn.getAttribute('data-finish');
      const absorption = btn.getAttribute('data-absorption');

      if (imgUrl && mainImage) mainImage.src = imgUrl;
      if (title && mainTitle) mainTitle.textContent = title;
      if (desc && mainDesc) mainDesc.textContent = desc;
      if (format && mainFormat) mainFormat.textContent = format;
      if (finish && mainFinish) mainFinish.textContent = finish;
      if (absorption && mainAbsorption) mainAbsorption.textContent = absorption;
    });
  });
}

/* ==========================================================================
   7. BEFORE & AFTER COMPARISON INTERACTION
   ========================================================================== */
function initBeforeAfter() {
  const slider = document.getElementById('before-after-slider');
  const afterImgWrapper = document.getElementById('after-img-wrapper');

  if (slider && afterImgWrapper) {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      afterImgWrapper.style.width = `${val}%`;
    });
  }
}

/* ==========================================================================
   8. LIGHTING TEMPERATURE SIMULATOR
   ========================================================================== */
function initLightingSimulator() {
  const lightBtns = document.querySelectorAll('.lighting-temp-btn');
  const simImage = document.getElementById('lighting-sim-img');
  const tempLabel = document.getElementById('lighting-temp-label');

  if (!lightBtns.length || !simImage) return;

  lightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lightBtns.forEach(b => {
        b.classList.remove('bg-neutral-900', 'text-white', 'dark:bg-white', 'dark:text-neutral-900');
        b.classList.add('bg-neutral-100', 'text-neutral-700', 'dark:bg-neutral-800', 'dark:text-neutral-300');
      });
      btn.classList.add('bg-neutral-900', 'text-white', 'dark:bg-white', 'dark:text-neutral-900');
      btn.classList.remove('bg-neutral-100', 'text-neutral-700', 'dark:bg-neutral-800', 'dark:text-neutral-300');

      const kelvin = btn.getAttribute('data-temp');
      if (kelvin === '2700') {
        simImage.style.filter = 'sepia(0.25) saturate(1.2) brightness(0.98)';
        if (tempLabel) tempLabel.textContent = '2700K Warm Residential Lumens - Enhances earthy travertine & brushed brass tones';
      } else if (kelvin === '4000') {
        simImage.style.filter = 'none';
        if (tempLabel) tempLabel.textContent = '4000K Neutral Architectural White - True color fidelity for Statuario & Basalt';
      } else if (kelvin === '6500') {
        simImage.style.filter = 'hue-rotate(185deg) saturate(0.9) brightness(1.02)';
        if (tempLabel) tempLabel.textContent = '6500K Direct Natural Sunlight - High reflectivity on polished porcelain';
      }
    });
  });
}

/* ==========================================================================
   9. ACCORDION EXPANDERS
   ========================================================================== */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      const isOpen = !content.classList.contains('hidden');

      const parentGroup = header.closest('.accordion-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'));
        parentGroup.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('rotate-180'));
      }

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

/* ==========================================================================
   10. UNIVERSAL SAMPLE & MODAL CTA TRIGGERS
   ========================================================================== */
function initModalTriggers() {
  document.querySelectorAll('.open-sample-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product-name') || 'Selected Surface Specification';
      showSampleRequestModal(productName);
    });
  });

  // Global event delegation for modal closing and acknowledge toast
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && (target.id === 'modal-ok-btn' || target.closest('#modal-ok-btn'))) {
      e.preventDefault();
      const modal = document.getElementById('quote-success-modal');
      if (modal) {
        modal.style.display = 'none';
        modal.remove();
        document.body.style.overflow = '';
      }
      showToast(
        'Specification Request Acknowledged',
        'Your swatch request has been logged. Physical samples and BIM dossiers are queued for 24h dispatch.'
      );
    } else if (target && (target.id === 'close-modal-btn' || target.closest('#close-modal-btn'))) {
      e.preventDefault();
      const modal = document.getElementById('quote-success-modal');
      if (modal) {
        modal.style.display = 'none';
        modal.remove();
        document.body.style.overflow = '';
      }
    }
  });
}

function showSampleRequestModal(productName) {
  showSuccessConfirmationModal({
    name: 'Architectural Specifier',
    email: 'specification@partner-studio.com',
    phone: '+1 (212) 555-0199',
    surfaceType: productName,
    area: 'Sample Swatch Box (4 Units)'
  });
}

/* ==========================================================================
   11. ARCHITECTURAL TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function getOrCreateToastContainer() {
  let container = document.getElementById('verona-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'verona-toast-container';
    container.className = 'fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full sm:w-96 px-4 sm:px-0';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(title = 'Request Acknowledged', message = 'Specification dossier queued for immediate dispatch.', type = 'success') {
  const container = getOrCreateToastContainer();

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-neutral-900 dark:bg-neutral-950 text-white border border-neutral-700 dark:border-neutral-800 border-l-4 border-l-[#C5A880] p-4 shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 border-sharp';

  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 flex-shrink-0 bg-[#C5A880]/20 border border-[#C5A880] flex items-center justify-center text-[#C5A880] mt-0.5 border-sharp">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="square" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="flex-grow min-w-0 pr-2">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">${escapeHtml(title)}</h4>
          <span class="text-[9px] font-mono uppercase tracking-widest text-[#C5A880]">Active</span>
        </div>
        <p class="text-xs text-neutral-300 mt-1 leading-relaxed">${escapeHtml(message)}</p>
        <div class="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>Tracking Ref: VR-${Math.floor(1000 + Math.random() * 9000)}</span>
          <span class="text-[#C5A880]">Dispatched</span>
        </div>
      </div>
      <button type="button" class="toast-close-btn text-neutral-400 hover:text-white p-1 focus:outline-none flex-shrink-0" aria-label="Dismiss Notification">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="square" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  const dismissToast = () => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  };

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      dismissToast();
    };
  }

  // Auto dismiss after 4.5 seconds
  setTimeout(dismissToast, 4500);
}

/* ==========================================================================
   12. ARCHITECTURAL WHITEPAPER & CAD DOSSIER DOWNLOAD CONTROLLER
   ========================================================================== */
function initWhitepaperDownloads() {
  const downloadBtns = document.querySelectorAll('.whitepaper-download-btn, [data-download-whitepaper]');
  if (!downloadBtns.length) return;

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Technical Architectural Specification';
      const pages = btn.getAttribute('data-pages') || '24';
      const size = btn.getAttribute('data-size') || '4.2 MB';

      triggerArchitecturalDossierDownload(title, pages, size);
    });
  });
}

function triggerArchitecturalDossierDownload(title, pages, size) {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const refCode = 'VRN-' + Math.floor(100000 + Math.random() * 900000);

  const dossierContent = 
    '%PDF-1.4\n' +
    '================================================================================\n' +
    'VERONA SURFACES & SANITARYWARE - TECHNICAL SPECIFICATION DOSSIER\n' +
    '================================================================================\n' +
    'Document Title     : ' + title + '\n' +
    'Reference Number   : ' + refCode + '\n' +
    'Publication Date   : ' + dateStr + '\n' +
    'Document Scope     : ' + pages + ' Pages | Archival Technical Spec (' + size + ')\n' +
    'Classification     : MasterFormat 09 30 00 (Surfaces) / 22 40 00 (Sanitary Fixtures)\n' +
    'Compliance Standard: European Standard EN 14411 / ISO 13006 / LEED v4.1 Platinum\n\n' +
    '1. ARCHITECTURAL SPECIFICATION & SUBSTRATE DEFLECTION GUIDELINES\n' +
    '--------------------------------------------------------------------------------\n' +
    '1.1 Substrate deflection for large format sintered porcelain slabs (>1200x2400mm)\n' +
    '    must not exceed L/720 under structural live and dead load configurations.\n' +
    '1.2 Floor surface flatness tolerance: Maximum 3mm deviation under a 3000mm\n' +
    '    calibrated straightedge conforming to ANSI A108.02.\n' +
    '1.3 Moisture barrier & decoupling: Approved uncoupling membranes required over\n' +
    '    all radiant hydronic floor heating screeds and post-tensioned assemblies.\n\n' +
    '2. ADHESIVE & GROUT ENGINEERING\n' +
    '--------------------------------------------------------------------------------\n' +
    '2.1 Thin-set mortar requirement: ANSI A118.15 / EN 12004 C2TES1 deformable polymer-\n' +
    '    modified cementitious systems with 100% full-coverage back-buttering.\n' +
    '2.2 Movement joints: Structural expansion joints at 4m to 6m perimeter intervals.\n' +
    '2.3 Laser-rectified edge joints: Calibrated for ultra-fine 1.0mm - 1.5mm joints.\n\n' +
    '3. ACOUSTIC DISSIPATION & SANITARY SUITE PERFORMANCE\n' +
    '--------------------------------------------------------------------------------\n' +
    '3.1 Wall-hung sanitary carriers rated for minimum 400kg static load benchmark.\n' +
    '3.2 Cyclonic rimless bowl flushing: 2.6L/4.0L dual flush; noise dissipation <18 dB(A).\n' +
    '3.3 Antibacterial Silver-Ion vitreous enamel permanently fired at 1280°C.\n\n' +
    'Issued by: Materials Architecture & Engineering Division, VERONA SURFACES\n' +
    'Direct Specifier Concierge: specification@partner-studio.com\n' +
    '================================================================================\n';

  const blob = new Blob([dossierContent], { type: 'application/pdf' });
  const sanitizedFilename = 'VERONA-' + title.replace(/[^a-zA-Z0-9]/g, '_') + '-Specification.pdf';
  const blobUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = sanitizedFilename;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);

  showToast(
    'Whitepaper Download Started',
    '"' + title + '" (' + size + ') specification dossier has been dispatched to your downloads.'
  );
}
