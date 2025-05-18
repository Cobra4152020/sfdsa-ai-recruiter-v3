import { useState } from 'react'
import { BadgeType, BadgeRarity } from '@/types/badge'

interface BadgeFilterProps {
  onFilterChange: (filters: BadgeFilters) => void
  defaultFilters?: Partial<BadgeFilters>
}

export interface BadgeFilters {
  type: BadgeType | 'all'
  rarity: BadgeRarity | 'all'
  status: 'all' | 'earned' | 'in-progress' | 'locked'
  sortBy: 'newest' | 'oldest' | 'points' | 'difficulty'
}

const defaultFilters: BadgeFilters = {
  type: 'all',
  rarity: 'all',
  status: 'all',
  sortBy: 'newest'
}

export function BadgeFilter({
  onFilterChange,
  defaultFilters: initialFilters
}: BadgeFilterProps) {
  const [filters, setFilters] = useState<BadgeFilters>({
    ...defaultFilters,
    ...initialFilters
  })

  const handleFilterChange = (key: keyof BadgeFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Type Filter */}
      <div className="flex-1">
        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          id="type-filter"
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value as BadgeType | 'all')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">All Types</option>
          <option value="achievement">Achievement</option>
          <option value="skill">Skill</option>
          <option value="participation">Participation</option>
          <option value="special">Special</option>
        </select>
      </div>

      {/* Rarity Filter */}
      <div className="flex-1">
        <label htmlFor="rarity-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Rarity
        </label>
        <select
          id="rarity-filter"
          value={filters.rarity}
          onChange={(e) => handleFilterChange('rarity', e.target.value as BadgeRarity | 'all')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex-1">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value as BadgeFilters['status'])}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="earned">Earned</option>
          <option value="in-progress">In Progress</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="flex-1">
        <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sort-filter"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value as BadgeFilters['sortBy'])}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="points">Points (High to Low)</option>
          <option value="difficulty">Difficulty (High to Low)</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <div className="flex items-end">
        <button
          onClick={() => {
            setFilters(defaultFilters)
            onFilterChange(defaultFilters)
          }}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
} 