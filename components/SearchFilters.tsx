'use client';

import { useState } from 'react';

export default function SearchFilters() {
  const [filters, setFilters] = useState({
    type: 'all',
    priceMin: '',
    priceMax: '',
    location: '',
    propertyType: 'all',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <option value="all">All</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <input
          type="number"
          name="priceMin"
          value={filters.priceMin}
          onChange={handleFilterChange}
          placeholder="Min Price"
          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        />

        <input
          type="number"
          name="priceMax"
          value={filters.priceMax}
          onChange={handleFilterChange}
          placeholder="Max Price"
          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        />

        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        />

        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleFilterChange}
          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <option value="all">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
      </div>
    </div>
  );
}
