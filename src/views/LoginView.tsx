import React, { useState } from 'react';
import { Building2, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Harap isi username/email dan password');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const res = await login(username.trim(), password);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message || 'Login gagal. Periksa kembali kredensial Anda');
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 mb-4 ring-8 ring-blue-500/10">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sistem Invoice & Logistik
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Masuk ke panel kendali manajemen bisnis & faktur
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: admin atau admin@invoicemanager.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Pilihan Akun Demo Cepat
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-blue-500/50 hover:bg-blue-950/30 text-left transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300">
                    Super Admin
                  </span>
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded font-medium">
                    Akses Penuh
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">admin / admin123</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('staff', 'staff123')}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-blue-500/50 hover:bg-blue-950/30 text-left transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300">
                    Staff Admin
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">
                    Operasional
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">staff / staff123</p>
              </button>
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-500" />
            Keamanan berbasis Session JWT & Password Hash Bcrypt
          </p>
        </div>
      </div>
    </div>
  );
};
