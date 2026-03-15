import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, ChevronDown } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { ExoticPets } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';

export default function PetsPage() {
  const [pets, setPets] = useState<ExoticPets[]>([]);
  const [filteredPets, setFilteredPets] = useState<ExoticPets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  const LIMIT = 9;

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [pets, searchQuery, selectedSpecies, selectedLocation]);

  const loadPets = async (loadMore = false) => {
    try {
      if (loadMore) setIsLoadingMore(true);
      
      const result = await BaseCrudService.getAll<ExoticPets>(
        'exoticpets',
        {},
        { limit: LIMIT, skip: loadMore ? skip : 0 }
      );
      
      if (loadMore) {
        setPets(prev => [...prev, ...result.items]);
      } else {
        setPets(result.items);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Failed to load pets:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const filterPets = () => {
    let filtered = [...pets];

    if (searchQuery) {
      filtered = filtered.filter(pet =>
        pet.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.itemDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecies !== 'all') {
      filtered = filtered.filter(pet => pet.species === selectedSpecies);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(pet => pet.approximateLocation === selectedLocation);
    }

    setFilteredPets(filtered);
  };

  const uniqueSpecies = Array.from(new Set(pets.map(pet => pet.species).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(pets.map(pet => pet.approximateLocation).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-5xl lg:text-6xl text-secondary mb-4">
            Browse Exotic Pets
          </h1>
          <p className="font-paragraph text-lg text-secondary/70 max-w-2xl mx-auto">
            Discover verified exotic companions available for responsible adoption
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm mb-12"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <input
                type="text"
                placeholder="Search by name, species, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-subtlebackground rounded-full font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Species Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-subtlebackground rounded-full font-paragraph text-secondary appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Species</option>
                {uniqueSpecies.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-subtlebackground rounded-full font-paragraph text-secondary appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || selectedSpecies !== 'all' || selectedLocation !== 'all') && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="font-paragraph text-sm text-secondary/60">Active filters:</span>
              {searchQuery && (
                <span className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-paragraph">
                  Search: {searchQuery}
                </span>
              )}
              {selectedSpecies !== 'all' && (
                <span className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-paragraph">
                  Species: {selectedSpecies}
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-paragraph">
                  Location: {selectedLocation}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecies('all');
                  setSelectedLocation('all');
                }}
                className="text-sm font-paragraph text-secondary/60 hover:text-primary transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-paragraph text-secondary/60">
            {isLoading ? 'Loading...' : `${filteredPets.length} ${filteredPets.length === 1 ? 'pet' : 'pets'} found`}
          </p>
        </div>

        {/* Pets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
          {isLoading ? null : filteredPets.length > 0 ? (
            filteredPets.map((pet, index) => (
              <motion.div
                key={pet._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link to={`/pets/${pet._id}`}>
                  <div className="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-shadow group h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={pet.itemImage || 'https://static.wixstatic.com/media/ee3aff_84d84926ea4e447b8fb764a7a5229909~mv2.png?originWidth=384&originHeight=256'}
                        alt={pet.itemName || 'Exotic pet'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        width={400}
                      />
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-paragraph font-bold px-4 py-2 rounded-full">
                        {formatPrice(pet.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading text-2xl text-secondary mb-2">
                        {pet.itemName}
                      </h3>
                      <p className="font-paragraph text-sm text-secondary/60 mb-3">
                        {pet.species}
                      </p>
                      <p className="font-paragraph text-secondary/70 mb-4 line-clamp-2 flex-1">
                        {pet.itemDescription}
                      </p>
                      {pet.approximateLocation && (
                        <div className="flex items-center gap-2 text-sm text-secondary/60 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span className="font-paragraph">{pet.approximateLocation}</span>
                        </div>
                      )}
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
                        className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-3 rounded-full hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {addingItemId === pet._id ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="font-paragraph text-lg text-secondary/60 mb-4">
                No pets found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecies('all');
                  setSelectedLocation('all');
                }}
                className="font-paragraph text-primary hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasNext && !isLoading && filteredPets.length === pets.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => loadPets(true)}
              disabled={isLoadingMore}
              className="bg-primary text-primary-foreground font-paragraph font-semibold px-10 py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isLoadingMore ? 'Loading...' : 'Load More Pets'}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
