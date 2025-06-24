
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  User, 
  Search,
  Clock,
  MapPin,
  UserCheck
} from "lucide-react";

const eventTemplates = [
  {
    id: "lecture",
    title: "Academic Lecture",
    description: "Perfect for university lectures, seminars, and academic presentations",
    icon: GraduationCap,
    color: "bg-blue-500",
    category: "Education",
    features: [
      "Student attendance tracking",
      "Registration number field",
      "Department/Course information",
      "Presenter details"
    ],
    participantFields: [
      { id: "name", label: "Full Name", required: true },
      { id: "email", label: "Email Address", required: true },
      { id: "registration", label: "Student ID", required: true },
      { id: "course", label: "Course/Department", required: false },
    ],
    capacity: 150,
    duration: "1-2 hours"
  },
  {
    id: "wedding",
    title: "Wedding Celebration",
    description: "Elegant template for wedding ceremonies and receptions",
    icon: Users,
    color: "bg-pink-500",
    category: "Celebration",
    features: [
      "RSVP management",
      "Dietary requirements",
      "Plus-one tracking",
      "Seating arrangements"
    ],
    participantFields: [
      { id: "name", label: "Full Name", required: true },
      { id: "email", label: "Email Address", required: true },
      { id: "phone", label: "Phone Number", required: true },
      { id: "dietary", label: "Dietary Requirements", required: false },
      { id: "plusone", label: "Plus One", required: false },
    ],
    capacity: 200,
    duration: "4-6 hours"
  },
  {
    id: "conference",
    title: "Business Conference",
    description: "Professional template for conferences, workshops, and corporate events",
    icon: Calendar,
    color: "bg-green-500",
    category: "Business",
    features: [
      "Company information",
      "Job title tracking",
      "Networking facilitation",
      "Badge generation"
    ],
    participantFields: [
      { id: "name", label: "Full Name", required: true },
      { id: "email", label: "Email Address", required: true },
      { id: "organization", label: "Company/Organization", required: true },
      { id: "position", label: "Job Title", required: true },
      { id: "phone", label: "Phone Number", required: false },
    ],
    capacity: 300,
    duration: "1-3 days"
  },
  {
    id: "workshop",
    title: "Workshop/Training",
    description: "Interactive template for workshops, training sessions, and skill-building events",
    icon: User,
    color: "bg-purple-500",
    category: "Training",
    features: [
      "Skill level tracking",
      "Prerequisites check",
      "Material requirements",
      "Certification tracking"
    ],
    participantFields: [
      { id: "name", label: "Full Name", required: true },
      { id: "email", label: "Email Address", required: true },
      { id: "phone", label: "Phone Number", required: false },
      { id: "experience", label: "Experience Level", required: false },
      { id: "organization", label: "Organization", required: false },
    ],
    capacity: 50,
    duration: "2-8 hours"
  }
];

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", ...Array.from(new Set(eventTemplates.map(t => t.category)))];

  const filteredTemplates = eventTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: typeof eventTemplates[0]) => {
    // Remove the icon component from template data to avoid cloning issues
    const { icon, ...templateData } = template;
    navigate("/create-event", { state: { template: templateData } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Templates</h1>
          <p className="text-gray-600 mt-2">
            Choose from our pre-designed templates to quickly create your event
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${template.color} bg-opacity-10`}>
                    <IconComponent className={`h-6 w-6 ${template.color.replace('bg-', 'text-')}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {template.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-4 w-4" />
                    <span>{template.capacity} max</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{template.duration}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Participant Fields:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.participantFields.slice(0, 3).map((field, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field.label}
                      </Badge>
                    ))}
                    {template.participantFields.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.participantFields.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => handleUseTemplate(template)}
                  className="w-full mt-4"
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or category filter
          </p>
        </div>
      )}
    </div>
  );
}
