import React from 'react';
import WebsiteQR from '../components/qr/WebsiteQR';

export default function QRGenerator() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gradient mb-2">QR Code Generator</h1>
          <p className="text-slate-600">Generate and share QR codes for AutoSpareOne website and deals</p>
        </div>

        {/* Website QR Code */}
        <WebsiteQR />
      </div>
    </div>
  );
}
