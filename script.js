/*
========================================================================
|         KODE JAVASCRIPT UNTUK SOELTAN MEDSOS (FINAL)                 |
========================================================================
|                                                                      |
| PERINGATAN UNTUK KLIEN:                                              |
| Sebaiknya JANGAN mengubah isi file ini.                              |
| Kesalahan di file ini dapat membuat seluruh website tidak berfungsi. |
|                                                                      |
========================================================================
*/


// --- PENGATURAN PENTING (Untuk diubah oleh Developer) ---

// Ganti dengan URL DEPLOYMENT BARU Anda setelah mendeploy ulang script Google
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbfx1umeQG4P5LmOqO8pyCf_9Z_yrWmeFeckKxJwKp2wB9lzMvM5fZRLCUhMPkhcXhsQ/exec';

// Ganti dengan nomor WhatsApp ADMIN UTAMA untuk pertanyaan layanan
const ADMIN_WHATSAPP = '6281252835832'; 

// Ganti dengan Kunci Rahasia yang SAMA PERSIS dengan yang ada di Google Apps Script Anda.
// Kunci ini PENTING untuk keamanan.
const API_KEY = 'MasDidik123'; 


// --- Variabel Global & Elemen DOM (Jangan diubah) ---
let cart = [];
const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');
const cartCount = document.getElementById('cart-count');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// --- Event Listener untuk Menu Mobile ---
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// --- FUNGSI-FUNGSI WEBSITE (Jangan diubah) ---

function addToCart(button, name, price) {
    const input = button.previousElementSibling;
    const quantity = parseInt(input.value);
    if (quantity > 0) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        updateCartCount();
        showNotification(`${quantity * 100} ${name} ditambahkan.`);
        input.value = 1;
    }
}

