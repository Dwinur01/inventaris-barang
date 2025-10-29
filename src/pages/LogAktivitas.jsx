// src/pages/LogAktivitas.jsx (Refactored - Complete Code)
import React, { useState, useMemo } from 'react'; //
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { MdSearch } from 'react-icons/md'; //

// Helper untuk mendapatkan inisial dari nama (logika tidak berubah)
const getInitials = (message) => {
  // Asumsi format pesan: "Nama ... aksi" atau "Sistem ..."
  const words = message.split(' ');
  if (!words || words.length === 0) return '??';

  const firstWord = words[0];
  if (firstWord.toLowerCase() === 'sistem') return 'SYS'; // Inisial untuk sistem

  // Coba ambil inisial dari 1 atau 2 kata pertama
  const nameParts = words.slice(0, 2); // Ambil maks 2 kata
  if (nameParts.length > 1 && nameParts[1].length > 1) { // Jika ada kata kedua > 1 huruf
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
  // Jika hanya 1 kata atau kata kedua hanya 1 huruf
  return (nameParts[0][0] + (nameParts[0][1] || '')).toUpperCase();
}; //

// Helper simpel untuk format waktu (logika tidak berubah)
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  // Pastikan timestamp adalah objek Date yang valid
  const logTime = new Date(timestamp);
  if (isNaN(logTime.getTime())) return 'waktu tidak valid'; // Handle jika timestamp salah

  const seconds = Math.floor((now - logTime) / 1000);

  if (seconds < 0) return 'dari masa depan'; // Handle jika ada perbedaan waktu aneh
  if (seconds < 60) return Math.floor(seconds) + " detik lalu";

  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " menit lalu";

  return Math.floor(seconds) + " detik lalu";
}; //

const LogAktivitas = () => {
  const { database } = useInventoryContext(); // Ambil data dari context
  const [searchTerm, setSearchTerm] = useState(''); // State untuk filter

  // Filter log berdasarkan searchTerm (menggunakan useMemo)
  const filteredLogs = useMemo(() => {
    // Pastikan database.logAktivitas ada
    if (!database?.logAktivitas) return [];
    const searchLower = searchTerm.toLowerCase();
    // Filter berdasarkan pesan log
    return database.logAktivitas.filter(log =>
      log.pesan?.toLowerCase().includes(searchLower) // Tambah null check
    );
  }, [database?.logAktivitas, searchTerm]); // Dependencies

  return (
    // Container layout diatur oleh Layout.jsx
    <div className="flex flex-col max-w-[960px] flex-1 mx-auto"> {/* Max width bisa disesuaikan */}
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-4">
         {/* Teks Header Semantik */}
        <p className="text-4xl font-black tracking-tighter text-text-dark dark:text-text-light">Log Aktivitas</p>
      </div>

      {/* Filter Semantik */}
      <div className="p-4">
        <div className="relative">
           {/* Input Search Semantik */}
          <input
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark text-text-dark dark:text-text-light placeholder:text-text-secondary dark:placeholder:text-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="Filter log berdasarkan pesan..." // Placeholder diperjelas
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Ikon Search Semantik */}
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-light" size={20} />
        </div>
      </div>

      {/* Timeline Semantik */}
      <div className="p-4">
        {/* Render setiap item log */}
        {filteredLogs.map((log) => (
          <div key={log.id} className="grid grid-cols-[auto_1fr] gap-x-4 py-4 hover:bg-background-light dark:hover:bg-background-dark/50 rounded-lg transition-colors duration-200 group"> {/* Tambah group untuk hover */}
            {/* Avatar & Garis Timeline */}
            <div className="flex flex-col items-center gap-1.5 pt-1">
               {/* Avatar Semantik */}
              <div className="bg-primary-soft dark:bg-primary-soft/20 text-primary flex items-center justify-center font-bold text-sm aspect-square rounded-full size-10 group-hover:scale-105 transition-transform"> {/* Efek hover */}
                {getInitials(log.pesan)}
              </div>
               {/* Garis Timeline Semantik */}
              <div className="w-0.5 bg-border dark:bg-border-dark h-full min-h-[4rem] group-last:hidden"></div> {/* Sembunyikan garis di item terakhir */}
            </div>
            {/* Konten Log */}
            <div className="flex flex-1 flex-col pb-6 pt-1"> {/* Penyesuaian padding top */}
               {/* Teks Pesan Semantik */}
              <p className="text-base leading-relaxed text-text-dark dark:text-text-light">
                {log.pesan}
              </p>
               {/* Teks Waktu Semantik */}
              <p className="text-text-secondary dark:text-text-secondary-light text-sm mt-1"> {/* Tambah margin top */}
                {formatRelativeTime(log.timestamp)} - {new Date(log.timestamp).toLocaleTimeString('id-ID')} {/* Tampilkan juga jam */}
              </p>
            </div>
          </div>
        ))}

        {/* Baris jika tidak ada hasil filter */}
        {filteredLogs.length === 0 && searchTerm && (
            <div className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                Tidak ada log yang cocok dengan filter "{searchTerm}".
            </div>
        )}

        {/* Baris jika tidak ada log sama sekali */}
         {(database?.logAktivitas?.length === 0) && (
            <div className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                Belum ada aktivitas tercatat.
            </div>
         )}


        {/* Tombol Muat Lebih Banyak (Placeholder Semantik) */}
        {/* Hanya tampilkan jika ada log */}
        {(database?.logAktivitas?.length > 0) && (
            <div className="flex justify-center mt-8">
            <button className="px-6 py-2 border border-border dark:border-border-dark rounded-full text-text-dark dark:text-text-light hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors text-sm">
                Muat Lebih Banyak (Placeholder)
            </button>
            </div>
        )}
      </div>
    </div>
  );
}; //

export default LogAktivitas; //