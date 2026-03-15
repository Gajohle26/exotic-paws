import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Image } from '@/components/ui/image';

export default function Cart() {
  const { items, totalPrice, isOpen, isCheckingOut, actions } = useCart();
  const { currency } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={actions.closeCart}
            className="fixed inset-0 bg-secondary/50 backdrop-blur-sm z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-secondary" />
                <h2 className="font-heading text-2xl text-secondary font-bold">
                  Your Cart
                </h2>
              </div>
              <button
                onClick={actions.closeCart}
                className="p-2 hover:bg-subtlebackground rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-secondary" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-secondary/20 mb-4" />
                  <p className="font-paragraph text-lg text-secondary/60">
                    Your cart is empty
                  </p>
                  <p className="font-paragraph text-sm text-secondary/40 mt-2">
                    Add some exotic pets to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex gap-4">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || 'https://static.wixstatic.com/media/ee3aff_f4911597efbb499fbca2b345e64b914e~mv2.png?originWidth=128&originHeight=128'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            width={80}
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-lg text-secondary font-semibold truncate">
                            {item.name}
                          </h3>
                          <p className="font-paragraph text-sm text-primary font-bold mt-1">
                            {formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => actions.updateQuantity(item, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 bg-subtlebackground rounded-full flex items-center justify-center hover:bg-brandaccent transition-colors"
                            >
                              <Minus className="w-4 h-4 text-secondary" />
                            </button>
                            <span className="font-paragraph font-semibold text-secondary min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => actions.updateQuantity(item, item.quantity + 1)}
                              className="w-8 h-8 bg-subtlebackground rounded-full flex items-center justify-center hover:bg-brandaccent transition-colors"
                            >
                              <Plus className="w-4 h-4 text-secondary" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => actions.removeFromCart(item)}
                          className="p-2 hover:bg-destructive/10 rounded-full transition-colors self-start"
                        >
                          <Trash2 className="w-5 h-5 text-destructive" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-secondary/10 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl text-secondary font-semibold">
                    Total
                  </span>
                  <span className="font-heading text-2xl text-primary font-bold">
                    {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={actions.checkout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary text-primary-foreground font-paragraph font-semibold py-4 rounded-full hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                {/* Clear Cart */}
                <button
                  onClick={actions.clearCart}
                  className="w-full font-paragraph text-sm text-secondary/60 hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
