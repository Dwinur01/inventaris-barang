// src/components/ToastContainer.jsx (Refactored - Complete Code)
import React from 'react'; //
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import { MdCheckCircle, MdError, MdWarning, MdClose } from 'react-icons/md'; //

// Komponen Toast Individual
const Toast = ({ toast, onRemove }) => {
  const { id, pesan, tipe } = toast; // Ambil data toast

  // Konfigurasi styling untuk setiap tipe toast menggunakan warna semantik
  const config = {
    success: {
      icon: <MdCheckCircle className="h-6 w-6 text-white" />, // Ikon centang putih
      // Latar belakang soft primary, dengan varian gelap
      bgColor: 'bg-primary-soft dark:bg-primary-soft/20',
      iconBg: 'bg-primary', // Latar ikon primary
      title: 'Success!', // Judul default
    },
    error: {
      icon: <MdClose className="text-white" />, // Ikon silang putih
      bgColor: 'bg-danger', // Latar belakang merah (danger)
      iconBg: 'bg-white/20', // Latar ikon transparan putih
      title: 'Error!', // Judul error
    },
    warning: {
      icon: <MdWarning className="text-warning text-2xl" />, // Ikon peringatan kuning
      // Latar belakang soft warning, dengan varian gelap
      bgColor: 'bg-warning-soft dark:bg-warning-soft/20',
      iconBg: '', // Tidak ada latar ikon khusus
      title: 'Peringatan!', // Judul peringatan
      borderColor: 'border-l-4 border-warning', // Border kiri kuning
    },
  }; //

  // Ambil konfigurasi berdasarkan tipe toast, default ke success jika tipe tidak valid
  const toastConfig = config[tipe] || config.success;

  // Keyframes animasi slideInRight (harus ada di index.css)
  /*
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slideInRight {
      animation: slideInRight 0.5s ease-out forwards;
    }
  */

  // Render toast tipe 'error'
  if (tipe === 'error') {
    return (
      <div className={`animate-slideInRight max-w-sm w-full ${toastConfig.bgColor} rounded-lg shadow-lg flex items-center p-4`}>
        <div className="flex-shrink-0">
          <div className={`${toastConfig.iconBg} rounded-full p-2`}>
            {toastConfig.icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-white font-bold text-base">{toastConfig.title}</p>
          <p className="text-white text-sm">{pesan}</p>
        </div>
        {/* Tombol close (opsional untuk error) */}
         <div className="ml-4 flex-shrink-0 flex">
          <button onClick={() => onRemove(id)} className="inline-flex rounded-md bg-transparent text-white/70 hover:text-white">
            <MdClose size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Render toast tipe 'warning'
  if (tipe === 'warning') {
    return (
       <div className={`animate-slideInRight max-w-sm w-full ${toastConfig.bgColor} ${toastConfig.borderColor} rounded-lg shadow-lg p-4 flex items-start`}>
        <div className="flex-shrink-0 pt-0.5"> {/* Penyesuaian posisi ikon */}
          {toastConfig.icon}
        </div>
        <div className="ml-3 w-0 flex-1">
           {/* Teks semantik */}
          <p className="text-sm font-bold text-text-dark dark:text-text-light">{toastConfig.title}</p>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-light">{pesan}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          {/* Tombol close semantik */}
          <button onClick={() => onRemove(id)} className="inline-flex rounded-md bg-transparent text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light">
            <MdClose size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Render toast tipe 'success' (default)
  return (
    <div className={`animate-slideInRight max-w-sm w-full ${toastConfig.bgColor} rounded-lg shadow-lg overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`${toastConfig.iconBg} rounded-full p-1.5`}>
              {toastConfig.icon}
            </div>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
             {/* Teks semantik */}
            <p className="text-sm font-bold text-text-dark dark:text-text-light">{toastConfig.title}</p>
            <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-light">{pesan}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
             {/* Tombol close semantik */}
            <button onClick={() => onRemove(id)} className="inline-flex text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light">
              <MdClose size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; //

// Container untuk semua toast
const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext(); // Dapatkan toasts dan fungsi remove

  return (
    // Posisi container di kanan atas, z-index tinggi
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-4">
      {/* Map setiap toast ke komponen Toast */}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}; //

export default ToastContainer; //