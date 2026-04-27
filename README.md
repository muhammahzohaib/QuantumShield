# 🛡️ QuantumShield: Next-Gen Privacy-First SaaS

![QuantumShield Banner](https://img.shields.io/badge/Security-Quantum--Safe-0ea5e9?style=for-the-badge&logo=shield)
![Platform](https://img.shields.io/badge/Platform-Google%20Cloud%20%26%20Firebase-white?style=for-the-badge&logo=google-cloud)
![License](https://img.shields.io/badge/Competition-Google%20AI%202025-8b5cf6?style=for-the-badge)

**QuantumShield** is a comprehensive, production-grade security platform built for the **Google AI Competition 2025**. It provides military-grade data protection through three synchronized security engines, hosted on Google Cloud and Firebase.

---

## 🚀 Key Security Engines

### 1. 🔐 Quantum Encryption Layer (Engine 1)
Protect sensitive assets against both classical and future quantum threats.
- **Algorithm**: Implementation of NIST-selected **CRYSTALS-Kyber-768**.
- **Features**: 256-bit XOR encryption cycles, SHA-256 integrity checksums, and secure key derivation.

### 2. 🔒 Differential Privacy Injector (Engine 2)
Sanitize datasets for AI training and analytics without compromising individual privacy.
- **Algorithm**: Automated **Laplacian Noise Injection**.
- **Features**: Adjustable $\epsilon$ (epsilon) privacy budgets, CSV batch processing, and privacy-loss scoring.

### 🛡️ Anti-AI Scraping Shield (Engine 3)
Make your data toxic to unauthorized AI crawlers while remaining perfectly readable to humans.
- **Techniques**: Adversarial text perturbations, Zero-Width Space (ZWSP) token injection, and Base64-obfuscated rendering.
- **Security**: Built-in **SSRF Protection** to prevent unauthorized internal network scraping.

---

## 🛠️ Technology Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion (Animations), Recharts (Analytics), TailwindCSS |
| **Backend** | Node.js, Express.js, Firebase Admin SDK |
| **Database** | Google Cloud Firestore (Real-time NoSQL) |
| **Auth** | Firebase Auth (Google Sign-In, Phone OTP, Email Magic Links) |
| **Security** | Helmet.js, Express-Rate-Limit, XSS-Clean, HPP (Hardened for OWASP Top 10) |
| **Testing** | Jest, Supertest, Vitest, Custom Autofix QA Suite |

---

## 🏗️ Architecture & Security Hardening

QuantumShield follows the **Defense-in-Depth** principle:

- **OWASP Top 10 Compliance**: Strictly hardened against Injection (A03), Broken Access Control (A01), and SSRF (A10).
- **Role-Based Access Control (RBAC)**: Tiered access system (`Free`, `Pro`, `Enterprise`) verified server-side via Firestore metadata.
- **Responsive Design**: 100% mobile-ready with a custom drawer system, fluid typography, and a specialized Bottom Navigation for handheld devices.
- **QA Automation**: Includes a specialized `runAndFix.js` script that performs real-time security audits and automatically patches common environment failures.

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase Project & Service Account Key
- Google Cloud Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quantumshield.git
   cd quantumshield
   ```

2. **Install Dependencies** (Root, Client, and Server)
   ```bash
   npm run install:all
   ```

3. **Environment Configuration**
   Create `.env` files in both `/frontend` and `/backend` directories based on the provided placeholders.

4. **Run Locally**
   ```bash
   npm run dev
   ```

---

## 🧪 Testing

QuantumShield features a robust testing environment to ensure security compliance:

- **Server Integration Tests**:
  ```bash
  cd backend && npm run test:server
  ```
- **Automated QA Diagnostic (Autofix)**:
  ```bash
  cd backend && npm run test:autofix
  ```

---

## 📝 Project Structure

```text
├── frontend/             # React + Vite application
│   ├── src/components/   # Atoms, Molecules, and Layouts
│   ├── src/context/      # Auth & Global state management
│   └── src/pages/        # Security Engine UI & Dashboard
├── backend/              # Node.js + Express API
│   ├── routes/           # Security Engine logic
│   ├── middleware/       # Firebase Auth & RBAC guards
│   └── tests/            # Integration & Diagnostic suites
└── root/                 # Orchestration scripts
```

---

## 👨‍💻 Developer
Developed by **Muhammad Zohaib** for the **AISehako Competition**.

---
*Disclaimer: This project is a security simulation and technical demonstration built for the Google AI 2026 competition.*
