# LAGOS STATE CIVIL SERVICE COMMISSION (LSCSC)
## Year 2027 Promotion Exercise - Computer-Based Testing (CBT) Platform

**LAGOS-CBT** is an enterprise-grade Computer-Based Testing (CBT) and merit evaluation platform specifically tailored for the **Lagos State Civil Service Commission (LSCSC)** to conduct promotion examinations for Lagos State Civil Servants across Grade Levels GL 06 through GL 16.

---

## 🏛️ Core Circular Integration & Key Features

### 1. Year 2027 Promotion Exercise Circular Grade Groups (100 Questions / 90 Mins)
- **GL 06 – 10 (Senior / Officer Group)**:
  - **Assessment Weight**: CBT 100% (Graded over 100%, 50% pass benchmark).
  - **Prescribed Regulations**: Public Service Rules (PSR) Chapters 2, 4, 12; Financial Regulations (FR) Chapters 1, 3, 4; Lagos State Public Procurement Law.
- **GL 12 – 14 (Middle Management Group)**:
  - **Assessment Weight**: CBT 100% (Graded over 100%, 50% pass benchmark).
  - **Prescribed Regulations**: PSR Chapters 4, 8, 10, 12; FR Chapters 3, 6, 20; Management & Leadership Principles.
- **GL 15 – 16 (Directorate Group)**:
  - **Assessment Weight**: CBT 100% (Graded over 100%, 50% pass benchmark).
  - **Prescribed Regulations**: PSR Chapters 2, 4, 6, 10, 12; FR Chapters 1, 3, 20, 25; Public Policy & Strategic Governance.

### 2. Candidate Onboarding & Authentication Rules
- **Demo Mode First (Default View)**:
  - 1-Click instant examination launch for instant test-taking without filling registration forms.
  - Pre-configured demo officers for each Grade Level Group (e.g., *Ademayowa Adetona* for GL 06-10, *Folashade Balogun* for GL 12-14, *Dr. Olusegun Sanwo* for GL 15-16).
- **Candidate Username Format (`firstname.surname`)**:
  - Automatically generated from First Name and Surname (e.g., `ademayowa.adetona`).
  - **Add a Number**: When a duplicate username exists or upon user customization, the system automatically appends a number (e.g., `ademayowa.adetona2`).
  - **No Oracle or Service Number Required**: Avoids cumbersome service number forms for candidates.
- **Password Requirement**:
  - Validates a **minimum of 4 characters** for all accounts.
- **Dedicated Administrator Account**:
  - Commission official credentials: Username `admin`, Password `admin2027`.
  - Unlocks live test monitoring, question editor, circular weight adjustments, and candidate merit roster exports.

### 3. Mobile View & Smartphone Optimization
- **Collapsible 100-Question Matrix Drawer**:
  - Instead of taking up the entire screen on mobile, the 100 questions are accessible via a quick-access header pill (`Matrix 100: Q 14/100`).
  - Tapping opens a sleek slide-up drawer showing all 100 color-coded question buttons (Green for Answered, Amber for Flagged, Slate for Unattempted).
  - Selecting any number jumps directly to that question and closes the drawer.
- **Thumb-Friendly Touch Targets**:
  - Option items (A, B, C, D) have a minimum height of 52px with large touch targets.
- **Sticky Mobile Action Bar**:
  - Previous, Flag, Next, and Submit buttons remain accessible at the bottom of mobile screens without scrolling.
- **Responsive Navigation Drawer**:
  - Mobile hamburger menu for quick access to multi-device sharing, study materials, and admin oversight.

### 4. Direct Citation & Resource Material References
- Every question card features a prominent blue badge citing the statutory authority (e.g., `[LAGOS STATE FINANCIAL REGULATIONS / TREASURY GUIDELINES, CHAPTER 1, FR 106]` or `[PUBLIC SERVICE RULES (PSR 2015), CHAPTER 2, RULE 020101]`).
- The post-exam feedback view displays all 100 questions with:
  - Correct answer indicators (✓).
  - Missed choices highlighted with explanations.
  - Exact reference material chapters.

---

## 📱 Multi-Device & Network Access

Run the development server and access from any mobile phone, tablet, or examiner laptop connected to the same Wi-Fi:

```bash
# Start server with network access
npm run dev
```

- **Local PC**: `http://localhost:5173/`
- **Network / Mobile**: `http://10.183.237.22:5173/` (or scan the QR Code in the "Multi-Device" modal).

---

## 🏛️ Commission Authority
- **Commission**: Lagos State Civil Service Commission (LSCSC)
- **Headquarters**: State Secretariat Complex, Alausa, Ikeja, Lagos State.
- **Regulatory Framework**: Lagos State Public Service Rules, State Treasury Office Financial Guidelines, Lagos State Public Procurement Agency Law.
