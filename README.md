# Kaashvi Healthcare — Invoice & Billing System

A modern, fullstack React application built for **Kaashvi Healthcare (Nursing Home & Home Healthcare)**. This application provides a client-ready invoice generator, patient directory management, equipment rental tariffs, and print-optimized A4 bills with Indian currency conversion.

---

## 🌟 Key Features

- **Pixel-Perfect Invoice Generator**:
  - Auto-generated sequential invoice numbers (`KH/YYYY/0001`).
  - Patient details auto-fill and lookup.
  - Care details (Attending Doctor, Admission & Discharge Dates, Room/Bed No.).
  - Dynamic line items with service selection (Nursing care, Equipment rentals, Doctor fees, etc.), quantity, rate, discount %, GST %, and calculated totals.
  - Tax Modes: Intra-State (CGST 50% + SGST 50%), Inter-State (IGST 100%), and No GST.
  - Indian Number-to-Words currency conversion (e.g., *"Fifteen Thousand Four Hundred and Fifty Rupees Only"*).
  - Additional flat discounts, round-off calculation, and payment mode selection.

- **Print & Export Ready**:
  - High-resolution A4 printable invoice sheet matching Kaashvi Healthcare branding.
  - One-click PDF / browser printing (`window.print()`).
  - Standalone HTML invoice download feature.

- **Patient & Services Master**:
  - Patient database directory with instant invoice creation triggers.
  - Master catalog for managing preset service tariffs and default GST rates.

- **Fullstack Data Persistence**:
  - Local JSON database storage (`data/db.json`) for zero-config offline deployment.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System
- **Fonts**: Manrope, Inter, IBM Plex Mono

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📦 How to Push & Deploy to GitHub

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Kaashvi Healthcare Fullstack Billing System"
```

### 2. Connect & Push to Your GitHub Repository
Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual repository details:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Deploy to Vercel (Recommended)
1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com).
3. Click **"New Project"**, select your GitHub repository, and click **"Deploy"**.

---

## 🏢 Contact & Company Info

**Kaashvi Healthcare — Nursing Home & Home Healthcare**  
#3, 7th Cross, Opp. BOB, Malleshwaram, Bangalore – 560 003  
Phone: +91 73536 65982 | +91 63636 65982 | +91 82966 55457  
Email: info@kaashvihealthcare.com  
Website: [www.kaashvihealthcare.com](http://www.kaashvihealthcare.com)
