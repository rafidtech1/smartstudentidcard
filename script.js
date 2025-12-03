// QR কোড ভেরিয়েবল
let qrcodeObj = null;

// পেজ লোড হলে একবার ডিফল্ট QR তৈরি হবে
window.onload = function() {
    updateCard(); // ডিফল্ট ডেটা দিয়ে কার্ড এবং QR সেট হবে
};

// টেক্সট আপডেট ফাংশন
function updateCard() {
    const name = document.getElementById('inName').value;
    const id = document.getElementById('inID').value;
    const session = document.getElementById('inSession').value;
    const level = document.getElementById('inLevel').value;
    const batch = document.getElementById('inBatch').value;
    const group = document.getElementById('inGroup').value;

    // টেক্সট আপডেট
    document.getElementById('outName').innerText = name ? name : "Student Name";
    document.getElementById('outID').innerText = id ? id : "123456";
    document.getElementById('outSession').innerText = session ? session : "2024-2025";
    document.getElementById('outLevel').innerText = level;
    document.getElementById('outBatch').innerText = batch ? batch : "29";
    document.getElementById('outGroup').innerText = group;

    // QR কোড জেনারেট আপডেট
    generateQR(name, id, session, group);
}

// QR কোড তৈরির ফাংশন
function generateQR(name, id, session, group) {
    const qrContainer = document.getElementById("qrcode");
    
    // আগের QR মুছে ফেলা (না হলে একটার পর একটা তৈরি হতে থাকবে)
    qrContainer.innerHTML = ""; 

    // QR এ কি তথ্য থাকবে
    const qrText = `Name: ${name || "Student"}\nID: ${id || "123456"}\nSession: ${session}\nGroup: ${group}`;

    // নতুন QR তৈরি
    new QRCode(qrContainer, {
        text: qrText,
        width: 50,  // সাইজ CSS এর সাথে মিল রাখা হয়েছে
        height: 50,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

// ভ্যালিডেশন ফাংশন (আগের মতোই)
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

// ছবি আপলোড ফাংশন
function loadPhoto(event) {
    const image = document.getElementById('previewPhoto');
    if(event.target.files[0]){
        image.src = URL.createObjectURL(event.target.files[0]);
    }
}

// কার্ড ডাউনলোড ফাংশন
function downloadCardImage() {
    const cardElement = document.getElementById("cardCapture");
    
    html2canvas(cardElement, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff" 
    }).then(canvas => {
        const link = document.createElement("a");
        link.document = document;
        link.download = "Student_ID_Card.png"; 
        link.href = canvas.toDataURL("image/png"); 
        link.click(); 
    });
}