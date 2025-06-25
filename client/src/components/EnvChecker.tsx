import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EnvChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref') || supabaseKey.includes('your_supabase')) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-semibold">Configuration Required</h3>
            </div>
            <div className="text-sm">
              <p className="mb-2">Please configure your Supabase credentials in the .env file:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Add your VITE_SUPABASE_URL</li>
                <li>Add your VITE_SUPABASE_ANON_KEY</li>
              </ul>
              <p className="mt-2 text-xs">
                Get these from your Supabase dashboard → Settings → API
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnvChecker;