/*
========================================================================
|    gtw males   |
========================================================================
*/

// ===============================================
// BAGIAN 1: KONFIGURASI UTAMA
// ===============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzggFNudw-oK6YE2DT5sWMADXCSDY7fhGlKOWUBHikNVRXo2kilBoaIpwQ4mn8eJGD2mg/exec';
const API_KEY = 'MasDidik123';

// ===============================================
// BAGIAN 2: STATE APLIKASI & ELEMEN DOM
// ===============================================
let cart = [];
let allServices = [];

const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');
const announcementModal = document.getElementById('announcement-modal');
const announcementModalContent = document.getElementById('announcement-modal-content');
const cartCount = document.getElementById('cart-count');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const orderForm = document.getElementById('order-form');
const platformSelect = document.getElementById('platform-select');
const subPlatformContainer = document.getElementById('sub-platform-container');
const subPlatformSelect = document.getElementById('sub-platform-select');
const serviceDropdown = document.getElementById('service-dropdown');
const priceDisplay = document.getElementById('price-display');
const orderDetails = document.getElementById('order-details');
const quantityInput = document.getElementById('quantity-input');
const totalPriceDisplay = document.getElementById('total-price');
const targetLinkContainer = document.getElementById('target-link-container');
const targetLinkInput = document.getElementById('target-link');
const toastContainer = document.getElementById('toast-container');


// ===============================================
// BAGIAN 3: FUNGSI-FUNGSI UTAMA
// ===============================================

async function fetchServices() {
    try {
        const response = await fetch('service.json');
        if (!response.ok) throw new Error('Gagal memuat data layanan.');
        allServices = await response.json();
        populatePlatforms();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function fetchAnnouncement() {
    try {
        const response = await fetch('pengumuman.json');
        if (!response.ok) return;
        const announcement = await response.json();
        if (announcement && announcement.title && announcement.content) {
            showAnnouncementModal(announcement);
        }
    } catch (error) {
        console.error('Error fetching announcement:', error);
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

function showAnnouncementModal(announcement) {
    announcementModalContent.innerHTML = `
        <h2 class="text-xl font-bold text-slate-900 mb-4">${announcement.title}</h2>
        <div class="flex-grow overflow-y-auto pr-2" style="max-height: 40vh;">${announcement.content}</div>
        <div class="flex justify-end mt-6">
            <button type="button" onclick="closeAnnouncementModal()" class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg text-sm">Tutup</button>
        </div>`;
    announcementModal.classList.remove('hidden');
}

function closeAnnouncementModal() {
    announcementModal.classList.add('hidden');
}

function populatePlatforms() {
    const uniquePlatforms = [...new Set(allServices.map(service => service.platform))];
    platformSelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
    uniquePlatforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = platform;
        option.innerText = platform;
        platformSelect.appendChild(option);
    });
}

function populateSubPlatforms(platform) {
    const subPlatforms = [...new Set(allServices
        .filter(s => s.platform === platform && s.sub_platform)
        .map(s => s.sub_platform))];
    
    subPlatformSelect.innerHTML = '<option value="">-- Pilih Aplikasi --</option>';
    subPlatforms.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub;
        option.innerText = sub;
        subPlatformSelect.appendChild(option);
    });
}

function populateServices(platform, subPlatform = null) {
    let filteredServices = allServices.filter(s => s.platform === platform);
    if (subPlatform) {
        filteredServices = filteredServices.filter(s => s.sub_platform === subPlatform);
    }
    
    serviceDropdown.innerHTML = '<option value="">-- Pilih Layanan --</option>';
    filteredServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.innerText = service.name;
        serviceDropdown.appendChild(option);
    });
}

function updateFormDisplay() {
    const selectedPlatform = platformSelect.value;
    
    // Reset state
    subPlatformContainer.classList.add('hidden');
    targetLinkContainer.classList.remove('hidden');
    quantityInput.placeholder = 'Contoh: 1000';
    subPlatformSelect.value = '';
    serviceDropdown.value = '';
    serviceDropdown.innerHTML = '<option value="">-- Pilih Kategori Dulu --</option>';
    serviceDropdown.disabled = true;
    updateFormOnServiceChange();

    if (!selectedPlatform) {
        return;
    }

    if (selectedPlatform === 'Aplikasi Premium') {
        subPlatformContainer.classList.remove('hidden');
        targetLinkContainer.classList.add('hidden'); // Sembunyikan link target untuk Apk
        quantityInput.placeholder = 'Contoh: 1'; // Ubah placeholder untuk Apk
        populateSubPlatforms(selectedPlatform);
    } else {
        populateServices(selectedPlatform);
        serviceDropdown.disabled = false;
    }
}

