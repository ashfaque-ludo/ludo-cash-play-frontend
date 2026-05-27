import React, { useState, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ScreenshotUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [matchId, setMatchId] = useState("");
  const [amount, setAmount] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: true });
  const inputRef = useRef();

  const pickFile = (selected) => {
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      setMessage({ text: "File too large. Max 5MB.", ok: false });
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setMessage({ text: "Only image files allowed.", ok: false });
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMessage({ text: "", ok: true });
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleUpload = async () => {
    if (!file) return setMessage({ text: "Please select a screenshot first.", ok: false });

    setUploading(true);
    setMessage({ text: "", ok: true });

    const formData = new FormData();
    formData.append("screenshot", file);
    if (matchId.trim()) formData.append("match_id", matchId.trim());
    if (amount) formData.append("amount", amount);

    try {
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ text: "Screenshot uploaded! Pending admin review.", ok: true });
      setFile(null);
      setPreview(null);
      setMatchId("");
      setAmount("");
    } catch (err) {
      setMessage({ text: "Upload failed: " + (err.response?.data?.error || err.message), ok: false });
    }

    setUploading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0E", padding: "80px 20px", color: "#fff" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
          Upload Match Screenshot
        </h1>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: 32, fontSize: 14 }}>
          Upload your winning screenshot for admin review. Prize money is credited after approval.
        </p>

        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.1)" }}>
          {/* Drag-drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            style={{
              padding: "36px 20px",
              border: `2px dashed ${dragging ? "#a855f7" : "#334155"}`,
              borderRadius: 12,
              textAlign: "center",
              cursor: "pointer",
              marginBottom: 20,
              background: dragging ? "rgba(168,85,247,0.08)" : "transparent",
              transition: "all 0.15s",
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => pickFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
            {file ? (
              <div style={{ color: "#a855f7", fontWeight: 600 }}>{file.name}</div>
            ) : (
              <>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Drag & drop or click to select</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>PNG, JPG, WEBP · Max 5 MB</div>
              </>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div style={{ marginBottom: 20 }}>
              <img
                src={preview}
                alt="Preview"
                style={{ width: "100%", borderRadius: 8, border: "1px solid rgba(168,85,247,0.4)", maxHeight: 300, objectFit: "contain" }}
              />
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                style={{ marginTop: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13 }}
              >
                Remove
              </button>
            </div>
          )}

          {/* Match ID */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>
              Match ID (optional)
            </label>
            <input
              type="text"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              placeholder="e.g. 664abc..."
              style={{
                width: "100%", padding: "10px 14px", background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                color: "#fff", fontSize: 14, boxSizing: "border-box",
              }}
            />
          </div>

          {/* Prize amount */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>
              Prize amount to claim (₹)
            </label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 900"
              style={{
                width: "100%", padding: "10px 14px", background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                color: "#fff", fontSize: 14, boxSizing: "border-box",
              }}
            />
            {amount && (
              <p style={{ color: "#10b981", fontSize: 12, marginTop: 4 }}>
                After 10% commission: ₹{(parseFloat(amount || 0) * 0.9).toFixed(2)}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              width: "100%", padding: "14px 0",
              background: !file || uploading ? "#374151" : "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: !file || uploading ? "#9ca3af" : "#fff",
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700,
              cursor: !file || uploading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {uploading ? "Uploading…" : "Submit Screenshot"}
          </button>

          {message.text && (
            <div style={{
              marginTop: 16, padding: "12px 16px", borderRadius: 8, fontSize: 14,
              background: message.ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${message.ok ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
              color: message.ok ? "#10b981" : "#ef4444",
            }}>
              {message.text}
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, marginTop: 20 }}>
          Admin usually reviews within 1–2 hours. Prize is added to your Winnings wallet.
        </p>
      </div>
    </div>
  );
}
