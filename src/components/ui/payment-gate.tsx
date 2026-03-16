import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, CreditCard } from 'lucide-react';

interface PaymentGateProps {
  children: ReactNode;
  messageToAddPayment?: string;
}

export function PaymentGate({ 
  children, 
  messageToAddPayment = "You must add payment details to access this page" 
}: PaymentGateProps) {
  const { member, isLoading: memberLoading } = useMember();
  const { verificationStatus, isLoading: verificationLoading } = useVerificationStatus(member?._id);
  const { hasPaymentMethod, isLoading: paymentLoading } = usePaymentStatus(member?._id);

  if (memberLoading || verificationLoading || paymentLoading) {
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

  // Not verified
  if (verificationStatus !== 'approved') {
    return <Navigate to="/verify" replace />;
  }

  // Verified but no payment method - redirect to payment page
  if (!hasPaymentMethod) {
    return <Navigate to="/payment" replace />;
  }

  // Has payment method - allow access
  return <>{children}</>;
}
