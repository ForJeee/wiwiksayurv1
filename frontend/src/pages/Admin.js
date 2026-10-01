import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  LayoutDashboard, ShoppingBag, Users, Ticket, Settings, Search, Plus, 
  PackageCheck, Truck, CheckCircle2, XCircle, Clock, MessageSquare, 
  MapPin, Edit, Trash2, Eye, RefreshCw
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import GoogleMapComponent from '../components/GoogleMap';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { products } = useAppContext();

  // Search & Filter State
  const [searchProduct, setSearchProduct] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State for Add Product
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Sayuran',
    price: '',
    unit: 'kg',
    stock: '',
    image_url: '',
    description: ''
  });

  // Mock Sales Data for Chart
  const salesData = [
    { name: 'Sen', total: 4200000, orders: 28 },
    { name: 'Sel', total: 3800000, orders: 24 },
    { name: 'Rab', total: 4900000, orders: 35 },
    { name: 'Kam', total: 5400000, orders: 40 },
    { name: 'Jum', total: 6800000, orders: 52 },
    { name: 'Sab', total: 8900000, orders: 74 },
    { name: 'Min', total: 9500000, orders: 82 },
  ];

  // Mock Orders Data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2026-001',
      customer: 'Budi Santoso',
      phone: '085814420843',
      address: 'Jl. Kemang Raya No. 12, Mampang Prapatan, Jakarta Selatan',
      items: [
        { name: 'Bayam Hijau Organik', qty: 2, price: 5000 },
        { name: 'Wortel Berastagi Super', qty: 1, price: 12000 },
        { name: 'Pisang Cavendish Fresh', qty: 1, price: 22000 }
      ],
      subtotal: 44000,
      delivery_fee: 8000,
      discount: 10000,
      total: 42000,
      status: 'shipping',
      date: '30 Sep 2026, 14:30 WIB'
    },
    {
      id: 'ORD-2026-002',
      customer: 'Siti Rahmawati',
      phone: '081298765432',
      address: 'Jl. Cilandak Barat No. 8, Cilandak, Jakarta Selatan',
      items: [
        { name: 'Brokoli Hijau Segar', qty: 2, price: 18000 },
        { name: 'Alpukat Mentega Super', qty: 2, price: 32000 }
      ],
      subtotal: 100000,
      delivery_fee: 0,
      discount: 20000,
      total: 80000,
      status: 'paid',
      date: '30 Sep 2026, 15:10 WIB'
    },
    {
      id: 'ORD-2026-003',
      customer: 'Ahmad Fauzi',
      phone: '081344556677',
      address: 'Jl. Tebet Timur No. 4, Tebet, Jakarta Selatan',
      items: [
        { name: 'Cabai Rawit Merah Juara', qty: 1, price: 35000 },
        { name: 'Bawang Merah Brebes Super', qty: 1, price: 28000 }
      ],
      subtotal: 63000,
      delivery_fee: 10500,
      discount: 0,
      total: 73500,
      status: 'completed',
      date: '29 Sep 2026, 10:15 WIB'
    }
  ]);

  // Mock Vouchers Data
  const [vouchers, setVouchers] = useState([
    { id: 1, code: 'SEGAR20', type: 'percentage', value: 20, min_spend: 75000, quota: 100, used: 42, is_active: true },
    { id: 2, code: 'HEMAT10RB', type: 'fixed', value: 10000, min_spend: 50000, quota: 200, used: 115, is_active: true },
    { id: 3, code: 'PELANGGANBARU', type: 'percentage', value: 15, min_spend: 40000, quota: 500, used: 88, is_active: true }
  ]);

  // Mock Customers Data
  const customers = [
    { id: 1, name: 'Budi Santoso', email: 'budi@gmail.com', phone: '085814420843', total_orders: 14, is_pelanggan_setia: true, joined: 'Mei 2026' },
    { id: 2, name: 'Siti Rahmawati', email: 'siti.r@gmail.com', phone: '081298765432', total_orders: 8, is_pelanggan_setia: false, joined: 'Juli 2026' },
    { id: 3, name: 'Ahmad Fauzi', email: 'ahmadf@gmail.com', phone: '081344556677', total_orders: 19, is_pelanggan_setia: true, joined: 'Maret 2026' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', phone: '081788990011', total_orders: 5, is_pelanggan_setia: false, joined: 'Agustus 2026' }
  ];

  // Mock Contact Messages
  const [messages, setMessages] = useState([
    { id: 1, name: 'Hendra Gunawan', email: 'hendra@gmail.com', phone: '081211223344', message: 'Apakah bisa supply rutin sayuran segar untuk restoran kami setiap hari Senin & Kamis?', date: '30 Sep 2026', is_read: false },
    { id: 2, name: 'Maya Putri', email: 'maya@gmail.com', phone: '085699887766', message: 'Sayuran yang kemarin dikirim segar sekali! Terima kasih WiwikSayur!', date: '29 Sep 2026', is_read: true }
  ]);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    name: 'Wiwik Sayur Store',
    tagline: 'Menyediakan Sayuran & Buah Fresh',
    address: 'Jl. Fatmawati Raya No. 45, Cilandak, Jakarta Selatan',
    lat: -6.2088,
    lng: 106.8456,
    phone: '085814420843',
    email: 'halo@wiwiksayur.id',
    base_fee: 8000,
    base_km: 2,
    per_km_fee: 2500
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Dibayar</Badge>;
      case 'processing':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Diproses</Badge>;
      case 'shipping':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Dikirim</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Menunggu Bayar</Badge>;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const filteredOrders = orderStatusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === orderStatusFilter);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Modern */}
      <div className="w-64 bg-emerald-950 text-white flex flex-col justify-between shadow-xl">
        <div>
          <div className="p-6 border-b border-emerald-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-xl shadow-md">
                🥬
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-tight">WiwikSayur</h2>
                <p className="text-xs text-emerald-300 font-medium">Panel Administrator</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-1.5 px-4">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', name: 'Kelola Produk', icon: ShoppingBag, count: products.length },
              { id: 'orders', name: 'Daftar Pesanan', icon: PackageCheck, count: orders.length },
              { id: 'vouchers', name: 'Voucher Promosi', icon: Ticket, count: vouchers.length },
              { id: 'customers', name: 'Data Pelanggan', icon: Users, count: customers.length },
              { id: 'messages', name: 'Pesan Masuk', icon: MessageSquare, unread: messages.filter(m => !m.is_read).length },
              { id: 'settings', name: 'Pengaturan Toko', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                      : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.unread > 0 && (
                    <span className="bg-amber-400 text-amber-950 text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.unread}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-xs text-emerald-300/60 font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-emerald-900/60 text-xs text-emerald-300/80">
          <p className="font-semibold text-white">WiwikSayur.id v1.2</p>
          <p className="text-[11px] text-emerald-400">Toko Sayuran & Buah Segar</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === 'dashboard' && 'Ringkasan Toko & Penjualan'}
              {activeTab === 'products' && 'Manajemen Katalog Produk'}
              {activeTab === 'orders' && 'Manajemen Pesanan Masuk'}
              {activeTab === 'vouchers' && 'Manajemen Voucher & Promo'}
              {activeTab === 'customers' && 'Database Pelanggan'}
              {activeTab === 'messages' && 'Pesan Kontak Masuk'}
              {activeTab === 'settings' && 'Pengaturan Toko & Lokasi Google Maps'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Slogan: &quot;Menyediakan Sayuran & Buah Fresh&quot;
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif
            </span>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800">Admin Utama</p>
                <p className="text-slate-500">admin@wiwiksayur.id</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-8 space-y-6 flex-1">
          {/* ================= TAB 1: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <Card className="border-slate-200/80 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendapatan</p>
                    <p className="text-2xl font-extrabold text-emerald-700 mt-2 font-mono">Rp 43.500.000</p>
                    <span className="inline-block mt-2 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      ↑ +18.4% minggu ini
                    </span>
                  </CardContent>
                </Card>
                <Card className="border-slate-200/80 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pesanan</p>
                    <p className="text-2xl font-extrabold text-slate-800 mt-2 font-mono">{orders.length + 328}</p>
                    <span className="inline-block mt-2 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      3 pesanan aktif hari ini
                    </span>
                  </CardContent>
                </Card>
                <Card className="border-slate-200/80 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Katalog Produk</p>
                    <p className="text-2xl font-extrabold text-slate-800 mt-2 font-mono">{products.length} Item</p>
                    <span className="inline-block mt-2 text-xs text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      Sayuran & Buah Fresh
                    </span>
                  </CardContent>
                </Card>
                <Card className="border-slate-200/80 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan Terdaftar</p>
                    <p className="text-2xl font-extrabold text-slate-800 mt-2 font-mono">{customers.length + 185}</p>
                    <span className="inline-block mt-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                      ★ 42 Pelanggan Setia
                    </span>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800">Tren Penjualan 7 Hari Terakhir</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">Grafik omset harian pesanan sayuran & buah fresh</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-emerald-700 bg-emerald-50">
                      Rata-rata: Rp 6.2jt / hari
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `Rp ${(val/1000000).toFixed(1)}jt`} />
                        <Tooltip 
                          formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omset']} 
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders Preview */}
              <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-800">Pesanan Masuk Terbaru</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-emerald-700 font-semibold text-xs">
                    Lihat Semua Pesanan →
                  </Button>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-3.5">ID Pesanan</th>
                        <th className="px-6 py-3.5">Pelanggan</th>
                        <th className="px-6 py-3.5">Total Belanja</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5">Tanggal</th>
                        <th className="px-6 py-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 3).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-emerald-800 text-xs">{ord.id}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800">{ord.customer}</p>
                            <p className="text-xs text-slate-500">{ord.phone}</p>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">
                            Rp {ord.total.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(ord.status)}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{ord.date}</td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => { setSelectedOrder(ord); setActiveTab('orders'); }}
                              className="text-xs"
                            >
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ================= TAB 2: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-9 bg-white" 
                    placeholder="Cari sayur, buah, atau bumbu..." 
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => setShowAddProductModal(true)} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm"
                >
                  <Plus className="h-4 w-4" /> Tambah Produk Baru
                </Button>
              </div>

              <Card className="border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5">Produk</th>
                        <th className="px-6 py-3.5">Kategori</th>
                        <th className="px-6 py-3.5">Harga</th>
                        <th className="px-6 py-3.5">Satuan</th>
                        <th className="px-6 py-3.5">Stok</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img 
                              src={p.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100'} 
                              alt={p.name} 
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-semibold text-slate-900">{p.name}</p>
                              <p className="text-xs text-slate-400 line-clamp-1">{p.description || 'Sayuran & Buah Segar'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium text-xs">
                              {p.category}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                            Rp {Number(p.price).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-xs font-mono">{p.unit}</td>
                          <td className="px-6 py-4">
                            <span className={`font-mono text-xs px-2 py-1 rounded font-bold ${p.stock > 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Aktif
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                              <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ================= TAB 3: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Status Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {[
                  { id: 'all', label: 'Semua Status' },
                  { id: 'pending', label: 'Menunggu Bayar' },
                  { id: 'paid', label: 'Sudah Dibayar' },
                  { id: 'processing', label: 'Sedang Diproses' },
                  { id: 'shipping', label: 'Dalam Pengiriman' },
                  { id: 'completed', label: 'Selesai' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setOrderStatusFilter(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      orderStatusFilter === s.id 
                        ? 'bg-emerald-700 text-white shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <Card className="border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5">ID & Waktu</th>
                        <th className="px-6 py-3.5">Pelanggan</th>
                        <th className="px-6 py-3.5">Detail Item</th>
                        <th className="px-6 py-3.5">Total Bayar</th>
                        <th className="px-6 py-3.5">Status Pesanan</th>
                        <th className="px-6 py-3.5">Ubah Status</th>
                        <th className="px-6 py-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/60">
                          <td className="px-6 py-4">
                            <p className="font-mono font-bold text-emerald-800 text-xs">{ord.id}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{ord.date}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{ord.customer}</p>
                            <p className="text-xs text-slate-500">{ord.phone}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px] mt-0.5">{ord.address}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-slate-700 space-y-0.5">
                              {ord.items.map((it, idx) => (
                                <div key={idx}>• {it.name} ({it.qty}x)</div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">
                            Rp {ord.total.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(ord.status)}</td>
                          <td className="px-6 py-4">
                            <select 
                              value={ord.status} 
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded-md p-1.5 bg-slate-50 font-medium focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="pending">Menunggu Bayar</option>
                              <option value="paid">Dibayar</option>
                              <option value="processing">Diproses</option>
                              <option value="shipping">Dikirim</option>
                              <option value="completed">Selesai</option>
                              <option value="cancelled">Dibatalkan</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedOrder(ord)} 
                              className="h-8 px-2.5 text-xs"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> Rincian
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ================= TAB 4: VOUCHERS ================= */}
          {activeTab === 'vouchers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Buat kode promo & diskon untuk memikat pembeli baru dan pelanggan setia.</p>
                <Button 
                  onClick={() => setShowAddVoucherModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Tambah Voucher
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vouchers.map((v) => (
                  <Card key={v.id} className="border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-lg font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                          {v.code}
                        </span>
                        <Badge className={v.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}>
                          {v.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p className="font-medium text-slate-800">
                          Diskon: <span className="font-bold text-emerald-700">{v.type === 'percentage' ? `${v.value}%` : `Rp ${v.value.toLocaleString('id-ID')}`}</span>
                        </p>
                        <p>Minimal Belanja: Rp {v.min_spend.toLocaleString('id-ID')}</p>
                        <p>Penggunaan: {v.used} / {v.quota} kupon</p>
                      </div>

                      {/* Progress Bar Kuota */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full" 
                          style={{ width: `${(v.used / v.quota) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: CUSTOMERS ================= */}
          {activeTab === 'customers' && (
            <Card className="border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Nama Pelanggan</th>
                      <th className="px-6 py-3.5">Kontak</th>
                      <th className="px-6 py-3.5">Total Pesanan</th>
                      <th className="px-6 py-3.5">Status Loyalti</th>
                      <th className="px-6 py-3.5">Bergabung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                        <td className="px-6 py-4 text-xs">
                          <p className="text-slate-800">{c.email}</p>
                          <p className="text-slate-500 font-mono mt-0.5">{c.phone}</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">
                          {c.total_orders} kali
                        </td>
                        <td className="px-6 py-4">
                          {c.is_pelanggan_setia ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200">
                              ★ Pelanggan Setia (≥10 Order)
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                              Pelanggan Reguler
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">{c.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ================= TAB 6: MESSAGES ================= */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.map((m) => (
                <Card key={m.id} className={`border-slate-200/80 shadow-sm ${!m.is_read ? 'bg-emerald-50/20 border-l-4 border-l-emerald-600' : 'bg-white'}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{m.name}</h4>
                        <p className="text-xs text-slate-500">{m.email} • {m.phone}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{m.date}</span>
                    </div>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-3">
                      &quot;{m.message}&quot;
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        Balas via WhatsApp
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs text-slate-500">
                        Tandai Selesai
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ================= TAB 7: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-800">Informasi Toko WiwikSayur</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Nama Toko</label>
                    <Input className="mt-1" value={storeSettings.name} onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Slogan / Tagline</label>
                    <Input className="mt-1" value={storeSettings.tagline} onChange={(e) => setStoreSettings({...storeSettings, tagline: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Alamat Lengkap Toko</label>
                    <Input className="mt-1" value={storeSettings.address} onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Latitude Toko</label>
                      <Input className="mt-1 font-mono" value={storeSettings.lat} onChange={(e) => setStoreSettings({...storeSettings, lat: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Longitude Toko</label>
                      <Input className="mt-1 font-mono" value={storeSettings.lng} onChange={(e) => setStoreSettings({...storeSettings, lng: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                      Simpan Pengaturan Toko
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-800">Titik Toko di Google Maps</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                    <GoogleMapComponent 
                      center={{ lat: storeSettings.lat, lng: storeSettings.lng }} 
                      markers={[{ lat: storeSettings.lat, lng: storeSettings.lng }]} 
                    />
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-800 space-y-1">
                    <p className="font-bold">Ketentuan Ongkos Kirim Terhubung:</p>
                    <p>• Dasar: Rp {storeSettings.base_fee.toLocaleString('id-ID')} untuk {storeSettings.base_km} km pertama</p>
                    <p>• Tambahan: Rp {storeSettings.per_km_fee.toLocaleString('id-ID')} / km berikutnya</p>
                    <p>• Gratis Ongkir Otomatis sesuai tier belanja belanja (Rp 200rb, 300rb, 400rb, 1jt)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: DETAIL PESANAN */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Rincian {selectedOrder.id}</h3>
                <p className="text-xs text-slate-500">{selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-slate-800">Penerima: {selectedOrder.customer} ({selectedOrder.phone})</p>
                <p className="text-slate-600">{selectedOrder.address}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Item Belanja:</p>
                <div className="divide-y divide-slate-100 text-xs">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <span>{it.name} x{it.qty}</span>
                      <span className="font-mono font-semibold">Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span>Rp {selectedOrder.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ongkir:</span>
                  <span>Rp {selectedOrder.delivery_fee.toLocaleString('id-ID')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Voucher:</span>
                    <span>- Rp {selectedOrder.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t">
                  <span>Total Bayar:</span>
                  <span className="text-emerald-700">Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setSelectedOrder(null)} className="w-full bg-slate-900 text-white">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
