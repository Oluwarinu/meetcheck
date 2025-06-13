
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Users } from "lucide-react";

export default function QRCode() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Event QR Code</h1>
        <p className="text-muted-foreground">Share this QR code with attendees for easy check-in.</p>
      </div>

      <Card className="bg-teal-600 text-white border-0">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 border-4 border-black grid grid-cols-8 gap-px mx-auto mb-4">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
                <div className="text-black">
                  <h3 className="font-bold">MeetCheck Check In</h3>
                  <p className="text-xs">Scan this QR code to check in</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Tech Conference 2024</h2>
        <p className="text-muted-foreground mb-4">
          July 15, 2024, 9:00 AM - 5:00 PM | Innovation Center, San Francisco
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Users className="h-4 w-4" />
          <span className="font-semibold">125</span>
          <span className="text-muted-foreground">Attendees Checked In</span>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share QR Code
          </Button>
          <Button className="bg-meetcheck-blue hover:bg-blue-600 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Event Status:</strong> Active
          </p>
        </div>
      </div>
    </div>
  );
}
