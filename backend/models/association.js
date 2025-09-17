// models/associations.js
const User = require('./User');
const Role = require('./Role');
const Company = require('./Company');
const Bank = require('./Bank');
const Profil = require('./Profil'); 
const Kategori = require('./Kategori');
const Bast = require('./Bast');
const Surat = require('./Surat');
const Invoice = require('./Invoice'); 
const InvoiceItem = require('./InvoiceItem'); 
const Kwitansi = require('./Kwitansi');
const Arsip = require('./Arsip');
const SuratKeluar = require('./SuratKeluar');
const Pembayaran = require('./Pembayaran');

// ==================== Company ↔ User (many-to-one) ====================
User.belongsTo(Company, { foreignKey: 'company_id', as: 'assignedCompany' });
Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });

// ==================== Role ↔ User ====================
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// ==================== User ↔ Profil ====================
User.hasMany(Profil, { foreignKey: 'user_id', as: 'profil' });
Profil.belongsTo(User, {foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== User ↔ Surat ====================
User.hasMany(Surat, { foreignKey: 'user_id', as: 'surat' });
Surat.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== Profil ↔ Surat ====================
Profil.hasMany(Surat, { foreignKey: 'profil_id', as: 'surat' });
Surat.belongsTo(Profil, { foreignKey: 'profil_id', as: 'profil' });

// ==================== Kategori ↔ Surat ====================
Kategori.hasMany(Surat, { foreignKey: 'kategori_kode', sourceKey: 'kode', as: 'surat' });
Surat.belongsTo(Kategori, { foreignKey: 'kategori_kode', targetKey: 'kode', as: 'kategori' });

// ==================== User ↔ Bast ====================
User.hasMany(Bast, { foreignKey: 'user_id', as: 'bast' });
Bast.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== Kategori ↔ Bast ====================
Kategori.hasMany(Bast, { foreignKey: 'kategori_kode', sourceKey: 'kode', as: 'bast' });
Bast.belongsTo(Kategori, { foreignKey: 'kategori_kode', targetKey: 'kode', as: 'kategori' });

// ==================== User ↔ Invoice ====================
User.hasMany(Invoice, { foreignKey: 'user_id', as: 'invoice' });
Invoice.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== Profil ↔ Invoice ====================
Profil.hasMany(Invoice, { foreignKey: 'profil_id', as: 'invoice' });
Invoice.belongsTo(Profil, { foreignKey: 'profil_id', as: 'profil' });

// ==================== Invoice ↔ InvoiceItem (one-to-many) ====================
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id', as: 'items', onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoice' });

// ==================== User ↔ Kwitansi ====================
User.hasMany(Kwitansi, { foreignKey: 'user_id', as: 'kwitansi' });
Kwitansi.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== Profil ↔ Kwitansi ====================
Profil.hasMany(Kwitansi, { foreignKey: 'profil_id', as: 'kwitansi' });
Kwitansi.belongsTo(Profil, { foreignKey: 'profil_id', as: 'profil' });

// ==================== User ↔ Arsip ====================
User.hasMany(Arsip, { foreignKey: 'user_id', as: 'arsip' });
Arsip.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== User ↔ Surat Keluar ====================
User.hasMany(SuratKeluar, { foreignKey: 'user_id', as: 'surat_keluar' });
SuratKeluar.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== User ↔ Pembayaran ====================
User.hasMany(Pembayaran, { foreignKey: 'user_id', as: 'pembayaran' });
Pembayaran.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid', as: 'user' });

// ==================== Bank ↔ Pembayaran ====================
Bank.hasMany(Pembayaran, { foreignKey: 'id_bank', as: 'pembayaran' });
Pembayaran.belongsTo(Bank, { foreignKey: 'id_bank', as: 'bank' });

// ==================== Kategori ↔ Kwitansi, Pembayaran, Invoice ====================
Kategori.hasMany(Kwitansi, { foreignKey: 'kategori_kode', sourceKey: 'kode', as: 'kwitansi' });
Kwitansi.belongsTo(Kategori, { foreignKey: 'kategori_kode', targetKey: 'kode', as: 'kategori' });

Kategori.hasMany(Pembayaran, { foreignKey: 'kategori_kode', sourceKey: 'kode', as: 'pembayaran' });
Pembayaran.belongsTo(Kategori, { foreignKey: 'kategori_kode', targetKey: 'kode', as: 'kategori' });

Kategori.hasMany(Invoice, { foreignKey: 'kategori_kode', sourceKey: 'kode', as: 'invoice' });
Invoice.belongsTo(Kategori, { foreignKey: 'kategori_kode', targetKey: 'kode', as: 'kategori' });

console.log('✅ Semua relasi model berhasil diatur');