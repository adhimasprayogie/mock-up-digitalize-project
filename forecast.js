function filterForecast() {
    const bp = document.getElementById('bpFilterForecast').value;
    const dsr = document.getElementById('dsrFilterForecast').value;
    
    document.querySelectorAll('.fc-row').forEach(row => {
        const rowBP = row.getAttribute('data-bp');
        const rowDSR = row.getAttribute('data-dsr');
        
        let matchBP = (bp === "ALL" || rowBP === bp);
        let matchDSR = (dsr === "ALL" || rowDSR === dsr);
        
        if (matchBP && matchDSR) { row.classList.remove('hidden-row'); } 
        else { row.classList.add('hidden-row'); }
    });
    
    // Dynamic KPI mockup based on filter
    let bpVol = bp === 'ALL' ? 1250000 : (bp === 'CPA 01' ? 765000 : 110000);
    let dsrVol = dsr === 'ALL' ? (bpVol / 4) : 265000;
    
    document.getElementById('kpi-fc-bp').innerText = bpVol.toLocaleString('id-ID') + " L";
    document.getElementById('kpi-fc-dsr').innerText = dsrVol.toLocaleString('id-ID') + " L";
    
    updateForecastCount();
}

function toggleAllForecast(source) {
    document.querySelectorAll('.fc-check').forEach(cb => {
        if(!cb.closest('tr').classList.contains('hidden-row')) { cb.checked = source.checked; }
    });
    updateForecastCount();
}

document.addEventListener('change', function(e) {
    if(e.target && e.target.classList.contains('fc-check')) { updateForecastCount(); }
});

function updateForecastCount() {
    const count = document.querySelectorAll('.fc-check:checked').length;
    document.getElementById('selectedCountTextForecast').innerText = count + " items selected";
}

function applyForecastConstraints() {
    const role = document.getElementById('roleSwitcher').value;
    
    document.querySelectorAll('.fc-row').forEach(row => {
        const status = row.getAttribute('data-status');
        const dsrInput = row.querySelector('.input-dsr-prop');
        const justInput = row.querySelector('.input-justification');
        const dsmInput = row.querySelector('.input-dsm-adj');
        const btnDelete = row.querySelector('.btn-delete');

        if (role === "DSR") {
            if(dsmInput) {
                dsmInput.readOnly = true;
                dsmInput.classList.add('bg-slate-100', 'text-slate-400', 'border-slate-200');
                dsmInput.classList.remove('bg-amber-50/50', 'text-amber-700', 'border-amber-300');
            }
            if (status === "APPROVED") {
                dsrInput.readOnly = true; dsrInput.classList.add('bg-slate-100', 'text-slate-500'); dsrInput.classList.remove('bg-white', 'bg-blue-50', 'border-brand-blue');
                justInput.readOnly = true; justInput.classList.add('bg-slate-100', 'text-slate-500'); justInput.classList.remove('bg-white');
                btnDelete.classList.add('hidden'); 
            } else {
                dsrInput.readOnly = false; dsrInput.classList.remove('bg-slate-100', 'text-slate-500'); dsrInput.classList.add('bg-white');
                justInput.readOnly = false; justInput.classList.remove('bg-slate-100', 'text-slate-500'); justInput.classList.add('bg-white');
                btnDelete.classList.remove('hidden'); 
            }
        } else { 
            // MGT (DSM/GM)
            dsrInput.readOnly = true; dsrInput.classList.add('bg-slate-100', 'text-slate-500'); dsrInput.classList.remove('bg-white', 'bg-blue-50', 'border-brand-blue');
            justInput.readOnly = true; justInput.classList.add('bg-slate-100', 'text-slate-500'); justInput.classList.remove('bg-white');
            
            if(dsmInput) {
                dsmInput.readOnly = false;
                dsmInput.classList.remove('bg-slate-100', 'text-slate-400', 'border-slate-200');
                dsmInput.classList.add('bg-amber-50/50', 'text-amber-700', 'border-amber-300');
            }
            btnDelete.classList.remove('hidden'); 
        }
    });
}

