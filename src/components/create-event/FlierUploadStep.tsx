
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlierUploadStepProps {
  flierData: string | null;
  onFlierUpdate: (flierData: string | null) => void;
}

export function FlierUploadStep({ flierData, onFlierUpdate }: FlierUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (PNG, JPG, JPEG, GIF)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onFlierUpdate(base64String);
      toast({
        title: "Flier Uploaded",
        description: "Your event flier has been uploaded successfully",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeFlier = () => {
    onFlierUpdate(null);
    toast({
      title: "Flier Removed",
      description: "The event flier has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Event Flier</h3>
        <p className="text-muted-foreground">
          Upload a flier that will be displayed to participants when they scan the QR code.
        </p>
      </div>

      {!flierData ? (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragActive ? 'border-meetcheck-blue bg-blue-50' : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium mb-2">Upload Event Flier</h4>
            <p className="text-muted-foreground text-center mb-4">
              Drag and drop your flier here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports PNG, JPG, JPEG, GIF • Max size 5MB
            </p>
            <div className="space-y-2">
              <Label htmlFor="flier-upload" className="cursor-pointer">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <span>
                    <FileImage className="h-4 w-4" />
                    Choose File
                  </span>
                </Button>
              </Label>
              <Input
                id="flier-upload"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Uploaded Flier</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removeFlier}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
            <div className="relative">
              <img 
                src={flierData} 
                alt="Event Flier" 
                className="w-full max-h-96 object-contain rounded-lg border"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              This flier will be displayed to participants when they scan the QR code
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