function updateFormOnServiceChange() {
    const service = allServices.find(s => s.id === parseInt(serviceDropdown.value));
    priceDisplay.innerText = service ? `Rp ${service.price.toLocaleString('id-ID')}` : 'Rp 0';
    orderDetails.innerText = service ? service.description || '-' : '-';
    calculateTotal();
}

function calculateTotal() {
    const service = allServices.find(s => s.id === parseInt(serviceDropdown.value));
    const quantity = parseInt(quantityInput.value) || 0;
    totalPriceDisplay.innerText = (service && quantity > 0) ? `Rp ${(service.price * quantity).toLocaleString('id-ID')}` : 'Rp 0';
}

function handleAddToCart() {
    const service = allServices.find(s => s.id === parseInt(serviceDropdown.value));
    
    if (!platformSelect.value) {
        showToast('Harap pilih kategori terlebih dahulu.', 'error');
        return;
    }
    if (platformSelect.value === 'Aplikasi Premium' && !subPlatformSelect.value) {
        showToast('Harap pilih aplikasi terlebih dahulu.', 'error');
        return;
    }
    if (!serviceDropdown.value) {
        showToast('Harap pilih layanan terlebih dahulu.', 'error');
        return;
    }
    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity < 1) {
        showToast('Harap isi jumlah dengan benar (minimal 1).', 'error');
        return;
    }
    if (platformSelect.value !== 'Aplikasi Premium' && !targetLinkInput.value) {
        showToast('Harap isi Link Target.', 'error');
        return;
    }

    cart.push({
        name: `[${service.platform}] ${service.name}`,
        price: service.price,
        quantity: quantity,
        link: platformSelect.value === 'Aplikasi Premium' ? '-' : targetLinkInput.value,
    });
    
    updateCartCount();
    showToast(`${quantity} ${service.name} ditambahkan.`);
    orderForm.reset();
    updateFormDisplay();
}

function updateCartCount() {
    cartCount.innerText = cart.length;
}

function showCartModal() {
    let content = `<h2 class="text-xl font-bold text-slate-900 mb-4">Keranjang Belanja</h2>`;
    content += '<div class="flex-grow overflow-y-auto pr-2" style="max-height: 40vh;">';
    if (cart.length === 0) {
        content += '<p class="text-slate-500">Keranjang Anda kosong.</p>';
    } else {
        cart.forEach((item, index) => {
            content += `<div class="flex justify-between items-start mb-3 border-b pb-3">
                <div class="flex-1">
                    <p class="font-semibold text-slate-800 text-sm">${item.name}</p>
                    <p class="text-xs text-slate-500">Qty: ${item.quantity.toLocaleString('id-ID')}</p>
                    ${item.link !== '-' ? `<p class="text-xs text-slate-500 break-all mt-1">Link: ${item.link}</p>` : ''}
                    <p class="text-sm font-bold text-teal-600 mt-2">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <button onclick="removeItem(${index})" class="ml-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600">HAPUS</button>
            </div>`;
        });
    }
    content += '</div>';

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    content += `
        <div class="border-t pt-4 mt-4">
            <div class="flex justify-between items-center mb-4">
                <span class="text-base font-semibold">Total:</span>
                <span class="text-lg font-bold text-teal-600">Rp ${total.toLocaleString('id-ID')}</span>
            </div>
            <div class="flex justify-end space-x-3">
                <button onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg text-sm">Tutup</button>
                <button onclick="showCheckoutForm()" class="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg text-sm ${!cart.length && 'opacity-50 cursor-not-allowed'}" ${!cart.length && 'disabled'}>Lanjut Bayar</button>
            </div>
        </div>`;
    modalContent.innerHTML = content;
    modalContainer.classList.remove('hidden');
}

function closeModal() {
    modalContainer.classList.add('hidden');
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    showCartModal();
}

