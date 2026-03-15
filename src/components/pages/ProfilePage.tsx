import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { motion } from 'framer-motion';
import { LogOut, Shield, FileCheck, Clock } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { DocumentVerifications } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProfilePage() {
  const { member, actions } = useMember();
  const [verifications, setVerifications] = useState<DocumentVerifications[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVerifications();
  }, [member?._id]);

  const loadVerifications = async () => {
    try {
      if (!member?._id) return;
      const result = await BaseCrudService.getAll<DocumentVerifications>('documentverifications', {}, { limit: 50 });
      const userVerifications = result.items.filter(v => v.userId === member._id);
      setVerifications(userVerifications);
    } catch (error) {
      console.error('Failed to load verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Shield className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-16 min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-secondary/5">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-heading text-4xl text-secondary mb-2">
                  {member?.profile?.nickname || member?.contact?.firstName || 'User Profile'}
                </h1>
                <p className="text-secondary/60 font-paragraph">
                  {member?.loginEmail}
                </p>
              </div>
              <button
                onClick={actions.logout}
                className="flex items-center gap-2 bg-destructive text-destructiveforeground font-paragraph font-semibold px-6 py-3 rounded-full hover:brightness-110 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Member Status */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-subtlebackground rounded-2xl p-4">
                <p className="text-sm text-secondary/60 mb-1">Status</p>
                <p className="font-heading text-lg text-secondary capitalize">
                  {member?.status || 'Active'}
                </p>
              </div>
              <div className="bg-subtlebackground rounded-2xl p-4">
                <p className="text-sm text-secondary/60 mb-1">Member Since</p>
                <p className="font-heading text-lg text-secondary">
                  {member?._createdDate ? new Date(member._createdDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-subtlebackground rounded-2xl p-4">
                <p className="text-sm text-secondary/60 mb-1">Email Verified</p>
                <p className="font-heading text-lg text-secondary">
                  {member?.loginEmailVerified ? '✓ Yes' : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Document Verifications */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-secondary/5">
            <h2 className="font-heading text-3xl text-secondary mb-6 flex items-center gap-2">
              <FileCheck className="w-8 h-8 text-primary" />
              Document Verifications
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : verifications.length > 0 ? (
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <motion.div
                    key={verification._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-secondary/10 rounded-2xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl text-secondary">
                            {verification.userType === 'seller' ? 'Seller Certification' : 'Buyer Verification'}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(verification.status)}`}>
                            {getStatusIcon(verification.status)}
                            {verification.status?.charAt(0).toUpperCase() + verification.status?.slice(1)}
                          </span>
                        </div>
                        <p className="text-secondary/60 font-paragraph">
                          Species: <span className="text-secondary font-semibold">{verification.species}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-secondary/60 mb-1">Submitted</p>
                        <p className="font-paragraph text-secondary">
                          {verification.submissionDate ? new Date(verification.submissionDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary/60 mb-1">Reviewed</p>
                        <p className="font-paragraph text-secondary">
                          {verification.reviewDate ? new Date(verification.reviewDate).toLocaleDateString() : 'Pending review'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileCheck className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
                <p className="text-secondary/60 font-paragraph mb-4">
                  No document verifications yet
                </p>
                <p className="text-secondary/50 text-sm font-paragraph max-w-md mx-auto">
                  Submit your documents to become a verified seller or buyer on Zafira Nero
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
