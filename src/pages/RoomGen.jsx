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
      <h1 style={{fontSize:'40px',marginBottom:'30px'}}>🎮 Room Code Generator</h1>
      <button onClick={generate} style={{padding:'20px 40px',background:'#10b981',color:'#fff',fontSize:'24px',border:'none',borderRadius:'12px',cursor:'pointer'}}>
        ✨ Generate Room
      </button>
      {room && (
        <div style={{marginTop:'40px',background:'rgba(6,182,212,0.2)',padding:'40px',borderRadius:'16px',display:'inline-block'}}>
          <p>Room Code:</p>
          <h2 style={{fontSize:'60px',color:'#06b6d4',margin:'10px'}}>{room.code}</h2>
          <p>Password:</p>
          <h2 style={{fontSize:'60px',color:'#06b6d4',margin:'10px'}}>{room.pwd}</h2>
        </div>
      )}
    </div>
  );
}
