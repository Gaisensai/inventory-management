'use client';

import { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import ProductTable from '@/components/products/ProductTable';
import ProductFilters from '@/components/products/ProductFilters';
import ProductForm from '@/components/products/ProductForm';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const { products, filteredProducts, loadSampleData, clearAllProducts, exportToCSV } =
    useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {products.length > 0 && (
            <>
              <Button variant="secondary" onClick={exportToCSV}>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export CSV
              </Button>
              <Button
                variant="ghost"
                onClick={clearAllProducts}
                className="text-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            </>
          )}
          {products.length === 0 && (
            <Button variant="secondary" onClick={loadSampleData}>
              Load Sample Data
            </Button>
          )}
          <Button onClick={() => setIsFormOpen(true)}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <ProductFilters />
      </div>

      <ProductTable />

      <ProductForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
