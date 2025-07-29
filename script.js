/*
========================================================================
|         KODE JAVASCRIPT UNTUK SOELTAN MEDSOS (V9 - FINAL(Harus nya))            |
|                                                                     |
========================================================================
*/

// ===============================================
// BAGIAN 1: KONFIGURASI UTAMA
// ===============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHBNIeOSUbNtas1cn-p6hH-I-EmKpubnySCrK5bdVZfpIAGV7PKHIIpjwTztQNHKnmjw/exec';
const API_KEY = 'MasDidik123';

// ===============================================
// BAGIAN 2: STATE APLIKASI & ELEMEN DOM
// ===============================================
let cart = []; // State utama untuk menampung item di keranjang

// Elemen DOM yang sering digunakan
const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');
const cartCount = document.getElementById('cart-count');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const orderForm = document.getElementById('order-form');
const platformSelect = document.getElementById('platform-select');
const serviceDropdown = document.getElementById('service-dropdown');
const priceDisplay = document.getElementById('price-display');
const orderDetails = document.getElementById('order-details');
const quantityInput = document.getElementById('quantity-input');
const totalPriceDisplay = document.getElementById('total-price');
const targetLinkInput = document.getElementById('target-link');

// ===============================================
// BAGIAN 3: DATABASE LAYANAN
// ===============================================
const allServices = [
    { id: 1, platform: 'TikTok', name: 'Tiktok Share', price: 3, description: '(MAX 100K)' },
    { id: 2, platform: 'TikTok', name: 'Tiktok Share (Refil 7 Days)', price: 5, description: '(MAX 100K)(Refil 7 Days)' },
    { id: 3, platform: 'TikTok', name: 'Tiktok Share (INSTAN)', price: 6, description: '(MAX 100K)(Refil 30 Days)(Non Drop)' },
    { id: 4, platform: 'TikTok', name: 'Tiktok Coment Like', price: 6, description: '(MAX 100K)(Super Fast)' },
    { id: 5, platform: 'TikTok', name: 'Tiktok Rondom Coment', price: 26, description: '(Start Time 1 - 4 Hour)' },
    { id: 6, platform: 'TikTok', name: 'Tiktok Costume Coment', price: 40, description: '(Kirim costume komen ke admin untuk di proses)' },
    { id: 7, platform: 'TikTok', name: 'Tiktok Costume Coment Indoneisa', price: 380, description: '(Kirim costume komen ke admin untuk di proses)' },
    { id: 8, platform: 'TikTok', name: 'Tiktok Folowers Mix', price: 50, description: '(MAX 200K)(7 Days Refil)' },
    { id: 9, platform: 'TikTok', name: 'Tiktok Folowers Real Accounts (HQ)', price: 55, description: '(MAX 300K)(15 Days Refil)' },
    { id: 10, platform: 'TikTok', name: 'Tiktok Folowers HQ Accounts (Real)', price: 70, description: '(MAX 300K)(30 Days Refil)' },
    { id: 11, platform: 'TikTok', name: 'Tiktok Followers Indonesia', price: 99, description: '(30 Days Refil)(500/day)(MAX 5K)' },
    { id: 12, platform: 'TikTok', name: 'Tiktok Like Indonesia (HQ)', price: 20, description: '(15k/Days)(No Refil)' },
    { id: 13, platform: 'TikTok', name: 'Tiktok Like (SuperInstan)', price: 2, description: '(7 Days Refil)' },
    { id: 14, platform: 'TikTok', name: 'Tiktok Like (HQ & Real Profil)', price: 3, description: '(30 Days Refil)(SuperInstan)' },
    { id: 15, platform: 'TikTok', name: 'Tiktok Story Like', price: 12, description: '(MAX 100K)(NO REFIL)' },
    { id: 16, platform: 'TikTok', name: 'Tiktok Story View', price: 12, description: '(MAX 100K)(NO REFIL)' },
    { id: 17, platform: 'TikTok', name: 'Tiktok View (FAST)', price: 1, description: '(Instan Start)(Non Drop)(Unlimited)' },
    { id: 18, platform: 'Instagram', name: 'Instagram Channel Member', price: 18, description: '(Global)(MAX 1M)(HQ Real)(Instan)(No Refil)' },
    { id: 19, platform: 'Instagram', name: 'Instagram Channel Member (Refil)', price: 25, description: '(Global)(MAX 1M)(HQ Real)(Instan)(15 Days Refil)' },
    { id: 20, platform: 'Instagram', name: 'Instagram Costume Coment', price: 100, description: '(No Refil)(Slow)' },
    { id: 21, platform: 'Instagram', name: 'Instagram Costume Coment Indonesia', price: 330, description: '(No Refil)(HQ(Slow)' },
    { id: 22, platform: 'Instagram', name: 'Instagram Followers Indonesia', price: 70, description: '(Real Aktif)(Refil 7 Days)(MAX 3K)' },
    { id: 23, platform: 'Instagram', name: 'Instagram Followers Less Drop', price: 60, description: '(100k/Days)(Refil 14 Days)' },
    { id: 24, platform: 'Instagram', name: 'Instagram Followers Less Drop (SuperFast)', price: 90, description: '(100k/Days)(Refil 30 Days)' },
    { id: 25, platform: 'Instagram', name: 'Instagram Like Indonesia (Fast)', price: 15, description: '(Max 1k)(30 DayS Refil)' },
    { id: 26, platform: 'Instagram', name: 'Instagram Like (HQ)', price: 8, description: '(Fast)(Max 10k)(30 DayS Refil)' },
    { id: 27, platform: 'Instagram', name: 'Instagram Like (LQ)', price: 5, description: '(Slow)(Max 10k)(30 DayS Refil)' },
    { id: 28, platform: 'Instagram', name: 'Instaram Reels View', price: 1, description: '(MAX 1M)' },
    { id: 29, platform: 'Instagram', name: 'Instaram Reels Like', price: 15, description: '(MAX 1M)' },
    { id: 30, platform: 'Instagram', name: 'Instagram Share', price: 4, description: '(Speed 50k/Days)' },
    { id: 31, platform: 'Instagram', name: 'Instagram Story View Indonesia', price: 5, description: '(NO REFIL)' },
    { id: 32, platform: 'Instagram', name: 'Instagram Story View (HQ)', price: 3, description: '(All Story)(NO REFIL)' },
    { id: 33, platform: 'Instagram', name: 'Instagram View', price: 1, description: '(All Video Link)(No Refil)' },
    { id: 34, platform: 'YouTube', name: 'Youtube Like', price: 4, description: '(Instan Start)(No Refil)(Max 1M)' },
    { id: 35, platform: 'YouTube', name: 'Youtube Like (Refil 7 Days)', price: 5, description: '(Instan Start)(Max 1M)' },
    { id: 36, platform: 'YouTube', name: 'Youtube Like Short', price: 25, description: '(No Refil)(Max 1M)' },
    { id: 37, platform: 'YouTube', name: 'Youtube Like Short (Refil)', price: 30, description: '(Max 1M)' },
    { id: 38, platform: 'YouTube', name: 'Youtube Subscribers (High Drop)', price: 25, description: '(No Komplain)(No Refil)' },
    { id: 39, platform: 'YouTube', name: 'Youtube Subscribers (Refil 7 Days)', price: 60, description: '(100 - 200/days)(MAX 10K)' },
    { id: 40, platform: 'YouTube', name: 'Youtube View', price: 32, description: '(99,9% Non Drop)(Direct+overdelivery)(max 25k/dats)' },
    { id: 41, platform: 'YouTube', name: 'Youtube View Jam Tayang (15 min video)', price: 370, description: '(Speed 100/Hours)(15 days refil)' },
    { id: 42, platform: 'YouTube', name: 'Youtube View Jam Tayang (30 min video)', price: 480, description: '(Speed 100/Hours)(15 days refil)' },
    { id: 43, platform: 'YouTube', name: 'Youtube View Jam Tayang (60 min video)', price: 1300, description: '(Speed 100/Hours)(15 days refil)' },
    { id: 44, platform: 'Facebook', name: 'Facebook Followers Profile', price: 20, description: '(No Refil)(100k/Days)' },
    { id: 45, platform: 'Facebook', name: 'Facebook Followers Profile (Refil 7 Days)', price: 26, description: '(100k/Days)' },
    { id: 46, platform: 'Facebook', name: 'Facebook Group Member', price: 20, description: '(MAX 10K)(NO REFIL)' },
    { id: 47, platform: 'Facebook', name: 'Facebook Post Like', price: 20, description: '(NO REFIL)(Real Profil)' },
    { id: 48, platform: 'Facebook', name: 'Facebook Post Like (Refil 7 days)', price: 24, description: '(Real Profil)' },
    { id: 49, platform: 'Facebook', name: 'Facebook Post Share', price: 10, description: '(Real Profil)(7 days refil)' },
];

