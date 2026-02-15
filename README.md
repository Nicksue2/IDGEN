# 💾 User_Profile_Creator_v3.6 (ID Generator)

![Project Banner](https://img.shields.io/badge/Status-Deployed-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Style-Windows_95_Retro-blue?style=for-the-badge)

A web-based application that generates official personnel ID cards with a retro **Windows 95/Brutalist aesthetic**. It features real-time QR code generation, image handling (Upload/URL), and downloadable ID cards.

> **Course:** IT292 - App Development (Laboratory Activity 2)  
> **Developer:** Nickolai Anquillano (BSIT 2-3)

---

##  Live Demo
### [👉 Click here to open Application](https://idqrbynicksue.vercel.app/)

---

## ✨ Key Features

* **💾 Retro UI/UX:** Styled to look like a legacy Windows application using raw CSS (Courier Prime font, inset borders, classic color palette).
* **📱 Fully Responsive:** Adaptive layout that switches from desktop window view to mobile-friendly column view.
* **🖼️ Image Handling:** * **File Upload:** Support for local image uploads (Blob/Base64).
    * **URL Support:** Option to use external image links.
* **⚡ Real-Time Validation:** Error handling for empty fields and invalid URLs with custom "System Error" modals.
* **🧩 QR Code Generation:** Automatically generates a scannable QR code containing the user's name using `qrcode.js`.
* **📥 Export to PNG:** Uses `html2canvas` to render the DOM element and download the ID card as a high-quality image.

---

## 🛠️ Tech Stack

* **Core:** HTML5, CSS3, Vanilla JavaScript (ES6)
* **Libraries:**
    * [`qrcode.js`](https://davidshimjs.github.io/qrcodejs/) - For generating QR codes.
    * [`html2canvas`](https://html2canvas.hertzen.com/) - For screenshotting the ID card DOM.
* **Deployment:** Vercel (CI/CD connected to GitHub).

---


## 🚀 How to Run Locally

If you want to run this on your machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Nicksue2/IDGEN.git](https://github.com/Nicksue2/IDGEN.git)
    ```
2.  **Navigate to the project folder**
    ```bash
    cd IDGEN
    ```
3.  **Open `index.html`**
    Simply double-click `index.html` or open it with Live Server in VS Code.

---

## 👨‍💻 Author

**Nickolai Anquillano**

* Instagram: [@zincsuedesu](https://instagram.com/zincsuedesu)
* GitHub: [@Nicksue2](https://github.com/Nicksue2)
* TikTok: [@nixszue](https://www.tiktok.com/@nixszue)

---

*Built with ❤️ and a lot of `console.log` errors.*
