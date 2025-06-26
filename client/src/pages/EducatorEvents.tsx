import React from 'react';
import EventManagementDashboard from '@/components/educator/EventManagementDashboard';

export default function EducatorEvents() {
  return (
    <div className="container mx-auto px-4 py-6">
      <EventManagementDashboard onCreateComplete={() => {}} />
    </div>
  );
}