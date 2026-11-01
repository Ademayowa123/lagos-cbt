import React, { useState } from 'react';
import { Wifi, Globe, Copy, Check, QrCode, X, Smartphone, Monitor, Shield, ArrowRight } from 'lucide-react';

export default function ShareAccessModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const localIp = "10.183.237.22";
  const networkUrl = `http://${localIp}:5173/`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(networkUrl)}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(networkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay animate-fade-in no-print">
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: 'var(--radius-md)', color: '#3b82f6' }}>
              <Wifi size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>Access & Sharing Portal</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>How other devices, candidates, and examiners connect</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Method 1: Local Wi-Fi / LAN Network Access (Active Now) */}
          <div style={{ 
            background: 'var(--bg-tertiary)', 
            border: '1.5px solid var(--brand-emerald)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.25rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span className="badge badge-emerald">ACTIVE ON LOCAL WI-FI / NETWORK</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>Ready for Multi-Device</span>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Connect Any Device on the Same Wi-Fi / CBT Center LAN
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Anyone connected to this office or home Wi-Fi can open the CBT platform on their phone, iPad, or computer using this network address:
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              background: 'var(--bg-primary)', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-medium)',
              marginBottom: '1rem'
            }}>
              <code style={{ fontSize: '1.05rem', color: 'var(--brand-emerald)', fontWeight: 700, background: 'none', padding: 0 }}>
                {networkUrl}
              </code>
              <button 
                id="copy-network-url-btn"
                className="btn btn-sm btn-primary"
                onClick={handleCopy}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy URL"}</span>
              </button>
            </div>

            {/* QR Code and Mobile Scanning Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <img 
                  src={qrCodeUrl} 
                  alt="Scan to open CBT on mobile" 
                  style={{ width: '100px', height: '100px', display: 'block' }} 
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Smartphone size={16} color="var(--brand-emerald)" />
                  Instant Mobile Phone Access
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                  Open your smartphone camera or QR reader while connected to the same Wi-Fi network to launch the examination directly on mobile.
                </div>
              </div>
            </div>
          </div>

          {/* Method 2: Public Internet Deployment */}
          <div style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.25rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Globe size={18} color="var(--brand-primary)" />
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
                Deploy to the Public Internet (Anywhere in the World)
              </h4>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              To give access to examiners or candidates who are in other states, remote offices, or on cellular data without shared Wi-Fi, the app is production-ready for free 24/7 cloud hosting:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Option A: Vercel</strong>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  Run <code>npx vercel</code> for a free live <code>.vercel.app</code> HTTPS link.
                </div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Option B: Netlify</strong>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  Drag & drop the <code>/dist</code> folder to Netlify Drop for free live URL.
                </div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Option C: Cloudflare</strong>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  Use Cloudflare Pages or Tunnel for instant live links.
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Shield size={16} color="var(--brand-emerald)" />
            <span>
              <strong>Examiner Access Security:</strong> The Commission Admin area is protected by security authorization so examinees cannot access question banks or modify scoring thresholds.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
