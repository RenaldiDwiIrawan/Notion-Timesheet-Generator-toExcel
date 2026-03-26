# 🚀 Notion Timesheet Generator

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Notion API](https://img.shields.io/badge/Notion_API-000000?style=for-the-badge&logo=notion&logoColor=white)
![ExcelJS](https://img.shields.io/badge/ExcelJS-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)

A modern, fast, and beautifully designed web application that automatically converts your Notion task entries into a professionally formatted Excel (.xlsx) timesheet. Perfect for seamlessly maintaining complex corporate Excel templates while tracking daily working tasks via Notion.

---

## ✨ Features

- **Painless Notion Integration:** Fetches your daily tasks simply by searching or pasting the Notion Page ID.
- **Smart Excel Mapping:** Automatically parses your tasks and populates the correct dates onto an Excel Template spreadsheet.
- **Custom Native File Browser:** Avoids strict browser restrictions by utilizing a custom Next.js API-based local file picker—select custom `.xlsx` templates and exact output directories with ease.
- **Digital Signatures:** Allows submittors and approvers to digitally stamp their signatures straight into the Excel layout.
- **Premium Glassmorphism UI:** Built using Tailwind CSS with dark-mode optimizations, subtle gradients, animations, and an immersive user experience.
- **In-App Guided Setup:** A built-in user guide to help users connect the Notion API in minutes directly from the browser.

## 🛠️ Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **UI:** React & Tailwind CSS
- **Notion SDK:** `@notionhq/client`
- **Spreadsheeting:** `exceljs`

## ⚙️ Prerequisites

- **Node.js** (v18+)
- A **Notion** account
- **Git** (optional, for cloning)

## 📦 Setup & Installation

1. **Clone the Repository** (or download it directly):
   ```bash
   git clone https://github.com/YourUsername/notion-timesheet-generator.git
   cd notion-timesheet-generator
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Get Your Notion API Key:**
   - Go to [Notion Integrations](https://www.notion.so/my-integrations).
   - Click "New Integration", give it a name, and copy the **Internal Integration Secret**.

4. **Environment Variables:**
   - Create a file named `.env.local` in the root folder.
   - Add your Notion Token like this:
     ```env
     NOTION_API_KEY=secret_yourNotionApiTokenHere
     ```

5. **Share Notion Page:**
   - Open your target Notion Timesheet (database/table) page.
   - Click the `...` at the top right > **Add connections** > Search for your integration name to give it read access.

## 🚀 Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 
The app will greet you with a Setup Guide!

---

**Crafted by Renn**
