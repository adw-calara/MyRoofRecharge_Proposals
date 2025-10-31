# Roof Recharge Proposal Generator

## Overview
Professional Word document proposal generator for Roof Recharge, a roof treatment company specializing in GoNano products. This web application allows users to fill out a detailed form and generate customized, professional-looking Word document proposals.

## Purpose
- Generate branded Word document proposals for roof treatment services
- Calculate costs, savings, and provide detailed product information
- Streamline the proposal creation process for sales representatives

## Current State
Fully functional web application with:
- Interactive web form for data entry
- Real-time cost calculations and savings preview
- Word document generation with professional formatting
- Automatic file download

## Recent Changes
**October 31, 2025**
- Initial project setup with Node.js, Express, and docx library
- Created frontend HTML form with live cost preview
- Built backend API for Word document generation
- Implemented comprehensive proposal template with:
  - Customer information section
  - Roof details
  - Product descriptions with benefits
  - Cost breakdown with custom services
  - Savings comparison
  - Professional formatting and branding

## Project Architecture

### Technology Stack
- **Backend**: Node.js with Express
- **Document Generation**: docx library
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Server**: Express serving static files and API endpoints

### File Structure
```
/
├── server.js                 # Express server and API endpoint
├── proposalGenerator.js      # Word document generation logic
├── public/
│   └── index.html           # Frontend form interface
├── package.json             # Dependencies
└── replit.md                # Project documentation
```

### Key Features
1. **Customer Information Collection**
   - Name, address, date
   - Roof type, age, square footage
   - GoNano product selection

2. **Pricing & Services**
   - Configurable price per square foot
   - Installation costs
   - Up to 3 custom additional services
   - Replacement cost comparison

3. **Word Document Generation**
   - Professional formatting with tables
   - Color-coded sections (Roof Recharge green: #2E8B57)
   - Product descriptions and benefits
   - Cost breakdown and savings comparison
   - Representative information

4. **Product Types**
   - GoNano Shingle Saver (0-7 years)
   - GoNano Revive (8-15 years)
   - GoNano BioBoost (15+ years)

### API Endpoints
- `GET /` - Serves the main form interface
- `POST /api/generate-proposal` - Generates and downloads Word document

### Workflow
- **server**: Runs on port 5000 with webview output

## User Preferences
- Clean, professional green branding (#2E8B57)
- Automatic calculations and live preview
- One-click Word document generation
