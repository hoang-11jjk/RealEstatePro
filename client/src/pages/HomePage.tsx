import { useEffect, useMemo, useRef } from 'react'
import ContactSection from '../components/ContactSection'
import Hero from '../components/Hero'
import PropertyGrid from '../components/PropertyGrid'
import SearchFilters from '../components/SearchFilters'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearFilters, setFilter } from '../store/filtersSlice'
import { fetchListings, selectProperty } from '../store/listingsSlice'

function HomePage() {
  const dispatch = useAppDispatch()
  const { items: listings, selectedId, status, error } = useAppSelector((state) => state.listings)
  const filters = useAppSelector((state) => state.filters)
  const searchRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchListings())
    }
  }, [dispatch, status])

  const filteredListings = useMemo(() => {
    return listings.filter((property) => {
      const keywordMatch =
        filters.keyword.trim() === '' ||
        property.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.keyword.toLowerCase())

      const locationMatch =
        filters.location.trim() === '' ||
        property.location.toLowerCase().includes(filters.location.toLowerCase())

      const typeMatch = filters.type ? property.type === filters.type : true
      const statusMatch = filters.status ? property.status === filters.status : true

      const minPrice = Number(filters.minPrice) || 0
      const maxPrice = Number(filters.maxPrice) || Infinity
      const priceMatch = property.price >= minPrice && property.price <= maxPrice

      return keywordMatch && locationMatch && typeMatch && statusMatch && priceMatch
    })
  }, [filters, listings])

  const featured = filteredListings[0] ?? listings[0] ?? null

  const handleScrollToSearch = () => {
    const el = document.getElementById('search-section') ?? searchRef.current
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="space-y-10">
      <Hero featured={featured} total={listings.length} onSearchClick={handleScrollToSearch} />

      <div ref={searchRef}>
        <SearchFilters
          filters={filters}
          onChange={(field, value) => dispatch(setFilter({ field, value }))}
          onClear={() => dispatch(clearFilters())}
          matchCount={filteredListings.length}
        />
      </div>

      <PropertyGrid
        properties={filteredListings}
        selectedId={selectedId}
        onSelect={(id) => dispatch(selectProperty(id))}
        isLoading={status === 'loading' || status === 'idle'}
        error={error}
      />

      <ContactSection />
    </div>
  )
}

export default HomePage
