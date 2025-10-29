// src/components/CetakLabelModal.jsx (Refactored - Complete Code)
import React, { useState, useRef, useEffect } from 'react'; // Impor useEffect
import Barcode from 'react-barcode'; // Komponen barcode
import { useReactToPrint } from 'react-to-print'; // Hook untuk print
import { MdClose, MdPrint } from 'react-icons/md'; // Ikon

// Komponen tersembunyi yang akan dicetak (styling tidak diubah, hanya untuk print)
const ComponentToPrint = React.forwardRef(({ item, jumlahCetak }, ref) => {
  if (!item) return null;
  // Buat array sejumlah label yang akan dicetak
  const labels = Array.from({ length: Math.max(1, Number(jumlahCetak)) }, (_, i) => i); // Pastikan minimal 1

  return (
    // 'print-only' class dari index.css akan membuatnya terlihat saat print
    <div ref={ref} className="print-only">
      {labels.map((_, index) => (
        // Styling untuk setiap halaman/label saat print (dari index.css)
        <div key={index} className="label-page">
          <p className="label-nama">{item.namaBarang}</p>
          <Barcode
            value={item.sku || 'NO-SKU'} // Fallback jika SKU kosong
            width={2} // Lebar bar
            height={50} // Tinggi bar
            fontSize={14} // Ukuran teks di bawah barcode
            margin={10} // Margin sekitar barcode
            background="transparent" // Transparan agar sesuai latar kertas
            lineColor="black" // Warna bar hitam
            fontOptions="bold"
          />
          <p className="label-sku">SKU: {item.sku || 'N/A'}</p>
        </div>
      ))}
    </div>
  );
});
ComponentToPrint.displayName = 'ComponentToPrint'; // Nama display untuk debugging

// --- Modal Utama ---
const CetakLabelModal = ({ isOpen, onClose, item }) => {
  const [jumlahCetak, setJumlahCetak] = useState(1); // State jumlah cetak
  const componentToPrintRef = useRef(null); // Ref untuk komponen yang akan dicetak

  // Hook react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current, // Target elemen yang dicetak
    documentTitle: `Label_${item?.sku || 'barang'}`, // Nama file saat print/save PDF
    // Opsional: Callback setelah print
    // onAfterPrint: () => console.log('Print selesai'),
  });

  // Reset jumlah cetak saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setJumlahCetak(1); // Reset ke 1
    }
  }, [isOpen]);

  // Jangan render jika modal tertutup atau tidak ada item
  if (!isOpen || !item) return null;

  // Handler perubahan input jumlah cetak
  const handleJumlahChange = (e) => {
    // Pastikan nilai >= 1
    const value = Math.max(1, parseInt(e.target.value, 10) || 1);
    setJumlahCetak(value);
  };

  return (
    // Backdrop Semantik
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Kontainer Modal Semantik */}
      <div className="relative bg-card dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md mx-auto flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        {/* Tombol Close Semantik */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light p-2 rounded-full hover:bg-background dark:hover:bg-background-dark/50 transition-colors"
          aria-label="Tutup modal cetak label"
        >
          <MdClose size={24} />
        </button>

        {/* Konten Modal */}
        <div className="p-6 md:p-8">
          {/* Judul Modal Semantik */}
          <h2 className="text-text-dark dark:text-text-light text-xl sm:text-2xl font-bold leading-tight tracking-tight mb-6">
            Cetak Label: <span className="text-primary">{item.namaBarang}</span>
          </h2>

          {/* Input Teks Kustom (Disabled, styling semantik) */}
          <div className="mb-6">
            <label className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2 block" htmlFor="custom-text">
              Teks Kustom (Opsional)
            </label>
            <input
              className="form-input flex w-full rounded-lg text-text-secondary dark:text-text-secondary-light focus:outline-none focus:ring-0 border border-border dark:border-border-dark bg-background dark:bg-background-dark/50 h-12 sm:h-14 p-3.5 cursor-not-allowed text-sm" // Styling disabled
              id="custom-text"
              placeholder="Fitur belum tersedia"
              disabled // Fitur ini tidak ada di logic awal
            />
          </div>

          {/* Preview Barcode Semantik */}
          <div className="bg-white border border-border dark:border-border-dark rounded-lg p-6 mb-6 flex flex-col items-center justify-center space-y-3"> {/* Background putih agar barcode jelas */}
            {/* Teks preview hitam agar kontras di latar putih */}
            <p className="text-black text-base sm:text-lg font-semibold text-center">{item.namaBarang}</p>
            <Barcode
              value={item.sku || 'NO-SKU'} // Fallback
              width={2}
              height={50}
              fontSize={14}
              background="transparent" // Latar barcode transparan
              lineColor="black" // Garis barcode hitam
              fontOptions="bold"
            />
            <p className="text-black text-sm sm:text-base text-center">SKU: {item.sku || 'N/A'}</p>
          </div>

          {/* Input Jumlah Cetak Semantik */}
          <div className="mb-6">
            <label className="text-sm font-medium text-text-dark dark:text-text-light pb-2 block" htmlFor="jumlah-cetak">
              Jumlah Label Cetak
            </label>
            <input
              type="number"
              id="jumlah-cetak"
              className="form-input flex w-full rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 sm:h-14 p-3.5 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Styling input number
              value={jumlahCetak}
              onChange={handleJumlahChange} // Handler khusus
              min="1" // Minimal 1
              required
            />
          </div>
        </div>

        {/* Footer Tombol Semantik */}
        <div className="flex justify-end gap-3 sm:gap-4 p-6 md:p-8 border-t border-border dark:border-border-dark">
          {/* Tombol Batal Semantik */}
          <button
            onClick={onClose}
            className="rounded-lg bg-border-light dark:bg-border-dark px-5 py-2.5 sm:px-6 sm:py-3 font-semibold text-text-dark dark:text-text-light hover:opacity-80 transition-opacity text-sm sm:text-base"
          >
            Batal
          </button>
          {/* Tombol Cetak Semantik */}
          <button
            onClick={handlePrint} // Panggil fungsi print
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 sm:px-6 sm:py-3 font-semibold text-white hover:bg-primary-hover transition-colors text-sm sm:text-base"
          >
            <MdPrint size={18}/> {/* Tambah ikon */}
            Cetak
          </button>
        </div>

        {/* Komponen tersembunyi untuk dicetak (tidak perlu styling tema) */}
        <div style={{ display: 'none' }}> {/* Cara lain menyembunyikan */}
          <ComponentToPrint ref={componentToPrintRef} item={item} jumlahCetak={jumlahCetak} />
        </div>
      </div>
       {/* CSS Animasi */}
    </div>
  );
}; //

export default CetakLabelModal; //