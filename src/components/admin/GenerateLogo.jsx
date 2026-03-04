import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function GenerateLogo() {
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  const generateLogo = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: "Professional logo for 'MechBridge' - a two-wheeler spare parts company. Design features a sleek modern blue motorcycle with chrome helmet in center, surrounded by automotive spare parts and tools (wrench, drill, spark plug, oil drop). Dark navy blue background with glowing blue and cyan accents. The text 'MechBridge' in bold modern font with 'Mech' in white/silver and 'Bridge' in bright cyan blue. Below the logo text: 'YOUR TRUSTED TWO-WHEELER SPARE PARTNER' in smaller white text. Professional, high-tech, dynamic composition with speed lines. Square format, website branding.",
        existing_image_urls: ["https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68bd4d604890101c87a5b6b7/6dda5dcbf_ChatGPTImageJan2202611_11_30PM.png"]
      });
      
      setLogoUrl(result.url);
      toast.success("Logo generated! Copy the URL below and update your files.");
    } catch (error) {
      console.error('Error generating logo:', error);
      toast.error("Failed to generate logo");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate MechBridge Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateLogo} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Logo'
            )}
          </Button>
          
          {logoUrl && (
            <div className="space-y-4">
              <img src={logoUrl} alt="Generated MechBridge Logo" className="w-full max-w-md rounded-lg border" />
              <div className="p-3 bg-slate-100 rounded">
                <p className="text-sm font-mono break-all">{logoUrl}</p>
              </div>
              <p className="text-sm text-slate-600">
                Copy this URL and update it in Layout.js and HeroSection.jsx
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}