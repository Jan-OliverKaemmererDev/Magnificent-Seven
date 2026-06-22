export const topCardsData = [
  {
    ticker: 'AAPL',
    name: 'Apple',
    revenue: 38.52,
    growthAbs: 1.06,
    growthPct: 2.83,
    icon: 'apple.svg'
  },
  {
    ticker: 'META',
    name: 'Meta',
    revenue: 435.57,
    growthAbs: -5.81,
    growthPct: -1.32,
    icon: 'meta.svg'
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft',
    revenue: 409.05,
    growthAbs: 1.70,
    growthPct: 2.51,
    icon: 'microsoft.svg'
  },
  {
    ticker: 'GOOG',
    name: 'Google',
    revenue: 29.87,
    growthAbs: 1.70,
    growthPct: 6.04,
    icon: 'google.svg'
  },
  {
    ticker: 'AMZN',
    name: 'Amazon',
    revenue: 117.89,
    growthAbs: 4.22,
    growthPct: 2.43,
    icon: 'amazon.svg'
  },
  {
    ticker: 'TSLA',
    name: 'Tesla',
    revenue: 177.89,
    growthAbs: 4.22,
    growthPct: 2.43,
    icon: 'tesla.svg'
  },
  {
    ticker: 'NVDA',
    name: 'Nvidia',
    revenue: 26.04,
    growthAbs: 3.12,
    growthPct: 13.60,
    icon: 'nvidia.svg'
  }
];

export const revenueBreakdownData = {
  labels: ['Apple', 'Microsoft', 'Nvidia', 'Google', 'Amazon', 'Meta', 'Tesla'],
  data: [17.7, 17.0, 14.7, 11.5, 9.1, 8.7, 5.4]
};

export const netIncomeData = {
  labels: ['Amazon', 'Meta', 'Google', 'Apple', 'Microsoft', 'Nvidia', 'Tesla'],
  data: [62.62, 40.15, 39.50, 26.25, 24.51, 6.81, 3.16]
};

export const grossMarginData = {
  labels: ['Nvidia', 'Meta', 'Amazon', 'Microsoft', 'Google', 'Apple', 'Tesla'],
  data: [24.8, 24.3, 12.7, 12.5, 12.2, 6.2, 5.7]
};

// Revenue Growth in % YoY (grouped by company, 4 quarters)
export const revenueGrowthData = {
  labels: ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta', 'Tesla', 'Nvidia'],
  datasets: [
    { label: 'Q1 2024', data: [5, 15, 82, 14, 25, -9, 262] },
    { label: 'Q4 2023', data: [2, 18, 80, 13, 25, 3, 265] },
    { label: 'Q3 2023', data: [-1, 13, 68, 11, 23, 9, 206] },
    { label: 'Q2 2023', data: [-1, 8, 42, 7, 11, 47, 101] }
  ]
};

// Revenue last 3 years
export const revenueHistoryData = {
  labels: ['Q1 2021', 'Q2 2021', 'Q3 2021', 'Q4 2021', 'Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
  datasets: [
    { label: 'Apple', data: [12, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 16.8, 17, 17.5, 17.7] },
    { label: 'Microsoft', data: [10, 11, 11.5, 12, 12.5, 13, 13.5, 14, 15, 15.5, 16, 16.5, 17.0] },
    { label: 'Nvidia', data: [3, 4, 4.5, 5, 6, 7, 7.5, 8, 8.5, 9, 10, 12, 14.7] },
    { label: 'Google', data: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11.5] },
    { label: 'Amazon', data: [4, 4.5, 5, 5.5, 6, 6.2, 6.5, 7, 7.5, 8, 8.5, 8.8, 9.1] },
    { label: 'Meta', data: [3.5, 4, 4.5, 5, 5.5, 6, 6.5, 6.8, 7, 7.5, 8, 8.5, 8.7] },
    { label: 'Tesla', data: [1.5, 2, 2.5, 3, 3.5, 3.8, 4, 4.2, 4.5, 4.8, 5, 5.2, 5.4] }
  ]
};
