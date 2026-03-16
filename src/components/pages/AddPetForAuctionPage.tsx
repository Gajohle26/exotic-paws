import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle, File, X } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AddPetForAuctionPage() {
  const { member } = useMember();
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [careRequirements, setCareRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [petImage, setPetImage] = useState<File | null>(null);
  const [legalDocument, setLegalDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const petImageRef = useRef<HTMLInputElement>(null);
  const legalDocRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      setPetImage(file);
      setError('');
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Document size must be less than 10MB');
        return;
      }
      setLegalDocument(file);
      setError('');
    }
  };

  const removeImage = () => {
    setPetImage(null);
    if (petImageRef.current) {
      petImageRef.current.value = '';
    }
  };

  const removeDocument = () => {
    setLegalDocument(null);
    if (legalDocRef.current) {
      legalDocRef.current.value = '';
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
    setError('');

    if (!member?._id) {
      setError('Please sign in to submit a pet');
      return;
    }

    if (!petName || !species || !description || !careRequirements || !location) {
      setError('Please fill in all required fields');
      return;
    }

    if (!petImage) {
      setError('Please upload a pet image');
      return;
    }

    if (!legalDocument) {
      setError('Please upload a legal document');
      return;
    }

    setIsSubmitting(true);
    try {
      const petImageBase64 = await convertFileToBase64(petImage);
      const legalDocBase64 = await convertFileToBase64(legalDocument);

      await BaseCrudService.create('petsubmissions', {
        _id: crypto.randomUUID(),
        sellerId: member._id,
        petName,
        species,
        description,
        careRequirements,
        location,
        petImage: petImageBase64,
        legalDocumentUrl: legalDocBase64,
        submissionStatus: 'pending',
        submissionDate: new Date(),
      });

      setSubmitSuccess(true);
      setPetName('');
      setSpecies('');
      setDescription('');
      setCareRequirements('');
      setLocation('');
      setPetImage(null);
      setLegalDocument(null);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit pet:', err);
      setError('Failed to submit pet. Please try again.');
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
            Please sign in to add a pet for auction
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
                Add Pet for Auction
              </h1>
              <p className="font-paragraph text-lg text-secondary/70 mb-8">
                Submit your exotic pet for auction. Our admin team will review your submission and legal documents before listing your pet.
              </p>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-secondary/5">
                  <div className="flex gap-4">
                    <Upload className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        Complete Information
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        Provide detailed information about your pet including species, care requirements, and location.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-secondary/5">
                  <div className="flex gap-4">
                    <File className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        Legal Documentation
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        Upload proof of ownership or breeder certification for your exotic pet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-subtlebackground rounded-2xl p-6 border border-primary/20">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-secondary mb-2">
                        Admin Review
                      </h3>
                      <p className="font-paragraph text-secondary/70 text-sm">
                        Our compliance team will review your submission within 24-48 hours and approve or request changes.
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
                    ✓ Pet submitted successfully! Our team will review your submission shortly.
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
                {/* Pet Name */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Sasha, King Cobra"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Species */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Species *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ball Python, Macaw, Tarantula"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your pet's characteristics, temperament, and any special features..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Care Requirements */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Care Requirements *
                  </label>
                  <textarea
                    placeholder="Describe the specific care needs, habitat requirements, diet, etc..."
                    value={careRequirements}
                    onChange={(e) => setCareRequirements(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Current Location *
                  </label>
                  <input
                    type="text"
                    placeholder="City, State/Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Pet Image */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Pet Photo *
                  </label>
                  
                  {!petImage ? (
                    <div
                      onClick={() => petImageRef.current?.click()}
                      className="border-2 border-dashed border-secondary/20 rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <Upload className="w-8 h-8 text-secondary/40 mx-auto mb-3" />
                      <p className="font-paragraph text-secondary font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-secondary/60">
                        Image files only, max 10MB
                      </p>
                      <input
                        ref={petImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
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
                            {petImage.name}
                          </p>
                          <p className="text-xs text-secondary/60">
                            {(petImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Legal Document */}
                <div>
                  <label className="block font-heading text-lg text-secondary mb-3">
                    Legal Document (PDF) *
                  </label>
                  
                  {!legalDocument ? (
                    <div
                      onClick={() => legalDocRef.current?.click()}
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
                        ref={legalDocRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleDocumentSelect}
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
                            {legalDocument.name}
                          </p>
                          <p className="text-xs text-secondary/60">
                            {(legalDocument.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeDocument}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Pet for Auction'}
                </button>

                {/* Info */}
                <p className="text-xs text-secondary/60 text-center">
                  By submitting, you confirm that you have the legal right to sell this pet and all information is accurate.
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
