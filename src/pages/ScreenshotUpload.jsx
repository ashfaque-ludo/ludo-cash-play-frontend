import React, { useState } from 'react';
import axios from 'axios';

export default function ScreenshotUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setMessage('File too large. Max 5MB.');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage('Upload successful!');
      setFile(null);
      setPreview(null);
    } catch (err) {
      setMessage('Upload failed: ' + (err.response?.data?.error || err.message));
    }

    setUploading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#1a0b2e',padding:'40px 20px',color:'#fff'}}>
      <div style={{maxWidth:'500px',margin:'0 auto'}}>
        <h1 style={{fontSize:'32px',textAlign:'center',marginBottom:'30px'}}>Upload Screenshot</h1>

        <div style={{background:'rgba(255,255,255,0.1)',padding:'30px',borderRadius:'16px'}}>
          <label style={{display:'block',padding:'40px',border:'2px dashed #06b6d4',borderRadius:'12px',textAlign:'center',cursor:'pointer',marginBottom:'20px'}}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
            <div style={{fontSize:'48px',marginBottom:'10px'}}>📸</div>
            <div>{file ? file.name : 'Click to select screenshot'}</div>
            <div style={{fontSize:'12px',color:'#888',marginTop:'10px'}}>Max 5MB</div>
          </label>

          {preview && (
            <div style={{marginBottom:'20px'}}>
              <img src={preview} alt="Preview" style={{width:'100%',borderRadius:'8px',border:'1px solid #06b6d4'}} />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              width:'100%',
              padding:'15px',
              background: !file || uploading ? '#555' : '#10b981',
              color:'#fff',
              border:'none',
              borderRadius:'8px',
              fontSize:'18px',
              fontWeight:'bold',
              cursor: !file || uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

          {message && (
            <div style={{marginTop:'20px',padding:'15px',background:message.includes('success')?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)',borderRadius:'8px',textAlign:'center'}}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}