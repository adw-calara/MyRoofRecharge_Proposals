# Roof Recharge Proposal Generator

## Overview
Professional Word document proposal generator for Roof Recharge by Green Energy Construction & Consulting. This web application creates comprehensive GoNano roof protection proposals that match the company's professional template exactly.

## Purpose
- Generate branded Word document proposals for GoNano roof treatment services
- Include aerial property images in proposals
- Calculate investment costs and savings compared to roof replacement
- Streamline the proposal creation process for sales representatives

## Current State
Fully functional web application with:
- Interactive web form for data entry
- Aerial image upload capability
- Real-time cost calculations and savings preview
- Professional Word document generation matching company template
- Automatic file download

## Recent Changes
**October 31, 2025**
- Rebuilt proposal generator to match exact company template format
- Added aerial image upload and embedding in Word documents
- Implemented comprehensive company profile section
- Added detailed product descriptions with KEY FEATURES and PROVEN RESULTS
- Created professional authorization to proceed section with signature lines
- Added complete terms and conditions section
- Fixed document formatting to prevent text duplication
- Configured multer for handling file uploads

## Project Architecture

### Technology Stack
- **Backend**: Node.js with Express
- **Document Generation**: docx library
- **File Upload**: multer middleware
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Server**: Express serving static files and API endpoints

### File Structure
```
/
├── server.js                 # Express server with multer for image uploads
├── proposalGenerator.js      # Word document generation matching template
├── public/
│   └── index.html           # Frontend form with image upload
├── package.json             # Dependencies
└── replit.md                # Project documentation
```

### Key Features

1. **Customer Information Collection**
   - Name, address, date
   - Roof type, age, square footage
   - GoNano product selection (auto-selected based on age)

2. **Aerial Image Upload**
   - Optional image upload for property photos
   - Images embedded in Word document
   - Accepts all common image formats

3. **Pricing & Calculations**
   - Configurable price per square foot
   - Installation costs
   - Replacement cost comparison
   - Automatic savings calculations

4. **Professional Word Document**
   Matches company template exactly with:
   - Cover page with customer information
   - Company profile and history
   - Project description with aerial image
   - Detailed product overview and features
   - Investment & savings analysis
   - Authorization to proceed section
   - Complete terms and conditions

5. **Product Information**
   - GoNano Shingle Saver (0-7 years) - Advanced protection
   - GoNano Revive (8-15 years) - Rejuvenation system
   - GoNano BioBoost (15+ years) - Restoration with bio-resistance
   
   Each product includes:
   - Detailed overview
   - KEY FEATURES section
   - PROVEN RESULTS section
   - Product-specific notes

### Template Sections

1. **Cover Page**
   - Project proposal heading
   - Customer details
   - Date
   - Professional tagline

2. **Company Profile**
   - Company overview
   - Our Experience
   - Why We're Different
   - Our Service Area
   - Our Commitment

3. **Project Description**
   - Property details table
   - Aerial image (when uploaded)
   - Proposed GoNano solution

4. **Product Overview**
   - Product description
   - KEY FEATURES
   - PROVEN RESULTS
   - Additional notes

5. **Investment & Savings Analysis**
   - Application costs
   - Installation costs
   - Total investment
   - Cost comparison with replacement
   - Savings calculation

6. **Authorization to Proceed**
   - Signature lines for customer
   - Representative signature
   - Date fields

7. **Terms and Conditions**
   - Scope of Work
   - Warranty
   - Payment Terms
   - Weather Conditions
   - Liability
   - Environmental Safety
   - Additional Fees

### API Endpoints
- `GET /` - Serves the main form interface
- `POST /api/generate-proposal` - Generates and downloads Word document (accepts multipart/form-data with optional image)

### Workflow
- **server**: Runs on port 5000 with webview output

## Technical Details

### Image Handling
- Images uploaded via multipart form data
- Stored in memory (not saved to disk)
- Maximum file size: 10MB
- Embedded in Word document at 500x350 pixels
- If no image uploaded, placeholder text is shown

### Document Generation
- Uses docx library for Word document creation
- Proper paragraph formatting (no mixed text/children properties)
- Professional color scheme (Roof Recharge green: #2E8B57)
- Tables with shaded headers and formatted cells
- Consistent spacing and typography

## User Preferences
- Professional green branding (#2E8B57)
- Exact template matching for company consistency
- One-click Word document generation with image
- Automatic calculations and live preview
