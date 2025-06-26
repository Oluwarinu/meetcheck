import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import EducatorTemplates from "@/components/educator/EducatorTemplates";
import { useLocation } from "wouter";
import { Search, GraduationCap, Heart, Building, Users, Clock, User } from "lucide-react";

const templateCategories = [
  { id: "all", name: "All", icon: null },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "celebration", name: "Celebration", icon: Heart },
  { id: "business", name: "Business", icon: Building },
  { id: "training", name: "Training", icon: Users }
];

const eventTemplates = [
  {
    id: "academic-lecture",
    name: "Academic Lecture",
    description: "Perfect for university lectures, seminars, and academic presentations",
    category: "education",
    maxAttendees: 150,
    duration: "1-2 hours",
    features: ["Student attendance tracking", "Registration number field", "Department/Course information"],
    fields: ["Full Name", "Email Address", "Student ID", "+1 more"],
    icon: GraduationCap,
    color: "blue"
  },
  {
    id: "wedding-celebration",
    name: "Wedding Celebration",
    description: "Elegant template for wedding ceremonies and receptions",
    category: "celebration",
    maxAttendees: 200,
    duration: "4-6 hours",
    features: ["RSVP management", "Dietary requirements", "Plus-one tracking"],
    fields: ["Full Name", "Email Address", "Phone Number", "+2 more"],
    icon: Heart,
    color: "pink"
  },
  {
    id: "business-conference",
    name: "Business Conference",
    description: "Professional template for conferences, workshops, and corporate events",
    category: "business",
    maxAttendees: 300,
    duration: "1-3 days",
    features: ["Company information", "Job title tracking", "Networking facilitation"],
    fields: ["Full Name", "Email Address", "Company/Organization", "+2 more"],
    icon: Building,
    color: "green"
  },
  {
    id: "workshop-training",
    name: "Workshop/Training",
    description: "Interactive template for workshops, training sessions, and skill-building events",
    category: "training",
    maxAttendees: 50,
    duration: "Half/Full day",
    features: ["Skill level tracking", "Pre-training survey", "Certificate generation"],
    fields: ["Full Name", "Email Address", "Experience Level", "+1 more"],
    icon: Users,
    color: "purple"
  }
];

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const userRole = user?.user_role;

  const handleUseTemplate = (template: any) => {
    // Store template in sessionStorage for event creation
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    
    // Navigate to educator events page to create event with template
    if (userRole === 'educator') {
      setLocation('/educator/events?useTemplate=true');
    } else {
      setLocation('/events/create?useTemplate=true');
    }
  };

  // Show educator-specific templates if user is an educator
  if (userRole === 'educator') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <EducatorTemplates onSelectTemplate={handleUseTemplate} />
      </div>
    );
  }

  const filteredTemplates = eventTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      pink: "bg-pink-50 border-pink-200 text-pink-700", 
      green: "bg-green-50 border-green-200 text-green-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Event Templates</h1>
        <p className="text-gray-600 mt-1">Choose from our pre-designed templates to quickly create your event</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {templateCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(template.color)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Template Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {template.maxAttendees} max
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.duration}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Features:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Participant Fields */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Participant Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.map((field, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
}