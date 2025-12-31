export interface Label {
  id: string;
  color: string;
  name?: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface Utilities {
  water: boolean;
  sewer: boolean;
  electric: boolean;
  gas: boolean;
}

export interface Contact {
  name?: string;
  phone?: string;
  email?: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  labels: Label[];
  dueDate?: string;
  comments: Comment[];
  listId: string;
  
  // Property Information
  address?: string;
  parcelNumber?: string;
  legalDescription?: string;
  acreage?: number;
  lotDimensions?: string;
  
  // Land Details
  zoning?: string;
  utilities?: Utilities;
  accessRoad?: string;
  topography?: string;
  floodZone?: string;
  surveyInfo?: string;
  environmentalConcerns?: string;
  
  // Financial Data
  askingPrice?: number;
  purchasePrice?: number;
  assignmentFee?: number;
  closingCosts?: number;
  profitMargin?: number;
  
  // Contact Information
  seller?: Contact;
  buyer?: Contact;
  agent?: Contact;
  
  // Deal Metadata
  contractDate?: string;
  closingDate?: string;
  leadSource?: string;
  createdAt?: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}

