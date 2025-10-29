// src/components/ItemListEmptyState.jsx (Refactored & Fixed)
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Import ikon yang digunakan: MdOutlineInventory2 DAN MdAdd
import { MdOutlineInventory2, MdAdd } from 'react-icons/md'; // <--- PERBAIKAN DI SINI

const ItemListEmptyState = () => {
  const navigate = useNavigate();

  return (
    // Kontainer Utama Semantik (menggunakan bg-card)
    <main className="flex-1 p-8 bg-card dark:bg-card-dark rounded-lg shadow-sm border border-border dark:border-border-dark"> {/* Tambah border */}
      {/* Konten ditengah */}
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]"> {/* min-height */}
        <div className="flex flex-col items-center gap-6 text-center"> {/* Text center */}
          {/* Ikon Semantik */}
          <div className="text-primary dark:text-primary/80 opacity-70"> {/* Sedikit transparan */}
            {/* Ukuran ikon lebih besar */}
            <MdOutlineInventory2 style={{ fontSize: '80px' }} /> {/* Ganti ikon & ukuran */}
          </div>
          {/* Teks Semantik */}
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <h2 className="text-2xl font-bold text-text-dark dark:text-text-light">
              Inventaris Masih Kosong
            </h2>
            <p className="text-base text-text-secondary dark:text-text-secondary-light">
              Mulai kelola stok Anda dengan menambahkan barang pertama.
            </p>
          </div>
          {/* Tombol Tambah Semantik */}
          <button
            onClick={() => navigate('/tambah-barang')} // Navigasi ke halaman tambah
            className="flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-hover transition-colors shadow hover:shadow-md" // Tambah shadow
          >
            {/* Gunakan ikon MdAdd yang sudah diimpor */}
            <MdAdd size={20} /> {/* <--- Ikon yang menyebabkan error */}
            <span className="truncate">Tambah Barang Baru</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default ItemListEmptyState;