// src/pages/Dashboard.jsx (Refactored - Complete Code)
import React, { useMemo } from 'react';
import { useInventoryContext } from '../contexts/InventoryContext'; //
import { useNavigate } from 'react-router-dom'; //
import { useTheme } from '../contexts/ThemeContext'; // Import ThemeContext
import {
  MdPendingActions,
  MdProductionQuantityLimits,
  MdHistory,
  MdArchive,
  MdPayments,
  MdWarning,
  MdLocalShipping,
  MdAutorenew,
  MdAddShoppingCart,
  MdCheckCircle,
  MdInventory2
} from 'react-icons/md'; //
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'; //

// Helper format waktu (asumsikan definisinya ada di sini atau diimpor)
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(timestamp)) / 1000);
  if (seconds < 60) return `${Math.floor(seconds)} detik lalu`;
  let interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} jam lalu`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} menit lalu`;
  return `${Math.floor(seconds)} detik lalu`;
}; //

// Helper format mata uang (asumsikan definisinya ada di sini atau diimpor)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
}; //

// Data mock untuk grafik tren (tetap sama)
const mockTrendData = [
  { name: 'Jan', Stok: 3000 },
  { name: 'Feb', Stok: 4000 },
  { name: 'Mar', Stok: 2000 },
  { name: 'Apr', Stok: 1000 },
  { name: 'Mei', Stok: 6000 },
  { name: 'Jun', Stok: 5000 },
]; //

