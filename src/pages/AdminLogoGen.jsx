import React from 'react';
import GenerateLogo from '../components/admin/GenerateLogo';

export default function AdminLogoGen() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gradient mb-6">Admin: Logo Generator</h1>
        <GenerateLogo />
      </div>
    </div>
  );
}

