// HPI 1.7-V
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, MapPin, Search, Scale, FileCheck, Lock, ChevronRight, ShoppingBag } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { ExoticPets } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';

// --- Custom Scoped Styles ---
const customStyles = `
  .noise-overlay {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 1;
  }
  .clip-diagonal {
    clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState<ExoticPets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const { scrollYProgress: parallaxScroll } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(parallaxScroll, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    loadFeaturedPets();
  }, []);

  const loadFeaturedPets = async () => {
    try {
      const result = await BaseCrudService.getAll<ExoticPets>('exoticpets', {}, { limit: 4 });
      setFeaturedPets(result.items);
    } catch (error) {
      console.error('Failed to load featured pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground font-paragraph">
      <style>{customStyles}</style>
      <Header />

      {/* 1. HERO SECTION - Inspired by the dark, sleek, full-bleed reference */}
      <section 
        ref={heroRef}
        className="relative w-full h-[100vh] min-h-[800px] bg-secondary overflow-hidden flex items-center"
      >
        <div className="noise-overlay"></div>
        
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        <div className="w-full max-w-[120rem] mx-auto px-6 lg:px-12 xl:px-24 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Content - Minimal, Typography Driven */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="lg:col-span-5 flex flex-col justify-center pt-20 lg:pt-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-secondary-foreground uppercase">Verified Auction Platform</span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-secondary-foreground leading-[1.1] tracking-tight mb-6">
                Ethical.<br />
                Regulated.<br />
                <span className="text-primary">Exotic.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-md mb-10 font-light leading-relaxed">
                The premier destination for responsible adoption and trading of rare companions, secured by our dual legal verification system.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/pets">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full flex items-center gap-3 transition-all"
                  >
                    <span className="relative z-10">Enter Auctions</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-full text-secondary-foreground font-semibold border border-white/20 hover:bg-white/5 transition-colors"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image - Massive, Bleeding off edge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-7 relative h-[50vh] lg:h-[90vh] w-full lg:w-[120%] lg:-mr-[20%] rounded-l-[3rem] overflow-hidden shadow-2xl"
          >
            <Image
              src="https://static.wixstatic.com/media/ee3aff_8991c7f4fc124b9280d293e1682af33b~mv2.png?originWidth=1408&originHeight=768"
              alt="Sleek exotic pet enclosure"
              className="w-full h-full object-cover object-center"
            />
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(13,26,26,0.8)] pointer-events-none" />
            
            {/* Floating Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-8 left-8 lg:bottom-16 lg:left-16 bg-secondary/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4"
            >
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="text-xs text-secondary-foreground/60 uppercase tracking-wider font-semibold">Live Status</p>
                <p className="text-sm text-secondary-foreground font-medium">Auctions Active</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 2. DUAL VERIFICATION SYSTEM - Sticky Narrative Scroll */}
      <section ref={processRef} className="relative w-full bg-background pt-24 pb-32">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 xl:px-24">
          
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Sticky Left Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl text-secondary mb-6 leading-tight">
                  The Standard in <br/>
                  <span className="text-secondary/50">Legal Trading.</span>
                </h2>
                <p className="text-lg text-secondary/70 mb-8 max-w-md">
                  Zafira Nero operates on a strict Dual Legal Verification System. We ensure that every participant is legally eligible, creating a safe and transparent marketplace for exotic companions.
                </p>
                
                <div className="hidden lg:flex flex-col gap-4 border-l-2 border-primary/20 pl-6">
                  <div className="flex items-center gap-3 text-secondary">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">1</div>
                    <span className="font-medium">Seller Certification</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary/50">
                    <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-sm">2</div>
                    <span>Buyer Verification</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary/50">
                    <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-sm">3</div>
                    <span>Admin Approval</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Scrolling Right Column - Cards */}
            <div className="lg:col-span-7 flex flex-col gap-8 lg:gap-24 lg:pt-32">
              
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-secondary/5 border border-secondary/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-subtlebackground rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-700" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 text-primary">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-3xl text-secondary mb-4">Seller Certification</h3>
                  <p className="text-secondary/70 text-lg leading-relaxed">
                    Before listing, sellers must upload valid ownership or breeder certificates. This proves the animal was ethically sourced and can be legally traded in their jurisdiction.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-secondary rounded-[2rem] p-8 lg:p-12 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 text-secondary">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-3xl text-secondary-foreground mb-4">Buyer Verification</h3>
                  <p className="text-secondary-foreground/70 text-lg leading-relaxed">
                    Prospective buyers must provide identification and any necessary local permits required to own specific exotic species in their region before placing a bid.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-subtlebackground rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-secondary/5 border border-primary/20 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 text-secondary shadow-sm">
                    <Scale className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-3xl text-secondary mb-4">Admin Approval</h3>
                  <p className="text-secondary/70 text-lg leading-relaxed">
                    Our compliance team manually reviews all submitted documentation. Only upon full approval do users gain access to the live auction floor, ensuring a 100% verified ecosystem.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. PARALLAX VISUAL BREATHER */}
      <section ref={parallaxRef} className="w-full h-[60vh] min-h-[500px] relative overflow-clip">
        <motion.div 
          style={{ y: parallaxY }}
          className="absolute inset-[-20%] w-[140%] h-[140%]"
        >
          <Image
            src="https://static.wixstatic.com/media/ee3aff_63efbd34fe3e42bdbab6cbe4e5d34036~mv2.png?originWidth=1344&originHeight=832"
            alt="Abstract exotic texture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary-foreground mb-6">
              Beauty in Rarity.
            </h2>
            <p className="text-xl text-secondary-foreground/80 font-light">
              Discover species curated for the discerning, responsible collector.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. FEATURED AUCTIONS - Data Driven Grid */}
      <section className="w-full bg-background py-32 relative">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 xl:px-24">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl lg:text-5xl text-secondary mb-4">
                Live Auctions
              </h2>
              <p className="text-lg text-secondary/70 max-w-xl">
                Currently verified and available for bidding. Ensure your credits are loaded.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/pets" className="group inline-flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors">
                View All Listings
                <span className="w-8 h-8 rounded-full bg-secondary/5 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Grid Container - Always renders to prevent hook crashes */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Loading Skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div 
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-[2rem] p-4 h-[500px] animate-pulse flex flex-col"
                  >
                    <div className="w-full h-64 bg-secondary/10 rounded-2xl mb-6" />
                    <div className="h-8 bg-secondary/10 rounded-md w-3/4 mb-4" />
                    <div className="h-4 bg-secondary/10 rounded-md w-1/2 mb-auto" />
                    <div className="h-12 bg-secondary/10 rounded-full w-full mt-6" />
                  </motion.div>
                ))
              ) : featuredPets.length > 0 ? (
                // Actual Data
                featuredPets.map((pet, index) => (
                  <motion.div
                    key={pet._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white rounded-[2rem] p-4 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 flex flex-col border border-secondary/5"
                  >
                    <Link to={`/pets/${pet._id}`} className="block relative overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                      <Image
                        src={pet.itemImage || 'https://static.wixstatic.com/media/ee3aff_a4c4aeb4817e441b9d3d41817caed13e~mv2.png?originWidth=640&originHeight=448'}
                        alt={pet.itemName || 'Exotic pet'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-secondary shadow-sm">
                        Verified
                      </div>
                      <div className="absolute bottom-4 right-4 bg-secondary text-secondary-foreground font-heading text-lg px-4 py-2 rounded-xl shadow-lg">
                        {formatPrice(pet.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                      </div>
                    </Link>
                    
                    <div className="px-2 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading text-2xl text-secondary line-clamp-1">
                          {pet.itemName}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-primary font-semibold mb-3 uppercase tracking-wider">
                        {pet.species}
                      </p>
                      
                      <p className="text-secondary/60 text-sm line-clamp-2 mb-6 flex-grow">
                        {pet.itemDescription}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary/5">
                        {pet.approximateLocation ? (
                          <div className="flex items-center gap-1.5 text-xs text-secondary/50">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{pet.approximateLocation}</span>
                          </div>
                        ) : <div />}
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            actions.addToCart({
                              collectionId: 'exoticpets',
                              itemId: pet._id,
                              quantity: 1
                            });
                          }}
                          disabled={addingItemId === pet._id}
                          className="w-10 h-10 rounded-full bg-subtlebackground text-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Add to cart"
                        >
                          {addingItemId === pet._id ? (
                            <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Empty State
                <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border border-secondary/5">
                  <div className="w-16 h-16 bg-subtlebackground rounded-full flex items-center justify-center mx-auto mb-4 text-secondary/40">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-2xl text-secondary mb-2">No Active Auctions</h3>
                  <p className="text-secondary/60">Check back soon for new verified listings.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA - Pill Shaped Container */}
      <section className="w-full bg-background pb-32 px-6 lg:px-12 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-[100rem] mx-auto bg-secondary rounded-[3rem] lg:rounded-[5rem] p-12 lg:p-24 text-center relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-primary/5 rounded-full blur-[100px] rotate-12" />
            <div className="absolute -bottom-[50%] -right-[10%] w-[70%] h-[150%] bg-brandaccent/5 rounded-full blur-[100px] -rotate-12" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl text-secondary-foreground mb-8 leading-tight">
              Begin Your <br/>
              <span className="text-primary">Verification.</span>
            </h2>
            <p className="text-lg md:text-xl text-secondary-foreground/70 mb-12 font-light">
              Join the most secure network of exotic pet enthusiasts. Submit your documentation today to gain full access to live auctions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold px-10 py-5 rounded-full text-lg hover:shadow-[0_0_30px_rgba(190,235,0,0.3)] transition-all"
                >
                  Start Process
                </motion.button>
              </Link>
              <Link to="/pets">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-transparent text-secondary-foreground font-semibold px-10 py-5 rounded-full text-lg border border-white/20 hover:bg-white/5 transition-all"
                >
                  Browse Gallery
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}