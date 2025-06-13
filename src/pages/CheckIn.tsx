
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";

export default function CheckIn() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCheckIn = () => {
    setIsChecking(true);
    setProgress(0);
    
    // Simulate check-in process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsChecking(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-8 h-8 bg-meetcheck-blue rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <CardTitle>Event Check-In</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please fill in the details below to check in to the event.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Enter your company name"
              value={formData.company}
              onChange={(e) => updateFormData("company", e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <MapPin className="h-4 w-4" />
            <span>Location: Detected (Accuracy: High)</span>
          </div>

          {isChecking && (
            <div className="space-y-2">
              <p className="text-sm text-center">Checking In...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleCheckIn}
            disabled={isChecking || !formData.name || !formData.email}
            className="w-full bg-meetcheck-blue hover:bg-blue-600"
          >
            {isChecking ? "Checking In..." : "Check In"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By checking in, you agree to the event's terms and conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
