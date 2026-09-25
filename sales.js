const kpiDataSales = {
    "ALL": { po: "454.760 L", deliv: "160.617 L", inv: "169.417 L", done: "68.531 L", sPct: "36.7%", sVal: "122.265 / 333.000 L", nsPct: "36.7%", nsVal: "115.683 / 315.000 L" },
    "CPA 01": { po: "85.200 L", deliv: "30.150 L", inv: "40.000 L", done: "15.050 L", sPct: "0.0%", sVal: "0 / 0 L", nsPct: "48.4%", nsVal: "10.012 / 20.700 L" },
    "CPA 02": { po: "65.000 L", deliv: "15.000 L", inv: "25.000 L", done: "25.000 L", sPct: "0.0%", sVal: "0 / 0 L", nsPct: "108.9%", nsVal: "21.567 / 19.800 L" },
    "CPA 03": { po: "95.500 L", deliv: "45.000 L", inv: "45.500 L", done: "5.000 L", sPct: "0.0%", sVal: "0 / 0 L", nsPct: "92.5%", nsVal: "52.041 / 56.250 L" },
    "CPA 04": { po: "209.060 L", deliv: "70.467 L", inv: "58.917 L", done: "23.481 L", sPct: "65.0%", sVal: "58.520 / 90.000 L", nsPct: "0.0%", nsVal: "0 / 0 L" }
};

function filterSalesDashboard() {
    const role = document.getElementById('roleSwitcher').value;
    let selectedBP = document.getElementById('bpFilterSales').value;
    
    if(role === 'DSR') { 
        selectedBP = 'CPA 01'; 
        document.getElementById('bpFilterSales').value = 'CPA 01'; 
        document.getElementById('bpFilterSales').disabled = true; 
    } else { 
        document.getElementById('bpFilterSales').disabled = false; 
    }

    const data = kpiDataSales[selectedBP];
    document.getElementById('kpi-po').innerText = data.po; 
    document.getElementById('kpi-deliv').innerText = data.deliv;
    document.getElementById('kpi-inv').innerText = data.inv; 
    document.getElementById('kpi-done').innerText = data.done;
    document.getElementById('kpi-smelter-pct').innerText = data.sPct; 
    document.getElementById('kpi-smelter-val').innerText = data.sVal;
    document.getElementById('kpi-ns-pct').innerText = data.nsPct; 
    document.getElementById('kpi-ns-val').innerText = data.nsVal;

    document.querySelectorAll('.sales-row').forEach(row => {
        if (selectedBP === "ALL" || row.getAttribute('data-bp') === selectedBP) { 
            row.classList.remove('hidden-row'); 
        } else { 
            row.classList.add('hidden-row'); 
        }
    });
}

function trackOrder() {
    const searchVal = document.getElementById('orderSearch').value.toLowerCase();
    const n3 = document.getElementById('node-3'), l3 = document.getElementById('line-3'), n4 = document.getElementById('node-4');
    const sub3 = document.getElementById('subtext-node-3'), sub4 = document.getElementById('subtext-node-4');
    const badge = document.getElementById('alertBadge');

    if (searchVal.includes('12.174')) {
        n3.className = "w-10 h-10 rounded-full bg-emerald-100 text-emerald-500 border border-emerald-200 flex items-center justify-center shadow-sm transition-all duration-300";
        l3.className = "w-1/4 bg-emerald-300 transition-colors duration-300"; sub3.classList.add('hidden');
        n4.className = "w-12 h-12 -mt-1 rounded-full bg-orange-50 text-orange-500 border-2 border-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)] bg-white relative z-20 transition-all duration-300 animate-pulse";
        sub4.classList.remove('hidden');
        badge.className = "bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 border border-orange-200 transition-colors";
        badge.innerHTML = `<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span><span id="alertText">Tracking PO: OS Invoice</span>`;
    } else if (searchVal.includes('pohf')) {
        n3.className = "w-12 h-12 -mt-1 rounded-full bg-red-50 text-red-600 border-2 border-red-400 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-white relative z-20 transition-all duration-300 animate-pulse";
        sub3.classList.remove('hidden'); sub3.innerText = "Pesanan Logistik"; l3.className = "w-1/4 bg-slate-200 transition-colors duration-300";
        n4.className = "w-10 h-10 rounded-full bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center shadow-sm transition-all duration-300"; sub4.classList.add('hidden');
        badge.className = "bg-blue-50 text-brand-blue text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 border border-blue-200 transition-colors";
        badge.innerHTML = `<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span></span><span id="alertText">Tracking PO: OS Delivery</span>`;
    } else {
        n3.className = "w-12 h-12 -mt-1 rounded-full bg-red-50 text-red-600 border-2 border-red-400 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-white relative z-20 transition-all duration-300 animate-pulse";
        sub3.classList.remove('hidden'); sub3.innerText = "5 Order > 3 Hari"; l3.className = "w-1/4 bg-slate-200 transition-colors duration-300";
        n4.className = "w-10 h-10 rounded-full bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center shadow-sm transition-all duration-300"; sub4.classList.add('hidden');
        badge.className = "bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 border border-red-100 transition-colors";
        badge.innerHTML = `<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span><span id="alertText">Live Bottleneck Alert</span>`;
    }
}