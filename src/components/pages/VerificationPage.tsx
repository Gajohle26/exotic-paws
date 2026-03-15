import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Upload, AlertCircle, CheckCircle, X, File } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { DocumentVerifications } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMember } from '@/integrations';

export default function VerificationPage() {
  const { member } = useMember();
  const [userType, setUserType] = useState<'seller' | 'buyer'>('buyer');
  const [species, setSpecies] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submissionMethod, setSubmissionMethod] = useState<'url' | 'upload'>('url');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member?._id || !species) {
      alert('Please fill in all fields');
      return;
    }

    if (submissionMethod === 'url' && !documentUrl) {
      alert('Please provide a document URL');
      return;
    }

    if (submissionMethod === 'upload' && !uploadedFile) {
      alert('Please upload a PDF file');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalDocumentUrl = documentUrl;

      // If file upload, convert to base64
      if (submissionMethod === 'upload' && uploadedFile) {
        const base64Data = await convertFileToBase64(uploadedFile);
        finalDocumentUrl = base64Data;
      }

      const verification: DocumentVerifications = {
        _id: crypto.randomUUID(),
        userId: member._id,
        userType,
        species,
        documentUrl: finalDocumentUrl,
        status: 'pending',
        submissionDate: new Date(),
      };

      await BaseCrudService.create('documentverifications', verification);
      setSubmitSuccess(true);
      setSpecies('');
      setDocumentUrl('');
      setUploadedFile(null);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit verification:', error);
      alert('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-16 text-center">
          <p className="font-paragraph text-lg text-secondary/60">
            Please sign in to submit verification documents
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
                Document Verification
              </h1>
              <p className="font-paragraph text-lg text-secondary/70 mb-8">
                Submit your documents to become a verified buyer or seller on Zafira Nero. Our compliance team will review your submission within 24-48 hours.
              </p>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-secondary/5">
                  <div className="flex gap-4">
                    <FileCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        For Sellers
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        Submit proof of ownership or breeder certification for the exotic species you wish to sell.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-secondary/5">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        For Buyers
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        Submit identification and any required local permits for the species you wish to purchase.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-subtlebackground rounded-2xl p-6 border border-primary/20">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        Manual Review
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        All documents are manually reviewed by our compliance team to ensure legal compliance and ethical practices.
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
                    ✓ Verification submitted successfully! Our team will review your documents shortly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    I am a:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="buyer"
                        checked={userType === 'buyer'}
                        onChange={(e) => setUserType(e.target.value as 'buyer' | 'seller')}
                        className="w-4 h-4"
                      />
                      <span className="font-paragraph text-secondary">Buyer</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="seller"
                        checked={userType === 'seller'}
                        onChange={(e) => setUserType(e.target.value as 'buyer' | 'seller')}
                        className="w-4 h-4"
                      />
                      <span className="font-paragraph text-secondary">Seller</span>
                    </label>
                  </div>
                </div>

                {/* Species */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Pet Species
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ball Python, Macaw, Tarantula"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Submission Method Toggle */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Document Submission Method
                  </label>
                  <div className="flex gap-3 bg-subtlebackground p-1 rounded-full">
                    <button
                      type="button"
                      onClick={() => setSubmissionMethod('url')}
                      className={`flex-1 px-4 py-2 rounded-full font-paragraph font-medium transition-all ${
                        submissionMethod === 'url'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-secondary hover:bg-white/50'
                      }`}
                    >
                      URL Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionMethod('upload')}
                      className={`flex-1 px-4 py-2 rounded-full font-paragraph font-medium transition-all ${
                        submissionMethod === 'upload'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-secondary hover:bg-white/50'
                      }`}
                    >
                      Upload PDF
                    </button>
                  </div>
                </div>

                {/* Document URL */}
                {submissionMethod === 'url' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <label className="block font-heading text-lg text-secondary mb-3">
                      Document URL
                    </label>
                    <div className="relative">
                      <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                      <input
                        type="url"
                        placeholder="https://example.com/document.pdf"
                        value={documentUrl}
                        onChange={(e) => setDocumentUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <p className="text-xs text-secondary/60 mt-2">
                      Provide a link to your document (PDF, image, or document storage link)
                    </p>
                  </motion.div>
                )}

                {/* File Upload */}
                {submissionMethod === 'upload' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <label className="block font-heading text-lg text-secondary mb-3">
                      Upload PDF Document
                    </label>
                    
                    {!uploadedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-secondary/20 rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <Upload className="w-8 h-8 text-secondary/40 mx-auto mb-3" />
                        <p className="font-paragraph text-secondary font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-secondary/60">
                          PDF files only, max 10MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                            <File className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-paragraph font-medium text-secondary">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-secondary/60">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </button>

                {/* Info */}
                <p className="text-xs text-secondary/60 text-center">
                  By submitting, you agree to our verification process and confirm that all information is accurate and truthful.
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
