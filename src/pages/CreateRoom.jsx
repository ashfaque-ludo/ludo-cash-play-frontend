import React, { useState } from 'react';
import axios from 'axios';

export default function CreateRoom() {
  const [amount, setAmount] = useState(100);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/room/create`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoom(res.data);
    } catch (e) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const pwd = Math.floor(1000 + Math.random() * 9000);
      setRoom({ roomCode: code, password: pwd, amount });
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#1a0b2e',padding:'40px 20px'}}>
      <div style={{maxWidth:'500px',margin:'0 auto'}}>
        <h1 style={{color:'#fff',fontSize:'32px',textAlign:'center',marginBottom:'30px'}}>🎮 Create Room</h1>

        {!room ? (
          <div style={{background:'rgba(255,255,255,0.1)',padding:'30px',borderRadius:'16px'}}>
            <p style={{color:'#fff',marginBottom:'15px'}}>Select Amount:</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px',marginBottom:'20px'}}>
              {[50,100,200,500,1000].map(a => (
                <button key={a} onClick={()=>setAmount(a)}
                  style={{padding:'15px',background:amount===a?'#ec4899':'rgba(255,255,255,0.1)',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>
                  ₹{a}
                </button>
              ))}
            </div>
            <button onClick={handleCreate} disabled={loading}
              style={{width:'100%',padding:'15px',background:'#10b981',color:'#fff',border:'none',borderRadius:'8px',fontSize:'18px',fontWeight:'bold',cursor:'pointer'}}>
              {loading?'Creating...':'✅ Create Room'}
            </button>
          </div>
        ) : (
          <div style={{background:'rgba(6,182,212,0.2)',border:'2px solid #06b6d4',padding:'30px',borderRadius:'16px',textAlign:'center'}}>
            <p style={{color:'#fff',marginBottom:'10px'}}>🎮 Room Code:</p>
            <p style={{color:'#06b6d4',fontSize:'48px',fontWeight:'bold',marginBottom:'20px'}}>{room.roomCode}</p>
            <p style={{color:'#fff',marginBottom:'10px'}}>🔐 Password:</p>
            <p style={{color:'#06b6d4',fontSize:'48px',fontWeight:'bold',marginBottom:'20px'}}>{room.password}</p>
            <p style={{color:'#fff',marginBottom:'20px'}}>💰 Entry: ₹{room.amount}</p>
            <button onClick={()=>{navigator.clipboard.writeText(`Room: ${room.roomCode}\nPassword: ${room.password}`);alert('Copied!')}}
              style={{width:'100%',padding:'12px',background:'#06b6d4',color:'#000',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>
              📋 Copy Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
