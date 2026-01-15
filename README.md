# 🚀 Crypto Tracker

A modern, responsive cryptocurrency tracking application built as a practice project to demonstrate proficiency with React, Redux Toolkit Query, and modern web development practices.

## 📋 About

This project is a full-featured cryptocurrency tracker that displays real-time market data, price charts, and detailed coin information. It was built for educational purposes to practice and showcase skills in modern React development, state management, API integration, and responsive design.

## ✨ Features

- **Real-time Market Data**: View top 100 cryptocurrencies with live price updates
- **Interactive Charts**: Price history charts with multiple time ranges (1 Day, 1 Week, 1 Month, 6 Months, 1 Year)
- **Search & Filter**: Search cryptocurrencies by name or symbol
- **Sorting Options**: Sort by rank, name, price, 24h change, or market cap
- **View Modes**: Toggle between grid and list view
- **Detailed Coin Pages**: View comprehensive information including:
  - Current price and 24h change
  - Market cap and volume
  - Supply information
  - Interactive price charts
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Auto-retry Logic**: Automatic retry mechanism for failed API requests
- **Error Handling**: User-friendly error messages with manual retry option

## 🛠️ Technologies Used

### Core Framework & Libraries
- **React 19.2.0** - Modern React with latest features
- **React Router 7.11.0** - Client-side routing
- **Vite 7.2.4** - Fast build tool and development server

### State Management & Data Fetching
- **Redux Toolkit 2.11.2** - State management
- **RTK Query** - Data fetching and caching with automatic polling
- **React Redux 9.2.0** - React bindings for Redux

### Styling
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Data Visualization
- **Recharts 3.6.0** - Composable charting library built on React components

### Development Tools
- **ESLint 9.39.1** - Code linting
- **TypeScript Types** - Type definitions for React and React DOM

### API
- **CoinGecko API** - Free cryptocurrency market data API


## 📁 Project Structure

```
crypto-tracker/
├── src/
│   ├── api/              # API utilities (legacy, now using RTK Query)
│   ├── assets/            # Static assets
│   ├── components/        # Reusable React components
│   │   ├── CryptoCard.jsx
│   │   ├── CryptoFooter.jsx
│   │   └── CryptoHeader.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── useDebounce.js
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   └── CoinDetail.jsx
│   ├── store/             # Redux store and API slice
│   │   ├── coinGeckoApi.js
│   │   └── store.js
│   ├── utils/             # Utility functions
│   │   └── formatter.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Public assets
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Key Features Implementation

### RTK Query Integration
- Automatic caching and request deduplication
- Polling for real-time updates (30-second intervals)
- Automatic retry logic for failed requests
- Optimistic updates and cache management

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface
- Optimized chart rendering for small screens

### Performance Optimizations
- Debounced search input
- Memoized filtered and sorted lists
- Lazy loading and code splitting
- Efficient re-renders with React hooks


## 🔗 API

This project uses the [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data:
- Free tier (no API key required)
- Rate limits apply
- Data updates every 30 seconds

## 📄 License

This project is for educational purposes only.

## 👨‍💻 Author

Built as a practice project to demonstrate modern React development skills.

---

**Note**: This is a practice project built for learning purposes. The CoinGecko API is used for demonstration of API integration and data fetching patterns.