// ===============================================
// BAGIAN 4: FUNGSI-FUNGSI LOGIKA APLIKASI
// ===============================================

/** Mengisi dropdown layanan berdasarkan data yang difilter. */
function populateServices(services) {
    serviceDropdown.innerHTML = '<option value="">-- Pilih Layanan --</option>';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.innerText = service.name;
        serviceDropdown.appendChild(option);
    });
}

/** Mengupdate tampilan form saat layanan baru dipilih. */
function updateFormOnServiceChange() {
    const selectedId = parseInt(serviceDropdown.value);
    const service = allServices.find(s => s.id === selectedId);
    if (service) {
        priceDisplay.innerText = `Rp ${service.price.toLocaleString('id-ID')}`;
        orderDetails.innerText = service.description || '-';
    } else {
        priceDisplay.innerText = 'Rp 0';
        orderDetails.innerText = '-';
    }
    calculateTotal();
}

/** Menghitung total harga secara real-time. */
function calculateTotal() {
    const selectedId = parseInt(serviceDropdown.value);
    const service = allServices.find(s => s.id === selectedId);
    const quantity = parseInt(quantityInput.value) || 0;
    if (service && quantity > 0) {
        totalPriceDisplay.innerText = `Rp ${(service.price * quantity).toLocaleString('id-ID')}`;
    } else {
        totalPriceDisplay.innerText = 'Rp 0';
    }
}

