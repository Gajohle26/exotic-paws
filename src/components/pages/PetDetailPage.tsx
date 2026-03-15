import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Shield, Info } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { ExoticPets } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<ExoticPets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  useEffect(() => {
    if (id) {
      loadPet();
    }
  }, [id]);

  const loadPet = async () => {
    try {
      const data = await BaseCrudService.getById<ExoticPets>('exoticpets', id!);
      setPet(data);
    } catch (error) {
      console.error('Failed to load pet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-12 min-h-[600px]">
        {/* Back Button */}
        <Link to="/pets">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 font-paragraph text-secondary/60 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to all pets
          </motion.button>
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : !pet ? (
          <div className="text-center py-20">
            <h2 className="font-heading text-3xl text-secondary mb-4">Pet Not Found</h2>
            <p className="font-paragraph text-secondary/60 mb-8">
              The pet you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/pets">
              <button className="bg-primary text-primary-foreground font-paragraph font-semibold px-8 py-3 rounded-full hover:brightness-110 transition-all">
                Browse All Pets
              </button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Image Section */}
              <div className="relative">
                <div className="sticky top-24">
                  <div className="relative h-[500px] rounded-3xl overflow-hidden bg-white shadow-lg">
                    <Image
                      src={pet.itemImage || 'https://static.wixstatic.com/media/ee3aff_b9b1c56bd6df4bc49b3fdb8419b208a2~mv2.png?originWidth=576&originHeight=448'}
                      alt={pet.itemName || 'Exotic pet'}
                      className="w-full h-full object-cover"
                      width={600}
                    />
                  </div>
                  <div className="absolute top-6 right-6 bg-primary text-primary-foreground font-heading text-2xl font-bold px-6 py-3 rounded-full shadow-lg">
                    {formatPrice(pet.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="font-heading text-4xl lg:text-5xl text-secondary mb-4">
                    {pet.itemName}
                  </h1>
                  
                  {pet.species && (
                    <div className="inline-block bg-subtlebackground px-4 py-2 rounded-full mb-6">
                      <p className="font-paragraph text-sm font-semibold text-secondary">
                        {pet.species}
                      </p>
                    </div>
                  )}

                  {pet.approximateLocation && (
                    <div className="flex items-center gap-2 text-secondary/60 mb-8">
                      <MapPin className="w-5 h-5" />
                      <span className="font-paragraph">{pet.approximateLocation}</span>
                    </div>
                  )}

                  {/* Description */}
                  {pet.itemDescription && (
                    <div className="mb-8">
                      <h2 className="font-heading text-2xl text-secondary mb-3 flex items-center gap-2">
                        <Info className="w-6 h-6 text-primary" />
                        About This Pet
                      </h2>
                      <p className="font-paragraph text-lg text-secondary/80 leading-relaxed">
                        {pet.itemDescription}
                      </p>
                    </div>
                  )}

                  {/* Care Requirements */}
                  {pet.careRequirements && (
                    <div className="bg-white rounded-2xl p-6 mb-8">
                      <h2 className="font-heading text-2xl text-secondary mb-3 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Care Requirements
                      </h2>
                      <p className="font-paragraph text-secondary/80 leading-relaxed">
                        {pet.careRequirements}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => actions.addToCart({
                        collectionId: 'exoticpets',
                        itemId: pet._id,
                        quantity: 1
                      })}
                      disabled={addingItemId === pet._id}
                      className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 text-lg"
                    >
                      {addingItemId === pet._id ? 'Adding to Cart...' : 'Add to Cart'}
                    </button>

                    <Link to="/contact" className="block">
                      <button className="w-full border-2 border-primary text-primary font-paragraph font-semibold py-4 rounded-full hover:bg-primary hover:text-primary-foreground transition-all text-lg">
                        Submit Adoption Inquiry
                      </button>
                    </Link>
                  </div>

                  {/* Verification Notice */}
                  <div className="mt-8 bg-subtlebackground rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-heading text-lg text-secondary font-semibold mb-2">
                          Verified & Legal
                        </h3>
                        <p className="font-paragraph text-sm text-secondary/70">
                          All pets on Zafira Nero are verified for legal ownership and ethical sourcing. Both buyers and sellers undergo document verification to ensure compliance with exotic pet regulations.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
