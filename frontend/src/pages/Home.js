import React, { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { products } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredProducts = activeCategory === 'Semua'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pb-16">
      <HeroBanner />
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur">
        <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pilihan {activeCategory !== 'Semua' ? activeCategory : 'Terbaru'}</h2>
            <p className="text-sm text-gray-500 mt-1">Produk segar langsung dari petani ke dapur Anda</p>
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada produk untuk kategori ini.</p>
          </div>
        )}
      </main>
    </div>
  );
}
