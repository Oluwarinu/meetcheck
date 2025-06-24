import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function QRCode() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">QR Code</h1>
            <p className="text-muted-foreground">
              Generate and manage QR codes for event check-ins
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>QR code generation coming soon!</p>
            <p className="text-sm mt-2">
              We're working on QR code generation and management features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}