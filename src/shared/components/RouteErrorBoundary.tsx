import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export function RouteErrorBoundary() {
  const error: any = useRouteError();

  let errorMessage = 'An unexpected error occurred while rendering this page.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card padding="lg" className="max-w-md w-full border border-slate-200 text-center space-y-5 shadow-md">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Application Recovery
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {errorStatus === 404
              ? 'The requested campus page could not be found.'
              : 'SkillBridge encountered an unexpected render issue. Your data and session remain secure.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-slate-100 rounded-xl text-left border border-slate-200/80">
            <p className="text-[11px] font-mono text-slate-700 break-all">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            variant="outline"
            className="flex-1 text-xs font-semibold py-2.5"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>

          <Button
            className="flex-1 text-xs font-semibold py-2.5 bg-slate-900 hover:bg-black text-white"
            leftIcon={<Home className="w-3.5 h-3.5" />}
            onClick={() => {
              window.location.href = '/feed';
            }}
          >
            Go to Feed
          </Button>
        </div>
      </Card>
    </div>
  );
}
