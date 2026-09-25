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
    
    // Forecast Elements
    const dsmPanelFC = document.getElementById('dsmValidationPanel');
    const btnTambahFC = document.getElementById('btnTambahForecast');
    const bpFilterFC = document.getElementById('bpFilterForecast');
    const dsrFilterFC = document.getElementById('dsrFilterForecast');
    
    // PHS Elements
    const bpFilterPHS = document.getElementById('bpFilterPhs');
    const dsrFilterPHS = document.getElementById('dsrFilterPhs');
    const btnTambahPHS = document.getElementById('btnTambahPhs');
    
    // Close Simulator Overlay in PHS
    document.getElementById('simOverlay').classList.remove('hidden');
    currentPhsIndex = null;

    if (role === "DSR") {
        roleText.innerText = "Sales Representative";
        
        // DSR Config for Forecast
        dsmPanelFC.classList.add('hidden');
        btnTambahFC.classList.remove('hidden');
        bpFilterFC.value = "CPA 01"; bpFilterFC.disabled = true;
        dsrFilterFC.value = "Desmanto Rio"; dsrFilterFC.disabled = true;
        
        // DSR Config for PHS
        bpFilterPHS.value = "CPA 01"; bpFilterPHS.disabled = true;
        dsrFilterPHS.value = "Desmanto Rio"; dsrFilterPHS.disabled = true;
        btnTambahPHS.classList.remove('hidden');
        
    } else { // Role = MGT (Tim Pricing / DSM / GM)
        roleText.innerText = "GM Sales / Pricing";
        
        // Manager Config for Forecast
        dsmPanelFC.classList.remove('hidden');
        btnTambahFC.classList.add('hidden');
        bpFilterFC.disabled = false; bpFilterFC.value = "ALL";
        dsrFilterFC.disabled = false; dsrFilterFC.value = "ALL";
        
        // Manager Config for PHS
        bpFilterPHS.disabled = false; bpFilterPHS.value = "ALL";
        dsrFilterPHS.disabled = false; dsrFilterPHS.value = "ALL";
        btnTambahPHS.classList.add('hidden');
    }
    
    // Trigger Filters across all modules
    filterSalesDashboard();
    filterForecast(); 
    applyForecastConstraints(); 
    filterPhs();
}

// --- INITIALIZER ---
document.addEventListener('DOMContentLoaded', function() {
    generatePHSData();
    changeRole(); 
});