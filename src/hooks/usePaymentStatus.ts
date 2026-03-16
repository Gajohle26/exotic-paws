import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';

export function usePaymentStatus(userId?: string) {
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const result = await BaseCrudService.getAll<any>('userpaymentmethods');
        const userPayment = result.items.find((p: any) => p.userId === userId);
        setHasPaymentMethod(!!userPayment);
      } catch (error) {
        console.error('Failed to check payment status:', error);
        setHasPaymentMethod(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [userId]);

  return { hasPaymentMethod, isLoading };
}
