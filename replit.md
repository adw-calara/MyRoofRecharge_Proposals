# Roof Recharge Proposal Generator

## Overview
Professional Word document proposal generator for Roof Recharge by Green Energy Construction & Consulting. This web application creates comprehensive GoNano roof protection proposals that match the company's professional template exactly with custom fonts and branding.

## Purpose
- Generate branded Word document proposals for GoNano roof treatment services
- Include company logo and aerial property images in proposals
- Calculate investment costs and savings compared to roof replacement
- Streamline the proposal creation process for sales representatives

## Current State
Fully functional web application with:
- Interactive web form for data entry
- Company logo on cover page
- Aerial image upload capability with styled presentation
- Custom font styling (Montserrat Bold 42 for titles, Montserrat 36 for headings, Open Sans 16 for body)
- Real-time cost calculations and savings preview
- Professional Word document generation matching company template
- Automatic file download

## Recent Changes
**October 31, 2025**
- Added company logo (Roof Recharge) to cover page top
- Implemented custom fonts:
  - Titles: Montserrat Bold size 42
  - Headings: Montserrat size 36
  - Body text: Open Sans size 16
- Created styled aerial image presentation with green bordered box
- Added "Professional GoNano Application" header above image
- Added "Extending Roof Life with Advanced Nanotechnology" footer below image
- Moved Company Profile section to page 2 with page breaks
- Restructured cover page to match exact template design
- Fixed document formatting to prevent text duplication
- Configured multer for handling file uploads

## Project Architecture

### Technology Stack
- **Backend**: Node.js with Express
- **Document Generation**: docx library with custom fonts
- **File Upload**: multer middleware
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Server**: Express serving static files and API endpoints

### File Structure
```
/
├── server.js                 # Express server with multer for image uploads
├── proposalGenerator.js      # Word document generation with custom fonts
├── public/
│   └── index.html           # Frontend form with image upload
├── attached_assets/
│   └── roof-recharge-logo-new_1761941852214.png  # Company logo
├── package.json             # Dependencies
└── replit.md                # Project documentation
```

### Key Features

1. **Customer Information Collection**
   - Name, address, date
   - Roof type, age, square footage
   - GoNano product selection (auto-selected based on age)

2. **Branding & Design**
   - Company logo on cover page
   - Custom font styling throughout
   - Professional green color scheme (#2E8B57)
   - Styled aerial image presentation

3. **Aerial Image Upload**
   - Optional image upload for property photos
   - Images embedded in styled green bordered box
   - Header: "Professional GoNano Application"
   - Footer: "Extending Roof Life with Advanced Nanotechnology"
   - Accepts all common image formats

4. **Pricing & Calculations**
   - Configurable price per square foot
   - Installation costs
   - Replacement cost comparison
   - Automatic savings calculations

5. **Professional Word Document**
   Matches company template exactly with:
   
   **Page 1 - Cover Page:**
   - Company logo
   - "PROJECT PROPOSAL" title (Montserrat Bold 42)
   - "GoNano Roof Protection System" subtitle
   - Customer information in bordered box
   - Proposal date
   - Styled aerial image presentation

   **Page 2 - Company Profile:**
   - Company overview
   - Our Experience
   - Why We're Different
   - Our Service Area
   - Our Commitment

   **Page 3 - Project Description:**
   - Property details table
   - Proposed GoNano solution
   - Product overview and features
   - KEY FEATURES section
   - PROVEN RESULTS section

   **Page 4 - Investment & Savings:**
   - Application costs
   - Installation costs
   - Total investment
   - Cost comparison with replacement
   - Savings calculation

   **Page 5 - Authorization:**
   - Signature lines for customer
   - Representative signature
   - Date fields

   **Page 6 - Terms and Conditions:**
   - 7 comprehensive sections

6. **Product Information**
   - GoNano Shingle Saver (0-7 years) - Advanced protection
   - GoNano Revive (8-15 years) - Rejuvenation system
   - GoNano BioBoost (15+ years) - Restoration with bio-resistance
   
   Each product includes:
   - Detailed overview
   - KEY FEATURES section
   - PROVEN RESULTS section
   - Product-specific notes

### Typography

**Custom Fonts:**
- **Titles**: Montserrat Bold, size 42pt
  - Used for: "PROJECT PROPOSAL", section headings like "COMPANY PROFILE", "PROJECT DESCRIPTION"
- **Headings**: Montserrat, size 36pt
  - Used for: subsection headings, "Your Savings" callouts
- **Body Text**: Open Sans, size 16pt
  - Used for: all paragraph text, descriptions, table content

**Note**: Fonts are specified in the document. Microsoft Word will use these fonts if installed on the system, or substitute similar fonts if not available.

### Color Scheme
- **Primary Green**: #2E8B57 (Roof Recharge brand color)
- **Light Green**: #E8F5E9 (table headers, image box background)
- **Accent Green**: #4CAF50 (savings highlight)
- **White**: #FFFFFF (text on green backgrounds)

### API Endpoints
- `GET /` - Serves the main form interface
- `POST /api/generate-proposal` - Generates and downloads Word document (accepts multipart/form-data with optional image)

### Workflow
- **server**: Runs on port 5000 with webview output

## Technical Details

### Logo Handling
- Logo loaded from `attached_assets/roof-recharge-logo-new_1761941852214.png`
- Embedded at top of cover page at 400x80 pixels
- High-quality PNG format

### Image Handling
- Images uploaded via multipart form data
- Stored in memory (not saved to disk)
- Maximum file size: 10MB
- Embedded in Word document at 450x300 pixels
- Styled with green bordered table cells
- Header and footer text in green

### Document Generation
- Uses docx library for Word document creation
- Custom font specifications (Montserrat, Open Sans)
- Proper paragraph formatting (no mixed text/children properties)
- Professional color scheme
- Tables with shaded headers and formatted cells
- Page breaks for section organization
- Consistent spacing and typography

## User Preferences
- Professional green branding (#2E8B57)
- Custom fonts: Montserrat Bold 42 for titles, Montserrat 36 for headings, Open Sans 16 for body
- Exact template matching for company consistency
- Styled aerial image presentation
- Company logo on cover page
- One-click Word document generation with image
- Automatic calculations and live preview
