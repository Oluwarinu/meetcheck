
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Users, Copy, Link as LinkIcon } from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";

export default function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [checkInUrl, setCheckInUrl] = useState<string>("");
  const location = useLocation();
  const { id: eventId } = useParams();
  const { toast } = useToast();
  
  const eventData = location.state?.eventData;

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Create check-in URL that would be used by attendees
        const url = `${window.location.origin}/check-in?eventId=${eventId}`;
        setCheckInUrl(url);
        
        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (eventId) {
      generateQRCode();
    }
  }, [eventId]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${eventData?.title || 'Event'}-QR-Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(checkInUrl);
      toast({
        title: "Link copied!",
        description: "Check-in link has been copied to clipboard.",
      });
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `${eventData?.title || 'Event'}-QR-Code.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `${eventData?.title || 'Event'} QR Code`,
          text: 'Scan this QR code to check in to the event',
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        // Fallback: copy URL to clipboard
        handleCopyLink();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyLink();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Event Check-In Options</h1>
        <p className="text-muted-foreground">Share these options with attendees for easy check-in.</p>
      </div>

      {/* QR Code Section */}
      <Card className="bg-teal-600 text-white border-0">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="w-72 h-72 bg-gray-200 rounded-lg flex items-center justify-center">
              {qrCodeUrl ? (
                <div className="text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="Event QR Code" 
                    className="w-64 h-64 mx-auto mb-4"
                  />
                  <div className="text-black">
                    <h3 className="font-bold">MeetCheck Check In</h3>
                    <p className="text-xs">Scan this QR code to check in</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p>Generating QR Code...</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in Link Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Alternative Check-in Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            For attendees who can't scan QR codes, share this direct link:
          </p>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <code className="flex-1 text-sm font-mono break-all">
              {checkInUrl}
            </code>
            <Button 
              onClick={handleCopyLink}
              size="sm"
              variant="outline"
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">{eventData?.title || 'Event'}</h2>
        <p className="text-muted-foreground mb-4">
          {eventData?.date && eventData?.time ? 
            `${eventData.date}, ${eventData.time}` : 
            'Date and time to be announced'
          } | {eventData?.location || 'Location to be announced'}
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Users className="h-4 w-4" />
          <span className="font-semibold">0</span>
          <span className="text-muted-foreground">Attendees Checked In</span>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share QR Code
          </Button>
          <Button 
            className="bg-meetcheck-blue hover:bg-blue-600 flex items-center gap-2"
            onClick={handleDownload}
            disabled={!qrCodeUrl}
          >
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
          <Button 
            variant="outline"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Event Status:</strong> Active
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Both QR code and direct link lead to the same check-in page
          </p>
        </div>
      </div>
    </div>
  );
}
