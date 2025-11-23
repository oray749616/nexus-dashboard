'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, RefreshCw, AlertCircle } from 'lucide-react'

// Type definitions
interface CachedRates {
  rates: { [key: string]: number }
  base: string
  timestamp: number
  date: string
}

interface CurrencyPreferences {
  fromCurrency: string
  toCurrency: string
}

// Common currency list
const COMMON_CURRENCIES = [
  { code: 'CNY', name: '人民币', symbol: '¥' },
  { code: 'USD', name: '美元', symbol: '$' },
  { code: 'EUR', name: '欧元', symbol: '€' },
  { code: 'GBP', name: '英镑', symbol: '£' },
  { code: 'JPY', name: '日元', symbol: '¥' },
  { code: 'HKD', name: '港币', symbol: 'HK$' },
  { code: 'AUD', name: '澳元', symbol: 'A$' },
  { code: 'CAD', name: '加元', symbol: 'C$' },
  { code: 'CHF', name: '瑞士法郎', symbol: 'Fr' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$' },
]

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000

export default function CurrencyWidget() {
  const [isClient, setIsClient] = useState(false)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('CNY')
  const [amount, setAmount] = useState(1)
  const [rates, setRates] = useState<CachedRates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Client-side initialization
  useEffect(() => {
    setIsClient(true)

    // Load user preferences
    const savedPreferences = localStorage.getItem('nexus_currency_preferences')
    if (savedPreferences) {
      try {
        const prefs: CurrencyPreferences = JSON.parse(savedPreferences)
        setFromCurrency(prefs.fromCurrency)
        setToCurrency(prefs.toCurrency)
      } catch (e) {
        console.error('Failed to load preferences:', e)
      }
    }

    // Load cached exchange rates
    const savedRates = localStorage.getItem('nexus_currency_rates')
    if (savedRates) {
      try {
        const cachedRates: CachedRates = JSON.parse(savedRates)
        setRates(cachedRates)
        setLastUpdated(new Date(cachedRates.timestamp))

        // Check if cache is expired
        const isExpired = Date.now() - cachedRates.timestamp > CACHE_DURATION
        if (isExpired) {
          fetchRates() // Background refresh
        }
      } catch (e) {
        console.error('Failed to load cached rates:', e)
        fetchRates()
      }
    } else {
      fetchRates()
    }
  }, [])

  // Save user preferences (only save currency type selection)
  useEffect(() => {
    if (isClient) {
      const preferences: CurrencyPreferences = {
        fromCurrency,
        toCurrency,
      }
      localStorage.setItem('nexus_currency_preferences', JSON.stringify(preferences))
    }
  }, [fromCurrency, toCurrency, isClient])

  // Fetch exchange rate data
  const fetchRates = async () => {
    const apiKey = process.env.NEXT_PUBLIC_FXRATES_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      setError('Please configure NEXT_PUBLIC_FXRATES_API_KEY in .env.local file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.fxratesapi.com/latest?api_key=${apiKey}&base=USD&resolution=1d`
      )

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'API returned an error')
      }

      const cachedRates: CachedRates = {
        rates: data.rates,
        base: data.base,
        timestamp: Date.now(),
        date: data.date,
      }

      setRates(cachedRates)
      setLastUpdated(new Date())
      localStorage.setItem('nexus_currency_rates', JSON.stringify(cachedRates))
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch rates'
      setError(errorMessage)
      console.error('Failed to fetch rates:', e)

      // If cached data is available, continue using it
      if (rates) {
        setError(`${errorMessage} (using cached data)`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Calculate conversion result
  const calculateConversion = (): number => {
    if (!rates || !rates.rates) return 0

    const fromRate = rates.rates[fromCurrency] || 1
    const toRate = rates.rates[toCurrency] || 1

    // Convert from fromCurrency to USD, then from USD to toCurrency
    const result = (amount / fromRate) * toRate
    return Math.round(result * 100) / 100 // Keep two decimal places
  }

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Format last updated time
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return 'Not updated'

    const now = Date.now()
    const diff = now - lastUpdated.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just updated'
    if (minutes < 60) return `Updated ${minutes} min ago`
    if (hours < 24) return `Updated ${hours} hr ago`
    return `Updated ${days} days ago`
  }

  // Get current exchange rate
  const getCurrentRate = (): string => {
    if (!rates || !rates.rates) return '-'

    const fromRate = rates.rates[fromCurrency] || 1
    const toRate = rates.rates[toCurrency] || 1
    const rate = toRate / fromRate

    return rate.toFixed(4)
  }

  if (!isClient) {
    return <div className="w-80 flex items-center justify-center">Loading...</div>
  }

  return (
    <div
      className="w-80 flex flex-col p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 标题 */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Currency Converter
      </h3>

      {/* 输入区域 */}
      <div className="space-y-3 mb-4">
        {/* 源货币输入 */}
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-0 flex-1 px-3 py-2 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700 dark:text-slate-200 placeholder-slate-400"
            placeholder="Amount"
            min="0"
            step="0.01"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="px-3 py-2 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700 dark:text-slate-200 cursor-pointer text-sm"
          >
            {COMMON_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name} {currency.code}
              </option>
            ))}
          </select>
        </div>

        {/* 互换按钮 */}
        <div className="flex justify-end pr-[3.2rem]">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-lg transition-all duration-200 active:scale-95"
            title="Swap Currencies"
          >
            <ArrowLeftRight size={20} />
          </button>
        </div>

        {/* 目标货币显示 */}
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200/50 dark:border-indigo-500/20 rounded-lg text-slate-700 dark:text-slate-200 font-semibold flex items-center">
            {loading ? (
              <span className="text-slate-400">Calculating...</span>
            ) : (
              <span>{calculateConversion().toLocaleString()}</span>
            )}
          </div>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="px-3 py-2 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700 dark:text-slate-200 cursor-pointer text-sm"
          >
            {COMMON_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name} {currency.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 汇率信息 */}
      <div className="p-3 bg-white/30 dark:bg-slate-900/30 rounded-lg space-y-1">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          1 {fromCurrency} = {getCurrentRate()} {toCurrency}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {formatLastUpdated()}
          </div>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh Rates"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-50/50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
