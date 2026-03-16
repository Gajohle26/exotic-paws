import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentDetailsPage() {
  const { member } = useMember();
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!member?._id) {
      setError('Please sign in to add payment details');
      return;
    }

    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all fields');
      return;
    }

    // Validate card number (basic check)
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      setError('Invalid card number');
      return;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError('Invalid expiry date format (MM/YY)');
      return;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cvv)) {
      setError('Invalid CVV');
      return;
    }

    setIsSubmitting(true);
    try {
      const cardLastFour = cleanCardNumber.slice(-4);
      const cardBrand = getCardBrand(cleanCardNumber);

      await BaseCrudService.create('userpaymentmethods', {
        _id: crypto.randomUUID(),
        userId: member._id,
        cardholderName,
        cardLastFour,
        cardBrand,
        isDefault,
        createdDate: new Date(),
      });

      setSubmitSuccess(true);
      setCardholderName('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');

      setTimeout(() => {
        setSubmitSuccess(false);
        // Redirect to pets page
        window.location.href = '/pets';
      }, 2000);
    } catch (err) {
      console.error('Failed to add payment method:', err);
      setError('Failed to add payment method. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardBrand = (cardNumber: string): string => {
    const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    };

    for (const [brand, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return brand.charAt(0).toUpperCase() + brand.slice(1);
      }
    }
    return 'Unknown';
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-16 text-center">
          <p className="font-paragraph text-lg text-secondary/60">
            Please sign in to add payment details
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Info */}
            <div>
              <h1 className="font-heading text-5xl text-secondary mb-6">
                Add Payment Details
              </h1>
              <p className="font-paragraph text-lg text-secondary/70 mb-8">
                Complete your payment information to unlock access to Browse Pets and Live Auctions. Your payment details are securely encrypted and stored.
              </p>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-secondary/5">
                  <div className="flex gap-4">
                    <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        Secure & Encrypted
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        All payment information is encrypted and securely stored according to industry standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-secondary/5">
                  <div className="flex gap-4">
                    <CreditCard className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        Multiple Payment Methods
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        Add multiple payment methods and set your preferred option for transactions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-subtlebackground rounded-2xl p-6 border border-primary/20">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        Unlock Full Access
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        After adding payment details, you'll have full access to browse pets and participate in live auctions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-secondary/5 h-fit">
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-100 border border-green-300 rounded-2xl"
                >
                  <p className="font-paragraph text-green-800 font-semibold">
                    ✓ Payment details added successfully! Redirecting...
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-100 border border-red-300 rounded-2xl flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="font-paragraph text-red-800 font-semibold">
                    {error}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cardholder Name */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength="19"
                      className="w-full pl-12 pr-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-lg text-secondary mb-3">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength="5"
                      className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-lg text-secondary mb-3">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                      maxLength="4"
                      className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Set as Default */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-paragraph text-secondary">
                    Set as default payment method
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 text-lg"
                >
                  {isSubmitting ? 'Adding Payment Method...' : 'Add Payment Method'}
                </button>

                {/* Info */}
                <p className="text-xs text-secondary/60 text-center">
                  Your payment information is secure and encrypted. We never store full card details.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
