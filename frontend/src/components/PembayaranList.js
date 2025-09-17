import React from "react";

function PembayaranList() {
  const data = [
    { id: 1, metode: "Transfer Bank", status: "Lunas" },
    { id: 2, metode: "Cash", status: "Pending" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Pembayaran</h1>
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Metode</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.id}</td>
              <td className="px-4 py-2 border">{item.metode}</td>
              <td className="px-4 py-2 border">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PembayaranList;
