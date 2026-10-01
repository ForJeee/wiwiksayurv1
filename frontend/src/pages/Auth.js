import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login
    const mockUser = { id: 1, name: 'Pelanggan Setia', email: 'user@example.com', role: 'user' };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">WiwikSayur.id</CardTitle>
          <CardDescription>
            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Lengkap</label>
                <Input required type="text" placeholder="Masukkan nama" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email / No. HP</label>
              <Input required type="text" placeholder="Masukkan email atau no HP" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kata Sandi</label>
              <Input required type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">
              {isLogin ? 'Masuk' : 'Daftar'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500">
              {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
