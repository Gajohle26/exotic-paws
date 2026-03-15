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