function showCheckoutForm() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalContent.innerHTML = `
        <h2 class="text-xl font-bold text-slate-900 mb-4">Formulir Pembayaran</h2>
        <form id="checkout-form" class="overflow-y-auto pr-2 space-y-4" style="max-height: 70vh;">
            <div><label for="nama-checkout" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label><input type="text" id="nama-checkout" placeholder="Nama Anda" class="form-input" required></div>
            <div><label for="email-checkout" class="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" id="email-checkout" placeholder="Email Anda" class="form-input" required></div>
            <div><label for="wa-checkout" class="block text-sm font-medium text-slate-700 mb-1">No WhatsApp</label><input type="tel" id="wa-checkout" placeholder="628..." class="form-input" required></div>
            <div class="bg-slate-100 p-4 rounded-lg mt-4 text-sm border border-slate-200">
                <h3 class="font-semibold text-slate-900 mb-2 text-center">1. Lakukan Pembayaran</h3><p class="text-center text-slate-600 mb-3">Total: <strong class="text-teal-600 text-base">Rp ${total.toLocaleString('id-ID')}</strong></p>
                <div class="text-center mb-3"><p class="text-xs text-slate-500 mb-2">Scan QRIS di bawah ini</p><img src="qrcode.png" alt="QRIS Payment" class="mx-auto w-48 h-48 rounded-lg bg-white p-1 border"></div>
                <div class="mt-4 text-slate-800"><p class="text-xs text-center text-slate-500 mb-2">Atau Transfer Manual ke:</p><p><strong>Dana:</strong> 085942068379</p><p><strong>BCA:</strong> 3271332007</p><p><strong>BRI:</strong> 0149 0108 0052 508</p><p class="mt-1">a/n <strong>Didik Fajar</strong></p></div>
            </div>
            <div class="mt-4"><h3 class="font-semibold text-slate-900 mb-2 text-center">2. Unggah Bukti Pembayaran</h3><label for="file" class="block text-sm font-medium text-slate-700 mb-1">Unggah Bukti Bayar (Wajib, Max 1.5MB)</label><input type="file" id="file" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600" required/></div>
            <div class="flex justify-end space-x-3 mt-6">
                <button type="button" onclick="showCartModal()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm">Kembali</button>
                <button type="submit" class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg text-sm" id="submit-button"><span>Kirim Pesanan</span></button>
            </div>
        </form>`;
    document.getElementById('checkout-form').addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-button');
    const nama = document.getElementById('nama-checkout').value;
    const email = document.getElementById('email-checkout').value;
    const no_wa = document.getElementById('wa-checkout').value;
    const file = document.getElementById('file').files[0];

    if (!nama || !email || !no_wa || !file) {
        showToast("Harap lengkapi semua data dan unggah bukti pembayaran.", 'error');
        return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
        showToast("Ukuran file terlalu besar! Maksimal 1.5 MB.", 'error');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mengirim...</span>`;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => sendData(buildDataPayload(nama, email, no_wa, file.name, file.type, reader.result.split(',')[1]));
    reader.onerror = () => {
        showToast("Gagal membaca file. Coba lagi.", 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Kirim Pesanan</span>`;
    };
}

function buildDataPayload(nama, email, no_wa, fileName, mimeType, fileData) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const pesanan = cart.map(item => `${item.name} | Qty: ${item.quantity.toLocaleString('id-ID')} | Link: ${item.link}`).join('\n');
    return {
        nama, email, no_wa,
        link: cart.length === 1 ? cart[0].link : "Lihat detail pesanan",
        pesanan, total, fileName, mimeType, fileData,
        apiKey: API_KEY
    };
}

function sendData(data) {
    fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(data) })
    .then(res => res.json())
    .then(response => {
        if (response.result === "success") {
            showSuccessMessage(response.orderId);
            cart = [];
            updateCartCount();
        } else {
            throw new Error(response.message || 'Terjadi kesalahan.');
        }
    })
    .catch(error => {
        showToast('Gagal mengirim pesanan: ' + error.message, 'error');
        const submitBtn = document.getElementById('submit-button');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Kirim Pesanan</span>`;
        }
    });
}

function showSuccessMessage(orderId) {
    modalContent.innerHTML = `
        <div class="text-center">
            <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 class="text-2xl font-bold text-green-600 mt-4 mb-2">Pesanan Terkirim!</h2>
            <p class="text-slate-700 mb-1">Pesanan Anda dengan ID <strong class="text-slate-900">${orderId}</strong> sedang diproses.</p>
            <p class="text-slate-500 text-sm mb-6">Konfirmasi juga telah dikirim ke email Anda. Terima kasih!</p>
            <button onclick="closeModal()" class="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg">Tutup</button>
        </div>`;
}

// ===============================================
// BAGIAN 4: INISIALISASI & EVENT LISTENERS
// ===============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Event listener untuk menu mobile
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // Event listener untuk menutup modal
    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => { if (event.target === modalContainer) closeModal(); });
    }
    if (announcementModal) {
        announcementModal.addEventListener('click', (event) => { if (event.target === announcementModal) closeAnnouncementModal(); });
    }

    // Muat data dan inisialisasi form
    await Promise.all([fetchServices(), fetchAnnouncement()]);
    
    updateCartCount();
    
    if (orderForm) {
        platformSelect.addEventListener('change', updateFormDisplay);

        subPlatformSelect.addEventListener('change', () => {
            const platform = platformSelect.value;
            const subPlatform = subPlatformSelect.value;
            serviceDropdown.value = '';
            if (subPlatform) {
                populateServices(platform, subPlatform);
                serviceDropdown.disabled = false;
            } else {
                serviceDropdown.innerHTML = '<option value="">-- Pilih Aplikasi Dulu --</option>';
                serviceDropdown.disabled = true;
            }
            updateFormOnServiceChange();
        });
        
        serviceDropdown.addEventListener('change', updateFormOnServiceChange);

        quantityInput.addEventListener('input', calculateTotal);
    }
});