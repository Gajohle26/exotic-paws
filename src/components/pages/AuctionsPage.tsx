import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, TrendingUp, Search, Filter, ChevronDown } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Auctions, ExoticPets } from '@/entities';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auctions[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auctions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { currency } = useCurrency();

  const LIMIT = 9;

  useEffect(() => {
    loadAuctions();
  }, []);

  useEffect(() => {
    filterAuctions();
  }, [auctions, searchQuery, selectedStatus]);

  const loadAuctions = async (loadMore = false) => {
    try {
      if (loadMore) setIsLoadingMore(true);

      const result = await BaseCrudService.getAll<Auctions>(
        'auctions',
        {},
        { limit: LIMIT, skip: loadMore ? skip : 0 }
      );

      if (loadMore) {
        setAuctions(prev => [...prev, ...result.items]);
      } else {
        setAuctions(result.items);
      }

      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Failed to load auctions:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const filterAuctions = () => {
    let filtered = [...auctions];

    if (searchQuery) {
      filtered = filtered.filter(auction =>
        auction.auctionTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(auction => auction.status === selectedStatus);
    }

    setFilteredAuctions(filtered);
  };

  const getTimeRemaining = (endTime?: Date | string) => {
    if (!endTime) return 'N/A';
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m left`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h left`;
    return `${Math.floor(diff / 86400000)}d left`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

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
            Live Auctions
          </h1>
          <p className="font-paragraph text-lg text-secondary/70 max-w-2xl mx-auto">
            Bid on verified exotic pets in real-time. All auctions are secured by our dual verification system.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm mb-12"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <input
                type="text"
                placeholder="Search auctions by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-subtlebackground rounded-full font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-subtlebackground rounded-full font-paragraph text-secondary appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Auctions</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="ended">Ended</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-paragraph text-secondary/60">
            {isLoading ? 'Loading...' : `${filteredAuctions.length} ${filteredAuctions.length === 1 ? 'auction' : 'auctions'} found`}
          </p>
        </div>

        {/* Auctions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
          {isLoading ? null : filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction, index) => (
              <motion.div
                key={auction._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link to={`/auctions/${auction._id}`}>
                  <div className="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-shadow group h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={auction.petImage || 'https://static.wixstatic.com/media/ee3aff_84d84926ea4e447b8fb764a7a5229909~mv2.png?originWidth=384&originHeight=256'}
                        alt={auction.auctionTitle || 'Auction'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        width={400}
                      />
                      <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(auction.status)}`}>
                        {auction.status?.charAt(0).toUpperCase() + auction.status?.slice(1)}
                      </div>
                      {auction.status === 'active' && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-paragraph font-bold px-4 py-2 rounded-full flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {getTimeRemaining(auction.auctionEndTime)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading text-2xl text-secondary mb-2 line-clamp-2">
                        {auction.auctionTitle}
                      </h3>

                      {/* Current Bid */}
                      <div className="mb-4">
                        <p className="text-sm text-secondary/60 mb-1">Current Bid</p>
                        <p className="font-heading text-2xl text-primary">
                          {formatPrice(auction.currentBid || auction.startingBid || 0, currency ?? DEFAULT_CURRENCY)}
                        </p>
                      </div>

                      {/* Starting Bid */}
                      {auction.startingBid && (
                        <p className="text-sm text-secondary/60 mb-4">
                          Starting: {formatPrice(auction.startingBid, currency ?? DEFAULT_CURRENCY)}
                        </p>
                      )}

                      {/* Bid Button */}
                      <button className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-3 rounded-full hover:brightness-110 transition-all mt-auto">
                        Place Bid
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="font-paragraph text-lg text-secondary/60 mb-4">
                No auctions found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                }}
                className="font-paragraph text-primary hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasNext && !isLoading && filteredAuctions.length === auctions.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => loadAuctions(true)}
              disabled={isLoadingMore}
              className="bg-primary text-primary-foreground font-paragraph font-semibold px-10 py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isLoadingMore ? 'Loading...' : 'Load More Auctions'}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
