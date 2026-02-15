// --- ELEMENTS ---
const nameInput = document.getElementById('nameInput');
const bioInput = document.getElementById('bioInput');
const imageInput = document.getElementById('imageInput');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const infoBtn = document.getElementById('infoBtn');
const statusBar = document.getElementById('statusBar');
const mainAppWindow = document.getElementById('mainAppWindow');
const cardOutputArea = document.getElementById('cardOutputArea');
const errorModal = document.getElementById('customErrorModal');
const modalMessage = document.getElementById('modalMessage');
const infoModal = document.getElementById('infoModal');

// --- INPUT LISTENERS ---
const inputs = [nameInput, bioInput, imageInput];
inputs.forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('input-error');
        const allFilled = inputs.every(i => i.value.trim() !== '');
        
        if(allFilled) {
            statusBar.innerText = "Status: Ready to Generate.";
            statusBar.style.color = "green";
        } else {
            statusBar.innerText = "Status: Waiting for input...";
            statusBar.style.color = "black";
        }
    });
});

// --- HELPER: URL CHECK ---
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
        return false;
    }
}

// --- MAIN: GENERATE CARD ---
generateBtn.addEventListener('click', () => {
    let emptyFields = [];
    if(!nameInput.value.trim()) emptyFields.push(nameInput);
    if(!bioInput.value.trim()) emptyFields.push(bioInput);
    if(!imageInput.value.trim()) emptyFields.push(imageInput);

    if(emptyFields.length > 0) {
        emptyFields.forEach(field => field.classList.add('input-error'));
        triggerError("DATA_MISSING: Please fill in all required fields.");
        return;
    }

    if(!isValidUrl(imageInput.value)) {
        imageInput.classList.add('input-error');
        triggerError("INVALID_PROTOCOL: Image Source must start with http:// or https://");
        return;
    }

    generateCard();
});

// --- ERROR HANDLING ---
function triggerError(msg) {
    modalMessage.innerText = msg;
    errorModal.classList.remove('hidden');
    
    mainAppWindow.classList.remove('shake-active');
    void mainAppWindow.offsetWidth; 
    mainAppWindow.classList.add('shake-active');

    statusBar.innerText = "Status: CRITICAL ERROR ENCOUNTERED.";
    statusBar.style.color = "red";
}

function closeErrorModal() {
    errorModal.classList.add('hidden');
    statusBar.innerText = "Status: Error acknowledged.";
    statusBar.style.color = "black";
}

// --- INFO MODAL HANDLING ---
infoBtn.addEventListener('click', () => { infoModal.classList.remove('hidden'); });
function closeInfoModal() { infoModal.classList.add('hidden'); }

// --- GENERATION LOGIC ---
function generateCard() {
    const nameVal = nameInput.value;
    const bioVal = bioInput.value;
    const imgVal = imageInput.value;

    statusBar.innerText = "Status: Generating Entity...";
    statusBar.style.color = "blue";

    cardOutputArea.innerHTML = `
        <div class="id-card" id="finalIdCard">
            <div class="id-header">OFFICIAL ID</div>
            <img src="${imgVal}" class="id-photo" crossorigin="anonymous" alt="ID_IMG" onerror="this.src='https://via.placeholder.com/150?text=IMG+ERROR'">
            <div class="id-name">${nameVal}</div>
            <div class="id-bio">${bioVal}</div>
            <div id="qrcode-container"></div>
            <small style="margin-top:5px; font-size:10px;">VERIFIED PERSONNEL</small>
        </div>
    `;
    cardOutputArea.classList.remove('empty-state');

    document.getElementById("qrcode-container").innerHTML = "";
    new QRCode(document.getElementById("qrcode-container"), {
        text: nameVal,
        width: 64, height: 64
    });

    saveBtn.classList.remove('hidden');
    statusBar.innerText = "Status: Process Complete.";
}

// --- SAVE TO DISK ---
saveBtn.addEventListener('click', function() {
    const cardElement = document.getElementById('finalIdCard');
    statusBar.innerText = "Status: Encoding to PNG...";
    
    html2canvas(cardElement, { useCORS: true, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${nameInput.value}_ID.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        statusBar.innerText = "Status: File saved successfully.";
    });
});