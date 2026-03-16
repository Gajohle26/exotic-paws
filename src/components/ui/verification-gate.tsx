import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface VerificationGateProps {
  children: ReactNode;
  messageToVerify?: string;
}

export function VerificationGate({ 
  children, 
  messageToVerify = "You must complete document verification to access this page" 
}: VerificationGateProps) {
  const { member, isLoading: memberLoading } = useMember();
  const { isVerified, verificationStatus, isLoading: verificationLoading } = useVerificationStatus(member?._id);

  if (memberLoading || verificationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Not authenticated
  if (!member) {
    return <Navigate to="/" replace />;
  }

  // Verified - allow access
  if (verificationStatus === 'approved') {
    return <>{children}</>;
  }

  // Not verified - show message
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-secondary/5 text-center">
        {verificationStatus === 'approved' ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h2 className="font-heading text-2xl text-secondary mb-3">
              Verification Approved
            </h2>
            
            <p className="font-paragraph text-secondary/70 mb-6">
              Your verification has been approved! You now have full access to live auctions and pets.
            </p>

            <div className="bg-green-50 rounded-2xl p-4 mb-6 text-left border border-green-200">
              <p className="text-sm font-paragraph text-green-800">
                <strong>Status:</strong> Approved
              </p>
            </div>

            <p className="text-sm text-secondary/60">
              Redirecting you to browse content...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h2 className="font-heading text-2xl text-secondary mb-3">
              Verification Required
            </h2>
            
            <p className="font-paragraph text-secondary/70 mb-6">
              {messageToVerify}
            </p>

            <div className="bg-subtlebackground rounded-2xl p-4 mb-6 text-left">
              <p className="text-sm font-paragraph text-secondary/70 mb-2">
                <strong>Current Status:</strong>
              </p>
              <p className="text-sm font-paragraph text-secondary capitalize">
                {verificationStatus === 'none' ? 'Not Submitted' : verificationStatus}
              </p>
            </div>

            {verificationStatus === 'none' && (
              <a
                href="/verify"
                className="block w-full bg-primary text-primary-foreground font-paragraph font-semibold py-3 rounded-full hover:brightness-110 transition-all text-center"
              >
                Complete Verification
              </a>
            )}

            {verificationStatus === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm font-paragraph text-blue-800">
                  Your verification is being reviewed. This typically takes 24-48 hours.
                </p>
              </div>
            )}

            {verificationStatus === 'rejected' && (
              <div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-paragraph text-red-800">
                    Your verification was not approved. Please contact support for more information.
                  </p>
                </div>
                <a
                  href="/verify"
                  className="block w-full bg-primary text-primary-foreground font-paragraph font-semibold py-3 rounded-full hover:brightness-110 transition-all text-center"
                >
                  Resubmit Verification
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
