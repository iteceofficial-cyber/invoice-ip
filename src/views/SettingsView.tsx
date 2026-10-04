import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Building2,
  FileText,
  Palette,
  Save,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { apiRequest } from '../services/api.ts';
import { useToast } from '../context/ToastContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ChangePasswordView } from './ChangePasswordView.tsx';

interface CompanySettings {
  company_name: string;
  logo_url: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  bank_account_no: string;
  bank_name: string;
  bank_account_name: string;
}

interface InvoiceSettings {
  prefix: string;
  number_format: string;
  start_number: number;
  date_format: string;
  currency: string;
  default_tax_percent: number;
  default_discount: number;
  default_notes: string;
  signature_text: string;
  signer_name: string;
  signer_title: string;
  footer_text: string;
  primary_color: string;
  secondary_color: string;
  app_name: string;
  header_image_url: string;
  footer_image_url: string;
}

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role_name === 'Super Admin' || user?.role_id === 1;

  const [activeTab, setActiveTab] = useState<'company' | 'invoice' | 'branding' | 'kop_footer' | 'security'>('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState<CompanySettings>({
    company_name: '',
    logo_url: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    bank_account_no: '',
    bank_name: '',
    bank_account_name: '',
  });

  const [invoice, setInvoice] = useState<InvoiceSettings>({
    prefix: 'INV',
    number_format: 'INV/{YYYY}/{MM}/{NUMBER}',
    start_number: 1,
    date_format: 'DD/MM/YYYY',
    currency: 'IDR',
    default_tax_percent: 11,
    default_discount: 0,
    default_notes: '',
    signature_text: 'Hormat Kami,',
    signer_name: 'Mohamad Rizal',
    signer_title: 'Direktur Operasional Info Papandayan',
    footer_text: '',
    primary_color: '#136239',
    secondary_color: '#7ba892',
    app_name: 'Info Papandayan - Invoice & Logistik',
    header_image_url: '/invoice-header.svg',
    footer_image_url: '/invoice-footer.svg',
  });

  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const footerFileInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    setLoading(true);
    const compRes = await apiRequest('/api/settings/company');
    if (compRes.success && compRes.data) {
      setCompany(compRes.data);
    }

    const invRes = await apiRequest('/api/settings/invoice');
    if (invRes.success && invRes.data) {
      setInvoice({
        ...invRes.data,
        header_image_url: invRes.data.header_image_url || '/invoice-header.svg',
        footer_image_url: invRes.data.footer_image_url || '/invoice-footer.svg',
        primary_color: invRes.data.primary_color || '#136239',
        secondary_color: invRes.data.secondary_color || '#7ba892',
      });
    }
    setLoading(false);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await apiRequest('/api/settings/company', {
      method: 'PUT',
      body: JSON.stringify(company),
    });
    setSaving(false);

    if (res.success) {
      toast.success('Pengaturan profil perusahaan Info Papandayan berhasil disimpan!');
    } else {
      toast.error(res.message || 'Gagal menyimpan profil perusahaan');
    }
  };

  const handleSaveInvoiceSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await apiRequest('/api/settings/invoice', {
      method: 'PUT',
      body: JSON.stringify(invoice),
    });
    setSaving(false);

    if (res.success) {
      toast.success('Pengaturan invoice dan tampilan berhasil disimpan!');
    } else {
      toast.error(res.message || 'Gagal menyimpan pengaturan');
    }
  };

  const handleHeaderFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang dapat mengganti Header Invoice');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setInvoice((prev) => ({ ...prev, header_image_url: reader.result as string }));
        toast.success('Gambar Header berhasil diunggah! Klik "Simpan Perubahan" di bawah.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFooterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang dapat mengganti Footer Invoice');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setInvoice((prev) => ({ ...prev, footer_image_url: reader.result as string }));
        toast.success('Gambar Footer berhasil diunggah! Klik "Simpan Perubahan" di bawah.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetHeaderDefault = () => {
    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang dapat mereset Header Invoice');
      return;
    }
    setInvoice((prev) => ({ ...prev, header_image_url: '/invoice-header.svg' }));
    toast.info('Header dikembalikan ke banner resmi Info Papandayan default.');
  };

  const handleResetFooterDefault = () => {
    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang dapat mereset Footer Invoice');
      return;
    }
    setInvoice((prev) => ({ ...prev, footer_image_url: '/invoice-footer.svg' }));
    toast.info('Footer dikembalikan ke banner resmi Info Papandayan default.');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-xl" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Sistem & Branding Info Papandayan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ubah informasi bisnis perusahaan, format nomor faktur, kop surat (header), dan footer tanpa menyentuh source code
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'company'
              ? 'border-[#136239] text-[#136239]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Profil & Rekening Usaha</span>
        </button>

        <button
          onClick={() => setActiveTab('invoice')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'invoice'
              ? 'border-[#136239] text-[#136239]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Format & Penomoran Invoice</span>
        </button>

        <button
          onClick={() => setActiveTab('kop_footer')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'kop_footer'
              ? 'border-[#136239] text-[#136239]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Kop Header & Footer Invoice</span>
          {isSuperAdmin && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-[#136239] font-extrabold uppercase">
              Super Admin
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'branding'
              ? 'border-[#136239] text-[#136239]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Warna & Penandatangan</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-[#136239] text-[#136239]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Ganti Password</span>
        </button>
      </div>

      {/* TAB 1: Company Profile & Bank */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Identitas Usaha & Kontak Resmi</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data ini tampil pada dokumen faktur, rincian kontak klien, dan tagihan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Perusahaan / Organisasi *
              </label>
              <input
                type="text"
                value={company.company_name}
                onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
                placeholder="Contoh: Info Papandayan"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:ring-2 focus:ring-[#136239] focus:bg-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Kantor Lengkap
              </label>
              <textarea
                rows={2}
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                placeholder="Alamat kantor resmi..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                placeholder="+62 822-4063-0123 / +62 813-2127-3552"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Perusahaan
              </label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                placeholder="info@infopapandayan.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Website / Tautan Resmi
              </label>
              <input
                type="text"
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                placeholder="https://infopapandayan.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239] focus:bg-white"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#136239]" />
              <h4 className="text-sm font-bold text-slate-900">Rekening Tujuan Pembayaran Resmi</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  value={company.bank_name}
                  onChange={(e) => setCompany({ ...company, bank_name: e.target.value })}
                  placeholder="Bank Mandiri KCP Garut"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:ring-2 focus:ring-[#136239] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  value={company.bank_account_no}
                  onChange={(e) => setCompany({ ...company, bank_account_no: e.target.value })}
                  placeholder="131-00-1849201-8"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-sm focus:ring-2 focus:ring-[#136239] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Atas Nama Rekening
                </label>
                <input
                  type="text"
                  value={company.bank_account_name}
                  onChange={(e) => setCompany({ ...company, bank_account_name: e.target.value })}
                  placeholder="Info Papandayan / Mohamad Rizal"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#136239] hover:bg-[#0f4d2d] text-white text-xs font-bold shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Profil Perusahaan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Invoice Format */}
      {activeTab === 'invoice' && (
        <form onSubmit={handleSaveInvoiceSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Format & Penomoran Otomatis Invoice</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan pola nomor faktur, persentase pajak default, dan syarat ketentuan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Prefix Invoice
              </label>
              <input
                type="text"
                value={invoice.prefix}
                onChange={(e) => setInvoice({ ...invoice, prefix: e.target.value })}
                placeholder="INV"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm uppercase focus:ring-2 focus:ring-[#136239]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pola / Format Nomor Faktur
              </label>
              <input
                type="text"
                value={invoice.number_format}
                onChange={(e) => setInvoice({ ...invoice, number_format: e.target.value })}
                placeholder="INV/{YYYY}/{MM}/{NUMBER}"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm focus:ring-2 focus:ring-[#136239]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Placeholder tersedia: <code>{'{YYYY}'}</code> (Tahun), <code>{'{MM}'}</code> (Bulan), <code>{'{DD}'}</code> (Hari), <code>{'{NUMBER}'}</code> (Urutan 4 digit)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Awal / Counter
              </label>
              <input
                type="number"
                min="1"
                value={invoice.start_number}
                onChange={(e) => setInvoice({ ...invoice, start_number: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mata Uang
              </label>
              <input
                type="text"
                value={invoice.currency}
                onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
                placeholder="IDR (Rp)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:ring-2 focus:ring-[#136239]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Default PPN / Pajak (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={invoice.default_tax_percent}
                onChange={(e) => setInvoice({ ...invoice, default_tax_percent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:ring-2 focus:ring-[#136239]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Catatan & Syarat Default Invoice
            </label>
            <textarea
              rows={4}
              value={invoice.default_notes}
              onChange={(e) => setInvoice({ ...invoice, default_notes: e.target.value })}
              placeholder="Contoh instruksi pembayaran default..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#136239] hover:bg-[#0f4d2d] text-white text-xs font-bold shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Format Invoice'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Kop Header & Footer Invoice (Super Admin Customization) */}
      {activeTab === 'kop_footer' && (
        <form onSubmit={handleSaveInvoiceSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Kop Surat (Header) & Footer Invoice Resmi</h3>
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#136239]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Akses Super Admin Terbuka
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    <Lock className="w-3.5 h-3.5" />
                    Hanya Super Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kop Header dan Footer banner ini otomatis disematkan pada seluruh faktur digital pratinjau dan unduhan PDF cetak A4.
              </p>
            </div>
          </div>

          {!isSuperAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Mode Hanya Baca (Read-Only)</p>
                <p className="mt-0.5 text-amber-700">
                  Anda login sebagai akun Admin biasa. Fitur penggantian gambar Kop Header dan Footer dokumen resmi dilindungi dan hanya dapat diubah oleh Super Admin.
                </p>
              </div>
            </div>
          )}

          {/* 1. Header Banner Management */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  1. Gambar Banner Kop Surat (Header Invoice)
                </label>
                <p className="text-[11px] text-slate-500">
                  Rasio ideal 1200 x 310 px (PNG, SVG, atau JPG). Menampilkan logo Info Papandayan, kontak, dan label INVOICE.
                </p>
              </div>

              {isSuperAdmin && (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={headerFileInputRef}
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    className="hidden"
                    onChange={handleHeaderFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => headerFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#136239] text-xs font-bold border border-emerald-300 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetHeaderDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                    title="Kembalikan ke Header Info Papandayan asli"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>
              )}
            </div>

            {/* Live Preview Box of Header */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 p-2 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 block mb-1">
                Tampilan Pratinjau Header Saat Ini:
              </span>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <img
                  src={invoice.header_image_url}
                  alt="Invoice Header Preview"
                  className="w-full h-auto max-h-36 object-contain block mx-auto"
                />
              </div>
            </div>

            {isSuperAdmin && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Atau masukkan URL gambar / path langsung:
                </label>
                <input
                  type="text"
                  value={invoice.header_image_url}
                  onChange={(e) => setInvoice({ ...invoice, header_image_url: e.target.value })}
                  placeholder="/invoice-header.svg"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-[#136239]"
                />
              </div>
            )}
          </div>

          {/* 2. Footer Banner Management */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  2. Gambar Banner Footer & Tanda Tangan (Footer Invoice)
                </label>
                <p className="text-[11px] text-slate-500">
                  Rasio ideal 1200 x 310 px (PNG, SVG, atau JPG). Menampilkan ornamen garis, tanda tangan Mohamad Rizal, dan legalitas.
                </p>
              </div>

              {isSuperAdmin && (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={footerFileInputRef}
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    className="hidden"
                    onChange={handleFooterFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => footerFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#136239] text-xs font-bold border border-emerald-300 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Footer Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFooterDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                    title="Kembalikan ke Footer Info Papandayan asli"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>
              )}
            </div>

            {/* Live Preview Box of Footer */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 p-2 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 block mb-1">
                Tampilan Pratinjau Footer Saat Ini:
              </span>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <img
                  src={invoice.footer_image_url}
                  alt="Invoice Footer Preview"
                  className="w-full h-auto max-h-36 object-contain block mx-auto"
                />
              </div>
            </div>

            {isSuperAdmin && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Atau masukkan URL gambar / path langsung:
                </label>
                <input
                  type="text"
                  value={invoice.footer_image_url}
                  onChange={(e) => setInvoice({ ...invoice, footer_image_url: e.target.value })}
                  placeholder="/invoice-footer.svg"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-[#136239]"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving || !isSuperAdmin}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#136239] hover:bg-[#0f4d2d] text-white text-xs font-bold shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Kop & Footer Dokumen'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Branding & Colors */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveInvoiceSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Warna Identitas & Penandatangan Dokumen</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur nama aplikasi di navigasi, warna tema sesuai logo, dan pejabat penandatangan resmi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Aplikasi di Navigasi
              </label>
              <input
                type="text"
                value={invoice.app_name}
                onChange={(e) => setInvoice({ ...invoice, app_name: e.target.value })}
                placeholder="Info Papandayan - Invoice & Logistik"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-[#136239]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Warna Utama (Primary Color)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={invoice.primary_color}
                  onChange={(e) => setInvoice({ ...invoice, primary_color: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={invoice.primary_color}
                  onChange={(e) => setInvoice({ ...invoice, primary_color: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Warna Sekunder (Aksen Sage)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={invoice.secondary_color}
                  onChange={(e) => setInvoice({ ...invoice, secondary_color: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={invoice.secondary_color}
                  onChange={(e) => setInvoice({ ...invoice, secondary_color: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Teks Pembuka Tanda Tangan
              </label>
              <input
                type="text"
                value={invoice.signature_text}
                onChange={(e) => setInvoice({ ...invoice, signature_text: e.target.value })}
                placeholder="Hormat Kami,"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Lengkap Penandatangan
              </label>
              <input
                type="text"
                value={invoice.signer_name}
                onChange={(e) => setInvoice({ ...invoice, signer_name: e.target.value })}
                placeholder="Mohamad Rizal"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-[#136239]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Jabatan Penandatangan
              </label>
              <input
                type="text"
                value={invoice.signer_title}
                onChange={(e) => setInvoice({ ...invoice, signer_title: e.target.value })}
                placeholder="Direktur Operasional Info Papandayan"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Catatan Kaki Footer Invoice
              </label>
              <input
                type="text"
                value={invoice.footer_text}
                onChange={(e) => setInvoice({ ...invoice, footer_text: e.target.value })}
                placeholder="Invoice ini diterbitkan secara sah dan diakui sebagai dokumen komersial resmi."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#136239]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#136239] hover:bg-[#0f4d2d] text-white text-xs font-bold shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Tampilan & Tanda Tangan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: Security / Change Password */}
      {activeTab === 'security' && (
        <div className="bg-transparent">
          <ChangePasswordView />
        </div>
      )}
    </div>
  );
};