function approveForecast() {
    const checkedBoxes = document.querySelectorAll('.fc-check:checked');
    if(checkedBoxes.length === 0) { alert("Pilih minimal 1 data forecast untuk disetujui!"); return; }

    checkedBoxes.forEach(cb => {
        const row = cb.closest('tr');
        row.setAttribute('data-status', 'APPROVED');
        const badge = row.querySelector('.status-badge');
        badge.className = "status-badge bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm";
        badge.innerText = "APPROVED";
        cb.checked = false;
    });
    document.getElementById('checkAllForecast').checked = false;
    updateForecastCount();
    applyForecastConstraints(); 
}

function rejectForecast() {
    const checkedBoxes = document.querySelectorAll('.fc-check:checked');
    if(checkedBoxes.length === 0) { alert("Pilih minimal 1 data forecast untuk direvisi!"); return; }

    checkedBoxes.forEach(cb => {
        const row = cb.closest('tr');
        row.setAttribute('data-status', 'REJECTED');
        const badge = row.querySelector('.status-badge');
        badge.className = "status-badge bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm";
        badge.innerText = "REVISED"; 
        cb.checked = false;
    });
    document.getElementById('checkAllForecast').checked = false;
    updateForecastCount();
    applyForecastConstraints(); 
}

function deleteForecastRow(btn) {
    const row = btn.closest('tr');
    if(confirm(`Yakin ingin menghapus baris forecast ini?`)) {
        row.remove();
        updateForecastCount();
    }
}

function addCustomForecast() {
    const tbody = document.getElementById('forecastTableBody');
    const currentBP = document.getElementById('bpFilterForecast').value === 'ALL' ? 'CPA 01' : document.getElementById('bpFilterForecast').value;
    const currentDSR = document.getElementById('dsrFilterForecast').value === 'ALL' ? 'Desmanto Rio' : document.getElementById('dsrFilterForecast').value;
    
    const newRow = document.createElement('tr');
    newRow.className = "bg-blue-50/20 fc-row transition-all duration-300";
    newRow.setAttribute('data-bp', currentBP);
    newRow.setAttribute('data-dsr', currentDSR);
    newRow.setAttribute('data-status', 'DRAFT'); 

    newRow.innerHTML = `
        <td class="px-3 py-3"><input type="checkbox" class="fc-check rounded"></td>
        <td class="px-3 py-3">
            <span class="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold mr-1">${currentBP}</span>
            <input type="text" placeholder="Nama Customer" class="w-32 border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 inline-block mt-1">
        </td>
        <td class="px-3 py-3 font-semibold"><input type="text" placeholder="SKU Baru..." class="w-full border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none"></td>
        <td class="px-3 py-3 text-right font-medium text-slate-400">0</td>
        <td class="px-3 py-3 text-right font-bold text-slate-400 bg-slate-50 border-x border-slate-100">-</td>
        <td class="px-3 py-3 text-center"><input type="number" placeholder="Input L" class="input-dsr-prop w-24 border-2 border-brand-blue rounded text-center py-1 font-semibold focus:outline-none focus:border-blue-500"></td>
        <td class="px-3 py-3 text-center"><input type="number" placeholder="-" class="input-dsm-adj w-24 border border-amber-300 rounded text-center py-1 font-bold focus:outline-none"></td>
        <td class="px-3 py-3"><input type="text" value="New target" class="input-justification w-full border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"></td>
        <td class="px-3 py-3 text-center"><span class="status-badge bg-slate-200 text-slate-600 border border-slate-300 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider">DRAFT</span></td>
        <td class="px-3 py-3 text-center"><button onclick="deleteForecastRow(this)" class="btn-delete text-slate-400 hover:text-red-600 transition-colors"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tbody.appendChild(newRow);
    applyForecastConstraints(); 
}