const Dashboard = () => {
  const { database } = useInventoryContext(); //
  const navigate = useNavigate(); //
  const { theme } = useTheme(); // Gunakan theme dari context

  // Tentukan warna tick chart berdasarkan theme
  const chartTickColor = theme === 'light' ? '#6B7280' : '#9CA3AF'; // Warna sekunder dari palet

  // Hitung Metrik
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    const ordersPending = database.orders.filter(
      o => o.status === 'Pending'
    ).length; //

    const lowStockItems = database.items.filter(
      i => Number(i.jumlah) <= 10
    ).length; //

    const recentShipments = database.orders.filter(
      o => o.status === 'Shipped'
    ).length; //

    const totalStock = database.items.reduce(
      (sum, item) => sum + Number(item.jumlah), 0
    ); //

    const inventoryValue = database.items.reduce(
      (sum, item) => sum + (Number(item.jumlah) * Number(item.hargaBeli)), 0
    ); //

    const outOfStock = database.items.filter(
      i => Number(i.jumlah) === 0
    ).length; //

    const todayShipments = database.orders.filter(
      o => o.status === 'Shipped' && o.tanggal === today
    ).length; //

    return {
      ordersPending,
      lowStockItems,
      recentShipments,
      totalStock,
      inventoryValue,
      outOfStock,
      todayShipments,
    };
  }, [database]); //

  // Ambil 5 log aktivitas terakhir
  const recentLogs = useMemo(() => {
    return database.logAktivitas.slice(0, 5);
  }, [database.logAktivitas]); //

  // Helper ikon log
  const getLogIcon = (pesan) => {
    const p = pesan.toLowerCase();
    if (p.includes('diperbarui') || p.includes('disesuaikan')) return <MdAutorenew />; //
    if (p.includes('ditambahkan') || p.includes('dibuat')) return <MdAddShoppingCart />; //
    if (p.includes('selesai')) return <MdCheckCircle />; //
    if (p.includes('dikirim')) return <MdLocalShipping />; //
    return <MdInventory2 />; //
  };

  return (
    // Container utama diatur oleh Layout.jsx
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        {/* Teks Header Semantik */}
        <p className="text-3xl font-bold text-text-dark dark:text-text-light">Dashboard</p>
      </div>

      {/* Top Cards */}
      <div className="p-4">
        {/* Latar Kartu Semantik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-card dark:bg-card-dark p-6 shadow-lg">
          {/* Card 1 */}
          <div className="flex items-center gap-4">
            {/* Latar Ikon Semantik */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft/20 text-primary">
              <MdPendingActions size={30} />
            </div>
            <div>
              {/* Teks Semantik */}
              <p className="text-text-secondary dark:text-text-secondary-light text-sm font-medium">Orders Pending</p>
              <p className="text-text-dark dark:text-text-light text-xl font-bold">{metrics.ordersPending}</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft/20 text-primary">
              <MdProductionQuantityLimits size={30} />
            </div>
            <div>
              <p className="text-text-secondary dark:text-text-secondary-light text-sm font-medium">Low Stock Items</p>
              <p className="text-text-dark dark:text-text-light text-xl font-bold">{metrics.lowStockItems}</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft/20 text-primary">
              <MdHistory size={30} />
            </div>
            <div>
              <p className="text-text-secondary dark:text-text-secondary-light text-sm font-medium">Recent Shipments</p>
              <p className="text-text-dark dark:text-text-light text-xl font-bold">{metrics.recentShipments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {/* Latar Kartu Semantik */}
        <div className="flex flex-col gap-4 rounded-xl bg-card dark:bg-card-dark p-6 shadow-lg">
          <MdArchive className="text-primary text-4xl" />
          {/* Teks Semantik */}
          <p className="text-text-secondary dark:text-text-secondary-light text-base font-medium">Total Stock</p>
          <p className="text-text-dark dark:text-text-light text-2xl font-bold">
            {new Intl.NumberFormat('id-ID').format(metrics.totalStock)}
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-xl bg-card dark:bg-card-dark p-6 shadow-lg">
          <MdPayments className="text-primary text-4xl" />
          <p className="text-text-secondary dark:text-text-secondary-light text-base font-medium">Inventory Value</p>
          <p className="text-text-dark dark:text-text-light text-2xl font-bold">
            {formatCurrency(metrics.inventoryValue)}
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-xl bg-card dark:bg-card-dark p-6 shadow-lg">
          {/* Bisa pakai text-warning */}
          <MdWarning className="text-primary text-4xl" />
          <p className="text-text-secondary dark:text-text-secondary-light text-base font-medium">Out of Stock</p>
          <p className="text-text-dark dark:text-text-light text-2xl font-bold">{metrics.outOfStock}</p>
        </div>
        <div className="flex flex-col gap-4 rounded-xl bg-card dark:bg-card-dark p-6 shadow-lg">
          <MdLocalShipping className="text-primary text-4xl" />
          <p className="text-text-secondary dark:text-text-secondary-light text-base font-medium">Today's Shipments</p>
          <p className="text-text-dark dark:text-text-light text-2xl font-bold">{metrics.todayShipments}</p>
        </div>
      </div>

      {/* Grafik & Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 mt-2">
        {/* Grafik Inventory Trend */}
        <div className="lg:col-span-2 flex flex-col gap-4 rounded-xl bg-card dark:bg-card-dark p-6 shadow-lg">
          <p className="text-text-dark dark:text-text-light text-lg font-bold">Inventory Trend</p>
          <p className="text-text-secondary dark:text-text-secondary-light text-base">Last 6 months (Mock Data)</p>
          <div className="w-full h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTrendData}>
                {/* Warna grid disesuaikan */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'light' ? '#E5E7EB' : '#4B5563'} strokeOpacity={0.5} />
                {/* Warna tick dinamis */}
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: chartTickColor, fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTickColor, fontSize: 12 }} />
                {/* Tooltip style dinamis */}
                <Tooltip
                  cursor={{ fill: theme === 'light' ? 'rgba(243, 244, 246, 0.5)' : 'rgba(55, 65, 81, 0.5)' }}
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#ffffff' : '#1F2937', // bg-card
                    borderColor: theme === 'light' ? '#E5E7EB' : '#4B5563', // border-border
                    borderRadius: '8px',
                    color: theme === 'light' ? '#111827' : '#F9FAFB' // text-text
                  }}
                  itemStyle={{ color: theme === 'light' ? '#111827' : '#F9FAFB' }}
                />
                <Bar dataKey="Stok" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 flex flex-col rounded-xl bg-card dark:bg-card-dark p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-text-dark dark:text-text-light text-lg font-bold">Recent Activity</p>
            <button
              onClick={() => navigate('/log-aktivitas')}
              className="text-primary text-sm font-medium hover:text-primary-hover"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 py-3 border-t border-border-light dark:border-border-dark">
                 {/* Latar Ikon Semantik */}
                <div className="text-primary flex items-center justify-center rounded-full bg-primary-soft dark:bg-primary-soft/20 shrink-0 size-10">
                  {getLogIcon(log.pesan)}
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                   {/* Teks Semantik */}
                  <p className="text-text-dark dark:text-text-light text-sm font-medium line-clamp-1">
                    {log.pesan}
                  </p>
                  <p className="text-text-secondary dark:text-text-secondary-light text-xs font-normal line-clamp-1">
                    {formatRelativeTime(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;