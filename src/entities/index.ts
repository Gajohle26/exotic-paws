/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: adoptioninquiries
 * Interface for AdoptionInquiries
 */
export interface AdoptionInquiries {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  inquirerName?: string;
  /** @wixFieldType text */
  inquirerEmail?: string;
  /** @wixFieldType text */
  inquirerPhone?: string;
  /** @wixFieldType text */
  petName?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType datetime */
  inquiryDate?: Date | string;
  /** @wixFieldType boolean */
  isProcessed?: boolean;
}


/**
 * Collection ID: auctions
 * Interface for ExoticPetAuctions
 */
export interface ExoticPetAuctions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  petId?: string;
  /** @wixFieldType text */
  sellerId?: string;
  /** @wixFieldType text */
  auctionTitle?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  petImage?: string;
  /** @wixFieldType number */
  startingBid?: number;
  /** @wixFieldType number */
  currentBid?: number;
  /** @wixFieldType text */
  highestBidderId?: string;
  /** @wixFieldType datetime */
  auctionEndTime?: Date | string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType number */
  durationHours?: number;
}


/**
 * Collection ID: bids
 * Interface for Bids
 */
export interface Bids {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  auctionId?: string;
  /** @wixFieldType text */
  bidderId?: string;
  /** @wixFieldType number */
  bidAmount?: number;
  /** @wixFieldType datetime */
  bidTime?: Date | string;
  /** @wixFieldType boolean */
  isWinningBid?: boolean;
}


/**
 * Collection ID: documentverifications
 * Interface for DocumentVerifications
 */
export interface DocumentVerifications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  userType?: string;
  /** @wixFieldType text */
  species?: string;
  /** @wixFieldType url */
  documentUrl?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType datetime */
  reviewDate?: Date | string;
}


/**
 * Collection ID: exoticpets
 * @catalog This collection is an eCommerce catalog
 * Interface for ExoticPets
 */
export interface ExoticPets {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType text */
  species?: string;
  /** @wixFieldType text */
  careRequirements?: string;
  /** @wixFieldType text */
  approximateLocation?: string;
}


/**
 * Collection ID: notifications
 * Interface for Notifications
 */
export interface Notifications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  type?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType text */
  relatedAuctionId?: string;
  /** @wixFieldType boolean */
  isRead?: boolean;
  /** @wixFieldType datetime */
  createdDate?: Date | string;
}


/**
 * Collection ID: petsubmissions
 * Interface for PetSubmissions
 */
export interface PetSubmissions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  sellerId?: string;
  /** @wixFieldType text */
  petName?: string;
  /** @wixFieldType text */
  species?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  petImage?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  careRequirements?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType url */
  legalDocumentUrl?: string;
  /** @wixFieldType text */
  submissionStatus?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType datetime */
  reviewDate?: Date | string;
  /** @wixFieldType text */
  adminNotes?: string;
}


/**
 * Collection ID: userpaymentmethods
 * Interface for UserPaymentMethods
 */
export interface UserPaymentMethods {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  cardholderName?: string;
  /** @wixFieldType text */
  cardLastFour?: string;
  /** @wixFieldType text */
  cardBrand?: string;
  /** @wixFieldType boolean */
  isDefault?: boolean;
  /** @wixFieldType datetime */
  createdDate?: Date | string;
}
