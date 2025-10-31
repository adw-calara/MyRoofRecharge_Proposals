# Roof Recharge Proposal Generator

## Overview
Professional Word document proposal generator for Roof Recharge by Green Energy Construction & Consulting. This web application creates comprehensive GoNano roof protection proposals that match the company's professional template exactly with custom fonts and branding.

## Purpose
- Generate branded Word document proposals for GoNano roof treatment services
- Include company logo and aerial property images in proposals
- Display product-specific images for each GoNano product
- Calculate investment costs and savings compared to roof replacement
- Streamline the proposal creation process for sales representatives

## Current State
Fully functional web application with:
- Interactive web form for data entry
- Company logo on cover page
- Aerial image upload capability with styled presentation
- Dynamic product-specific content and images based on selection
- Custom font styling (Montserrat Bold 42 for titles, Montserrat 36 for headings, Open Sans 16 for body)
- Real-time cost calculations and savings preview
- Professional Word document generation matching company template
- Automatic file download

## Recent Changes
**October 31, 2025**
- Added company logo (Roof Recharge) to cover page top
- Implemented custom fonts with optimized sizes for single-page sections:
  - Main titles: Montserrat Bold size 48
  - Section headings: Montserrat size 42
  - Subsection headings: Montserrat size 28
  - Body text headings: Open Sans Bold size 22
  - Body text: Open Sans size 20
- Created styled aerial image presentation with green bordered box
- Added "Professional GoNano Application" header above image
- Added "Extending Roof Life with Advanced Nanotechnology" footer below image
- Moved Company Profile section to page 2 with page breaks
- Moved Project Description to its own page (page 3)
- Updated property details table with green headers and white text
- Converted KEY FEATURES and PROVEN RESULTS to side-by-side table layout
- Moved Proposed GoNano Solution to its own page (page 4)
- Added product-specific images for all three products:
  - Shingle Saver: Purple barrel product image
  - Revive: Orange barrel product image
  - BioBoost: Green barrel product image
- Created side-by-side layout for product description and image
- Updated BioBoost product information with new features and benefits
- Restructured cover page to match exact template design
- Fixed document formatting to prevent text duplication
- Configured multer for handling file uploads
- Added "The GoNano Difference" page (page 5) with:
  - Comparison chart showing GoNano vs. Competition
  - Authorized Reseller & Installer banner
- Added page numbers to footer (bottom right, all pages except cover)
- Added small GoNano logo to footer (bottom right)

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
│   ├── roof-recharge-logo-new_1761941852214.png                      # Company logo
│   ├── Shingle Saver mockup_1761943502086.png                        # Shingle Saver product
│   ├── Revive label mockup_1761943502085.png                         # Revive product
│   ├── Bio-boost mockup_1761943502078.png                            # BioBoost product
│   ├── GoNano VS Competition chart_Square Format copy_1761943938309.png  # Comparison chart
│   ├── gonano-authorized-reseller-banner_1761943967489.png           # Authorized reseller banner
│   └── 1758641788792_ce68f289307689cd8c46bf9217137ee4_1761945730363.png  # Small GoNano logo for footer
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
   - Product-specific images

3. **Aerial Image Upload**
   - Optional image upload for property photos
   - Images embedded in styled green bordered box
   - Header: "Professional GoNano Application"
   - Footer: "Extending Roof Life with Advanced Nanotechnology"
   - Accepts all common image formats

4. **Dynamic Product Content**
   - Product selection drives content and images
   - GoNano Shingle Saver: Advanced protection (0-7 years) with purple barrel
   - GoNano Revive: Rejuvenation system (8-15 years) with orange barrel
   - GoNano BioBoost: Cost-effective solution for mature roofs (15+ years) with green barrel
   - Each product displays unique features, results, and notes

5. **Pricing & Calculations**
   - Configurable price per square foot
   - Installation costs
   - Replacement cost comparison
   - Automatic savings calculations

