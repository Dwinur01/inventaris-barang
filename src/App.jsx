// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard'; 
import ItemList from './pages/ItemList';
import ItemForm from './pages/ItemForm';
import ImporBarang from './pages/ImporBarang';
import StokOpname from './pages/StokOpname';
import SupplierManagement from './pages/SupplierManagement';
import OrderManagement from './pages/OrderManagement';
import UserManagement from './pages/UserManagement';
import UserProfile from './pages/UserProfile';
import LogAktivitas from './pages/LogAktivitas';
import Pengaturan from './pages/Pengaturan';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ItemList />} /> 
        {/* Kita set ItemList sebagai halaman utama untuk saat ini */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tambah-barang" element={<ItemForm />} />
        <Route path="/edit-barang/:id" element={<ItemForm />} />
        <Route path="/impor-barang" element={<ImporBarang />} />
        <Route path="/stok-opname" element={<StokOpname />} />
        <Route path="/supplier" element={<SupplierManagement />} />
        <Route path="/order" element={<OrderManagement />} />
        <Route path="/user" element={<UserManagement />} />
        <Route path="/profil" element={<UserProfile />} />
        <Route path="/log-aktivitas" element={<LogAktivitas />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
        {/* Tambahkan 404 Not Found di sini jika perlu */}
      </Route>
    </Routes>
  );
}

export default App;