# Expense Tracker

> *Track expenses, manage savings, and stay financially aware*

**Expense Tracker** is a full-featured financial web app that allows users to track their income, expenses, savings goals, and more. Built with React + TypeScript and powered by a secure, scalable backend, this frontend is optimized for modularity, performance, and accessibility.

---

## 🚀 Features

* ✅ **User Authentication** (Login, Register, Session Persistence with Refresh Tokens)
* ✅ **Transaction Management** (Create, Filter, Sort, Paginate)
* ✅ **Savings Goals Tracking** with visual progress indicators
* ✅ **Category & Bank Account Management** with modals
* ✅ **Forgot Password via Email OTP** (Gmail for now, Resend-ready)
* ✅ **Dark/Light Mode** toggle with context
* ✅ **Protected Routes** and role-based access control
* ✅ **Responsive & Accessible UI**
* ✅ **Branded Fullpage Loader & Skeleton States**
* ✅ **SEO + Performance Optimized** (Lighthouse score 90+)

---

## 📍 Tech Stack

| Category      | Technology                            |
|---------------|----------------------------------------|
| Framework     | React + Vite + TypeScript             |
| State         | Redux Toolkit, React Query            |
| Styling       | Tailwind CSS, Framer Motion           |
| Forms & Validation | React Hook Form + Zod           |
| Routing       | React Router DOM                      |
| HTTP          | Axios with interceptors               |
| Image Upload  | Cloudinary                            |
| Email Service | Gmail (Resend configured for future)  |
| Deployment    | Vercel                                |


---

## 🔧 Setup & Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker/frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Create Environment File

Create a `.env` file in the root folder and set:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

> Refer to `.env.sample` for the correct format.

### 4. Run the app

```bash
npm run dev
# or
yarn dev
```

---

## 🗂️ Project Structure

```
src/
 ┣ assets/                 
 ┣ components/              
 ┣ context/                 
 ┣ hooks/                   
 ┣ interfaces/              
 ┣ lib/                     
 ┣ pages/                   
 ┣ redux/                  
 ┣ routes/                 
 ┣ schemas/                 
 ┣ services/               
 ┣ utils/                   
 ┣ App.tsx / main.tsx      
```

---

## 🙌 Contribution

This is a personal project built from the ground up.
Feel free to raise issues, suggest improvements, or fork it for your own financial planner app.

---

## 📜 License

[MIT LICENSE](./LICENSE) — Open to use, modify, and build upon.
