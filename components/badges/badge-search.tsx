import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeWithProgress } from '@/types/badge'
import { useEnhancedBadges } from '@/hooks/use-enhanced-badges'
import { Search, X } from 'lucide-react'
import debounce from 'lodash/debounce'

interface BadgeSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  showSuggestions?: boolean
}

export function BadgeSearch({
  onSearch,
  placeholder = 'Search badges...',
  showSuggestions = true
}: BadgeSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { collections } = useEnhancedBadges()

  const allBadges = useMemo(() => {
    if (!collections) return []
    return collections.flatMap(c => c.badges) as BadgeWithProgress[]
  }, [collections])

  const suggestions = useMemo(() => {
    if (!query || !showSuggestions || !allBadges.length) return []

    const searchTerms = query.toLowerCase().split(' ')
    return allBadges
      .filter(badge => {
        const searchText = `${badge.name} ${badge.description} ${badge.type} ${badge.rarity}`.toLowerCase()
        return searchTerms.every(term => searchText.includes(term))
      })
      .slice(0, 5)
  }, [query, showSuggestions, allBadges])

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      onSearch(value)
    }, 300),
    [onSearch]
  )

  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, debouncedSearch])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto"
          >
            {suggestions.map((badge) => (
              <button
                key={badge.id}
                onClick={() => {
                  setQuery(badge.name)
                  setIsFocused(false)
                  onSearch(badge.name)
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
              >
                {badge.imageUrl ? (
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      {badge.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium">{badge.name}</div>
                  <div className="text-sm text-gray-500">
                    {badge.type} • {badge.rarity}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 