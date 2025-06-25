import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import IndustryDashboard from '@/components/industry/IndustryDashboard';

export default function IndustryDashboardPage() {
  const { user } = useAuth();
  
  // This would typically come from user profile or settings
  const industryType = 'corporate'; // Default or from user profile
  const userRole = 'Training Manager'; // From user profile/role
  
  return (
    <div className="container mx-auto px-4 py-6">
      <IndustryDashboard 
        industryType={industryType as 'corporate' | 'education' | 'networking'}
        userRole={userRole}
      />
    </div>
  );
}