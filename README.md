# Next Affordable Housing Platform

This is a [Next.js](https://nextjs.org) project that provides an affordable housing platform with property listings, job opportunities, and community resources.

## Features

- Property listings with search and filtering
- Job board for employment opportunities
- Community resources and educational content
- User authentication and profiles
- Admin dashboard for content management
- Real-time notifications
- Secure payment processing

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18.x or later
- npm or yarn
- MongoDB instance

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email (for notifications)
EMAIL_SERVER_USER=your_email_server_user
EMAIL_SERVER_PASSWORD=your_email_server_password
EMAIL_SERVER_HOST=your_email_server_host
EMAIL_SERVER_PORT=your_email_server_port
EMAIL_FROM=your_from_email
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables as described above

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Create an admin user (required for initial setup):
   ```bash
   npm run create-admin
   # or
   yarn create-admin
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js 13+ app directory containing all routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and database configuration
- `/models` - MongoDB schema models
- `/public` - Static assets
- `/providers` - React context providers
- `/types` - TypeScript type definitions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
