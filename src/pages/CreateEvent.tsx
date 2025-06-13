
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: ""
  });
  const navigate = useNavigate();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission
      console.log("Event created:", formData);
      navigate("/events");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/events" className="text-meetcheck-blue hover:text-blue-600 flex items-center gap-1 mb-4">
          <ChevronLeft className="h-4 w-4" />
          Events
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Events</span>
          <span>/</span>
          <span>New Event</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Step {currentStep} of {totalSteps}</h1>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Team Meeting, Conference, Workshop"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief overview of the event"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData("date", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateFormData("time", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Expected Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Maximum number of attendees"
                  value={formData.capacity}
                  onChange={(e) => updateFormData("capacity", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Attendance Settings</h3>
              <p className="text-muted-foreground">Configure how attendees will check in to your event.</p>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Location Verification</h3>
              <p className="text-muted-foreground">Set up location-based verification for secure check-ins.</p>
            </div>
          )}

          {currentStep === 6 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Review & Create</h3>
              <p className="text-muted-foreground">Review your event details and create the event.</p>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-medium mb-2">{formData.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{formData.description}</p>
                <p className="text-sm"><strong>Date:</strong> {formData.date}</p>
                <p className="text-sm"><strong>Time:</strong> {formData.time}</p>
                <p className="text-sm"><strong>Location:</strong> {formData.location}</p>
                <p className="text-sm"><strong>Capacity:</strong> {formData.capacity}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-meetcheck-blue hover:bg-blue-600"
            >
              {currentStep === totalSteps ? "Create Event" : "Next"}
              {currentStep < totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
