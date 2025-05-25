# 🗺️ Google Maps Clone

A feature-rich Google Maps clone built with Next.js, React, and the Google Maps JavaScript API. This application provides comprehensive mapping functionality including multiple route options, real-time traffic data, travel mode comparisons, and an intuitive user interface.

![Google Maps Clone](https://img.shields.io/badge/Next.js-14.0.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Google Maps](https://img.shields.io/badge/Google_Maps_API-4285F4?style=for-the-badge&logo=google-maps)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🗺️ **Core Mapping Features**
- **Interactive Google Maps** with full pan, zoom, and navigation
- **Current location detection** with GPS integration
- **Search functionality** with Google Places autocomplete
- **Custom markers** for locations and points of interest
- **Real-time traffic layer** with color-coded traffic conditions

### 🛣️ **Advanced Routing**
- **Multiple route options** with alternative path suggestions
- **Travel mode comparison** (Driving, Transit, Walking, Bicycling)
- **Real-time traffic integration** for accurate travel times
- **Route selection** with visual feedback and detailed information
- **ETA calculations** based on current traffic conditions

### 🎯 **User Experience**
- **Responsive design** that works on desktop and mobile
- **Saved places** for quick access to frequent destinations
- **Recent searches** with persistent history
- **Traffic delay warnings** and route optimization
- **Clean, modern UI** inspired by Google Maps

### 📱 **Interface Features**
- **Collapsible sidebar** with scrollable content
- **Travel mode buttons** with time/distance display
- **Route comparison cards** with detailed metrics
- **Traffic condition indicators** and warnings
- **Quick action buttons** for common tasks

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager
- A **Google Cloud Platform** account
- A **Google Maps JavaScript API** key

### 📋 Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/google-maps-clone.git
   cd google-maps-clone
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Configure your API keys** (see API Setup section below)

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Google Maps API Setup

### Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select an existing project
3. Give your project a name (e.g., "Maps Clone App")
4. Click **"Create"**

### Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

1. **Maps JavaScript API** - For displaying interactive maps
2. **Places API** - For location search and autocomplete
3. **Directions API** - For route calculations and navigation
4. **Geocoding API** - For address to coordinates conversion
5. **Distance Matrix API** - For travel time calculations

**To enable APIs:**
1. Go to **APIs & Services > Library**
2. Search for each API listed above
3. Click on the API and press **"Enable"**

### Step 3: Create API Credentials

1. Go to **APIs & Services > Credentials**
2. Click **"Create Credentials" > "API Key"**
3. Copy your API key
4. **Important:** Restrict your API key for security

### Step 4: Configure API Key Restrictions

**For production security, restrict your API key:**

1. Click on your API key in the Credentials page
2. Under **"API restrictions"**, select **"Restrict key"**
3. Choose the APIs you enabled above
4. Under **"Website restrictions"**, add your domains:
   - `localhost:3000` (for development)
   - `yourdomain.com` (for production)

### Step 5: Set Up Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional: Additional API Keys for enhanced features
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration (if using authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Firebase Configuration (if using Firebase features)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
\`\`\`

## 🛠️ Configuration

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_MAPS_API_KEY` | Server-side Google Maps API key | ✅ Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side Google Maps API key | ✅ Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ Optional |
| `NEXTAUTH_URL` | NextAuth.js URL configuration | ❌ Optional |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | ❌ Optional |

### API Usage Limits

**Free Tier Limits (Google Maps Platform):**
- **Maps JavaScript API**: $200 free credit monthly
- **Places API**: $200 free credit monthly  
- **Directions API**: $200 free credit monthly

**Typical Usage Costs:**
- Map loads: $7 per 1,000 loads
- Places Autocomplete: $17 per 1,000 requests
- Directions: $5 per 1,000 requests

## 📁 Project Structure

\`\`\`
google-maps-clone/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   ├── loading.js           # Loading component
│   └── page.js              # Main application page
├── components/
│   └── ui/                  # Reusable UI components
│       ├── button.jsx       # Button component
│       ├── card.jsx         # Card component
│       ├── input.jsx        # Input component
│       └── separator.jsx    # Separator component
├── lib/
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── .env.local              # Environment variables
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md               # This file
\`\`\`

## 🎯 Usage Guide

### Basic Navigation
1. **Search for locations** using the search bar
2. **Click "Your location"** to center map on current position
3. **Use direction controls** to get route information

### Getting Directions
1. Click the **"Directions"** button
2. Enter **start and destination** locations
3. Select your **travel mode** (Car, Transit, Walk, Bike)
4. Choose from **multiple route options**
5. View **real-time traffic** and **ETA information**

### Advanced Features
- **Save frequently visited places** for quick access
- **Compare different travel modes** side by side
- **View traffic conditions** with color-coded overlays
- **Select alternative routes** based on preferences

## 🔧 Development

### Available Scripts

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking (if using TypeScript)
npm run type-check
\`\`\`

### Adding New Features

1. **Create new components** in the `components/` directory
2. **Add API integrations** in the main page component
3. **Style with Tailwind CSS** classes
4. **Test thoroughly** with different locations and scenarios

## 🚨 Troubleshooting

### Common Issues

**❌ "Google Maps JavaScript API error: RefererNotAllowedMapError"**
- **Solution**: Add your domain to API key restrictions in Google Cloud Console

**❌ "This page can't load Google Maps correctly"**
- **Solution**: Check that your API key is valid and has the required APIs enabled

**❌ "Geocoder failed due to: OVER_QUERY_LIMIT"**
- **Solution**: You've exceeded your API quota. Check usage in Google Cloud Console

**❌ Map not loading or showing gray area**
- **Solution**: Verify your API key is correctly set in environment variables

**❌ "Loading Google Maps..." stuck on screen**
- **Solution**: Check browser console for API errors and network connectivity

### Debug Mode

Enable debug mode by adding to your `.env.local`:
\`\`\`env
NEXT_PUBLIC_DEBUG=true
\`\`\`

## 📊 Performance Optimization

### Best Practices
- **Lazy load** map components when needed
- **Debounce** search inputs to reduce API calls
- **Cache** frequently accessed location data
- **Optimize** marker rendering for large datasets
- **Use** appropriate zoom levels for better performance

### Monitoring Usage
- Monitor API usage in [Google Cloud Console](https://console.cloud.google.com/)
- Set up **billing alerts** to avoid unexpected charges
- Use **quotas** to limit API usage if needed

## 🔒 Security Considerations

### API Key Security
- **Never commit** API keys to version control
- **Use environment variables** for all sensitive data
- **Restrict API keys** to specific domains and APIs
- **Rotate keys** regularly for enhanced security

### Production Deployment
- Set up **proper domain restrictions**
- Use **HTTPS** for all production deployments
- Implement **rate limiting** if needed
- Monitor for **unusual API usage patterns**

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
- **Netlify**: Similar process to Vercel
- **AWS Amplify**: Full-stack deployment option
- **Google Cloud Run**: Container-based deployment
- **Traditional hosting**: Build and upload static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps Platform** for providing comprehensive mapping APIs
- **Next.js team** for the excellent React framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for beautiful, accessible UI components

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting) above
2. Search [existing issues](https://github.com/yourusername/google-maps-clone/issues)
3. Create a [new issue](https://github.com/yourusername/google-maps-clone/issues/new) with detailed information
4. Join our [Discord community](https://discord.gg/your-invite) for real-time help

---

**Happy Mapping! 🗺️✨**

Made with ❤️ using Next.js and Google Maps API
\`\`\`

This comprehensive README file includes:

## 📋 **Key Sections:**

### 🔧 **Setup Instructions**
- Step-by-step installation guide
- Prerequisites and requirements
- Environment configuration

### 🔑 **API Key Guidance**
- Detailed Google Cloud setup process
- API enablement instructions
- Security best practices
- Cost considerations

### 📁 **Project Information**
- Feature overview with emojis
- Project structure explanation
- Usage guidelines

### 🚨 **Troubleshooting**
- Common issues and solutions
- Debug mode instructions
- Performance optimization tips

### 🚀 **Deployment & Security**
- Multiple deployment options
- Security considerations
- Production best practices

The README is designed to be beginner-friendly while providing comprehensive information for developers of all skill levels!
