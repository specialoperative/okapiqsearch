# Okapiq - Bloomberg for Small Businesses

## 🚀 AI-Powered Market Intelligence Platform

Okapiq is a comprehensive market intelligence platform that provides deal sourcing, market analysis, and business intelligence for small business acquisitions. The platform integrates real Google Maps business data with UC Berkeley A-Z Databases for academic market intelligence.

## ✨ Key Features

### 🗺️ Real Google Maps Integration
- **20 Cities Supported**: San Francisco, New York, Los Angeles, Chicago, Miami, Austin, Seattle, Denver, Atlanta, Boston, Phoenix, Dallas, Houston, Philadelphia, San Diego, Detroit, Portland, Las Vegas, Minneapolis, Tampa, Orlando
- **Authentic Business Addresses**: All addresses match actual Google Maps search results
- **Verified Phone Numbers**: Correct area codes for each geographic region
- **Google Maps Searchable**: Every address can be verified on Google Maps

### 📚 UC Berkeley A-Z Databases Integration
- **IBISWorld**: Industry reports and market size data
- **Bureau of Labor Statistics**: Employment and wage data
- **US Census Bureau**: Demographic and economic data
- **Economic Intelligence Unit**: Global economic and business intelligence
- **Frost & Sullivan**: Market research and consulting data

### 🎯 Market Intelligence Features
- **TAM/SAM/SOM Calculations**: Market size estimation and revenue potential analysis
- **HHI Analysis**: Herfindahl-Hirschman Index for market concentration
- **Lead Generation**: CRM-ready business profiles with detailed metrics
- **Succession Risk Scoring**: Owner age estimation and business transition analysis

## 🏗️ Architecture

### Backend (FastAPI)
- **Port**: 8000
- **Framework**: FastAPI with Python
- **Database**: SQLite (development)
- **Key Components**:
  - Market Intelligence Service
  - Yelp Scraper (with real Google Maps data)
  - UC Berkeley Database Collector
  - Lead Management System

### Frontend (Next.js)
- **Port**: 3001
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Key Components**:
  - Market Scanner Interface
  - Business Profile Pages
  - CRM Dashboard
  - Analytics Dashboard

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🗺️ Real Google Maps Business Data

### San Francisco
- 1725 Montgomery St
- 1 Henry Adams St
- 1000 California St
- 1580 Tennessee St
- 1450 Howard St

### New York
- 368 9th Ave 6th floor
- 746 E 9th St
- 156 2nd Ave 3rd floor
- 141 W 20th St

### Los Angeles
- 904 Wall St Suite 203
- 8599 Venice Blvd
- 622 Alpine St
- 509 N Fairfax Ave
- 2355 Westwood Blvd #145

*[Complete list for all 20 cities available in the codebase]*

## 📚 UC Berkeley A-Z Databases Integration

The platform integrates with [UC Berkeley A-Z Databases](https://guides.lib.berkeley.edu/az/databases) for academic market intelligence:

- **IBISWorld**: Industry reports and market size data
- **Bureau of Labor Statistics**: Employment and wage data
- **US Census Bureau**: Demographic and economic data
- **Economic Intelligence Unit**: Global economic and business intelligence
- **Frost & Sullivan**: Market research and consulting data

## 🎯 Market Scanner Features

### Real Business Data
- Authentic Google Maps addresses for all 20 cities
- Verified phone numbers with correct area codes
- Realistic business names and metrics
- Professional business profiles

### Market Intelligence
- TAM/SAM/SOM estimates with academic sources
- HHI fragmentation analysis
- Lead scoring and qualification
- Succession risk assessment

### User Experience
- Cache-busting for fresh data
- Real-time scan results
- Google Maps verification buttons
- Professional UI with smooth animations

## 🔧 Technical Implementation

### Backend Architecture
```
backend/
├── app/
│   ├── routers/
│   │   ├── market.py          # Market intelligence endpoints
│   │   ├── leads.py           # Lead management
│   │   ├── auth.py            # Authentication
│   │   └── analytics.py       # Analytics endpoints
│   ├── data_collectors/
│   │   ├── yelp_scraper.py    # Real Google Maps data
│   │   └── berkeley_databases.py # UC Berkeley integration
│   ├── services/
│   │   └── market_intelligence_service.py
│   └── core/
│       ├── config.py
│       └── database.py
└── main.py
```

### Frontend Architecture
```
frontend/
├── app/
│   ├── business/[id]/         # Dynamic business profiles
│   ├── page.tsx               # Landing page
│   ├── App.tsx                # Main app component
│   └── layout.tsx             # App layout
├── components/
│   ├── market-scanner-page.tsx
│   ├── landing-page.tsx
│   ├── dashboard.tsx
│   └── crm-page.tsx
└── ui/
    └── smooth-components.tsx  # Custom UI components
```

## 🧪 Testing

### Backend API Tests
```bash
# Test San Francisco market scan
curl -X POST http://localhost:8000/market/scan \
  -H "Content-Type: application/json" \
  -d '{"location": "San Francisco", "industry": "HVAC", "radius_miles": 25}'
```

### Frontend Tests
- Visit http://localhost:3001
- Perform market scans for different cities
- Verify real Google Maps addresses appear
- Test "Verify on Maps" functionality

## 📊 API Endpoints

### Market Intelligence
- `POST /market/scan` - Scan market for businesses
- `GET /market/area-calculator` - Calculate market areas
- `GET /market/tam/{zip_code}` - TAM estimates
- `GET /market/fragmentation/{industry}` - HHI analysis

### Lead Management
- `GET /leads/` - Get all leads
- `POST /leads/` - Create new lead
- `PUT /leads/{id}` - Update lead

### Analytics
- `GET /analytics/market-trends` - Market trend analysis
- `GET /analytics/lead-conversion` - Lead conversion metrics

## 🎨 Design System

### Custom UI Components
- **Smooth Components**: Custom animation system
- **Fur Patterns**: Zebra, Okapi, Cheetah, Leopard, Lion, Rhino themes
- **Responsive Design**: Mobile-first approach
- **Professional UI**: Clean, modern interface

### Color Palette
- **Okapi Brown**: Primary brand color
- **Accent Colors**: Blue, Green, Orange for different actions
- **Status Colors**: Success (Green), Warning (Yellow), Error (Red)

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && uvicorn main:app --reload

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Deploy backend
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using FastAPI, Next.js, and real Google Maps data**
