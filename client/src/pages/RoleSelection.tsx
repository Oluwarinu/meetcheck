import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  Users, 
  Building2, 
  Calendar,
  BarChart3,
  BookOpen,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface Role {
  id: 'training_manager' | 'hr_leader' | 'educator' | 'event_organizer';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  primaryColor: string;
}

const roles: Role[] = [
  {
    id: 'training_manager',
    title: 'Training Manager',
    description: 'Corporate training and development programs',
    icon: <Briefcase className="h-8 w-8" />,
    features: ['Compliance Tracking', 'Skills Assessment', 'Training ROI Analytics', 'Certification Management'],
    primaryColor: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'hr_leader',
    title: 'HR Leader',
    description: 'Human resources and workforce management',
    icon: <Users className="h-8 w-8" />,
    features: ['Employee Engagement', 'Onboarding Tracking', 'Performance Analytics', 'Team Building Events'],
    primaryColor: 'bg-green-600 hover:bg-green-700'
  },
  {
    id: 'educator',
    title: 'Educator',
    description: 'Academic institutions and educational programs',
    icon: <GraduationCap className="h-8 w-8" />,
    features: ['Attendance & Demographics', 'Academic Performance', 'Assignment Tracking', 'Early Intervention'],
    primaryColor: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    id: 'event_organizer',
    title: 'Event Organizer',
    description: 'Professional events and networking',
    icon: <Calendar className="h-8 w-8" />,
    features: ['Event Management', 'Networking Analytics', 'Engagement Tracking', 'Post-Event Surveys'],
    primaryColor: 'bg-orange-600 hover:bg-orange-700'
  }
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  console.log('RoleSelection - User:', user);

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user, redirecting to login');
    navigate('/login');
    return null;
  }

  // If user already has a role, redirect to dashboard
  if (user.user_role) {
    console.log('User has role:', user.user_role, 'redirecting to dashboard');
    navigate('/dashboard');
    return null;
  }

  const handleRoleSelect = async (roleId: Role['id']) => {
    console.log('Role selected:', roleId);
    try {
      const updatedUser = await updateProfile({ user_role: roleId });
      console.log('Profile updated:', updatedUser);
      
      toast({
        title: "Role Selected",
        description: `Welcome to your ${roles.find(r => r.id === roleId)?.title} dashboard!`,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({
        title: "Error",
        description: "Failed to update your role. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Role</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your primary role to get a customized dashboard with specialized tools, 
            templates, and analytics designed for your specific needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className="relative hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${role.primaryColor} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {role.icon}
                </div>
                <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">{role.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 mb-6">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full ${role.primaryColor} text-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect(role.id);
                  }}
                >
                  Select Role
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            You can change your role anytime in Settings
          </p>
        </div>
      </div>
    </div>
  );
}