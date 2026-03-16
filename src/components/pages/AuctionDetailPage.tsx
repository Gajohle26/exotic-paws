import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, TrendingUp, Users, AlertCircle, Trophy } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { ExoticPetAuctions, Bids } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMember } from '@/integrations';
import { useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import PaymentModal, { CardData } from '@/components/PaymentModal';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { member } = useMember();
  const [auction, setAuction] = useState<ExoticPetAuctions | null>(null);
  const [bids, setBids] = useState<Bids[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userWinningBid, setUserWinningBid] = useState<Bids | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { currency } = useCurrency();

  // Update time remaining every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (auction?.auctionEndTime) {
        setTimeRemaining(getTimeRemaining(auction.auctionEndTime));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [auction?.auctionEndTime]);

  useEffect(() => {
    if (id) {
      loadAuction();
    }
  }, [id]);

  const loadAuction = async () => {
    try {
      const data = await BaseCrudService.getById<ExoticPetAuctions>('auctions', id!);
      setAuction(data);
      setTimeRemaining(getTimeRemaining(data?.auctionEndTime));

      // Load bids for this auction
      const bidsResult = await BaseCrudService.getAll<Bids>('bids', {}, { limit: 50 });
      const auctionBids = bidsResult.items
        .filter(b => b.auctionId === id)
        .sort((a, b) => {
          const timeA = new Date(a.bidTime || 0).getTime();
          const timeB = new Date(b.bidTime || 0).getTime();
          return timeB - timeA;
        });
      setBids(auctionBids);

      // Check if current user has a winning bid (only if auction is ended)
      if (member?._id && data?.status === 'ended') {
        const userWinningBid = auctionBids.find(b => b.bidderId === member._id && b.isWinningBid);
        setUserWinningBid(userWinningBid || null);
      }
    } catch (error) {
      console.error('Failed to load auction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!member?._id || !auction?._id || !bidAmount) return;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= (auction.currentBid || auction.startingBid || 0)) {
      alert('Bid must be higher than current bid');
      return;
    }

    setIsPlacingBid(true);
    try {
      // Mark previous winning bids as non-winning
      if (bids.length > 0) {
        const previousWinningBid = bids.find(b => b.isWinningBid);
        if (previousWinningBid) {
          await BaseCrudService.update('bids', {
            _id: previousWinningBid._id,
            isWinningBid: false
          });
        }
      }

      // Create new bid
      const newBid: Bids = {
        _id: crypto.randomUUID(),
        auctionId: auction._id,
        bidderId: member._id,
        bidAmount: amount,
        bidTime: new Date(),
        isWinningBid: true,
      };

      await BaseCrudService.create('bids', newBid);

      // Update auction with new highest bid
      await BaseCrudService.update('auctions', {
        _id: auction._id,
        currentBid: amount,
        highestBidderId: member._id,
      });

      // Reload auction and bids
      await loadAuction();
      setBidAmount('');
    } catch (error) {
      console.error('Failed to place bid:', error);
      alert('Failed to place bid. Please try again.');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handlePaymentSubmit = async (cardData: CardData) => {
    if (!userWinningBid) {
      throw new Error('No winning bid found');
    }

    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Payment processed for:', cardData.cardholderName);
        alert('Payment successful! Your auction has been secured.');
        resolve(undefined);
      }, 2000);
    });
  };

  const getTimeRemaining = (endTime?: Date | string) => {
    if (!endTime) return 'N/A';
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Auction Ended';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m left`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h left`;
    return `${Math.floor(diff / 86400000)}d left`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-12 min-h-[600px]">
        {/* Back Button */}
        <Link to="/auctions">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 font-paragraph text-secondary/60 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to auctions
          </motion.button>
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : !auction ? (
          <div className="text-center py-20">
            <h2 className="font-heading text-3xl text-secondary mb-4">Auction Not Found</h2>
            <p className="font-paragraph text-secondary/60 mb-8">
              The auction you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/auctions">
              <button className="bg-primary text-primary-foreground font-paragraph font-semibold px-8 py-3 rounded-full hover:brightness-110 transition-all">
                Browse All Auctions
              </button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-3 gap-12 mb-12">
              {/* Image Section */}
              <div className="lg:col-span-2">
                <div className="relative h-[500px] rounded-3xl overflow-hidden bg-white shadow-lg">
                  <Image
                    src={auction.petImage || 'https://static.wixstatic.com/media/ee3aff_b9b1c56bd6df4bc49b3fdb8419b208a2~mv2.png?originWidth=576&originHeight=448'}
                    alt={auction.auctionTitle || 'Auction'}
                    className="w-full h-full object-cover"
                    width={600}
                  />
                </div>
              </div>

              {/* Bidding Section */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-secondary/5 h-fit sticky top-24">
                <h1 className="font-heading text-3xl text-secondary mb-4">
                  {auction.auctionTitle}
                </h1>

                {/* Status */}
                <div className="mb-6 p-4 bg-subtlebackground rounded-2xl">
                  <p className="text-sm text-secondary/60 mb-1">Status</p>
                  <p className="font-heading text-lg text-secondary capitalize">
                    {auction.status}
                  </p>
                </div>

               {/* Time Remaining */}
                {auction.status === 'active' && (
                  <div className="mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-primary animate-pulse" />
                      <p className="text-sm text-secondary/60">Time Remaining</p>
                    </div>
                    <p className="font-heading text-2xl text-primary">
                      {timeRemaining}
                    </p>
                  </div>
                )}

                {/* Current Bid */}
                <div className="mb-6">
                  <p className="text-sm text-secondary/60 mb-2">Current Bid</p>
                  <p className="font-heading text-4xl text-primary mb-2">
                    {formatPrice(auction.currentBid || auction.startingBid || 0, currency ?? DEFAULT_CURRENCY)}
                  </p>
                  {auction.startingBid && (
                    <p className="text-sm text-secondary/60">
                      Starting: {formatPrice(auction.startingBid, currency ?? DEFAULT_CURRENCY)}
                    </p>
                  )}
                </div>

                {/* Bid Count */}
                <div className="mb-6 p-4 bg-subtlebackground rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-secondary/60" />
                    <p className="text-sm text-secondary/60">Total Bids</p>
                  </div>
                  <p className="font-heading text-lg text-secondary">{bids.length}</p>
                </div>

                {/* Bid Input */}
                {auction.status === 'active' ? (
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Enter bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-subtlebackground rounded-full font-paragraph text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handlePlaceBid}
                      disabled={isPlacingBid || !member}
                      className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 text-lg"
                    >
                      {isPlacingBid ? 'Placing Bid...' : member ? 'Place Bid' : 'Sign In to Bid'}
                    </button>
                    {!member && (
                      <p className="text-sm text-secondary/60 text-center">
                        You must be signed in to place a bid
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-100 rounded-2xl text-center">
                    <p className="font-paragraph text-secondary/60">
                      This auction has ended
                    </p>
                  </div>
                )}

                {/* User Winning Bid Section */}
                {userWinningBid && auction.status === 'ended' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-2xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <p className="font-heading text-lg text-green-800">
                        You Won This Auction!
                      </p>
                    </div>
                    <p className="text-sm text-green-700 mb-4 font-paragraph">
                      Congratulations! You have the winning bid. Complete your payment to secure this exotic pet.
                    </p>
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full bg-green-600 text-white font-paragraph font-semibold py-3 rounded-full hover:bg-green-700 transition-all"
                    >
                      Complete Payment
                    </button>
                  </motion.div>
                )}

                {/* Payment Notice */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-paragraph text-sm text-yellow-800 font-semibold mb-1">
                        Payment Method Required
                      </p>
                      <p className="font-paragraph text-xs text-yellow-700">
                        After winning, you'll be guided to complete payment through our secure external payment processor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-secondary/5">
              <h2 className="font-heading text-2xl text-secondary mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Bid History
              </h2>

              {bids.length > 0 ? (
                <div className="space-y-3">
                  {bids.map((bid, index) => (
                    <motion.div
                      key={bid._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-subtlebackground rounded-2xl"
                    >
                      <div>
                        <p className="font-paragraph font-semibold text-secondary">
                          Bid #{bids.length - index}
                        </p>
                        <p className="text-sm text-secondary/60">
                          {bid.bidTime ? new Date(bid.bidTime).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-lg text-primary">
                          {formatPrice(bid.bidAmount || 0, currency ?? DEFAULT_CURRENCY)}
                        </p>
                        {bid.isWinningBid && (
                          <p className="text-xs text-primary font-semibold">Highest Bid</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="font-paragraph text-secondary/60">
                    No bids placed yet. Be the first to bid!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        auctionTitle={auction?.auctionTitle}
        winningAmount={userWinningBid?.bidAmount || 0}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </div>
  );
}
