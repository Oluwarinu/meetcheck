
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const EnvChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref') || supabaseKey.includes('your_supabase')) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Required</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">Please configure your Supabase credentials in the .env file:</p>
              <ul className="text-xs space-y-1">
                <li>• Add your VITE_SUPABASE_URL</li>
                <li>• Add your VITE_SUPABASE_ANON_KEY</li>
              </ul>
              <p className="mt-2 text-xs">
                Get these from your Supabase dashboard → Settings → API
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnvChecker;
