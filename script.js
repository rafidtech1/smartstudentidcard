// Global Variables
let isFormComplete = false;

window.onload = function() {
    loadSavedData(); 
    checkTheme();
    updateCard();
    setupEventListeners();
    setup3DTilt();
    checkCompletion(); // Check initially
};

// --- 1. Auto Save & Load ---
function loadSavedData() {
    const fields = ['inName', 'inID', 'inSession', 'inLevel', 'inBatch', 'inGroup'];
    fields.forEach(id => {
        const saved = localStorage.getItem(id);
        if (saved) document.getElementById(id).value = saved;
    });
}

function saveData() {
    const fields = ['inName', 'inID', 'inSession', 'inLevel', 'inBatch', 'inGroup'];
    fields.forEach(id => {
        localStorage.setItem(id, document.getElementById(id).value);
    });
    checkCompletion(); // Check every time data saves
}

// --- 2. Update Card Logic (No QR) ---
function updateCard() {
    const name = document.getElementById('inName').value;
    const id = document.getElementById('inID').value;
    const session = document.getElementById('inSession').value;
    const level = document.getElementById('inLevel').value;
    const batch = document.getElementById('inBatch').value;
    const group = document.getElementById('inGroup').value;

    document.getElementById('outName').innerText = name ? name : "Student Name";
    document.getElementById('outID').innerText = id ? id : "123456";
    document.getElementById('outSession').innerText = session ? session : "2024-2025";
    document.getElementById('outLevel').innerText = level;
    document.getElementById('outBatch').innerText = batch ? batch : "29";
    document.getElementById('outGroup').innerText = group;

    saveData();
}

// --- 3. Validations ---
function validateName(input, errorId) {
    const regex = /[0-9]/g; // Check for numbers
    if (regex.test(input.value)) {
        document.getElementById(errorId).style.display = 'block';
        input.value = input.value.replace(regex, ''); // Remove numbers instantly
    } else {
        document.getElementById(errorId).style.display = 'none';
    }
    updateCard();
}

function validateNumber(input, errorId) {
    const regex = /[^0-9]/g; 
    if (regex.test(input.value)) {
        document.getElementById(errorId).style.display = 'block';
        input.value = input.value.replace(regex, '');
    } else {
        document.getElementById(errorId).style.display = 'none';
    }
    updateCard();
}

function validateSession(input, errorId) {
    const regex = /[^0-9-]/g; 
    if (regex.test(input.value)) {
        document.getElementById(errorId).style.display = 'block';
        input.value = input.value.replace(regex, '');
    } else {
        document.getElementById(errorId).style.display = 'none';
    }
    updateCard();
}

// --- 4. Button Animation Logic ---
function checkCompletion() {
    const requiredIds = ['inName', 'inID', 'inSession', 'inBatch'];
    let allFilled = true;
    
    requiredIds.forEach(id => {
        if(document.getElementById(id).value.trim() === "") allFilled = false;
    });

    const btnJpg = document.getElementById('btnJpg');
    const btnPdf = document.getElementById('btnPdf');

    if (allFilled) {
        btnJpg.classList.add('btn-ready');
        btnPdf.classList.add('btn-ready');
    } else {
        btnJpg.classList.remove('btn-ready');
        btnPdf.classList.remove('btn-ready');
    }
}

function showSuccessFeedback() {
    const toast = document.getElementById('toast');
    toast.classList.remove('hidden');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// --- 5. Reset Form ---
function resetForm() {
    if(confirm("Are you sure you want to clear all data?")) {
        document.getElementById('inName').value = "";
        document.getElementById('inID').value = "";
        document.getElementById('inSession').value = "";
        document.getElementById('inBatch').value = "";
        document.getElementById('inPhoto').value = "";
        document.getElementById('previewPhoto').src = "https://via.placeholder.com/150";
        localStorage.clear();
        updateCard();
        
        // Remove button animation
        document.getElementById('btnJpg').classList.remove('btn-ready');
        document.getElementById('btnPdf').classList.remove('btn-ready');
    }
}

// --- 6. Download Functions ---
function downloadCardImage() {
    showSuccessFeedback(); // Trigger animation
    document.getElementById('cardCapture').style.transform = "none";
    
    html2canvas(document.getElementById("cardCapture"), { scale: 3, useCORS: true, backgroundColor: "#ffffff" })
    .then(canvas => {
        const link = document.createElement("a");
        link.download = `ID_${document.getElementById('inID').value || 'Card'}.png`; 
        link.href = canvas.toDataURL("image/png"); 
        link.click(); 
    });
}

function downloadCardPDF() {
    showSuccessFeedback(); // Trigger animation
    document.getElementById('cardCapture').style.transform = "none";

    html2canvas(document.getElementById("cardCapture"), { scale: 3, useCORS: true, backgroundColor: "#ffffff" })
    .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const cardWidth = 55; const cardHeight = 88;
        pdf.addImage(imgData, 'PNG', (210 - cardWidth) / 2, (297 - cardHeight) / 2, cardWidth, cardHeight);
        pdf.save(`ID_${document.getElementById('inID').value || 'Card'}.pdf`);
    });
}

// --- 7. Helpers & Effects ---
function loadPhoto(event) {
    const image = document.getElementById('previewPhoto');
    if(event.target.files[0]){
        image.src = URL.createObjectURL(event.target.files[0]);
    }
}

function setupEventListeners() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) nextInput.focus();
            }
        });
    });
}

function setup3DTilt() {
    const card = document.getElementById('cardCapture');
    const container = document.getElementById('tiltContainer');
    const glare = document.querySelector('.glare');

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / 20) * -1;
        const rotateY = (x - centerX) / 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        glare.style.opacity = 0.5;
        glare.style.transform = `translate(${x - centerX}px, ${y - centerY}px)`;
    });

    container.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
        glare.style.opacity = 0;
    });

    window.addEventListener("deviceorientation", (e) => {
        if(window.innerWidth < 768) {
            const tiltX = (e.beta / 4);
            const tiltY = (e.gamma / 4);
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        }
    }, true);
}

function checkTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('#themeToggle i').classList.replace('fa-moon', 'fa-sun');
    }
}

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#themeToggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});