6. **Professional Word Document**
   Matches company template exactly with:
   
   **Page 1 - Cover Page:**
   - Company logo (Roof Recharge)
   - "PROJECT PROPOSAL" title in green (Montserrat Bold 32)
   - "gonano" branding (Montserrat Bold 36)
   - "Roof Protection System" subtitle (Open Sans 20)
   - Customer information in bordered box ("Prepared For" section)
   - Proposal date
   - Aerial image of property
   - Footer: "Extending Roof Life with Advanced Nanotechnology" and "myroofrecharge.com"

   **Page 2 - Company Profile:**
   - Company overview
   - Our Experience
   - Why We're Different
   - Our Service Area
   - Our Commitment

   **Page 3 - Project Description:**
   - Property details table with green headers
   - "[Aerial image will be inserted here]" placeholder

   **Page 4 - Proposed GoNano Solution:**
   - Dynamic heading based on selected product
   - Product-specific image (all products now have images)
   - Side-by-side layout: description on left, product image on right
   - Product overview and features
   - Side-by-side KEY FEATURES and PROVEN RESULTS table
   - Additional notes

   **Page 5 - The GoNano Difference:**
   - Title: "THE GONANO DIFFERENCE" (Montserrat Bold 84)
   - GoNano vs. Competition comparison chart
   - Authorized Reseller & Installer banner

   **Page 6 - Investment & Savings:**
   - Application costs
   - Installation costs
   - Total investment
   - Cost comparison with replacement
   - Savings calculation

   **Page 7 - Authorization:**
   - Signature lines for customer
   - Representative signature
   - Date fields

   **Page 8 - Terms and Conditions:**
   - 7 comprehensive sections

7. **Product Information**
   
   **GoNano Shingle Saver (0-7 years)**
   - Purple barrel product image
   - Advanced protection for newer roofs
   - Key Features: FORTIFY, ENHANCE, PRESERVE, LONGEVITY
   - Results: 68% aging reduction, breathable protection, warranty
   
   **GoNano Revive (8-15 years)**
   - Orange barrel product image
   - Rejuvenation system
   - Key Features: RESTORE, PROTECT, PRESERVE, LONGEVITY
   - Results: Restores flexibility, fills micro-cracks, 8-12 year extension
   
   **GoNano BioBoost (15+ years)**
   - Green barrel product image
   - Cost-effective solution for mature roofs
   - Key Features: BOOSTS LONGEVITY, RESISTS DAMAGE, RESTORES VITALITY, SAVES MONEY
   - Product Benefits: Bio-oil formula, water repellent, 3-5 year extension
   
   Each product includes:
   - Detailed overview
   - Product-specific barrel image (250x250 pixels)
   - KEY FEATURES section
   - PROVEN RESULTS/PRODUCT BENEFITS section
   - Product-specific notes

### Typography

**Custom Fonts (optimized for single-page sections):**
- **Main Titles**: Montserrat Bold, size 48pt
  - Used for: "PROJECT PROPOSAL", main section headings
- **Section Headings**: Montserrat, size 42pt
  - Used for: "COMPANY PROFILE", "PROJECT DESCRIPTION", "INVESTMENT & SAVINGS ANALYSIS"
- **Subsection Headings**: Montserrat, size 28pt
  - Used for: subsection headings
- **Body Text Headings**: Open Sans Bold, size 22pt
  - Used for: table headers, emphasis text
- **Body Text**: Open Sans, size 20pt
  - Used for: all paragraph text, descriptions, table content

**Note**: Font sizes have been optimized to ensure each section fits on a single page while maintaining readability. Fonts are specified in the document. Microsoft Word will use these fonts if installed on the system, or substitute similar fonts if not available.

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

### Product Images
- All three products now have professional barrel images
- **Shingle Saver**: Purple barrel (200x200 pixels)
- **Revive**: Orange barrel (200x200 pixels)
- **BioBoost**: Green barrel (200x200 pixels)
- Images displayed in side-by-side table layout with product description
- Professional presentation with vertical centering
- Optimized sizes for single-page layouts

### Document Generation
- Uses docx library for Word document creation
- Custom font specifications (Montserrat, Open Sans)
- Proper paragraph formatting (no mixed text/children properties)
- Professional color scheme
- Tables with shaded headers and formatted cells
- Side-by-side KEY FEATURES and PROVEN RESULTS layout
- Page breaks for section organization
- Consistent spacing and typography
- Dynamic content based on product selection
- Page numbers in footer (bottom right, all pages except cover)
- Small GoNano logo in footer (bottom right)

## User Preferences
- Professional green branding (#2E8B57)
- Custom fonts optimized for single-page sections: Montserrat Bold 48 for titles, Montserrat 42 for headings, Open Sans 20 for body
- Exact template matching for company consistency
- Styled aerial image presentation
- Green table headers with white text
- Side-by-side feature comparison tables
- Product-specific images and content
- Company logo on cover page
- One-click Word document generation with image
- Automatic calculations and live preview
- Each section fits on one page for professional presentation