/** Mengembalikan form ke keadaan semula. */
function resetFormState() {
    orderForm.reset();
    priceDisplay.innerText = 'Rp 0';
    orderDetails.innerText = '-';
    totalPriceDisplay.innerText = 'Rp 0';
    serviceDropdown.innerHTML = '<option value="">-- Pilih Platform Dulu --</option>';
    serviceDropdown.disabled = true;
}

/** Memvalidasi input pada form utama sebelum tambah ke keranjang. */
function validateForm() {
    if (!platformSelect.value) {
        alert('Harap pilih platform terlebih dahulu.');
        return false;
    }
    if (!serviceDropdown.value) {
        alert('Harap pilih layanan terlebih dahulu.');
        return false;
    }
    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity < 1) {
        alert('Harap isi jumlah dengan benar (minimal 1).');
        return false;
    }
    if (!targetLinkInput.value) {
        alert('Harap isi Link Target.');
        return false;
    }
    return true; // Semua valid
}

/** Menambahkan item ke keranjang belanja setelah validasi. */
function handleAddToCart() {
    if (!validateForm()) return;
    
    const selectedId = parseInt(serviceDropdown.value);
    const service = allServices.find(s => s.id === selectedId);
    
    cart.push({
        name: `[${service.platform}] ${service.name}`,
        price: service.price,
        quantity: parseInt(quantityInput.value),
        link: targetLinkInput.value,
    });

    updateCartCount();
    showNotification(`${parseInt(quantityInput.value).toLocaleString('id-ID')} ${service.name} ditambahkan.`);
    resetFormState();
}

/** Mengupdate angka di ikon keranjang. */
function updateCartCount() {
    cartCount.innerText = cart.length;
}

/** Menampilkan notifikasi singkat. */
function showNotification(message) {
    const oldNotif = document.getElementById('cart-notification');
    if (oldNotif) oldNotif.remove();
    const notif = document.createElement('div');
    notif.id = 'cart-notification';
    notif.className = 'fixed bottom-5 right-5 bg-teal-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 font-semibold';
    notif.innerText = message;
    document.body.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 3000);
}

/** Menampilkan modal keranjang belanja. */
function showCartModal() {
    let content = `<h2 class="text-xl font-bold text-slate-900 mb-4">Keranjang Belanja</h2>`;
    content += `<div class="flex-grow overflow-y-auto pr-2" style="max-height: 40vh;">`;
    if (cart.length === 0) {
        content += '<p class="text-slate-500">Keranjang Anda kosong.</p>';
    } else {
        cart.forEach((item, index) => {
            content += `
                <div class="flex justify-between items-start mb-3 border-b border-slate-200 pb-3">
                    <div class="flex-1"><p class="font-semibold text-slate-800 text-sm">${item.name}</p><p class="text-xs text-slate-500">Qty: ${item.quantity.toLocaleString('id-ID')}</p><p class="text-xs text-slate-500 break-all mt-1">Link: ${item.link}</p><p class="text-sm font-bold text-teal-600 mt-2">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p></div>
                    <button onclick="removeItem(${index})" class="ml-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600">HAPUS</button>
                </div>`;
        });
    }
    content += `</div>`;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    content += `
        <div class="border-t border-slate-200 pt-4 mt-4">
            <div class="flex justify-between items-center mb-4"><span class="text-base font-semibold text-slate-800">Total:</span><span class="text-lg font-bold text-teal-600">Rp ${total.toLocaleString('id-ID')}</span></div>
            <div class="flex justify-end space-x-3">
                <button onclick="closeModal()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm">Tutup</button>
                <button onclick="showCheckoutForm()" class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg text-sm ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${cart.length === 0 ? 'disabled' : ''}>Lanjut ke Pembayaran</button>
            </div>
        </div>`;
    modalContent.innerHTML = content;
    modalContainer.classList.remove('hidden');
}

