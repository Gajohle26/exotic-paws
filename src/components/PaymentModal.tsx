import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionTitle?: string;
  winningAmount: number;
  onPaymentSubmit: (cardData: CardData) => Promise<void>;
}

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  auctionTitle,
  winningAmount,
  onPaymentSubmit
}: PaymentModalProps) {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { currency } = useCurrency();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }

    // Limit CVV to 4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    setError('');
  };

  const validateCardData = (): boolean => {
    if (!cardData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setError('Card number must be 16 digits');
      return false;
    }
    if (!cardData.cardholderName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    if (!cardData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError('Expiry date must be in MM/YY format');
      return false;
    }
    if (!cardData.cvv.match(/^\d{3,4}$/)) {
      setError('CVV must be 3-4 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateCardData()) {
      return;
    }

    setIsProcessing(true);
    try {
      await onPaymentSubmit(cardData);
      setCardData({
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvv: ''
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-secondary/10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl text-secondary">Payment</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-subtlebackground rounded-2xl p-4">
                  {auctionTitle && (
                    <p className="text-sm text-secondary/60 mb-2">
                      {auctionTitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-secondary/70">Total Amount:</span>
                    <span className="font-heading text-2xl text-primary">
                      {formatPrice(winningAmount, currency ?? DEFAULT_CURRENCY)}
                    </span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 font-paragraph">
                    Your payment information is encrypted and secure. We never store your full card details.
                  </p>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-paragraph text-secondary/70 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      className="w-full px-4 py-3 bg-subtlebackground rounded-xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-paragraph text-secondary/70 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      placeholder="John Doe"
                      value={cardData.cardholderName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-subtlebackground rounded-xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-paragraph text-secondary/70 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardData.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                        className="w-full px-4 py-3 bg-subtlebackground rounded-xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-paragraph text-secondary/70 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        className="w-full px-4 py-3 bg-subtlebackground rounded-xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 p-3 bg-red-50 rounded-2xl border border-red-200"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800 font-paragraph">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {isProcessing ? 'Processing Payment...' : `Pay ${formatPrice(winningAmount, currency ?? DEFAULT_CURRENCY)}`}
                  </button>

                  <p className="text-xs text-secondary/60 text-center font-paragraph">
                    By completing this payment, you agree to our terms and conditions.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
