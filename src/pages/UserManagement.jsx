// src/pages/UserManagement.jsx (Refactored - Complete Code)
import React, { useState, useMemo } from 'react'; // Impor useMemo
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import DeleteConfirmModal from '../components/DeleteConfirmModal'; // Import modal hapus
import UserFormModal from '../components/UserFormModal'; // Import modal form user
import { MdSearch, MdEdit, MdDelete, MdAdd } from 'react-icons/md'; //

const UserManagement = () => {
  const { database, addUser, updateUser, deleteUser } = useInventoryContext(); // Ambil data dan fungsi
  const { showToast } = useToastContext(); // Ambil fungsi toast

  // State Management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // State modal form
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State modal hapus
  const [selectedUser, setSelectedUser] = useState(null); // User yang dipilih untuk edit/hapus
  const [searchTerm, setSearchTerm] = useState(''); // State pencarian

  // --- Handlers Modal ---
  const handleOpenAddModal = () => {
    setSelectedUser(null); // Mode tambah
    setIsFormModalOpen(true);
  }; //

  const handleOpenEditModal = (user) => {
    setSelectedUser(user); // Mode edit
    setIsFormModalOpen(true);
  }; //

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user); // Siapkan untuk dihapus
    setIsDeleteModalOpen(true);
  }; //

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null); // Reset pilihan
  }; //

  // --- Handlers CRUD ---
  const handleFormSubmit = (formData) => {
    if (selectedUser) { // Cek apakah ada ID (mode edit)
      updateUser({ ...selectedUser, ...formData }); // Panggil fungsi update
      showToast('Data pengguna berhasil diperbarui.', 'success');
    } else {
      addUser(formData); // Panggil fungsi tambah
      showToast('Pengguna baru berhasil ditambahkan.', 'success');
    }
    handleCloseModals(); // Tutup modal
  }; //

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id); // Panggil fungsi hapus
      showToast(`Pengguna "${selectedUser.namaLengkap}" telah dihapus.`, 'success');
      handleCloseModals(); // Tutup modal
    }
  }; //

  // --- Logika Filter (useMemo) ---
  const filteredUsers = useMemo(() => {
     // Pastikan database.users ada
    if (!database?.users) return [];
    // Filter hanya berdasarkan nama atau email
    return database.users.filter(user =>
      (user.namaLengkap?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [database?.users, searchTerm]); // Dependencies

  // --- Helper Badge Status (Refactored Semantik) ---
  const getStatusBadge = (status) =>
    status === 'Active'
    ? 'bg-success-soft text-success dark:bg-success-soft/20' // Warna success
    : 'bg-danger-soft text-danger dark:bg-danger-soft/20'; // Warna danger

  return (
     // Container layout diatur oleh Layout.jsx
    <div className="flex flex-col max-w-5xl mx-auto"> {/* Max width bisa disesuaikan */}
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-4">
         {/* Teks Header Semantik */}
        <p className="text-text-dark dark:text-text-light text-4xl font-black">User Management</p>
         {/* Tombol Tambah Semantik */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
        >
          <MdAdd size={20}/>
          <span className="truncate">Add New User</span>
        </button>
      </div>

      {/* Search Bar Semantik */}
      <div className="px-4 py-3">
        <label className="relative flex items-center w-full">
          <MdSearch className="absolute left-4 text-text-secondary dark:text-text-secondary-light" size={20} />
          <input
            className="form-input w-full rounded-lg text-text-dark dark:text-text-light bg-input dark:bg-input-dark h-12 pl-12 pr-4 border border-border dark:border-border-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-light focus:ring-primary focus:border-primary text-sm"
            placeholder="Search by name or email..." // Placeholder diperbarui
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {/* Tabel User */}
      <div className="px-4 py-3">
         {/* Container Tabel Semantik */}
        <div className="flex overflow-hidden rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left"> {/* min-width */}
               {/* Header Tabel Semantik */}
              <thead className="bg-background-light dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
                <tr>
                   {/* Kolom Header Semantik */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
               {/* Body Tabel Semantik */}
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredUsers.map((user) => (
                   // Hover Baris Semantik
                  <tr key={user.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                     {/* Kolom User Semantik */}
                    <td className="h-[72px] px-6 py-2">
                      <p className="text-sm font-medium text-text-dark dark:text-text-light">{user.namaLengkap}</p>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-light">{user.email}</p>
                    </td>
                     {/* Kolom Role Semantik */}
                    <td className="h-[72px] px-6 py-2 text-text-secondary dark:text-text-secondary-light text-sm font-normal">{user.role}</td>
                     {/* Kolom Status dengan Badge */}
                    <td className="h-[72px] px-6 py-2 text-sm font-normal">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status || 'Active')}`}> {/* Ukuran font xs */}
                        {user.status || 'Active'}
                      </span>
                    </td>
                    {/* Kolom Aksi */}
                    <td className="h-[72px] px-6 py-2 text-sm font-bold">
                      <div className="flex items-center gap-4">
                         {/* Tombol Aksi Semantik */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="text-text-secondary dark:text-text-secondary-light hover:text-primary transition-colors"
                          title="Edit User"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="text-text-secondary dark:text-text-secondary-light hover:text-danger transition-colors"
                          title="Delete User"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                 {/* Baris jika tidak ada hasil */}
                 {filteredUsers.length === 0 && (
                    <tr>
                        <td colSpan={4} className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                            Tidak ada pengguna yang cocok dengan pencarian Anda.
                        </td>
                    </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals (Pastikan modal juga di-refactor) */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleFormSubmit}
        userToEdit={selectedUser}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        judul="Hapus Pengguna?"
        pesan={`Anda yakin ingin menghapus ${selectedUser?.namaLengkap}?`}
      />
    </div>
  );
}; //

export default UserManagement; //