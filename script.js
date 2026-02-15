// --- ELEMENTS ---
const nameInput = document.getElementById('nameInput');
const bioInput = document.getElementById('bioInput');
const imageInput = document.getElementById('imageInput'); // For URL
const fileInput = document.getElementById('fileInput');   // For File
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const infoBtn = document.getElementById('infoBtn');
const statusBar = document.getElementById('statusBar');
const mainAppWindow = document.getElementById('mainAppWindow');
const cardOutputArea = document.getElementById('cardOutputArea');
const errorModal = document.getElementById('customErrorModal');
const modalMessage = document.getElementById('modalMessage');
const infoModal = document.getElementById('infoModal');

// Variables to track image source mode
let useFileUpload = true;
let uploadedImageData = ""; // Stores base64 string of uploaded image

// --- INPUT LISTENERS ---
const inputs = [nameInput, bioInput]; // URL input handled separately based on mode
inputs.forEach(input => {
    input.addEventListener('input', updateStatus);
});

function updateStatus() {
    // Check main inputs
    let allFilled = nameInput.value.trim() !== '' && bioInput.value.trim() !== '';
    
    // Check Image Requirement
    if (useFileUpload) {
        if (!fileInput.files || fileInput.files.length === 0) allFilled = false;
    } else {
        if (imageInput.value.trim() === '') allFilled = false;
    }

    if(allFilled) {
        statusBar.innerText = "Status: Ready to Generate.";
        statusBar.style.color = "green";
    } else {
        statusBar.innerText = "Status: Waiting for input...";
        statusBar.style.color = "black";
    }
}

// --- TOGGLE SOURCE FUNCTION ---
window.toggleSource = function() {
    const radios = document.getElementsByName('imgSource');
    const uploadContainer = document.getElementById('uploadContainer');
    const urlContainer = document.getElementById('urlContainer');
    
    // Determine which radio is checked
    for(let radio of radios) {
        if(radio.checked) {
            if(radio.value === 'upload') {
                useFileUpload = true;
                uploadContainer.classList.remove('hidden');
                urlContainer.classList.add('hidden');
            } else {
                useFileUpload = false;
                uploadContainer.classList.add('hidden');
                urlContainer.classList.remove('hidden');
            }
        }
    }
    updateStatus();
}

// --- FILE READER LISTENER ---
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageData = e.target.result; // Save base64
            updateStatus();
        }
        reader.readAsDataURL(file);
    }
});
imageInput.addEventListener('input', updateStatus);


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
    
    // Image Validation
    let finalImageSrc = "";

    if (useFileUpload) {
        if (!fileInput.files || fileInput.files.length === 0) {
            triggerError("DATA_MISSING: Please upload an image file.");
            return;
        }
        finalImageSrc = uploadedImageData;
    } else {
        if(!imageInput.value.trim()) {
            emptyFields.push(imageInput);
        } else if(!isValidUrl(imageInput.value)) {
            imageInput.classList.add('input-error');
            triggerError("INVALID_PROTOCOL: Image Source must start with http:// or https://");
            return;
        }
        finalImageSrc = imageInput.value;
    }

    if(emptyFields.length > 0) {
        emptyFields.forEach(field => field.classList.add('input-error'));
        triggerError("DATA_MISSING: Please fill in all required fields.");
        return;
    }

    generateCard(finalImageSrc);
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

window.closeErrorModal = function() {
    errorModal.classList.add('hidden');
    statusBar.innerText = "Status: Error acknowledged.";
    statusBar.style.color = "black";
}

// --- INFO MODAL HANDLING ---
infoBtn.addEventListener('click', () => { infoModal.classList.remove('hidden'); });
window.closeInfoModal = function() { infoModal.classList.add('hidden'); }

// --- GENERATION LOGIC ---
function generateCard(imgSrc) {
    const nameVal = nameInput.value;
    const bioVal = bioInput.value;

    statusBar.innerText = "Status: Generating Entity...";
    statusBar.style.color = "blue";

    cardOutputArea.innerHTML = `
        <div class="id-card" id="finalIdCard">
            <div class="id-header">OFFICIAL ID</div>
            <img src="${imgSrc}" class="id-photo" crossorigin="anonymous" alt="ID_IMG" onerror="this.src='https://via.placeholder.com/150?text=IMG+ERROR'">
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