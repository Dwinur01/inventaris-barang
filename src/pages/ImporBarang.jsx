// src/pages/ImporBarang.jsx (Refactored - Complete Code)
import React, { useState, useCallback, useMemo } from 'react'; // Impor useMemo
import { useDropzone } from 'react-dropzone'; // Hook untuk drag and drop
import Papa from 'papaparse'; // Library untuk parsing CSV
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import { useNavigate } from 'react-router-dom'; // Hook navigasi
import { MdUpload } from 'react-icons/md'; // Ikon upload

// Helper untuk download file CSV (logika tidak berubah)
const downloadCSV = (csvString, fileName) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Header untuk template CSV (nama kategori agar mudah diisi user)
const templateHeaders = [
  "sku",
  "namaBarang",
  "kategoriNama", // Pakai nama, bukan ID
  "jumlah",
  "hargaBeli",
  "hargaJual",
  "deskripsi"
];
// Buat string CSV untuk template
const templateData = Papa.unparse([templateHeaders]);

const ImporBarang = () => {
  const { database, addItem } = useInventoryContext(); // Ambil data dan fungsi tambah
  const { showToast } = useToastContext(); // Ambil fungsi toast
  const navigate = useNavigate(); // Ambil fungsi navigasi

  // State Management
  const [fileName, setFileName] = useState(null); // Nama file yang diupload
  const [previewData, setPreviewData] = useState([]); // Data untuk tabel pratinjau (maks 5 baris)
  const [fullParsedData, setFullParsedData] = useState([]); // Semua data hasil parse CSV
  const [isImporting, setIsImporting] = useState(false); // Status proses impor

  // Callback saat file di-drop atau dipilih
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; // Ambil file pertama
    if (file) {
      setFileName(file.name); // Simpan nama file

      // Parsing file CSV menggunakan PapaParse
      Papa.parse(file, {
        header: true, // Anggap baris pertama sebagai header
        skipEmptyLines: true, // Lewati baris kosong
        complete: (results) => {
          // Validasi header CSV
          const expectedHeaders = templateHeaders;
          // Ambil header dari data hasil parse (atau objek kosong jika tidak ada data)
          const actualHeaders = Object.keys(results.data[0] || {});

          // Cek apakah semua header yang diharapkan ada di file CSV
          const headersMatch = expectedHeaders.every(h => actualHeaders.includes(h));

          if (!headersMatch) {
             showToast(`Format file salah. Header harus: ${expectedHeaders.join(', ')}`, 'error');
             // Reset state jika format salah
             setFileName(null);
             setPreviewData([]);
             setFullParsedData([]);
             return; // Hentikan proses
          }

          // Simpan semua data hasil parse
          setFullParsedData(results.data);
          // Simpan 5 baris pertama untuk pratinjau
          setPreviewData(results.data.slice(0, 5));
          showToast(`File "${file.name}" berhasil dibaca. Siap untuk impor.`, 'success');
        },
        error: (error) => {
          // Tampilkan error jika parsing gagal
          showToast(`Gagal membaca file CSV: ${error.message}`, 'error');
          setFileName(null); // Reset nama file
        }
      });
    }
  }, [showToast, database?.kategori]); // Dependency showToast dan database.kategori (untuk validasi nanti)

  // Konfigurasi react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, // Fungsi callback saat drop
    accept: { 'text/csv': ['.csv'] }, // Hanya terima file .csv
    maxFiles: 1, // Hanya boleh 1 file
  });

  // Handler tombol download template
  const handleDownloadTemplate = () => {
    downloadCSV(templateData, 'template_impor_barang.csv');
  };

  // Handler tombol mulai impor
  const handleImport = () => {
    if (fullParsedData.length === 0) {
      showToast('Tidak ada data CSV yang valid untuk diimpor.', 'warning');
      return;
    }
    // Pastikan kategori sudah ada di database
    if (!database?.kategori || database.kategori.length === 0) {
        showToast('Kategori belum ada di Pengaturan. Tambahkan kategori terlebih dahulu.', 'error');
        return;
    }

    setIsImporting(true); // Set status sedang mengimpor
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const errors = []; // Simpan pesan error spesifik

    // Iterasi setiap baris data dari CSV
    fullParsedData.forEach((row, index) => {
      // Validasi data dasar (SKU, Nama Barang, Nama Kategori tidak boleh kosong)
      if (!row.sku || !row.namaBarang || !row.kategoriNama) {
        skippedCount++;
        errors.push(`Baris ${index + 2}: SKU, Nama Barang, atau Nama Kategori kosong.`);
        return; // Lewati baris ini
      }

      // Cari ID Kategori berdasarkan nama kategori di CSV (case-insensitive)
      const kategori = database.kategori.find(
        k => k.nama.toLowerCase() === row.kategoriNama.toLowerCase()
      );

      // Jika kategori tidak ditemukan di database
      if (!kategori) {
        skippedCount++;
        errors.push(`Baris ${index + 2}: Kategori "${row.kategoriNama}" tidak ditemukan.`);
        return; // Lewati baris ini
      }

      // Buat objek item baru sesuai format database
      const newItem = {
        namaBarang: row.namaBarang,
        sku: row.sku,
        kategori: kategori.id, // Gunakan ID kategori yang ditemukan
        jumlah: parseInt(row.jumlah, 10) || 0, // Pastikan jumlah adalah angka
        hargaBeli: parseFloat(row.hargaBeli) || 0, // Pastikan harga adalah angka
        hargaJual: parseFloat(row.hargaJual) || 0, // Pastikan harga adalah angka
        deskripsi: row.deskripsi || '', // Deskripsi opsional
        gambarUrl: '', // Impor CSV tidak menyertakan gambar
      };

      try {
        addItem(newItem); // Panggil fungsi tambah item dari context
        successCount++;
      } catch (error) {
         // Tangani jika ada error saat addItem (misal validasi di hook)
         errorCount++;
         errors.push(`Baris ${index + 2} (${row.sku}): Gagal impor - ${error.message || 'Error tidak diketahui'}`);
         console.error(`Error importing row ${index + 2}:`, error);
      }
    });

    setIsImporting(false); // Selesai mengimpor

    // Tampilkan hasil impor
    if (errorCount === 0 && skippedCount === 0) {
        showToast(`${successCount} barang berhasil diimpor.`, 'success');
    } else {
        showToast(`${successCount} berhasil, ${skippedCount} dilewati, ${errorCount} gagal. Cek console log untuk detail error.`, 'warning');
        console.warn("Import Errors/Skipped Rows:", errors); // Tampilkan detail error/skip di console
    }

    // Navigasi kembali ke daftar barang setelah impor
    navigate('/');
  };

  // Memoize header tabel pratinjau
  const previewHeaders = useMemo(() => {
    return previewData.length > 0 ? Object.keys(previewData[0]) : [];
  }, [previewData]);

  return (
    // Container layout diatur oleh Layout.jsx
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Halaman */}
      <div className="text-center mb-8">
         {/* Teks Header Semantik */}
        <h1 className="text-4xl font-black tracking-tight text-text-dark dark:text-text-light">Impor Barang</h1>
        <p className="text-base text-text-secondary dark:text-text-secondary-light mt-2">
          Impor barang baru ke inventaris Anda dengan mengunggah file CSV.
        </p>
      </div>

      {/* Kartu Konten Semantik */}
      <div className="bg-card dark:bg-card-dark rounded-xl shadow-lg p-6 md:p-8 space-y-8">
        {/* Step 1: Unduh Template */}
        <div>
          <h2 className="text-lg font-bold text-text-dark dark:text-text-light">Step 1: Unduh Template</h2>
          <p className="text-text-secondary dark:text-text-secondary-light mt-1 text-sm"> {/* Ukuran font */}
            <button
              onClick={handleDownloadTemplate}
              className="text-primary underline hover:text-primary-hover transition-colors"
            >
              Unduh template CSV kami
            </button>
            {" "}untuk memastikan format kolom yang benar (sku, namaBarang, kategoriNama, dll).
          </p>
        </div>

        {/* Step 2: Unggah File (Dropzone Semantik) */}
        <div>
          <h2 className="text-lg font-bold text-text-dark dark:text-text-light">Step 2: Unggah File CSV Anda</h2>
          <div
            {...getRootProps()} // Terapkan props dari useDropzone
            // Styling area dropzone + state aktif + warna semantik
            className={`mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border dark:border-border-dark px-6 py-10 sm:py-14 text-center transition-colors cursor-pointer ${
                isDragActive
                ? 'bg-primary-soft/50 dark:bg-primary-soft/10 border-primary' // Saat file di-drag
                : 'bg-input dark:bg-input-dark hover:border-text-secondary dark:hover:border-text-secondary-light' // State normal & hover
            }`}
          >
             {/* Ikon Semantik */}
            <MdUpload className="mx-auto text-5xl sm:text-6xl text-text-secondary dark:text-text-secondary-light mb-4" /> {/* Ukuran ikon disesuaikan */}
             {/* Teks Instruksi Semantik */}
            <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-light">
              <span className="font-semibold text-primary">Seret & lepas file .csv</span>
            </p>
             <p className="text-sm text-text-secondary dark:text-text-secondary-light mt-1">atau <span className="font-semibold text-primary">klik untuk memilih file</span></p>
            {/* Input file tersembunyi */}
            <input {...getInputProps()} className="sr-only" />
          </div>
          {/* Tampilkan nama file yang dipilih */}
          {fileName && (
            <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-light">File terpilih: <span className="font-medium text-text-dark dark:text-text-light">{fileName}</span></p>
          )}
        </div>

        {/* Pratinjau Data Semantik (jika ada data) */}
        {previewData.length > 0 && (
          <div id="file-preview">
            <h3 className="text-md font-bold text-text-dark dark:text-text-light mb-4">Pratinjau Data (5 Baris Pertama)</h3>
            {/* Container Tabel Pratinjau Semantik */}
            <div className="overflow-x-auto rounded-lg border border-border dark:border-border-dark">
              <table className="min-w-full divide-y divide-border dark:divide-border-dark">
                 {/* Header Tabel Pratinjau Semantik */}
                <thead className="bg-background-light dark:bg-background-dark/50">
                  <tr>
                    {previewHeaders.map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary dark:text-text-secondary-light">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Body Tabel Pratinjau Semantik */}
                <tbody className="bg-card dark:bg-card-dark divide-y divide-border dark:divide-border-dark">
                  {previewData.map((row, index) => (
                    <tr key={index} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                      {Object.values(row).map((cell, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             <p className="mt-2 text-xs text-text-secondary dark:text-text-secondary-light">Menampilkan {previewData.length} dari {fullParsedData.length} baris data.</p>
          </div>
        )}

        {/* Step 3: Mulai Proses Impor */}
        <div>
          <h2 className="text-lg font-bold text-text-dark dark:text-text-light">Step 3: Mulai Proses Impor</h2>
           {/* Tombol Impor Semantik */}
          <button
            id="import-button"
            type="button"
            onClick={handleImport}
            // Disable tombol jika tidak ada data atau sedang mengimpor
            disabled={fullParsedData.length === 0 || isImporting}
            className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-card-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? (
                <>
                {/* Tambahkan spinner sederhana */}
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengimpor...
                </>
            ) : (
                'Mulai Impor Data'
            )}
          </button>
           <p className="mt-2 text-xs text-text-secondary dark:text-text-secondary-light">Pastikan data Anda sudah benar sebelum mengimpor. Proses ini mungkin memerlukan waktu beberapa saat tergantung jumlah data.</p>
        </div>
      </div>
    </div>
  );
}; //

export default ImporBarang; //