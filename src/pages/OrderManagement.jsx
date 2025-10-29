// src/pages/OrderManagement.jsx (Refactored - Complete Code)
import React, { useState, useMemo } from 'react'; //
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import DeleteConfirmModal from '../components/DeleteConfirmModal'; // Import modal hapus
import OrderFormModal from '../components/OrderFormModal'; // Import modal form order
import { MdAdd, MdExpandMore } from 'react-icons/md'; //

const OrderManagement = () => {
  const { database, addOrder, updateOrder, deleteOrder } = useInventoryContext(); // Ambil data dan fungsi
  const { showToast } = useToastContext(); // Ambil fungsi toast

  // State Management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // State modal form
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State modal hapus
  const [selectedOrder, setSelectedOrder] = useState(null); // Order yang dipilih untuk edit/hapus
  const [filterStatus, setFilterStatus] = useState(''); // State filter status
  const [filterTipe, setFilterTipe] = useState(''); // State filter tipe
  const [filterTglAwal, setFilterTglAwal] = useState(''); // State filter tanggal awal
  const [filterTglAkhir, setFilterTglAkhir] = useState(''); // State filter tanggal akhir

  // --- Handlers Modal ---
  const handleOpenAddModal = () => {
    setSelectedOrder(null); // Mode tambah
    setIsFormModalOpen(true);
  }; //

  const handleOpenEditModal = (order) => {
    setSelectedOrder(order); // Mode edit
    setIsFormModalOpen(true);
  }; //

  const handleOpenDeleteModal = (order) => {
    setSelectedOrder(order); // Siapkan untuk dihapus
    setIsDeleteModalOpen(true);
  }; //

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedOrder(null); // Reset pilihan
  }; //

  // --- Handlers CRUD ---
  const handleFormSubmit = (formData) => {
    if (selectedOrder) { // Cek apakah ada ID (mode edit)
      updateOrder({ ...selectedOrder, ...formData }); // Panggil fungsi update
      showToast('Order berhasil diperbarui.', 'success');
    } else {
      addOrder(formData); // Panggil fungsi tambah
      showToast('Order baru berhasil dibuat.', 'success');
    }
    handleCloseModals(); // Tutup modal setelah submit
  }; //

  const handleDeleteConfirm = () => {
    if (selectedOrder) {
      deleteOrder(selectedOrder.id); // Panggil fungsi hapus
      showToast(`Order "${selectedOrder.orderId}" telah dihapus.`, 'success');
      handleCloseModals(); // Tutup modal
    }
  }; //

  // --- Logika Filter (useMemo) ---
  const filteredOrders = useMemo(() => {
    // Pastikan database.orders ada
    if (!database?.orders) return [];
    return database.orders
      .filter(o => filterStatus ? o.status === filterStatus : true) // Filter status
      .filter(o => filterTipe ? o.tipe === filterTipe : true) // Filter tipe
      .filter(o => { // Filter tanggal awal
        if (!filterTglAwal) return true;
        try {
          return new Date(o.tanggal) >= new Date(filterTglAwal);
        } catch (e) { return true; } // Abaikan jika tanggal tidak valid
      })
      .filter(o => { // Filter tanggal akhir
        if (!filterTglAkhir) return true;
        try {
          // Tambah 1 hari ke tgl akhir agar inklusif
          const tglAkhirPlusSatu = new Date(filterTglAkhir);
          tglAkhirPlusSatu.setDate(tglAkhirPlusSatu.getDate() + 1);
          return new Date(o.tanggal) < tglAkhirPlusSatu;
        } catch (e) { return true; }
      })
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Urutkan terbaru di atas
  }, [database?.orders, filterStatus, filterTipe, filterTglAwal, filterTglAkhir]); // Dependencies

  // --- Helper Badge Status (Refactored Semantik) ---
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning-soft text-warning dark:bg-warning-soft/20';
      // Asumsi ada warna 'info' atau gunakan 'blue' jika tidak ada
      case 'Processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Shipped': return 'bg-success-soft text-success dark:bg-success-soft/20';
      case 'Delivered': return 'bg-success-soft text-success dark:bg-success-soft/20';
      case 'Cancelled': return 'bg-danger-soft text-danger dark:bg-danger-soft/20';
      default: return 'bg-border-light text-text-secondary dark:bg-border-dark dark:text-text-secondary-light';
    }
  }; //

  return (
    // Container layout diatur oleh Layout.jsx
    <div className="flex flex-col max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-6">
         {/* Teks Header Semantik */}
        <p className="text-text-dark dark:text-text-light text-4xl font-black">Order Management</p>
         {/* Tombol Tambah Semantik */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
        >
          <MdAdd size={20} />
          Create New Order
        </button>
      </div>

      {/* Filter Bar Semantik */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 px-6 py-3 border-y border-border dark:border-border-dark bg-card dark:bg-card-dark">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Filter Status Semantik */}
          <div className="relative">
            <select onChange={e => setFilterStatus(e.target.value)} value={filterStatus} className="appearance-none bg-input dark:bg-input-dark border border-border dark:border-border-dark text-text-dark dark:text-text-light text-sm rounded-lg block w-full lg:w-auto p-2.5 pr-8 focus:ring-primary focus:border-primary">
              <option value="">Filter by Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <MdExpandMore className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary dark:text-text-secondary-light" />
          </div>
          {/* Filter Tipe Semantik */}
          <div className="relative">
            <select onChange={e => setFilterTipe(e.target.value)} value={filterTipe} className="appearance-none bg-input dark:bg-input-dark border border-border dark:border-border-dark text-text-dark dark:text-text-light text-sm rounded-lg block w-full lg:w-auto p-2.5 pr-8 focus:ring-primary focus:border-primary">
              <option value="">Filter by Type</option>
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
            </select>
            <MdExpandMore className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary dark:text-text-secondary-light" />
          </div>
          {/* Filter Tanggal Semantik */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input type="date" value={filterTglAwal} onChange={e => setFilterTglAwal(e.target.value)} className="bg-input dark:bg-input-dark border border-border dark:border-border-dark text-text-secondary dark:text-text-secondary-light text-sm rounded-lg block w-full p-2 focus:ring-primary focus:border-primary" placeholder="Dari tanggal"/>
            <span className="text-text-secondary dark:text-text-secondary-light hidden sm:inline">-</span>
            <input type="date" value={filterTglAkhir} onChange={e => setFilterTglAkhir(e.target.value)} className="bg-input dark:bg-input-dark border border-border dark:border-border-dark text-text-secondary dark:text-text-secondary-light text-sm rounded-lg block w-full p-2 focus:ring-primary focus:border-primary" placeholder="Sampai tanggal"/>
          </div>
        </div>
        {/* Tambahkan tombol reset filter jika perlu */}
        {/* <button onClick={() => { setFilterStatus(''); setFilterTipe(''); setFilterTglAwal(''); setFilterTglAkhir(''); }} className="text-sm text-primary hover:underline">Reset Filter</button> */}
      </div>

      {/* Tabel Order */}
      <div className="px-6 py-3">
         {/* Container Tabel Semantik */}
        <div className="flex overflow-hidden rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark">
          <div className="overflow-x-auto w-full"> {/* Pastikan bisa scroll */}
            <table className="min-w-full text-left">
               {/* Header Tabel Semantik */}
              <thead className="border-b border-border dark:border-border-dark bg-background-light dark:bg-background-dark/50">
                <tr>
                   {/* Kolom Header Semantik */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Total Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
               {/* Body Tabel Semantik */}
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredOrders.map((o) => (
                   // Hover Baris Semantik
                  <tr key={o.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                     {/* Kolom Teks Semantik */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary hover:underline cursor-pointer">{o.orderId}</td> {/* Bisa dibuat link detail */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">{new Date(o.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">{o.tipe}</td>
                    {/* Kolom Status dengan Badge */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">{o.kuantitas}</td>
                     {/* Kolom Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       {/* Tombol Aksi Semantik */}
                      <button onClick={() => handleOpenEditModal(o)} className="text-primary hover:text-primary-hover mr-4 text-xs font-semibold uppercase">Update Status</button>
                      <button onClick={() => handleOpenDeleteModal(o)} className="text-danger hover:text-danger/80 text-xs font-semibold uppercase">Delete</button>
                    </td>
                  </tr>
                ))}
                 {/* Baris jika tidak ada hasil */}
                 {filteredOrders.length === 0 && (
                    <tr>
                        <td colSpan={6} className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                            Tidak ada order yang cocok dengan filter Anda.
                        </td>
                    </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals (Pastikan modal juga di-refactor) */}
      <OrderFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleFormSubmit}
        orderToEdit={selectedOrder}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        judul="Hapus Order?"
        pesan={`Anda yakin ingin menghapus order ${selectedOrder?.orderId}?`}
      />
    </div>
  );
}; //

export default OrderManagement; //