import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GUDANG_JAYA_DB_KEY = 'GUDANG_JAYA_DB';

// Fungsi untuk mendapatkan data awal (termasuk admin dummy)
const getInitialData = () => {
  const adminId = uuidv4();
  return {
    items: [],
    kategori: [
      { id: uuidv4(), nama: 'Elektronik' },
      { id: uuidv4(), nama: 'Pakaian' },
      { id: uuidv4(), nama: 'Makanan' },
      { id: uuidv4(), nama: 'Minuman' },
      { id: uuidv4(), nama: 'Alat Tulis' },
    ],
    users: [
      { 
        id: adminId, 
        namaLengkap: 'John Doe', 
        email: 'john.doe@example.com', 
        telepon: '+1234567890', 
        role: 'Admin', 
        status: 'Active',
        password: 'admin' // Dalam aplikasi nyata, ini harus di-hash
      }
    ],
    suppliers: [],
    orders: [],
    logAktivitas: [
      { id: uuidv4(), pesan: `Sistem dimulai. User Admin (John Doe) dibuat.`, timestamp: new Date() }
    ],
    // Asumsi kita melacak currentUser setelah login
    currentUser: null, // Kita akan set currentUser setelah implementasi login
  };
};

export const useInventory = () => {
  const [database, setDatabase] = useState(() => {
    try {
      const data = localStorage.getItem(GUDANG_JAYA_DB_KEY);
      return data ? JSON.parse(data) : getInitialData();
    } catch (error) {
      console.error("Gagal membaca dari local storage", error);
      return getInitialData();
    }
  });

  // Efek untuk menulis ke localStorage setiap kali 'database' berubah
  useEffect(() => {
    try {
      localStorage.setItem(GUDANG_JAYA_DB_KEY, JSON.stringify(database));
    } catch (error) {
      console.error("Gagal menyimpan ke local storage", error);
    }
  }, [database]);

  // --- Fungsi Logging ---
  const addLog = (pesan) => {
    const logEntry = {
      id: uuidv4(),
      pesan,
      timestamp: new Date(),
    };
    setDatabase((prevDb) => ({
      ...prevDb,
      logAktivitas: [logEntry, ...prevDb.logAktivitas], // Tambah di awal array
    }));
  };

  // --- Fungsi CRUD Kategori ---
  const addKategori = (kategori) => {
    const newKategori = { ...kategori, id: uuidv4() };
    setDatabase((prevDb) => ({
      ...prevDb,
      kategori: [...prevDb.kategori, newKategori],
    }));
    addLog(`Kategori baru ditambahkan: ${kategori.nama}`);
  };

  const updateKategori = (kategoriUpdated) => {
    setDatabase((prevDb) => ({
      ...prevDb,
      kategori: prevDb.kategori.map((k) =>
        k.id === kategoriUpdated.id ? kategoriUpdated : k
      ),
    }));
    addLog(`Kategori diperbarui: ${kategoriUpdated.nama}`);
  };

  const deleteKategori = (id) => {
    const kategori = database.kategori.find(k => k.id === id);
    if (kategori) {
      setDatabase((prevDb) => ({
        ...prevDb,
        kategori: prevDb.kategori.filter((k) => k.id !== id),
      }));
      addLog(`Kategori dihapus: ${kategori.nama}`);
    }
  };
  
  // --- Fungsi CRUD Items ---
  const addItem = (item) => {
    const newItem = { ...item, id: uuidv4() };
    setDatabase(prevDb => ({
      ...prevDb,
      items: [...prevDb.items, newItem]
    }));
    addLog(`Barang baru ditambahkan: ${item.namaBarang} (SKU: ${item.sku})`);
  };

  const updateItem = (itemUpdated) => {
    setDatabase(prevDb => ({
      ...prevDb,
      items: prevDb.items.map(item => 
        item.id === itemUpdated.id ? itemUpdated : item
      )
    }));
    addLog(`Barang diperbarui: ${itemUpdated.namaBarang} (SKU: ${itemUpdated.sku})`);
  };
  
  const deleteItem = (id) => {
    const item = database.items.find(i => i.id === id);
    if(item) {
      setDatabase(prevDb => ({
        ...prevDb,
        items: prevDb.items.filter(i => i.id !== id)
      }));
      addLog(`Barang dihapus: ${item.namaBarang} (SKU: ${item.sku})`);
    }
  };

  // --- Fungsi Aksi Massal (Bulk Actions) ---
  const updateBanyakItem = (itemsToUpdate) => {
    // itemsToUpdate adalah array [{id: "...", jumlah: "..."}]
    setDatabase(prevDb => {
      const newItems = prevDb.items.map(dbItem => {
        const updateInfo = itemsToUpdate.find(u => u.id === dbItem.id);
        return updateInfo ? { ...dbItem, jumlah: updateInfo.jumlah } : dbItem;
      });
      return { ...prevDb, items: newItems };
    });
    addLog(`Stok opname selesai. ${itemsToUpdate.length} item disesuaikan.`);
  };

  const deleteBanyakItem = (arrayId) => {
    setDatabase(prevDb => ({
      ...prevDb,
      items: prevDb.items.filter(item => !arrayId.includes(item.id))
    }));
    addLog(`${arrayId.length} barang dihapus (aksi massal).`);
  };
  
  // --- Fungsi CRUD Users ---
  const addUser = (user) => {
    const newUser = { ...user, id: uuidv4() };
    setDatabase(prevDb => ({
      ...prevDb,
      users: [...prevDb.users, newUser]
    }));
    addLog(`Pengguna baru ditambahkan: ${user.namaLengkap} (Role: ${user.role})`);
  };
  
  const updateUser = (userUpdated) => {
    setDatabase(prevDb => ({
      ...prevDb,
      users: prevDb.users.map(user => 
        user.id === userUpdated.id ? userUpdated : user
      ),
      // Jika user yang diupdate adalah currentUser, update juga
      currentUser: prevDb.currentUser?.id === userUpdated.id ? userUpdated : prevDb.currentUser
    }));
    addLog(`Profil pengguna diperbarui: ${userUpdated.namaLengkap}`);
  };

  const deleteUser = (id) => {
    const user = database.users.find(u => u.id === id);
    if (user) {
      setDatabase(prevDb => ({
        ...prevDb,
        users: prevDb.users.filter(u => u.id !== id)
      }));
      addLog(`Pengguna dihapus: ${user.namaLengkap}`);
    }
  };
  
  // --- Fungsi CRUD Suppliers ---
  const addSupplier = (supplier) => {
    const newSupplier = { ...supplier, id: uuidv4() };
    setDatabase(prevDb => ({
      ...prevDb,
      suppliers: [...prevDb.suppliers, newSupplier]
    }));
    addLog(`Supplier baru ditambahkan: ${supplier.namaSupplier}`);
  };

  const updateSupplier = (supplierUpdated) => {
    setDatabase(prevDb => ({
      ...prevDb,
      suppliers: prevDb.suppliers.map(s => 
        s.id === supplierUpdated.id ? supplierUpdated : s
      )
    }));
    addLog(`Supplier diperbarui: ${supplierUpdated.namaSupplier}`);
  };

  const deleteSupplier = (id) => {
    const supplier = database.suppliers.find(s => s.id === id);
    if (supplier) {
      setDatabase(prevDb => ({
        ...prevDb,
        suppliers: prevDb.suppliers.filter(s => s.id !== id)
      }));
      addLog(`Supplier dihapus: ${supplier.namaSupplier}`);
    }
  };

  // --- Fungsi CRUD Orders ---
  const addOrder = (order) => {
    // Buat Order ID acak
    const newOrder = { 
      ...order, 
      id: uuidv4(), 
      orderId: `#${Math.floor(10000 + Math.random() * 90000)}` 
    };
    setDatabase(prevDb => ({
      ...prevDb,
      orders: [...prevDb.orders, newOrder]
    }));
    addLog(`Order baru dibuat: ${newOrder.orderId} (Tipe: ${order.tipe})`);
  };

  const updateOrder = (orderUpdated) => {
    setDatabase(prevDb => ({
      ...prevDb,
      orders: prevDb.orders.map(o => 
        o.id === orderUpdated.id ? orderUpdated : o
      )
    }));
    addLog(`Order diperbarui: ${orderUpdated.orderId} (Status: ${orderUpdated.status})`);
  };

  const deleteOrder = (id) => {
    const order = database.orders.find(o => o.id === id);
    if (order) {
      setDatabase(prevDb => ({
        ...prevDb,
        orders: prevDb.orders.filter(o => o.id !== id)
      }));
      addLog(`Order dihapus: ${order.orderId}`);
    }
  };


  // Return semua state dan fungsi
  return {
    database,
    addLog,
    // Kategori
    addKategori,
    updateKategori,
    deleteKategori,
    // Items
    addItem,
    updateItem,
    deleteItem,
    updateBanyakItem,
    deleteBanyakItem,
    // Users
    addUser,
    updateUser,
    deleteUser,
    // Suppliers
    addSupplier,
    updateSupplier,
    deleteSupplier,
    // Orders
    addOrder,
    updateOrder,
    deleteOrder,
  };
};