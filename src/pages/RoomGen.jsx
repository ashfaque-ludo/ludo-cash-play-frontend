import React, { useState } from 'react';
export default function RoomGen() {
  const [r, setR] = useState(null);
  return (
    <div style={{minHeight:'100vh',background:'#1a0b2e',padding:'40px',color:'#fff',textAlign:'center'}}>
      <h1 style={{fontSize:'40px'}}>Room Generator</h1>
      <button onClick={()=>setR({c:Math.floor(100000+Math.random()*900000),p:Math.floor(1000+Math.random()*9000)})} style={{padding:'20px 40px',background:'#10b981',color:'#fff',fontSize:'24px',border:'none',borderRadius:'12px',cursor:'pointer',margin:'30px'}}>Generate Room</button>
      {r && <div style={{background:'rgba(6,182,212,0.2)',padding:'40px',borderRadius:'16px',display:'inline-block',marginTop:'20px'}}><p>Code:</p><h2 style={{fontSize:'60px',color:'#06b6d4'}}>{r.c}</h2><p>Password:</p><h2 style={{fontSize:'60px',color:'#06b6d4'}}>{r.p}</h2></div>}
    </div>
  );
}
