'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Filters {
  type: string;
  priceMin: string;
  priceMax: string;
  location: string;
  propertyType: string;
}

interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    priceMin: '',
    priceMax: '',
    location: '',
    propertyType: 'all',
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
