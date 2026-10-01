import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-bold text-2xl tracking-tight text-white">WiwikSayur.id</span>
            <p className="mt-2 text-sm text-emerald-200">
              Menyediakan Sayuran & Buah Fresh - Segar dari Petani, Langsung ke Dapur Anda
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-emerald-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-emerald-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-emerald-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">Menu Cepat</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="text-emerald-200 hover:text-white">Beranda</Link></li>
              <li><Link to="/tentang-kami" className="text-emerald-200 hover:text-white">Tentang Kami</Link></li>
              <li><Link to="/kontak" className="text-emerald-200 hover:text-white">Kontak</Link></li>
              <li><Link to="/auth" className="text-emerald-200 hover:text-white">Masuk / Daftar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">Kontak Kami</h3>
            <ul className="mt-4 space-y-2 text-sm text-emerald-200">
              <li>Jl. Pertanian No. 123, Jakarta</li>
              <li>Telepon: 0812-3456-7890</li>
              <li>Email: halo@wiwiksayur.id</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-emerald-800 pt-8 flex items-center justify-between">
          <p className="text-base text-emerald-400">
            &copy; {new Date().getFullYear()} WiwikSayur.id. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
