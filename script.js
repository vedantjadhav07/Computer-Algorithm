let jobs = [];
let snapshots = [];
let curStep = 0;
let timer = null;

const visual = document.getElementById('visual');
const slotsArea = document.getElementById('slotsArea');
const curOp = document.getElementById('curOp');
const totalProfitEl = document.getElementById('totalProfit');
const logEl = document.getElementById('log');
const statusEl = document.getElementById('status');

const jobSet = document.getElementById('jobSet');
const generateBtn = document.getElementById('generateBtn');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stepFwdBtn = document.getElementById('stepFwdBtn');
const stepBackBtn = document.getElementById('stepBackBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSel = document.getElementById('speed');

// NEW MANUAL JOB INPUT ELEMENTS
const manualJobInput = document.getElementById('manualJobInput');
const loadManualBtn = document.getElementById('loadManualBtn');

playBtn.addEventListener('click', play);
pauseBtn.addEventListener('click', pause);
stepFwdBtn.addEventListener('click', () => showStep(curStep + 1));
stepBackBtn.addEventListener('click', () => showStep(curStep - 1));
resetBtn.addEventListener('click', () => showStep(0));
generateBtn.addEventListener('click', () => { generateAndRecord(false); }); 
loadManualBtn.addEventListener('click', loadJobsFromInput);     

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

function recordSnapshot(jobsArr, slotsArr, desc, highlights = {}, totalProfit = 0) {
    snapshots.push({
        jobs: deepCopy(jobsArr),
        slots: slotsArr ? slotsArr.slice() : null,
        desc,
        highlights: deepCopy(highlights),
        totalProfit
    });
    logEl.value += (snapshots.length - 1) + ": " + desc + "\n";
}

// NEW FUNCTION: Parses manual input
function loadJobsFromInput() {
    const input = manualJobInput.value.trim();
    if (!input) { 
        // Do nothing instead of alert
        return; 
    }

    const newJobs = [];
    const lines = input.split('\n');

    for (const line of lines) {
        const parts = line.trim().split(/[\s,]+/);
        if (parts.length < 3) continue;

        const id = parseInt(parts[0]);
        const d = parseInt(parts[1]);
        const p = parseInt(parts[2]);

        if (id > 0 && d > 0 && p > 0) {
            newJobs.push({ id: id, deadline: d, profit: p });
        }
    }

    if (newJobs.length > 0) {
        jobs = newJobs;
        generateAndRecord(true); 
    } else {
        // Do nothing silently
        return;
    }
}


// MODIFIED: Accepts 'isManual' flag
function generateAndRecord(isManual = false) {
    snapshots = []; logEl.value = ''; curStep = 0;

    if (!isManual) { 
        const mode = jobSet.value;
        if (mode === 'preset1') {
            jobs = [
                { id: 1, deadline: 2, profit: 100 },
                { id: 2, deadline: 1, profit: 19 },
                { id: 3, deadline: 2, profit: 27 },
                { id: 4, deadline: 1, profit: 25 },
                { id: 5, deadline: 3, profit: 15 }
            ];
        } else if (mode === 'preset2') {
            jobs = [
                { id: 1, deadline: 2, profit: 60 },
                { id: 2, deadline: 1, profit: 100 },
                { id: 3, deadline: 3, profit: 20 },
                { id: 4, deadline: 2, profit: 40 },
                { id: 5, deadline: 1, profit: 20 },
                { id: 6, deadline: 3, profit: 50 }
            ];
        } else { 
            const n = 6 + Math.floor(Math.random() * 4);
            jobs = [];
            for (let i = 1; i <= n; i++) {
                jobs.push({ id: i, deadline: 1 + Math.floor(Math.random() * 4), profit: 10 + Math.floor(Math.random() * 90) });
            }
        }
    }

    if (jobs.length === 0) {
        statusEl.textContent = `Status: No jobs loaded.`;
        return;
    }

    recordSnapshot(jobs, null, 'Start (unsorted jobs)', {}, 0);

    let arr = deepCopy(jobs);
    arr.sort((a, b) => b.profit - a.profit); 
    recordSnapshot(arr, null, 'Sort: completed (jobs sorted by profit desc)', {}, 0);
    jobs = deepCopy(arr);

    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    let slots = new Array(maxDeadline + 1).fill(-1);
    let totalProfit = 0;
    recordSnapshot(jobs, slots, `Schedule: start (maxDeadline=${maxDeadline})`, {}, totalProfit);

    for (let i = 0; i < jobs.length; i++) {
        const j = jobs[i];
        recordSnapshot(jobs, slots, `Schedule: selecting J${j.id} [P=${j.profit}, D=${j.deadline}]`, { selected: i }, totalProfit);
        let placed = false;
        for (let d = Math.min(j.deadline, maxDeadline); d > 0; d--) {
            recordSnapshot(jobs, slots, `Schedule: check slot ${d} for J${j.id}`, { selected: i, compareSlot: d }, totalProfit);
            if (slots[d] === -1) { 
                slots[d] = j.id;
                totalProfit += j.profit;
                placed = true;
                recordSnapshot(jobs, slots, `Schedule: placed J${j.id} in slot ${d}`, { selected: i, scheduledSlot: d }, totalProfit);
                break; 
            }
        }
        if (!placed) {
            recordSnapshot(jobs, slots, `Schedule: no slot available for J${j.id} -> skipped`, { selected: i }, totalProfit);
        }
    }

    recordSnapshot(jobs, slots, 'Schedule: done', {}, totalProfit);
    showStep(0);
    statusEl.textContent = `Generated ${jobs.length} jobs; snapshots recorded: ${snapshots.length}`;
}

/* Rendering */
function showStep(index) {
    if (index < 0) index = 0;
    if (index >= snapshots.length) index = snapshots.length - 1;
    curStep = index;
    const snap = snapshots[curStep];
    visual.innerHTML = '';
    const jobsNow = snap.jobs;
    const highlights = snap.highlights || {};
    const scheduledIndices = [];
    if (snap.slots) {
        snap.slots.forEach(val => {
            if (val !== -1) {
                const idx = jobsNow.findIndex(j => j.id === val);
                if (idx !== -1 && !scheduledIndices.includes(idx)) scheduledIndices.push(idx);
            }
        });
    }
    jobsNow.forEach((job, idx) => {
        const d = document.createElement('div');
        d.className = 'job' + ((job.profit < 18) ? ' small' : '');
        if (highlights.compare && Array.isArray(highlights.compare) && highlights.compare.includes(idx)) d.classList.add('compare');
        if (highlights.swap && Array.isArray(highlights.swap) && highlights.swap.includes(idx)) d.classList.add('swap');
        if (typeof highlights.selected === 'number' && highlights.selected === idx) d.classList.add('selected');
        if (scheduledIndices.includes(idx)) d.classList.add('scheduled');
        d.innerHTML = `J${job.id}<br>D:${job.deadline}<br>P:${job.profit}`;
        visual.appendChild(d);
    });

    slotsArea.innerHTML = '';
    if (snap.slots) {
        for (let s = 1; s < snap.slots.length; s++) {
            const container = document.createElement('div');
            container.className = 'slotContainer';
            const label = document.createElement('div');
            label.className = 'slotLabel';
            const box = document.createElement('div');
            box.className = 'slotBox';
            const val = snap.slots[s];
            if (val === -1) { label.textContent = ''; box.textContent = `Slot ${s}`; }
            else { label.textContent = `J${val}`; box.textContent = `Slot ${s}`; }
            if (highlights.scheduledSlot && highlights.scheduledSlot === s) { box.style.boxShadow = '0 0 10px 3px rgba(239,68,68,0.4)'; }
            else box.style.boxShadow = 'none';
            container.appendChild(label); container.appendChild(box);
            slotsArea.appendChild(container);
        }
    }

    curOp.textContent = snap.desc || '—';
    totalProfitEl.textContent = snap.totalProfit || 0;
    statusEl.textContent = `Step ${curStep} / ${snapshots.length - 1}`;

    logEl.scrollTop = logEl.scrollHeight;
}

/* Playback */
function play() {
    if (snapshots.length === 0) return;
    playBtn.disabled = true; pauseBtn.disabled = false;
    stepFwdBtn.disabled = true; stepBackBtn.disabled = true;
    const delay = parseInt(speedSel.value, 10) || 350;
    timer = setInterval(() => {
        if (curStep < snapshots.length - 1) showStep(curStep + 1);
        else pause();
    }, delay);
}
function pause() {
    playBtn.disabled = false; pauseBtn.disabled = true;
    stepFwdBtn.disabled = false; stepBackBtn.disabled = false;
    if (timer) { clearInterval(timer); timer = null; }
}

const clearManualBtn = document.getElementById('clearManualBtn');

clearManualBtn.addEventListener('click', () => {
    manualJobInput.value = '';  // Clear the textarea
    jobs = [];                  // Clear current jobs array
    snapshots = [];             // Clear snapshots
    curStep = 0;
    visual.innerHTML = '';      // Clear visual area
    slotsArea.innerHTML = '';   // Clear slots
    logEl.value = '';           // Clear log
    curOp.textContent = '—';
    totalProfitEl.textContent = '0';
    statusEl.textContent = 'Manual jobs cleared';
});

/* init */
(function init() {
    loadJobsFromInput();
})();
