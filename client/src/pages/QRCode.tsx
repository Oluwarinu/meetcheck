import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share2, Copy, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateEventId, sanitizeInput } from "@/utils/security";
import QRCodeLib from "qrcode";

export default function QRCode() {
  const { id } = useParams();
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [checkInLink, setCheckInLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Validate event ID
  const isValidEventId = id && validateEventId(id);

  useEffect(() => {
    if (!isValidEventId) {
      toast({
        title: "Invalid Event",
        description: "The event ID is invalid or missing.",
        variant: "destructive"
      });
      return;
    }

    generateQRCode();
  }, [id, isValidEventId]);

  const generateQRCode = async () => {
    if (!id || !isValidEventId) return;

    setIsGenerating(true);
    try {
      const sanitizedId = sanitizeInput(id);
      const baseUrl = window.location.origin;
      const checkInUrl = `${baseUrl}/public/checkin/${encodeURIComponent(sanitizedId)}`;
      
      setCheckInLink(checkInUrl);

      // Generate QR code with correct options
      const qrDataUrl = await QRCodeLib.toDataURL(checkInUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        width: 256
      });

      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    try {
      const link = document.createElement('a');
      link.download = `meetcheck-event-${sanitizeInput(id || 'unknown')}-qr.png`;
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "QR Code Downloaded",
        description: "QR code has been saved to your device.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download QR code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyLink = async () => {
    if (!checkInLink) return;

    try {
      await navigator.clipboard.writeText(checkInLink);
      toast({
        title: "Link Copied",
        description: "Check-in link has been copied to clipboard.",
      });
    } catch (error) {
      console.error('Copy error:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = checkInLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Link Copied",
          description: "Check-in link has been copied to clipboard.",
        });
      } catch (fallbackError) {
        toast({
          title: "Copy Failed",
          description: "Could not copy link. Please copy manually.",
          variant: "destructive"
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const shareQRCode = async () => {
    if (!checkInLink) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MeetCheck Event Check-in',
          text: 'Join our event using this check-in link',
          url: checkInLink,
        });
      } else {
        // Fallback to copying
        await copyLink();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share error:', error);
        toast({
          title: "Share Failed",
          description: "Could not share the link. Link copied instead.",
          variant: "destructive"
        });
      }
    }
  };

  if (!isValidEventId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Invalid or missing event ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event QR Code</h1>
          <p className="text-gray-600">
            Share this QR code or link with participants for easy check-in
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* QR Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                {isGenerating ? (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Event QR Code" 
                    className="w-64 h-64 border rounded-lg"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={downloadQRCode} 
                  disabled={!qrCodeUrl || isGenerating}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  onClick={shareQRCode}
                  disabled={!checkInLink || isGenerating}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Check-in Link Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Direct Check-in Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  For participants who can't scan QR codes
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <code className="text-sm break-all text-gray-800">
                    {checkInLink || "Generating..."}
                  </code>
                </div>
              </div>
              
              <Button 
                onClick={copyLink} 
                disabled={!checkInLink || isGenerating}
                className="w-full"
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Share this link via email, SMS, or messaging apps</p>
                <p>• Participants click the link to check-in directly</p>
                <p>• Works on any device with internet access</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">How to use:</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-sm mb-1">QR Code Method:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. Download and print the QR code</li>
                  <li>2. Display it at your event entrance</li>
                  <li>3. Participants scan with their phone camera</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Direct Link Method:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. Copy the check-in link</li>
                  <li>2. Share via email, SMS, or social media</li>
                  <li>3. Participants click to check-in directly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
