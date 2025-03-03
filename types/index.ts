import { Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'buyer' | 'seller';
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

export interface Property {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt?: number;
    propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  };
  images: {
    url: string;
    alt: string;
  }[];
  status: 'available' | 'pending' | 'sold';
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  _id: Types.ObjectId;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'active' | 'closed';
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  resume: {
    name: string;
    url: string;
  };
  coverLetter?: {
    name: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  _id: Types.ObjectId;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}
