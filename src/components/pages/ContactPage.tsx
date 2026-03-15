import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail, User, Phone, MessageSquare, Calendar } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { AdoptionInquiries, ExoticPets } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    inquirerName: '',
    inquirerEmail: '',
    inquirerPhone: '',
    petName: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pets, setPets] = useState<ExoticPets[]>([]);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const result = await BaseCrudService.getAll<ExoticPets>('exoticpets', {}, { limit: 100 });
      setPets(result.items);
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await BaseCrudService.create<AdoptionInquiries>('adoptioninquiries', {
        _id: crypto.randomUUID(),
        inquirerName: formData.inquirerName,
        inquirerEmail: formData.inquirerEmail,
        inquirerPhone: formData.inquirerPhone,
        petName: formData.petName,
        message: formData.message,
        inquiryDate: new Date().toISOString(),
        isProcessed: false
      });

      setIsSuccess(true);
      setFormData({
        inquirerName: '',
        inquirerEmail: '',
        inquirerPhone: '',
        petName: '',
        message: ''
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-5xl lg:text-6xl text-secondary mb-4">
            Submit Adoption Inquiry
          </h1>
          <p className="font-paragraph text-lg text-secondary/70 max-w-2xl mx-auto">
            Interested in adopting an exotic pet? Fill out the form below and our team will review your inquiry and get back to you shortly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
                <h2 className="font-heading text-3xl text-secondary mb-4">
                  Inquiry Submitted!
                </h2>
                <p className="font-paragraph text-secondary/70 mb-8">
                  Thank you for your interest. Our team will review your inquiry and contact you within 24-48 hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-primary text-primary-foreground font-paragraph font-semibold px-8 py-3 rounded-full hover:brightness-110 transition-all"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 font-paragraph font-semibold text-secondary mb-2">
                    <User className="w-5 h-5 text-primary" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="inquirerName"
                    value={formData.inquirerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 font-paragraph font-semibold text-secondary mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="inquirerEmail"
                    value={formData.inquirerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 font-paragraph font-semibold text-secondary mb-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="inquirerPhone"
                    value={formData.inquirerPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Pet Selection */}
                <div>
                  <label className="flex items-center gap-2 font-paragraph font-semibold text-secondary mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Interested Pet
                  </label>
                  <select
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="">Select a pet (optional)</option>
                    {pets.map(pet => (
                      <option key={pet._id} value={pet.itemName}>
                        {pet.itemName} - {pet.species}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center gap-2 font-paragraph font-semibold text-secondary mb-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-subtlebackground rounded-2xl font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about your experience with exotic pets, living situation, and why you're interested in adoption..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Inquiry
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-sm font-paragraph text-secondary/60 text-center">
                  * Required fields
                </p>
              </form>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* What Happens Next */}
            <div className="bg-subtlebackground rounded-3xl p-8">
              <h2 className="font-heading text-2xl text-secondary mb-6">
                What Happens Next?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Review',
                    description: 'Our team reviews your inquiry and verifies your information.'
                  },
                  {
                    step: '2',
                    title: 'Verification',
                    description: 'We may request additional documentation to ensure legal compliance.'
                  },
                  {
                    step: '3',
                    title: 'Contact',
                    description: 'We\'ll reach out within 24-48 hours to discuss next steps.'
                  },
                  {
                    step: '4',
                    title: 'Adoption',
                    description: 'Once approved, we\'ll guide you through the adoption process.'
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-secondary font-semibold mb-1">
                        {item.title}
                      </h3>
                      <p className="font-paragraph text-sm text-secondary/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-white rounded-3xl p-8">
              <h2 className="font-heading text-2xl text-secondary mb-4">
                Important Information
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="font-paragraph text-secondary/70">
                    All adopters must provide valid identification and proof of legal eligibility to own exotic pets in their region.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="font-paragraph text-secondary/70">
                    Adoption fees vary by species and include initial health certifications.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="font-paragraph text-secondary/70">
                    We prioritize responsible adoption and may decline inquiries that don't meet our standards.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="font-paragraph text-secondary/70">
                    All transactions are transparent and legally documented for your protection.
                  </p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
