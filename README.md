# 📈 AlgoTerminal | Built with ❤️ by AerynnnSh :3

> A real-time crypto market analytics dashboard built with Next.js 14, TypeScript, Supabase, and Recharts.

![Project Banner](img/banner1.png)

## 🔗 Live Demo
🚀 **[View Live Demo](https://algoterminal-eli.vercel.app)**

## ✨ Key Features

### 🔐 Authentication & Cloud Sync (NEW!)
- **GitHub OAuth:** Secure login system using Supabase Auth.
- **Hybrid Watchlist System:**
  - **Logged In:** Watchlist is synced to a **PostgreSQL Database** in real-time. Access your data across devices.
  - **Guest Mode:** Watchlist is saved to **LocalStorage**, allowing full functionality without login.

### 📊 Advanced Technical Charting
- **Interactive Area Charts:** Visualize price action with gradient fills using `Recharts`.
- **Technical Indicators:** Toggleable **SMA-14** (Simple Moving Average) and **EMA-50** (Exponential Moving Average) calculated in real-time using custom algorithms.
- **Dynamic Tooltips:** Hover over charts to see precise price and indicator values.

### 🛠 Tools & Utilities
- **Scenario Simulator:** A built-in Profit Calculator to simulate investment returns based on future price targets.
- **Real-Time Search:** Instant filtering of assets by Name or Symbol without API refetching.

### ⚡ Performance & UX
- **Server-Side Rendering (SSR):** Optimized initial load with Next.js App Router.
- **Loading Skeletons:** Zero layout shifts during data fetching.
- **Responsive Design:** Fully optimized for Desktop, Tablet, and Mobile.
- **Dark/Light Mode:** Theme-aware UI components.

## 🏗 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Backend / DB:** Supabase (PostgreSQL, Auth)
- **Styling:** Tailwind CSS
- **Visualization:** Recharts
- **Data Source:** CoinGecko Public API
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [https://github.com/username/algoterminal.git](https://github.com/username/algoterminal.git)
   cd algoterminal

 2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    
 4. **Setup Environment Variables** Create a .env.local file in the root directory and add your Supabase credentials:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
 6. **Run the development server**
    ```bash
    npm run dev
    
 8. **Open your browser** Navigate to http://localhost:3000

## 🧠 Algo Logic Highlight
One of the challenges in this project was implementing a Hybrid Sync Strategy for the watchlist. Below is the logic that decides whether to save to the Cloud (Supabase) or LocalStorage:
```typescript
      // Hybrid Sync Logic (inside LiveTable.tsx)
const handleStarClick = async (id: string) => {
  // 1. Optimistic UI Update (Instant feedback)
  toggleCoin(id);

  // 2. If User is Logged In -> Sync to DB
  if (user) {
    if (isAdding) {
      await supabase.from("watchlist").insert({ user_id: user.id, coin_id: id });
    } else {
      await supabase.from("watchlist").delete().match({ user_id: user.id, coin_id: id });
    }
  }
  // 3. If Guest -> Zustand handles LocalStorage automatically
};
