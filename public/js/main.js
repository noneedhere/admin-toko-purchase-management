/**
 * Admin Toko — Client-side JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNotifications();
  initNavToggle();
  initNavActive();
  initPurchaseForm();
  initCancelModal();
});

function initNotifications() {
  const notification = document.getElementById('notification');
  if (notification) {
    setTimeout(() => {
      closeNotification();
    }, 5000);
  }
}

function closeNotification() {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.classList.add('notification-hide');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

window.closeNotification = closeNotification;

/* ============================
   Navigation
   ============================ */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
}

function initNavActive() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (path === href || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });
}

/* ============================
   Purchase Form
   ============================ */
function initPurchaseForm() {
  const form = document.getElementById('purchaseForm');
  if (!form) return;

  const productSelect = document.getElementById('product_id');
  const quantityInput = document.getElementById('quantity');
  const unitPriceInput = document.getElementById('unit_price');
  const totalPriceInput = document.getElementById('total_price');
  const stockHint = document.getElementById('stockHint');
  const btnSubmit = document.getElementById('btnSubmit');

  let selectedPrice = 0;
  let selectedStock = 0;

  // Format number to Rupiah
  function formatRupiah(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  productSelect.addEventListener('change', () => {
    const selectedOption = productSelect.options[productSelect.selectedIndex];

    if (!productSelect.value) {
      unitPriceInput.value = '';
      totalPriceInput.value = '';
      stockHint.textContent = '';
      selectedPrice = 0;
      selectedStock = 0;
      clearError('product_id');
      return;
    }

    selectedPrice = parseFloat(selectedOption.dataset.price) || 0;
    selectedStock = parseInt(selectedOption.dataset.stock, 10) || 0;

    unitPriceInput.value = formatRupiah(selectedPrice);
    stockHint.textContent = `Stok tersedia: ${selectedStock}`;
    clearError('product_id');

    updateTotal();

    fetch(`/api/products/${productSelect.value}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) return;
        selectedPrice = data.price;
        selectedStock = data.stock_quantity;
        unitPriceInput.value = formatRupiah(selectedPrice);
        stockHint.textContent = `Stok tersedia: ${selectedStock}`;
        updateTotal();
      })
      .catch(() => {
      });
  });

  quantityInput.addEventListener('input', () => {
    clearError('quantity');
    updateTotal();
  });

  function updateTotal() {
    const qty = parseInt(quantityInput.value, 10);
    if (qty > 0 && selectedPrice > 0) {
      totalPriceInput.value = formatRupiah(qty * selectedPrice);
    } else {
      totalPriceInput.value = '';
    }
  }

  form.addEventListener('submit', (e) => {
    let valid = true;

    if (!productSelect.value) {
      showError('product_id', 'Produk harus dipilih');
      valid = false;
    }

    const qty = parseInt(quantityInput.value, 10);
    if (!quantityInput.value || quantityInput.value.trim() === '') {
      showError('quantity', 'Quantity harus diisi');
      valid = false;
    } else if (isNaN(qty) || !Number.isInteger(qty)) {
      showError('quantity', 'Quantity harus berupa angka bulat');
      valid = false;
    } else if (qty <= 0) {
      showError('quantity', 'Quantity minimal adalah 1');
      valid = false;
    } else if (qty > selectedStock) {
      showError('quantity', `Stok tidak mencukupi. Stok tersedia: ${selectedStock}`);
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Memproses...';
  });
}

/* ============================
   Form Validation Helpers
   ============================ */
function showError(fieldId, message) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError(fieldId) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = '';
  }
}

/* ============================
   Cancel Modal
   ============================ */
let cancelModalEl = null;

function initCancelModal() {
  cancelModalEl = document.getElementById('cancelModal');
  if (!cancelModalEl) return;

  cancelModalEl.addEventListener('click', (e) => {
    if (e.target === cancelModalEl) {
      closeCancelModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cancelModalEl.classList.contains('active')) {
      closeCancelModal();
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-cancel-purchase');
    if (btn) {
      const purchaseId = btn.dataset.id;
      const invoiceNumber = btn.dataset.invoice;
      showCancelModal(purchaseId, invoiceNumber);
    }
  });
}

function showCancelModal(purchaseId, invoiceNumber) {
  if (!cancelModalEl) return;

  const form = document.getElementById('cancelForm');
  const invoiceEl = document.getElementById('modalInvoice');

  form.action = `/purchases/${purchaseId}/cancel`;
  invoiceEl.textContent = invoiceNumber;

  cancelModalEl.classList.add('active');
}

function closeCancelModal() {
  if (cancelModalEl) {
    cancelModalEl.classList.remove('active');
  }
}

window.showCancelModal = showCancelModal;
window.closeCancelModal = closeCancelModal;
