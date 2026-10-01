import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/button';
import { formatRupiah } from '../lib/utils';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity } = useAppContext();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
        <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Keranjang Belanja
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag className="h-16 w-16 text-emerald-200" />
              <p>Keranjang masih kosong</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>Mulai Belanja</Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-4 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded-md" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="font-mono text-primary font-bold text-sm mt-1">{formatRupiah(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-white border border-gray-200 rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><Minus className="h-3 w-3" /></button>
                        <span className="px-2 py-1 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><Plus className="h-3 w-3" /></button>
                      </div>
                      <p className="font-mono text-gray-900 font-bold text-sm">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-emerald-100 p-4 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p className="font-mono font-extrabold text-emerald-700">{formatRupiah(subtotal)}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">Ongkos kirim akan dihitung saat checkout.</p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
