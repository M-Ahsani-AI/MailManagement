import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function KategoriForm({ formData = {}, onSubmit, onCancel, isEditing }) {
  const [localData, setLocalData] = React.useState(formData);
  const quillRef = React.useRef(null);

  React.useEffect(() => {
    setLocalData({
      ...formData,
      template: formData.template || '',
    });
  }, [formData]);

  const handleTemplateChange = (content) => {
    setLocalData({ ...localData, template: content });
  };

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localData.kode || !localData.nama_kategori) {
      alert('Field Kode dan Detail wajib diisi');
      return;
    }
    onSubmit(localData);
  };

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      try {
        const res = await axios.post(`${API_URL}/upload`, uploadFormData);
        const url = res.data.url;
        
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', `${API_URL.replace('/api', '')}${url}`);
      } catch (err) {
        console.error('Gagal upload gambar:', err);
        alert('Gagal mengunggah gambar.');
      }
    };
  }, []);

  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'table'],
      ],
      handlers: {
        'image': imageHandler,
      }
    },
    // ✅ KOREKSI FINAL: Hapus baris 'table: true' yang menyebabkan error
  }), [imageHandler]);


  return (
    // Lapisan luar untuk menengahkan modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      
      {/* Panel Modal dengan flex column dan tinggi maksimal agar bisa scroll */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[90vh]">

        {/* Header Modal */}
        <h3 className="text-xl font-bold p-6 pb-4 flex-shrink-0">
          {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
        </h3>
        
        {/* Form dijadikan area yang bisa scroll */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 pb-6">
          
          <div className="mb-4">
            <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
            <input id="kode" name="kode" value={localData.kode || ''} onChange={handleChange} required className="w-full border p-2 rounded" disabled={isEditing} />
          </div>
          
          <div className="mb-4">
            <label htmlFor="nama_kategori" className="block text-sm font-medium text-gray-700 mb-1">Detail</label>
            <input id="nama_kategori" name="nama_kategori" value={localData.nama_kategori || ''} onChange={handleChange} required className="w-full border p-2 rounded" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={localData.template || ''}
              onChange={handleTemplateChange}
              modules={modules}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}</button>
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default KategoriForm;