/** Menghapus item dari keranjang. */
function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    showCartModal();
}

/** Menampilkan form checkout & pembayaran. */
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

/** Menangani pengiriman form checkout. */
function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-button');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mengirim...</span>`;
    
    const nama = document.getElementById('nama-checkout').value;
    const email = document.getElementById('email-checkout').value;
    const no_wa = document.getElementById('wa-checkout').value;
    const file = document.getElementById('file').files[0];

    if (!nama || !email || !no_wa) {
        alert("Harap lengkapi Nama, Email, dan No WhatsApp.");
        submitBtn.disabled = false; submitBtn.innerHTML = `<span>Kirim Pesanan</span>`; return;
    }
    if (!file) {
        alert("Harap unggah bukti pembayaran.");
        submitBtn.disabled = false; submitBtn.innerHTML = `<span>Kirim Pesanan</span>`; return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Harap pilih file di bawah 1.5 MB.");
        submitBtn.disabled = false; submitBtn.innerHTML = `<span>Kirim Pesanan</span>`; return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => sendData(buildDataPayload(nama, email, no_wa, file.name, file.type, reader.result.split(',')[1]));
    reader.onerror = () => {
        alert("Gagal membaca file. Coba lagi.");
        submitBtn.disabled = false; submitBtn.innerHTML = `<span>Kirim Pesanan</span>`;
    };
}

/** Membangun payload data untuk dikirim ke Google Apps Script. */
function buildDataPayload(nama, email, no_wa, fileName, mimeType, fileData) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const pesanan = cart.map(item => `${item.name} | Qty: ${item.quantity.toLocaleString('id-ID')} | Link: ${item.link}`).join('\n');
    return {
        nama, email, no_wa,
        link: cart.length === 1 ? cart[0].link : "Lihat detail pesanan di bawah",
        pesanan, total, fileName, mimeType, fileData,
        apiKey: API_KEY
    };
}

/** Mengirim data ke backend Google Apps Script. */
function sendData(data) {
    fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(data) })
    .then(res => res.json())
    .then(response => {
        const submitBtn = document.getElementById('submit-button');
        if (response.result === "success") {
            showSuccessMessage(response.orderId);
            cart = [];
            updateCartCount();
        } else {
            alert('Gagal mengirim pesanan: ' + (response.message || 'Terjadi kesalahan.'));
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = `<span>Kirim Pesanan</span>`; }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Gagal mengirim pesanan. Periksa koneksi Anda atau hubungi admin.');
        const submitBtn = document.getElementById('submit-button');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = `<span>Kirim Pesanan</span>`; }
    });
}

/** Menampilkan pesan sukses setelah pesanan terkirim. */
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

/** Menutup modal. */
function closeModal() {
    modalContainer.classList.add('hidden');
}

// ===============================================
// BAGIAN 5: INISIALISASI & EVENT LISTENERS
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    modalContainer.addEventListener('click', (event) => { if (event.target === modalContainer) closeModal(); });

    if (orderForm) {
        platformSelect.addEventListener('change', () => {
            const selectedPlatform = platformSelect.value;
            serviceDropdown.value = '';
            updateFormOnServiceChange();
            if (selectedPlatform) {
                populateServices(allServices.filter(service => service.platform === selectedPlatform));
                serviceDropdown.disabled = false;
            } else {
                serviceDropdown.innerHTML = '<option value="">-- Pilih Platform Dulu --</option>';
                serviceDropdown.disabled = true;
            }
        });
        serviceDropdown.addEventListener('change', updateFormOnServiceChange);
        quantityInput.addEventListener('input', calculateTotal);
    }
});