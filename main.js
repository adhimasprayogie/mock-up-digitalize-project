// --- GLOBAL TAB NAVIGATION ---
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('bg-slate-800', 'text-white', 'border-brand-blue');
        el.classList.add('text-slate-400', 'border-transparent');
    });
    element.classList.remove('text-slate-400', 'border-transparent');
    element.classList.add('bg-slate-800', 'text-white', 'border-brand-blue');
}

// --- GLOBAL ROLE SWITCHER ---
function changeRole() {
    const role = document.getElementById('roleSwitcher').value;
    const roleText = document.getElementById('sidebar-role-text');
    const dsmPanelFC = document.getElementById('dsmValidationPanel');
    const btnTambahFC = document.getElementById('btnTambahForecast');
    const bpFilterFC = document.getElementById('bpFilterForecast');
    const dsrFilterFC = document.getElementById('dsrFilterForecast');
    const bpFilterPHS = document.getElementById('bpFilterPhs');
    const dsrFilterPHS = document.getElementById('dsrFilterPhs');
    const btnTambahPHS = document.getElementById('btnTambahPhs');

    document.getElementById('simOverlay').classList.remove('hidden');
    currentPhsIndex = null;

    if (role === "DSR") {
        roleText.innerText = "Sales Representative";
        dsmPanelFC.classList.add('hidden');
        btnTambahFC.classList.remove('hidden');
        bpFilterFC.value = PERSONA.bp; bpFilterFC.disabled = true;
        dsrFilterFC.value = PERSONA.dsr; dsrFilterFC.disabled = true;
        bpFilterPHS.value = PERSONA.bp; bpFilterPHS.disabled = true;
        dsrFilterPHS.value = PERSONA.dsr; dsrFilterPHS.disabled = true;
        btnTambahPHS.classList.remove('hidden');
    } else {
        roleText.innerText = "GM Sales / Pricing";
        dsmPanelFC.classList.remove('hidden');
        btnTambahFC.classList.add('hidden');
        bpFilterFC.disabled = false; bpFilterFC.value = "ALL";
        dsrFilterFC.disabled = false; dsrFilterFC.value = "ALL";
        bpFilterPHS.disabled = false; bpFilterPHS.value = "ALL";
        dsrFilterPHS.disabled = false; dsrFilterPHS.value = "ALL";
        btnTambahPHS.classList.add('hidden');
    }

    filterSalesDashboard();
    filterForecast();
    applyForecastConstraints();
    filterPhs();
}

// --- INITIALIZER (tunggu data selesai dimuat) ---
document.addEventListener('DOMContentLoaded', function () {
    loadData().then(function () {
        renderSalesTables();
        renderForecastRows();
        generatePHSData();
        changeRole();
        trackOrder();
    }).catch(function (e) {
        console.error('Gagal memuat ' + DATA_URL, e);
        alert('Data tidak bisa dimuat: ' + DATA_URL + '. Cek apakah file ada di repo yang sama dengan index.html.');
    });
});
