import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Upgrade() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Upgrade</h1>
            <p className="text-muted-foreground">
              Upgrade your account to unlock premium features
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Upgrade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Ready to unlock more features?</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}