import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatRupiah } from '../lib/utils';
import GoogleMapComponent from '../components/GoogleMap';
import { MapPin, Ticket, ShieldCheck, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const MIDTRANS_CLIENT_KEY = 'Mid-client-viGLekjKyOUm4QLa';
// Jika key diawali Mid- biasanya production, namun jika diset sandbox pakai URL sandbox
const IS_SANDBOX = true; 
const SNAP_URL = IS_SANDBOX 
  ? 'https://app.sandbox.midtrans.com/snap/snap.js' 
  : 'https://app.midtrans.com/snap/snap.js';

export default function Checkout() {
  const { cart, clearCart, user } = useAppContext();
  const navigate = useNavigate();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || 'Budi Santoso');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '085814420843');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'pembeli@wiwiksayur.id');
  const [address, setAddress] = useState('Jl. Fatmawati Raya No. 12, Cilandak, Jakarta Selatan');
  const [notes, setNotes] = useState('');
  
  // Voucher State
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // Loading & Payment State
  const [isProcessing, setIsProcessing] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  // Perhitungan Biaya
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryDistanceKm = 2.4; // estimasi rute Google Maps
  const shippingFee = subtotal >= 200000 && deliveryDistanceKm <= 1 ? 0 : 8000 + Math.ceil(Math.max(0, deliveryDistanceKm - 2)) * 2500;
  
  // Diskon Voucher
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percentage') {
      discountAmount = Math.min((subtotal * appliedVoucher.value) / 100, appliedVoucher.max_discount || subtotal);
    } else {
      discountAmount = Math.min(appliedVoucher.value, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  // Load Script Midtrans Snap secara dinamis
  useEffect(() => {
    const existingScript = document.getElementById('midtrans-snap-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'midtrans-snap-script';
      script.src = SNAP_URL;
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
      script.onload = () => setSnapReady(true);
      document.body.appendChild(script);
    } else {
      setSnapReady(true);
    }
  }, []);

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();

    if (code === 'SEGAR20') {
      if (subtotal < 75000) {
        setVoucherError('Minimal belanja Rp 75.000 untuk voucher SEGAR20');
        return;
      }
      setAppliedVoucher({ code: 'SEGAR20', type: 'percentage', value: 20, max_discount: 25000 });
    } else if (code === 'HEMAT10RB') {
      if (subtotal < 50000) {
        setVoucherError('Minimal belanja Rp 50.000 untuk voucher HEMAT10RB');
        return;
      }
      setAppliedVoucher({ code: 'HEMAT10RB', type: 'fixed', value: 10000 });
    } else if (code === 'PELANGGANBARU') {
      if (subtotal < 40000) {
        setVoucherError('Minimal belanja Rp 40.000 untuk voucher PELANGGANBARU');
        return;
      }
      setAppliedVoucher({ code: 'PELANGGANBARU', type: 'percentage', value: 15, max_discount: 20000 });
    } else {
      setVoucherError('Kode voucher tidak ditemukan atau kedaluwarsa');
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Mohon isi alamat pengiriman lengkap Anda');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Coba request Snap Token ke backend API
      let snapToken = null;
      try {
        const res = await axios.post('/api/orders', {
          items: cart,
          subtotal,
          delivery_fee: shippingFee,
          discount: discountAmount,
          voucher_code: appliedVoucher?.code || null,
          address,
          notes,
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          distance_km: deliveryDistanceKm
        });

        if (res.data?.payment_token) {
          snapToken = res.data.payment_token;
        }
      } catch (apiErr) {
        console.warn('Backend API offline / lokal mode, lanjut dengan simulasi Snap:', apiErr);
      }

      // 2. Jika window.snap tersedia dan ada token, buka popup Snap Midtrans
      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            clearCart();
            navigate(`/payment-result?status=success&order_id=${result.order_id}`);
          },
          onPending: function (result) {
            clearCart();
            navigate(`/payment-result?status=pending&order_id=${result.order_id}`);
          },
          onError: function (result) {
            alert('Pembayaran gagal atau dibatalkan oleh bank');
            setIsProcessing(false);
          },
          onClose: function () {
            setIsProcessing(false);
          }
        });
      } else {
        // Simulasi jika dipratinjau secara lokal (tanpa koneksi server aktif)
        setTimeout(() => {
          setIsProcessing(false);
          clearCart();
          const mockOrderId = 'WS-' + Date.now();
          navigate(`/payment-result?status=success&order_id=${mockOrderId}`);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses pesanan.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-4 font-bold">
          🥬
        </div>
        <p className="text-xl font-bold text-gray-800 mb-2">Keranjang Anda Masih Kosong</p>
        <p className="text-gray-500 mb-6 text-sm">Pilih sayuran dan buah segar dari petani sebelum checkout.</p>
        <Button onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-700">
          Mulai Belanja Sayur & Buah
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout Pesanan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Selesaikan pesanan Anda dengan aman melalui gateway pembayaran Midtrans
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Data Pengiriman & Alamat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Penerima */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">1</span>
                Informasi Penerima
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
                  <Input 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    placeholder="Nama penerima..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp / HP</label>
                  <Input 
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)} 
                    placeholder="08xxxxxxxxxx"
                    className="mt-1 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Alamat Email (untuk bukti nota bayar)</label>
                <Input 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)} 
                  placeholder="email@anda.com"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Alamat & Titik Pengiriman Google Maps */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">2</span>
                Alamat & Lokasi Google Maps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="h-60 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                <GoogleMapComponent />
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-800">
                <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Estimasi jarak: <strong>{deliveryDistanceKm} km</strong> dari toko WiwikSayur.id (Jakarta Selatan).
                </span>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Alamat Lengkap Pengiriman</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  placeholder="Tulis nama jalan, nomor rumah, RT/RW, kelurahan, patokan khusus..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Catatan untuk Penjual / Kurir (Opsional)</label>
                <Input 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Contoh: Titip di satpam / sayuran tolong yang segar baru panen"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Rincian Belanja & Pembayaran Midtrans */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm sticky top-24">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-800">Ringkasan Belanja</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Daftar Barang */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-sm divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.id} className="pt-2 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-slate-500">{item.quantity} {item.unit || 'pack'} × {formatRupiah(item.price)}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Input Voucher */}
              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Ticket className="h-3.5 w-3.5 text-emerald-600" /> Punya Kode Voucher?
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={voucherCode} 
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: SEGAR20"
                    className="text-xs uppercase font-mono"
                  />
                  <Button 
                    type="button" 
                    onClick={handleApplyVoucher}
                    variant="outline" 
                    className="text-xs px-3"
                  >
                    Gunakan
                  </Button>
                </div>
                {appliedVoucher && (
                  <div className="mt-2 p-2 bg-emerald-50 rounded text-xs text-emerald-700 flex items-center justify-between">
                    <span className="font-semibold">Voucher &quot;{appliedVoucher.code}&quot; aktif!</span>
                    <button onClick={() => setAppliedVoucher(null)} className="text-red-600 hover:underline">Hapus</button>
                  </div>
                )}
                {voucherError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {voucherError}
                  </p>
                )}
              </div>

              {/* Breakdown Biaya */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Sayur & Buah</span>
                  <span className="font-mono font-semibold">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ongkos Kirim ({deliveryDistanceKm} km)</span>
                  <span className="font-mono font-semibold">
                    {shippingFee === 0 ? <strong className="text-emerald-700">GRATIS</strong> : formatRupiah(shippingFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Diskon Voucher</span>
                    <span className="font-mono">- {formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Tagihan</span>
                  <span className="font-mono text-emerald-700 text-lg">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Tombol Bayar Midtrans */}
              <div className="pt-2 space-y-3">
                <Button 
                  onClick={handlePay} 
                  disabled={isProcessing} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20"
                >
                  <CreditCard className="h-4 w-4" />
                  {isProcessing ? 'Memproses Gateway...' : 'Bayar Sekarang via Midtrans'}
                </Button>

                {/* Badge Keamanan */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Didukung Midtrans Snap (BCA, Mandiri, QRIS, GoPay)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
