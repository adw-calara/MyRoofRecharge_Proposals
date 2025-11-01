# Roof Recharge Proposal Generator

## Overview
This web application generates professional Word document proposals for Green Energy Construction & Consulting's GoNano roof protection services. Its primary purpose is to streamline the sales process by creating branded, comprehensive proposals that precisely match the company's established template, including custom fonts, branding, and dynamic content. The system supports multi-roof proposals, aerial image integration, product-specific information, and automated cost calculations, ultimately aiming to enhance professionalism and efficiency in client presentations.

## Recent Updates (November 1, 2025)
- **Fixed roof replacement cost calculation**: Cost comparison now correctly displays total replacement cost for all roofs
- **Moved Authorization to Proceed**: Authorization section now appears on the Investment & Savings page instead of a separate page
- **Updated footer design**: All pages now display "myroofrecharge.com" in center and page number on the right side

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

## System Architecture

### Technology Stack
- **Backend**: Node.js with Express
- **Document Generation**: docx library
- **File Upload**: multer middleware
- **Frontend**: Vanilla HTML, CSS, JavaScript

### Key Features

1.  **Multi-Roof Support**: Allows adding unlimited roofs to a single proposal, each with independent type, age, square footage, pricing, and product selection.
2.  **Branding & Design**: Incorporates company and GoNano logos, custom fonts (Montserrat, Open Sans), and a professional green color scheme.
3.  **Dynamic Content Generation**: Product selection (Shingle Saver, Revive, BioBoost) drives specific content, images, and feature descriptions. Product auto-selection is based on roof age.
4.  **Aerial Image Integration**: Users can upload aerial property images, which are styled and embedded within the proposal.
5.  **Automated Calculations**: Provides real-time investment costs, installation costs, replacement cost comparisons, and savings calculations, with detailed per-roof breakdowns.
6.  **Professional Word Document Output**: Generates a multi-page Word document (`.docx`) that precisely replicates the company's template, including:
    *   **Cover Page**: Company and GoNano logos, project title, customer details, aerial image.
    *   **Company Profile**: Overview, experience, differentiation.
    *   **Project Description**: Property details, user-uploaded aerial image, "Our Process" section.
    *   **Proposed GoNano Solution**: Product-specific images, features, and benefits in a side-by-side layout, grouped by product for multi-roof proposals.
    *   **The GoNano Difference**: Comparison chart, authorized reseller banner.
    *   **Investment & Savings**: Detailed cost breakdown and savings analysis per roof and aggregated totals.
    *   **Authorization & Terms**: Signature lines and comprehensive terms and conditions.
    *   Consistent page numbering in the footer (excluding cover).

### System Design
- **Document Structure**: The generated Word document is carefully structured with specific page layouts for each section, optimized to fit content on single pages where appropriate.
- **Typography**: Utilizes specific font families (Montserrat, Open Sans) and sizes for different elements (titles, headings, body text) to maintain brand consistency and readability.
- **Color Scheme**: Adheres to a primary green brand color (#2E8B57) with accent colors for highlighting.
- **Image Handling**: Supports dynamic image uploads (aerial photos) and embeds static product-specific images, all optimized for document presentation.
- **Modular Calculation**: `calculateCosts()` function handles complex calculations for multiple roofs, returning per-roof and aggregated totals while maintaining backward compatibility for single-roof proposals.

## External Dependencies

-   **docx library**: For programmatic generation of `.docx` Word documents.
-   **multer**: Node.js middleware for handling `multipart/form-data`, primarily used for file uploads (e.g., aerial images).