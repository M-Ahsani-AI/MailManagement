// test-api.js
const User = require('./models/User');

console.log('🔍 Hasil require Bast:', User); // 🔥 Cek apakah undefined

const testAPI = async () => {
  try {
    if (!User) {
      console.error('❌ Surat tidak terload. Cek export di Bast.js');
      return;
    }

    console.log('✅ Bast berhasil di-load, mencoba findAll()...');
    const data = await User.findAll();
    console.log('✅ Data ditemukan:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error saat findAll:', err.message);
  }
};

testAPI();