function updateCartCount() {
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function showNotification(message) {
    const oldNotif = document.getElementById('cart-notification');
    if (oldNotif) oldNotif.remove();
    const notif = document.createElement('div');
    notif.id = 'cart-notification';
    notif.className = 'fixed bottom-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg z-50';
    notif.innerText = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

function showCartModal() {
    let content = `<h2 class="text-xl font-bold text-white mb-4">Keranjang Belanja</h2>`;
    content += `<div class="flex-grow overflow-y-auto pr-2" style="max-height: 40vh;">`;

    if (cart.length === 0) {
        content += '<p class="text-slate-400">Keranjang Anda kosong.</p>';
    } else {
        cart.forEach((item, index) => {
            content += `
                <div class="flex justify-between items-center mb-3">
                    <div>
                        <p class="font-semibold text-white text-sm">${item.name}</p>
                        <p class="text-xs text-slate-400">Rp ${item.price.toLocaleString('id-ID')} /100</p>
                    </div>
                    <div class="flex items-center">
                        <button onclick="decreaseQuantity(${index})" class="font-bold w-6 h-6 bg-slate-700 rounded">-</button>
                        <span class="w-10 text-center">${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})" class="font-bold w-6 h-6 bg-slate-700 rounded">+</button>
                    </div>
                </div>`;
        });
    }

    content += `</div>`;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    content += `
        <div class="border-t border-slate-700 pt-4 mt-4">
            <div class="flex justify-between items-center mb-4">
                <span class="text-base font-semibold text-white">Total:</span>
                <span class="text-lg font-bold text-blue-500">Rp ${total.toLocaleString('id-ID')}</span>
            </div>
            <div class="flex justify-end space-x-3">
                <button onclick="closeModal()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">Tutup</button>
                <button onclick="showCheckoutForm()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${cart.length === 0 ? 'disabled' : ''}>Lanjut</button>
            </div>
        </div>`;

    modalContent.innerHTML = content;
    modalContainer.classList.remove('hidden');
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCartCount();
    showCartModal();
}

function decreaseQuantity(index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    showCartModal();
}
// Disini untuk Mengganti Form Chekout
function showCheckoutForm() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalContent.innerHTML = `
        <h2 class="text-xl font-bold text-white mb-4">Formulir Pembayaran & Pesanan</h2>
        <form id="checkout-form" class="overflow-y-auto pr-2" style="max-height: 70vh;">
            <div class="bg-slate-800 p-4 rounded-lg mb-4 text-sm">
                <h3 class="font-semibold text-white mb-2 text-center">1. Lakukan Pembayaran</h3>
                <p class="text-center text-slate-300 mb-3">Total: <strong class="text-blue-400 text-base">Rp ${total.toLocaleString('id-ID')}</strong></p>
                <div class="text-center mb-3"> 
                    <p class="text-xs text-slate-400 mb-2">Scan QRIS di bawah ini</p>
                    <img src="GambarQris" alt="QRIS Payment" class="mx-auto w-48 h-48 rounded-lg bg-white p-1">
                </div>
                <div class="mt-4 text-slate-300">
                    <p class="text-xs text-center text-slate-400 mb-2">Atau Transfer Manual ke:</p>
                    <p><strong>Dana:</strong> 085942068379</p>
                    <p><strong>BCA:</strong> 3271332007</p>
                    <p><strong>BRI:</strong> 0149 0108 0052 508</p>
                    <p class="mt-1">a/n <strong>Didik Fajar</strong></p>
                </div>
            </div>
            <h3 class="font-semibold text-white mb-2 text-center mt-6">2. Isi Data & Unggah Bukti</h3>
            <div class="mb-3"><label for="nama" class="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label><input type="text" id="nama" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required></div>
            <div class="mb-3"><label for="email" class="block text-sm font-medium text-slate-300 mb-1">Alamat Email</label><input type="email" id="email" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required></div>
            <div class="mb-3"><label for="no_wa" class="block text-sm font-medium text-slate-300 mb-1">Nomor WhatsApp</label><input type="tel" id="no_wa" placeholder="62812..." class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required></div>
            <div class="mb-3"><label for="link" class="block text-sm font-medium text-slate-300 mb-1">Link Target</label><input type="url" id="link" placeholder="https://..." class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required></div>
            <div class="mb-3">
                <label for="file" class="block text-sm font-medium text-slate-300 mb-1">Unggah Bukti Bayar (Wajib, Max 1.5MB)</label>
                <input type="file" id="file" accept="image/*" class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" required/>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button type="button" onclick="showCartModal()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">Kembali</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm" id="submit-button">
                    <span>Kirim Pesanan</span>
                </button>
            </div>
        </form>`;
    document.getElementById('checkout-form').addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-button');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mengirim... (Proses bisa lambat)</span>`;
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    if (!file) {
        alert("Harap unggah bukti pembayaran.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Kirim Pesanan</span>`;
        return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Harap pilih file di bawah 1.5 MB.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Kirim Pesanan</span>`;
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const fileData = reader.result.split(',')[1];
        const dataToSend = buildDataPayload(file.name, file.type, fileData);
        sendData(dataToSend);
    };
    reader.onerror = () => {
        alert("Gagal membaca file. Coba lagi.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Kirim Pesanan</span>`;
    };
}

function buildDataPayload(fileName, mimeType, fileData) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const pesanan = cart.map(item => `${item.name} (Qty: ${item.quantity * 100})`).join('\n');
    return {
        nama: document.getElementById('nama').value,
        email: document.getElementById('email').value,
        no_wa: document.getElementById('no_wa').value,
        link: document.getElementById('link').value,
        pesanan: pesanan,
        total: total,
        fileName: fileName,
        mimeType: mimeType,
        fileData: fileData,
        apiKey: API_KEY
    };
}

function sendData(data) {
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        if (response.result === "success") {
            showSuccessMessage(response.orderId);
            cart = [];
            updateCartCount();
        } else {
            alert('Gagal mengirim pesanan: ' + (response.message || 'Terjadi kesalahan tidak diketahui.'));
            const submitBtn = document.getElementById('submit-button');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Kirim Pesanan</span>`;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Gagal mengirim pesanan. Periksa koneksi Anda atau hubungi admin.');
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
            <h2 class="text-2xl font-bold text-green-400 mt-4 mb-2">Pesanan Terkirim!</h2>
            <p class="text-slate-300 mb-1">Pesanan Anda dengan ID <strong class="text-white">${orderId}</strong> sedang diproses.</p>
            <p class="text-slate-400 text-sm mb-6">Konfirmasi juga telah dikirim ke email Anda. Terima kasih!</p>
            <button onclick="closeModal()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Tutup</button>
        </div>`;
}

function closeModal() {
    modalContainer.classList.add('hidden');
}

updateCartCount();