# Exotic Pet Auction System - Multi-Step Verification & Access Logic

## System Overview

The system now implements a three-step verification process to ensure secure and compliant access to the pet auction platform:

### Step 1: Document Verification (Existing)
- **Route**: `/verify`
- **Purpose**: Verify user identity and legitimacy
- **For Buyers**: Submit identification and local permits
- **For Sellers**: Submit proof of ownership or breeder certification
- **Status**: `pending` → `approved` → `rejected`
- **Database**: `documentverifications` collection

### Step 2: Payment Details (NEW)
- **Route**: `/payment`
- **Purpose**: Collect credit card information for transactions
- **Triggered**: Automatically when user tries to access `/pets` or `/auctions` after verification is approved
- **For Buyers**: Enables payment for auction purchases
- **For Sellers**: Enables receiving payment after selling pets
- **Database**: `userpaymentmethods` collection

### Step 3: Access to Core Features
After completing both steps, users gain access to:
- **Browse Pets** (`/pets`) - View available exotic pets
- **Live Auctions** (`/auctions`) - Participate in live auctions and place bids

## User Flow

### For Buyers
```
1. Sign In
   ↓
2. Complete Document Verification (Status: Approved)
   ↓
3. Add Payment Details
   ↓
4. Access Browse Pets & Live Auctions
   ↓
5. Place Bids & Purchase Pets
```

### For Sellers
```
1. Sign In
   ↓
2. Complete Document Verification (Status: Approved)
   ↓
3. Add Payment Details
   ↓
4. Access Browse Pets & Live Auctions
   ↓
5. Add Pet for Auction (NEW FEATURE)
   ↓
6. Submit Pet Details, Photos & Legal Documents
   ↓
7. Admin Reviews & Approves Pet
   ↓
8. Pet Listed in Live Auction
```

## New Collections Created

### 1. User Payment Methods (`userpaymentmethods`)
Stores credit card information for users.

**Fields:**
- `userId` (text) - User ID
- `cardholderName` (text) - Name on card
- `cardLastFour` (text) - Last 4 digits
- `cardBrand` (text) - Visa, MasterCard, etc.
- `isDefault` (boolean) - Default payment method
- `createdDate` (datetime) - When added

**Purpose**: Track which users have completed payment setup

### 2. Pet Submissions (`petsubmissions`)
Queue for sellers to submit pets for admin review before auction listing.

**Fields:**
- `sellerId` (text) - Seller's user ID
- `petName` (text) - Name of the pet
- `species` (text) - Species/breed
- `petImage` (image) - Pet photo
- `description` (text) - Pet description
- `careRequirements` (text) - Care instructions
- `location` (text) - Current location
- `legalDocumentUrl` (url) - Legal document
- `submissionStatus` (text) - pending/approved/rejected
- `submissionDate` (datetime) - When submitted
- `reviewDate` (datetime) - When reviewed
- `adminNotes` (text) - Admin feedback

**Purpose**: Manage seller pet submissions for admin approval

## New Pages & Components

### 1. Payment Details Page (`/payment`)
- **Component**: `PaymentDetailsPage.tsx`
- **Access**: After document verification is approved
- **Features**:
  - Credit card form with validation
  - Card number formatting
  - Expiry date formatting
  - CVV validation
  - Set as default payment method
  - Secure submission

### 2. Add Pet for Auction Page (`/add-pet`)
- **Component**: `AddPetForAuctionPage.tsx`
- **Access**: After verification & payment details are complete
- **Features**:
  - Pet information form
  - Pet photo upload
  - Legal document upload (PDF)
  - Submission status tracking
  - Admin review queue

## New Hooks

### 1. usePaymentStatus
- **Location**: `/src/hooks/usePaymentStatus.ts`
- **Purpose**: Check if user has added payment details
- **Returns**: `{ hasPaymentMethod, isLoading }`

### 2. useVerificationStatus (Enhanced)
- **Location**: `/src/hooks/useVerificationStatus.ts`
- **Purpose**: Check user's verification status
- **Returns**: `{ isVerified, verificationStatus, isLoading }`

## New Gates/Middleware

### 1. PaymentGate Component
- **Location**: `/src/components/ui/payment-gate.tsx`
- **Purpose**: Protect routes that require payment details
- **Behavior**:
  - Checks if user is authenticated
  - Checks if user is verified
  - Checks if user has payment method
  - Redirects to `/payment` if payment details missing
  - Allows access if all conditions met

## Route Protection

### Protected Routes (Require All Three Steps)
- `/pets` - Browse Pets
- `/pets/:id` - Pet Details
- `/auctions` - Live Auctions
- `/auctions/:id` - Auction Details
- `/add-pet` - Add Pet for Auction (Sellers only)

### Semi-Protected Routes (Require Verification Only)
- `/payment` - Add Payment Details
- `/verify` - Document Verification

### Public Routes
- `/` - Home
- `/contact` - Contact
- `/profile` - User Profile (Requires login only)

## Navigation Updates

### Header Navigation
- **Add Pet** link appears only when:
  - User is logged in
  - User is verified (status: approved)
  - User has added payment details

## Database Queries

### Check if User Has Payment Method
```typescript
const result = await BaseCrudService.getAll('userpaymentmethods');
const userPayment = result.items.find(p => p.userId === userId);
const hasPayment = !!userPayment;
```

### Get User's Pet Submissions
```typescript
const result = await BaseCrudService.getAll('petsubmissions');
const userPets = result.items.filter(p => p.sellerId === userId);
```

### Get Pending Pet Submissions (Admin)
```typescript
const result = await BaseCrudService.getAll('petsubmissions');
const pendingPets = result.items.filter(p => p.submissionStatus === 'pending');
```

## Admin Management

### Approving Pet Submissions
Admins can manage pet submissions through the Wix Dashboard:
1. Go to Database → Pet Submissions
2. Review pet details and legal documents
3. Update `submissionStatus` to "approved" or "rejected"
4. Add notes in `adminNotes` field
5. Set `reviewDate` to current date

Once approved, the pet can be manually added to the `exoticpets` catalog for auction listing.

## Security Considerations

1. **Payment Information**: Only last 4 digits and brand are stored (full card details should be handled by payment processor)
2. **Document Verification**: All documents are manually reviewed by compliance team
3. **Pet Submissions**: Admin approval required before public listing
4. **User Authentication**: All sensitive routes require login
5. **Access Control**: Multi-gate system ensures proper verification at each step

## Testing the System

### Test as Buyer
1. Sign in
2. Go to `/verify` and submit buyer verification
3. Wait for admin approval (or manually approve in dashboard)
4. Try accessing `/pets` → should redirect to `/payment`
5. Add payment details
6. Access `/pets` and `/auctions` should now work

### Test as Seller
1. Sign in
2. Go to `/verify` and submit seller verification
3. Wait for admin approval
4. Add payment details
5. "Add Pet" link should appear in header
6. Submit pet for auction
7. Admin approves in dashboard
8. Pet appears in catalog

## Future Enhancements

1. **Payment Processing**: Integrate with Stripe/PayPal for actual payment processing
2. **Auction Logic**: Implement real-time bidding and auction management
3. **Notifications**: Send email/SMS notifications for verification status and auction updates
4. **Admin Dashboard**: Create admin interface for managing verifications and pet submissions
5. **Seller Dashboard**: Create seller dashboard to track pet submissions and sales
6. **Buyer Dashboard**: Create buyer dashboard to track bids and purchases
