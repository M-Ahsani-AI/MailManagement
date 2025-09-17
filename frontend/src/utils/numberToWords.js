// backend/utils/numberToWords.js

const terbilang = (angka) => {
  const bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  if (angka < 12) {
    return bilangan[angka];
  } else if (angka < 20) {
    return terbilang(angka - 10) + ' Belas';
  } else if (angka < 100) {
    return terbilang(Math.floor(angka / 10)) + ' Puluh ' + terbilang(angka % 10);
  } else if (angka < 200) {
    return 'Seratus ' + terbilang(angka - 100);
  } else if (angka < 1000) {
    return terbilang(Math.floor(angka / 100)) + ' Ratus ' + terbilang(angka % 100);
  } else if (angka < 2000) {
    return 'Seribu ' + terbilang(angka - 1000);
  } else if (angka < 1000000) {
    return terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
  } else if (angka < 1000000000) {
    return terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
  } else if (angka < 1000000000000) {
    return terbilang(Math.floor(angka / 1000000000)) + ' Milyar ' + terbilang(angka % 1000000000);
  } else if (angka < 1000000000000000) {
    return terbilang(Math.floor(angka / 1000000000000)) + ' Triliun ' + terbilang(angka % 1000000000000);
  }
  return 'Angka terlalu besar';
};

const numberToWords = (number) => {
  if (number === 0) return 'Nol Rupiah';
  
  const parts = number.toString().split('.');
  const integerPart = parseInt(parts[0], 10);
  const decimalPart = parts[1] ? parseInt(parts[1], 10) : 0;
  
  let result = '';
  if (integerPart > 0) {
    result += terbilang(integerPart) + ' Rupiah';
  }
  
  if (decimalPart > 0) {
    if (result) {
      result += ' dan ';
    }
    result += terbilang(decimalPart) + ' Sen';
  }
  
  return result.trim();
};

module.exports = { numberToWords };