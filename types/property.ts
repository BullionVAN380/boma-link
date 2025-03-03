export interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'rent' | 'sale';
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: string[];
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  createdAt: string;
  updatedAt: string;
}
