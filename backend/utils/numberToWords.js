// backend/utils/numberToWords.js

const a = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

function terbilang(n) {
  if (n < 12) {
    return a[n];
  }
  if (n < 20) {
    return a[n - 10] + ' belas';
  }
  if (n < 100) {
    return a[Math.floor(n / 10)] + ' puluh ' + a[n % 10];
  }
  if (n < 200) {
    return 'seratus ' + terbilang(n - 100);
  }
  if (n < 1000) {
    return a[Math.floor(n / 100)] + ' ratus ' + terbilang(n % 100);
  }
  if (n < 2000) {
    return 'seribu ' + terbilang(n - 1000);
  }
  if (n < 1000000) {
    return terbilang(Math.floor(n / 1000)) + ' ribu ' + terbilang(n % 1000);
  }
  if (n < 1000000000) {
    return terbilang(Math.floor(n / 1000000)) + ' juta ' + terbilang(n % 1000000);
  }
  if (n < 1000000000000) {
    return terbilang(Math.floor(n / 1000000000)) + ' milyar ' + terbilang(n % 1000000000);
  }
  if (n < 1000000000000000) {
    return terbilang(Math.floor(n / 1000000000000)) + ' triliun ' + terbilang(n % 1000000000000);
  }
}

function numberToWords(n) {
  if (n === null || n === undefined) return '';
  const num = Number(n);
  if (num === 0) return 'Nol';
  const result = terbilang(num).trim().replace(/\s+/g, ' ');
  return result.charAt(0).toUpperCase() + result.slice(1); // Kapital di awal kalimat
}

module.exports = { numberToWords };