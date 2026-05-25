import React, { useState } from 'react';
export default function RoomGen() {
  const [room, setRoom] = useState(null);
  const generate = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const pwd = Math.floor(1000 + Math.random() * 9000);
    setRoom({ code, pwd });
  };
  return (
    <div style={{minHeight:'100vh',background:'#1a0b2e',padding:'40px 20px',color:'#fff',textAlign:'center'}}>
      <h1 style={{fontSize:'40px',marginBottom:'30px'}}>Room Code Generator</h1>
      <button onClick={generate} style={{padding:'20px 50px',background:'#10b981',color:'#fff',fontSize:'24px',border:'none',borderRadius:'12px',cursor:'pointer',fontWeight:'bold'}}>
        Generate Room
      </button>
      {room && (
        <div style={{marginTop:'40px',background:'rgba(6,182,212,0.2)',border:'2px solid #06b6d4',padding:'40px',borderRadius:'16px',display:'inline-block'}}>
          <p style={{fontSize:'18px',marginBottom:'10px'}}>Room Code:</p>
          <h2 style={{fontSize:'60px',color:'#06b6d4',margin:'10px 0'}}>{room.code}</h2>
          <p style={{fontSize:'18px',marginBottom:'10px',marginTop:'20px'}}>Password:</p>
          <h2 style={{fontSize:'60px',color:'#06b6d4',margin:'10px 0'}}>{room.pwd}</h2>
          <button onClick={() => { navigator.clipboard.writeText('Room: ' + room.code + ' Password: ' + room.pwd); alert('Copied!'); }} style={{marginTop:'20px',padding:'12px 30px',background:'#06b6d4',color:'#000',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
