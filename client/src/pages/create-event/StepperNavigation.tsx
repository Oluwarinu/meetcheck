
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  handleNext: () => void;
  handlePrevious: () => void;
}

export function StepperNavigation({
  currentStep,
  totalSteps,
  handleNext,
  handlePrevious
}: StepperNavigationProps) {
  return (
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
        {currentStep === totalSteps ? "Create Event & Generate QR" : "Next"}
        {currentStep < totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
      </Button>
    </div>
  );
}
