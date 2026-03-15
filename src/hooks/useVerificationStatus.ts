import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { DocumentVerifications } from '@/entities';

export function useVerificationStatus(userId?: string) {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const checkVerificationStatus = async () => {
      try {
        const result = await BaseCrudService.getAll<DocumentVerifications>('documentverifications');
        const userVerification = result.items.find(v => v.userId === userId);

        if (userVerification) {
          setVerificationStatus(userVerification.status as 'pending' | 'approved' | 'rejected' | 'none');
          setIsVerified(userVerification.status === 'approved');
        } else {
          setVerificationStatus('none');
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Failed to check verification status:', error);
        setIsVerified(false);
        setVerificationStatus('none');
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, [userId]);

  return { isVerified, verificationStatus, isLoading };
}
