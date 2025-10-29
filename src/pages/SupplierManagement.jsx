// src/pages/SupplierManagement.jsx (Refactored - Complete Code)
import React, { useState, useMemo } from 'react'; // Impor useMemo
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import DeleteConfirmModal from '../components/DeleteConfirmModal'; // Import modal hapus
import SupplierFormModal from '../components/SupplierFormModal'; // Import modal form supplier
import { MdSearch, MdEdit, MdDelete, MdAdd } from 'react-icons/md'; //

const SupplierManagement = () => {
  const { database, addSupplier, updateSupplier, deleteSupplier } = useInventoryContext(); // Ambil data dan fungsi
  const { showToast } = useToastContext(); // Ambil fungsi toast

  // State Management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // State modal form
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State modal hapus
  const [selectedSupplier, setSelectedSupplier] = useState(null); // Supplier yang dipilih
  const [searchTerm, setSearchTerm] = useState(''); // State pencarian

  // --- Handlers Modal --- (Logika tidak berubah)
  const handleOpenAddModal = () => { setSelectedSupplier(null); setIsFormModalOpen(true); }; //
  const handleOpenEditModal = (supplier) => { setSelectedSupplier(supplier); setIsFormModalOpen(true); }; //
  const handleOpenDeleteModal = (supplier) => { setSelectedSupplier(supplier); setIsDeleteModalOpen(true); }; //
  const handleCloseModals = () => { setIsFormModalOpen(false); setIsDeleteModalOpen(false); setSelectedSupplier(null); }; //

  // --- Handlers CRUD --- (Logika tidak berubah)
  const handleFormSubmit = (formData) => {
    if (selectedSupplier) { // Cek jika mode edit (selectedSupplier ada)
      updateSupplier({ ...selectedSupplier, ...formData });
      showToast('Data supplier berhasil diperbarui.', 'success');
    } else {
      addSupplier(formData);
      showToast('Supplier baru berhasil ditambahkan.', 'success');
    }
    handleCloseModals();
  }; //

  const handleDeleteConfirm = () => {
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier.id);
      showToast(`Supplier "${selectedSupplier.namaSupplier}" telah dihapus.`, 'success');
      handleCloseModals();
    }
  }; //

  // --- Logika Filter (useMemo) ---
  const filteredSuppliers = useMemo(() => {
    // Pastikan database.suppliers ada
    if (!database?.suppliers) return [];
    const searchLower = searchTerm.toLowerCase();
    return database.suppliers.filter(s =>
        (s.namaSupplier?.toLowerCase() || '').includes(searchLower) || // Filter nama supplier
        (s.kontakPerson?.toLowerCase() || '').includes(searchLower) // Filter kontak person
    );
  }, [database?.suppliers, searchTerm]); // Dependencies

  // --- Helper Badge Status (Refactored Semantik) ---
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'bg-success-soft text-success dark:bg-success-soft/20';
      case 'Inactive': return 'bg-danger-soft text-danger dark:bg-danger-soft/20';
      case 'On Hold': return 'bg-warning-soft text-warning dark:bg-warning-soft/20';
      default: return 'bg-border-light text-text-secondary dark:bg-border-dark dark:text-text-secondary-light'; // Default badge
    }
  }; //

  return (
    // Container layout diatur oleh Layout.jsx
    <div className="flex flex-col max-w-7xl mx-auto"> {/* Max width bisa disesuaikan */}
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-4 mt-4">
         {/* Teks Header Semantik */}
        <p className="text-text-dark dark:text-text-light text-4xl font-black">Manage Suppliers</p>
         {/* Tombol Tambah Semantik */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
        >
          <MdAdd size={20} />
          <span className="truncate">Add New Supplier</span>
        </button>
      </div>

      {/* Search Bar Semantik */}
      <div className="px-4 py-3">
        <label className="relative flex items-center w-full">
          <MdSearch className="absolute left-4 text-text-secondary dark:text-text-secondary-light" size={20} />
          <input
            className="form-input w-full rounded-lg text-text-dark dark:text-text-light bg-input dark:bg-input-dark h-12 pl-12 pr-4 border border-border dark:border-border-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-light focus:ring-primary focus:border-primary text-sm"
            placeholder="Search by supplier name or contact person..." // Placeholder diperjelas
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {/* Tabel Supplier */}
      <div className="px-4 py-3">
         {/* Container Tabel Semantik */}
        <div className="flex overflow-hidden rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left"> {/* min-width */}
               {/* Header Tabel Semantik */}
              <thead className="bg-background-light dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
                <tr>
                   {/* Kolom Header Semantik */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Supplier Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Contact Person</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
               {/* Body Tabel Semantik */}
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredSuppliers.map((s) => (
                   // Hover Baris Semantik
                  <tr key={s.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                     {/* Kolom Teks Semantik */}
                    <td className="h-[72px] px-4 py-2 text-text-dark dark:text-text-light text-sm">{s.namaSupplier}</td>
                    <td className="h-[72px] px-4 py-2 text-text-secondary dark:text-text-secondary-light text-sm">{s.kontakPerson}</td>
                    <td className="h-[72px] px-4 py-2 text-text-secondary dark:text-text-secondary-light text-sm">{s.telepon || '-'}</td> {/* Fallback jika kosong */}
                    <td className="h-[72px] px-4 py-2 text-text-secondary dark:text-text-secondary-light text-sm">{s.email || '-'}</td> {/* Fallback jika kosong */}
                     {/* Kolom Status dengan Badge */}
                    <td className="h-[72px] px-4 py-2 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                     {/* Kolom Aksi */}
                    <td className="h-[72px] px-4 py-2 text-sm">
                      <div className="flex items-center gap-4">
                         {/* Tombol Aksi Semantik */}
                        <button onClick={() => handleOpenEditModal(s)} className="text-primary hover:text-primary-hover text-sm font-bold transition-colors">Edit</button>
                        <button onClick={() => handleOpenDeleteModal(s)} className="text-danger hover:text-danger/80 text-sm font-bold transition-colors">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
                 {/* Baris jika tidak ada hasil */}
                 {filteredSuppliers.length === 0 && (
                    <tr>
                        <td colSpan={6} className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                            Tidak ada supplier yang cocok dengan pencarian Anda.
                        </td>
                    </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals (Pastikan modal juga di-refactor) */}
      <SupplierFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleFormSubmit}
        supplierToEdit={selectedSupplier}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        judul="Hapus Supplier?"
        pesan={`Anda yakin ingin menghapus supplier ${selectedSupplier?.namaSupplier}?`}
      />
    </div>
  );
}; //

export default SupplierManagement; //