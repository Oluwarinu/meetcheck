
import React from 'react';
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, FileText, Users, Lightbulb, Download, ExternalLink, Clock } from 'lucide-react';

const Resources = () => {
  const resourceCategories = [
    {
      title: "Getting Started",
      icon: <Lightbulb className="h-6 w-6" />,
      resources: [
        {
          title: "Quick Start Guide",
          description: "Set up your first event in under 5 minutes",
          type: "Guide",
          readTime: "3 min read",
          link: "#"
        },
        {
          title: "Event Planning Checklist",
          description: "Complete checklist for successful event management",
          type: "Template",
          readTime: "5 min read",
          link: "#"
        }
      ]
    },
    {
      title: "Video Tutorials",
      icon: <Video className="h-6 w-6" />,
      resources: [
        {
          title: "Creating Your First Event",
          description: "Step-by-step video walkthrough",
          type: "Video",
          readTime: "8 min watch",
          link: "#"
        },
        {
          title: "Advanced Analytics Overview",
          description: "Understand your event data and insights",
          type: "Video",
          readTime: "12 min watch",
          link: "#"
        }
      ]
    },
    {
      title: "Best Practices",
      icon: <BookOpen className="h-6 w-6" />,
      resources: [
        {
          title: "Maximizing Event Attendance",
          description: "Proven strategies to boost event participation",
          type: "Article",
          readTime: "7 min read",
          link: "#"
        },
        {
          title: "QR Code Setup Best Practices",
          description: "Optimize your check-in process for smooth operations",
          type: "Guide",
          readTime: "4 min read",
          link: "#"
        }
      ]
    },
    {
      title: "Templates & Downloads",
      icon: <Download className="h-6 w-6" />,
      resources: [
        {
          title: "Event Promotion Templates",
          description: "Ready-to-use templates for marketing your events",
          type: "Template",
          readTime: "Download",
          link: "#"
        },
        {
          title: "Attendee Survey Templates",
          description: "Collect valuable feedback from your participants",
          type: "Template",
          readTime: "Download",
          link: "#"
        }
      ]
    }
  ];

  const featuredArticles = [
    {
      title: "The Complete Guide to Event Analytics",
      description: "Learn how to measure event success and ROI using MeetCheck's analytics features",
      category: "Analytics",
      readTime: "15 min read",
      featured: true
    },
    {
      title: "Scaling Events: From 50 to 5000 Attendees",
      description: "Real-world case studies and strategies for growing your events",
      category: "Growth",
      readTime: "10 min read",
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resources & Learning Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to master event management and maximize your success with MeetCheck
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredArticles.map((article, index) => (
              <Card key={index} className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-600 text-white">{article.category}</Badge>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Read Article
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resource Categories */}
        <div className="space-y-12">
          {resourceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {category.resources.map((resource, resourceIndex) => (
                  <Card key={resourceIndex} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {resource.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        {resource.type === 'Template' ? 'Download' : resource.type === 'Video' ? 'Watch Now' : 'Read More'}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Additional Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed with your events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Contact Support
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline">
              Join Community Forum
              <Users className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
