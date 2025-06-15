
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  template?: any;
}

export function StepHeader({ currentStep, totalSteps, template }: StepHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      <Link to="/events" className="text-meetcheck-blue hover:text-blue-600 flex items-center gap-1 mb-4">
        <ChevronLeft className="h-4 w-4" />
        Events
      </Link>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Events</span>
        <span>/</span>
        <span>New Event</span>
        {template && (
          <>
            <span>/</span>
            <span>{template.title}</span>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}
          {template && <span className="text-lg font-normal text-muted-foreground ml-2">- {template.title}</span>}
        </h1>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
