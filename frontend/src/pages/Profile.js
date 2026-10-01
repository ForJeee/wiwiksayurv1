import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatRupiah } from '../lib/utils';
import { LogOut, Package, User } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  // Mock orders
  const orders = [
    { id: 'ORD-001', date: '2023-11-20', total: 150000, status: 'Selesai' },
    { id: 'ORD-002', date: '2023-11-25', total: 85000, status: 'Dikirim' },
  ];

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <Button variant="outline" className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Riwayat Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{order.id}</span>
                          <Badge variant={order.status === 'Selesai' ? 'default' : 'secondary'}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <p className="text-sm text-gray-500 mb-1">Total Belanja</p>
                        <p className="font-mono font-bold text-primary">{formatRupiah(order.total)}</p>
                        {order.status === 'Dikirim' && (
                          <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto" onClick={() => navigate(`/track/${order.id}`)}>
                            Lacak Pesanan
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Belum ada riwayat pesanan.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
