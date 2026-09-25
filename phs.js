let phsData = [];
const bps = ['CPA 01', 'CPA 02', 'CPA 03', 'CPA 04'];
const dsrs = ['Desmanto Rio', 'David Prang', 'Brigita Maria', 'Peter Spykhner'];
const custs = ['PT Kaltim Prima', 'PT Berau Coal', 'CV Maju Jaya', 'PT Pama Persada', 'PT Halmahera Jaya', 'PT PLN Ternate', 'PT Indo Tambang'];

function generatePHSData() {
    phsData = [];
    for(let i=1; i<=20; i++) {
        let bp = bps[i%4]; let dsr = dsrs[i%4]; let cust = custs[i%7];
        let status = i===1 ? 'REJECTED' : (i%3===0 ? 'APPROVED' : 'PENDING');
        let marginPct = (Math.random() * 16 + 2);
        let suppPrice = 68680 / (1 - (marginPct/100));
        let disc = ((85000 - suppPrice) / 85000) * 100;

        phsData.push({
            id: `#PHS-260${90+i}`, bp, dsr, cust, 
            support: suppPrice, margin: marginPct, discount: disc, status: status,
            volume: (Math.floor(Math.random() * 10) + 1) * 500
        });
    }
}

function renderPhsTable() {
    const tbody = document.getElementById('phsTableBody');
    tbody.innerHTML = '';
    
    const filterBp = document.getElementById('bpFilterPhs').value;
    const filterDsr = document.getElementById('dsrFilterPhs').value;
    const searchCust = document.getElementById('custFilterPhs').value.toLowerCase();
    const role = document.getElementById('roleSwitcher').value;

    let pendingCount = 0; let rejectedCount = 0; let totalCount = 0;

    phsData.forEach((item, index) => {
        if(filterBp !== 'ALL' && item.bp !== filterBp) return;
        if(filterDsr !== 'ALL' && item.dsr !== filterDsr) return;
        if(searchCust && !item.cust.toLowerCase().includes(searchCust)) return;

        totalCount++;
        if(item.status === 'PENDING') pendingCount++;
        if(item.status === 'REJECTED') rejectedCount++;

        let badgeClass = item.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' : 
                         (item.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200');
        
        let marginBadgeClass = item.margin >= 10 ? 'bg-green-100 text-green-700 border-green-300' :
                               (item.margin >= 5 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-red-100 text-red-700 border-red-300');

        let btnHtml = '';
        if(role === 'MGT') {
            btnHtml = `<button onclick="openSimulator(${index})" class="bg-blue-50 text-brand-blue px-3 py-1 rounded shadow-sm border border-blue-200 hover:bg-brand-blue hover:text-white transition-colors text-xs font-bold"><i class="fa-solid fa-calculator"></i> Simulasikan</button>`;
        } else { 
            if(item.status === 'REJECTED') {
                btnHtml = `<button onclick="openSimulator(${index})" class="bg-amber-50 text-amber-600 px-3 py-1 rounded shadow-sm border border-amber-200 hover:bg-amber-500 hover:text-white transition-colors text-xs font-bold"><i class="fa-solid fa-pen"></i> Revisi</button>`;
            } else {
                btnHtml = `<button onclick="openSimulator(${index}, true)" class="bg-slate-100 text-slate-500 px-3 py-1 rounded shadow-sm border border-slate-200 hover:bg-slate-200 transition-colors text-xs font-bold"><i class="fa-solid fa-eye"></i> View</button>`;
            }
        }

        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-50 transition-colors ${item.status==='REJECTED' ? 'bg-red-50/30' : ''}`;
        tr.innerHTML = `
            <td class="px-4 py-3 font-bold text-brand-blue font-mono text-xs">${item.id}</td>
            <td class="px-4 py-3"><span class="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold mr-1 block w-max mb-1">${item.bp}</span><span class="text-xs font-medium text-slate-600">${item.dsr}</span></td>
            <td class="px-4 py-3 font-bold text-slate-800 text-xs whitespace-normal w-48">${item.cust}</td>
            <td class="px-4 py-3 text-right font-bold text-slate-700">Rp ${item.support.toLocaleString('id-ID', {maximumFractionDigits:0})}</td>
            <td class="px-4 py-3 text-center"><span class="${marginBadgeClass} px-2 py-0.5 rounded-full text-[10px] font-black w-12 inline-block border">${item.margin.toFixed(1)}%</span></td>
            <td class="px-4 py-3 text-center"><span class="${badgeClass} px-2 py-1 rounded-full text-[9px] font-bold tracking-wider border shadow-sm">${item.status}</span></td>
            <td class="px-4 py-3 text-center">${btnHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('kpi-phs-total').innerText = totalCount;
    document.getElementById('kpi-phs-pending').innerText = pendingCount;
    document.getElementById('kpi-phs-rejected').innerText = rejectedCount;
}

function filterPhs() { renderPhsTable(); }

let currentPhsIndex = null;

function openSimulator(index, isViewOnly = false) {
    currentPhsIndex = index;
    const item = phsData[index];
    const role = document.getElementById('roleSwitcher').value;
    
    document.getElementById('simOverlay').classList.add('hidden');
    document.getElementById('sim-phs-id').innerText = item.id;
    
    const sDisc = document.getElementById('discountSlider');
    const sVol = document.getElementById('volumeSlider');
    const btnAction = document.getElementById('simActionBtn');

    sDisc.value = item.discount;
    sVol.value = item.volume;

    if(isViewOnly) {
        sDisc.disabled = true; sVol.disabled = true;
        btnAction.disabled = true;
        btnAction.className = "w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-lg text-sm cursor-not-allowed border border-slate-700";
        btnAction.innerHTML = "View Only";
    } else {
        sDisc.disabled = false; sVol.disabled = false;
        btnAction.disabled = false;
        if(role === 'MGT') {
            btnAction.className = "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all text-sm shadow-md";
            btnAction.innerHTML = '<i class="fa-solid fa-check-double mr-2"></i> Update & Approve';
            btnAction.onclick = () => { changePhsStatus('APPROVED'); };
        } else if (role === 'DSR') {
            btnAction.className = "w-full bg-brand-blue hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all text-sm shadow-md";
            btnAction.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Ajukan Ulang (Revisi)';
            btnAction.onclick = () => { changePhsStatus('PENDING'); };
        }
    }
    updateSimulator(); 
}

function updateSimulator() {
    if(currentPhsIndex === null) return;
    
    let disc = parseFloat(document.getElementById('discountSlider').value);
    document.getElementById('discountVal').innerText = disc.toFixed(1) + '%';
    document.getElementById('volumeVal').innerText = document.getElementById('volumeSlider').value;

    let suppPrice = 85000 * (1 - (disc / 100));
    document.getElementById('simPrice').innerText = 'Rp ' + suppPrice.toLocaleString('id-ID', {maximumFractionDigits: 0});
    
    let margin = ((suppPrice - 68680) / suppPrice) * 100;
    let elMargin = document.getElementById('simMargin');
    let elContainer = document.getElementById('simMarginContainer');
    
    elMargin.innerText = margin.toFixed(2) + '%';
    elContainer.className = "inline-block px-6 py-2 rounded-lg border transition-colors";
    elMargin.className = "text-4xl font-black font-mono transition-colors";

    if (margin >= 10) { 
        elContainer.classList.add('bg-emerald-900/30', 'border-emerald-700/50'); elMargin.classList.add('text-emerald-400');
    } else if (margin >= 5) { 
        elContainer.classList.add('bg-yellow-900/30', 'border-yellow-700/50'); elMargin.classList.add('text-yellow-400');
    } else { 
        elContainer.classList.add('bg-red-900/30', 'border-red-700/50'); elMargin.classList.add('text-red-500');
    }

    phsData[currentPhsIndex].discount = disc;
    phsData[currentPhsIndex].support = suppPrice;
    phsData[currentPhsIndex].margin = margin;
    phsData[currentPhsIndex].volume = document.getElementById('volumeSlider').value;
}

function changePhsStatus(newStatus) {
    phsData[currentPhsIndex].status = newStatus;
    document.getElementById('simOverlay').classList.remove('hidden');
    currentPhsIndex = null;
    renderPhsTable(); 
}