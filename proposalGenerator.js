const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun, BorderStyle, PageBreak, Footer, Header, PageNumber } = require('docx');
const fs = require('fs');
const path = require('path');

function formatCurrency(amount) {
    const value = parseFloat(amount);
    return `$${(isNaN(value) ? 0 : value).toFixed(2)}`;
}

function formatDate(dateString) {
    if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateCosts(data) {
    const replacementPerSqFt = parseFloat(data.replacementCostPerSqFt) || 0;
    const legacyInstallCost = parseFloat(data.installationCost) || 0; // For backward compatibility
    
    let normalizedRoofs = [];
    
    // Check if we have roofs array (new format) or legacy single roof format
    if (data.roofs && Array.isArray(data.roofs) && data.roofs.length > 0) {
        // New format: multiple roofs
        normalizedRoofs = data.roofs.map((roof, index) => {
            const sqft = parseFloat(roof.squareFeet) || 0;
            const pricePerSqFt = parseFloat(roof.pricePerSqFt) || 0;
            const installCost = parseFloat(roof.installationCost) || 0;
            const applicationCost = sqft * pricePerSqFt;
            const replacementCost = sqft * replacementPerSqFt;
            
            return {
                label: `Roof ${index + 1}`,
                roofType: roof.roofType || '',
                roofAge: parseInt(roof.roofAge) || 0,
                squareFeet: sqft,
                gonanoProduct: roof.gonanoProduct || '',
                pricePerSqFt: pricePerSqFt,
                installationCost: installCost,
                applicationCost: applicationCost,
                replacementCost: replacementCost
            };
        });
    } else {
        // Legacy format: single roof (backward compatibility)
        const sqft = parseFloat(data.squareFeet) || 0;
        const pricePerSqFt = parseFloat(data.pricePerSqFt) || 0;
        const applicationCost = sqft * pricePerSqFt;
        const replacementCost = sqft * replacementPerSqFt;
        
        normalizedRoofs = [{
            label: '',  // No label for single roof
            roofType: data.roofType || '',
            roofAge: parseInt(data.roofAge) || 0,
            squareFeet: sqft,
            gonanoProduct: data.gonanoProduct || '',
            pricePerSqFt: pricePerSqFt,
            installationCost: legacyInstallCost,
            applicationCost: applicationCost,
            replacementCost: replacementCost
        }];
    }
    
    // Calculate totals
    const totals = normalizedRoofs.reduce((acc, roof) => ({
        totalSquareFeet: acc.totalSquareFeet + roof.squareFeet,
        totalApplicationCost: acc.totalApplicationCost + roof.applicationCost,
        totalInstallationCost: acc.totalInstallationCost + roof.installationCost,
        totalReplacementCost: acc.totalReplacementCost + roof.replacementCost
    }), {
        totalSquareFeet: 0,
        totalApplicationCost: 0,
        totalInstallationCost: 0,
        totalReplacementCost: 0
    });
    
    // Add optional services
    const service1Price = parseFloat(data.service1Price) || 0;
    const service2Price = parseFloat(data.service2Price) || 0;
    const service3Price = parseFloat(data.service3Price) || 0;
    const customServicesTotal = service1Price + service2Price + service3Price;
    
    totals.customServicesTotal = customServicesTotal;
    totals.totalCost = totals.totalApplicationCost + totals.totalInstallationCost + customServicesTotal;
    totals.savingsAmount = totals.totalReplacementCost - totals.totalCost;
    
    return {
        roofs: normalizedRoofs,
        totals: totals
    };
}

function getProductInfo(productName) {
    const products = {
        'GoNano Shingle Saver': {
            subtitle: 'Perfect for your newer roof (0-7 years old), this advanced nanotechnology formula will protect your investment for decades to come.',
            overview: 'GoNano Shingle Saver is a nanotechnology-driven clear and breathable penetrating sealer for asphalt shingles. Using advanced nano-particles that connect to the aggregate and bitumen, it creates a hydrophobic environment that dramatically extends roof life.',
            imagePath: 'attached_assets/Shingle Saver mockup_1761943502086.png',
            features: [
                { icon: '✓ FORTIFY', description: 'Significantly enhances impact resistance' },
                { icon: '✓ ENHANCE', description: 'Improves wind and weather resistance' },
                { icon: '✓ PRESERVE', description: 'Creates hydrophobic barrier' },
                { icon: '✓ LONGEVITY', description: 'Extends roof life up to 15 years' }
            ],
            results: [
                '• Aging reduction up to 68%',
                '• 100% breathable protection',
                '• Resists freeze-thaw damage',
                '• Prevents organic growth',
                '• Natural flat finish',
                '• UL & IBHS tested',
                '• 5-15 year warranty'
            ],
            notes: "Customer's roof is in excellent condition. Shingle Saver will provide maximum protection with its nanotechnology-driven formula, creating a hydrophobic barrier that prevents damage and extends roof life."
        },
        'GoNano Revive': {
            subtitle: 'Ideal for mid-life roofs (8-15 years old), this advanced formula rejuvenates aging shingles and restores protective properties.',
            overview: 'GoNano Revive is a nanotechnology-based rejuvenation system for aging asphalt shingles. The advanced formula penetrates deep into shingle material, restoring flexibility and creating a protective barrier against further deterioration.',
            imagePath: 'attached_assets/Revive label mockup_1761943502085.png',
            features: [
                { icon: '✓ RESTORE', description: 'Rejuvenates aging shingles' },
                { icon: '✓ PROTECT', description: 'Creates long-lasting barrier' },
                { icon: '✓ PRESERVE', description: 'Prevents further deterioration' },
                { icon: '✓ LONGEVITY', description: 'Extends roof life 8-12 years' }
            ],
            results: [
                '• Restores shingle flexibility',
                '• Fills micro-cracks and gaps',
                '• 100% breathable protection',
                '• Improves water resistance',
                '• Natural flat finish',
                '• UL & IBHS tested',
                '• 5-15 year warranty'
            ],
            notes: "Customer's mid-life roof will benefit from GoNano Revive's restoration properties, filling micro-cracks and rejuvenating aged shingles for extended protection."
        },
        'GoNano BioBoost': {
            subtitle: 'The smart choice for your mature roof (15+ years old), providing cost-effective protection that delays replacement.',
            overview: 'GoNano BioBoost is a cost-effective solution for protecting and maintaining asphalt shingle roofs. By combining nanotechnology with renewable bio-oils, it offers a balance of performance and environmental consciousness for mature roofs.',
            imagePath: 'attached_assets/Bio-boost mockup_1761943502078.png',
            features: [
                { icon: '✓ BOOSTS LONGEVITY', description: 'Extends life of mature roofs' },
                { icon: '✓ RESISTS DAMAGE', description: 'Protects against weather & UV' },
                { icon: '✓ RESTORES VITALITY', description: 'Infuses bio-oil for flexibility' },
                { icon: '✓ SAVES MONEY', description: 'Cost-effective protection' }
            ],
            results: [
                '• Basic protection for older roofs',
                '• Water repellent technology',
                '• Slows oxidation process',
                '• Eco-friendly bio-oil formula',
                '• Natural finish maintained',
                '• Coverage: 40-60 sq ft/liter',
                '• Adds 3-5 years roof life'
            ],
            notes: "Designed for mature roofs (15+ years old). BioBoost boosts longevity and restores vitality while resisting damage from weather, UV exposure, and wear."
        }
    };
    
    return products[productName] || products['GoNano Shingle Saver'];
}

async function generateProposal(data, aerialImage) {
    const costs = calculateCosts(data);
    
    // Group roofs by product
    const roofsByProduct = {};
    costs.roofs.forEach(roof => {
        const product = roof.gonanoProduct || 'GoNano Shingle Saver';
        if (!roofsByProduct[product]) {
            roofsByProduct[product] = [];
        }
        roofsByProduct[product].push(roof);
    });
    
    const logoPath = path.join(__dirname, 'attached_assets', 'roof-recharge-logo-new_1761941852214.png');
    let logoBuffer;
    try {
        logoBuffer = fs.readFileSync(logoPath);
    } catch (err) {
        console.error('Logo not found:', err);
        logoBuffer = null;
    }
    
    // Load small GoNano logo for footer
    const smallLogoPath = path.join(__dirname, 'attached_assets', '1758641788792_ce68f289307689cd8c46bf9217137ee4_1761945730363.png');
    let smallLogoBuffer;
    try {
        smallLogoBuffer = fs.readFileSync(smallLogoPath);
    } catch (err) {
        console.error('Small logo not found:', err);
        smallLogoBuffer = null;
    }
    
    // Load GoNano logo for cover page
    const gonanoLogoPath = path.join(__dirname, 'attached_assets', 'gonano-logo-dark_1761946062514.png');
    let gonanoLogoBuffer;
    try {
        gonanoLogoBuffer = fs.readFileSync(gonanoLogoPath);
    } catch (err) {
        console.error('GoNano logo not found:', err);
        gonanoLogoBuffer = null;
    }
    
    const children = [];
    
    if (logoBuffer) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 150 },
                children: [
                    new ImageRun({
                        data: logoBuffer,
                        transformation: {
                            width: 400,
                            height: 80
                        }
                    })
                ]
            })
        );
    }
    
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "PROJECT PROPOSAL",
                    size: 36,
                    color: "2E8B57",
                    font: "Montserrat"
                })
            ]
        })
    );
    
    // Add GoNano logo
    if (gonanoLogoBuffer) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                children: [
                    new ImageRun({
                        data: gonanoLogoBuffer,
                        transformation: {
                            width: 300,
                            height: 80
                        }
                    })
                ]
            })
        );
    }
    
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 250 },
            children: [
                new TextRun({
                    text: "Roof Protection System",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        })
    );
    
    children.push(
        new Table({
            width: { size: 80, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER,
            margins: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 100
            },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 100, after: 100 },
                                    children: [
                                        new TextRun({
                                            text: "Prepared For",
                                            bold: true,
                                            size: 20,
                                            font: "Open Sans"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { after: 50 },
                                    children: [
                                        new TextRun({
                                            text: data.customerName || '',
                                            size: 22,
                                            bold: true,
                                            font: "Open Sans"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { after: 50 },
                                    children: [
                                        new TextRun({
                                            text: data.customerAddress || '',
                                            size: 20,
                                            font: "Open Sans"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { after: 100 },
                                    children: [
                                        new TextRun({
                                            text: data.customerCity || '',
                                            size: 20,
                                            font: "Open Sans"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        }),
        
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 300 },
            children: [
                new TextRun({
                    text: `Date: ${formatDate(data.proposalDate)}`,
                    size: 22,
                    font: "Open Sans"
                })
            ]
        })
    );
    
    if (aerialImage && aerialImage.buffer) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [
                    new ImageRun({
                        data: aerialImage.buffer,
                        transformation: {
                            width: 400,
                            height: 300
                        }
                    })
                ]
            })
        );
    }
    
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 150, after: 50 },
            children: [
                new TextRun({
                    text: "Extending Roof Life with Advanced Nanotechnology",
                    size: 20,
                    color: "FFFFFF",
                    italics: true,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "myroofrecharge.com",
                    size: 20,
                    color: "FFFFFF",
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            children: [new PageBreak()]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 300 },
            children: [
                new TextRun({
                    text: "COMPANY PROFILE",
                    bold: true,
                    size: 42,
                    color: "2E8B57",
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "Transforming roof protection with cutting-edge nanotechnology solutions across the Mid-Atlantic United States",
                    italics: true,
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "We believe that every property deserves protection that lasts. Our journey began with a commitment to bringing innovative nanotechnology solutions to property owners who demand excellence and longevity from their roofing investments.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "Our Experience",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Green Energy Construction & Consulting has over 15 years of experience developing and installing thousands of renewable energy projects for home and business owners. It is through this experience we recognized a clear need and our Roof Recharge division was born.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "Why We're Different",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "We recognized that traditional roofing treatments offered short-term protection at best. We partnered with GoNano to deliver cutting-edge nanotechnology solutions that strengthen durability and extend roof lifespan by decades, providing our customers with true long-term value.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "Our Service Area",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Today, we serve property owners throughout the Mid-Atlantic United States, combining our construction expertise with revolutionary GoNano technology to protect investments and reduce maintenance costs for years to come.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "Our Commitment",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "✓ Authorized GoNano Installer - Fully certified and trained in advanced application techniques",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "✓ Proven Track Record - Thousands of successful installations over 15+ years",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "✓ Long-Term Protection - Solutions that extend roof life by decades, not just years",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 300 },
            children: [
                new TextRun({
                    text: "✓ True Value - Cost-effective alternatives to premature roof replacement",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            children: [new PageBreak()]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 300 },
            children: [
                new TextRun({
                    text: "PROJECT DESCRIPTION",
                    bold: true,
                    size: 42,
                    color: "2E8B57",
                    font: "Montserrat"
                })
            ]
        }),
        
        (() => {
            const tableRows = [];
            
            // Property Address row (always first)
            tableRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 35, type: WidthType.PERCENTAGE },
                            shading: { fill: "2E8B57" },
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: "Property Address", 
                                    bold: true,
                                    size: 22,
                                    color: "FFFFFF",
                                    font: "Open Sans"
                                })]
                            })]
                        }),
                        new TableCell({
                            width: { size: 65, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: `${data.customerAddress}, ${data.customerCity}`,
                                    size: 22,
                                    font: "Open Sans"
                                })]
                            })]
                        })
                    ]
                })
            );
            
            // Add rows for each roof
            costs.roofs.forEach(roof => {
                const prefix = roof.label ? `${roof.label} - ` : '';
                
                // Roof Area
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { fill: "2E8B57" },
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `${prefix}Roof Area`, 
                                        bold: true,
                                        size: 22,
                                        color: "FFFFFF",
                                        font: "Open Sans"
                                    })]
                                })]
                            }),
                            new TableCell({
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `${roof.squareFeet} sq ft`,
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                })]
                            })
                        ]
                    })
                );
                
                // Roof Type
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { fill: "2E8B57" },
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `${prefix}Roof Type`, 
                                        bold: true,
                                        size: 22,
                                        color: "FFFFFF",
                                        font: "Open Sans"
                                    })]
                                })]
                            }),
                            new TableCell({
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: roof.roofType || '',
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                })]
                            })
                        ]
                    })
                );
                
                // Roof Age
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { fill: "2E8B57" },
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `${prefix}Roof Age`, 
                                        bold: true,
                                        size: 22,
                                        color: "FFFFFF",
                                        font: "Open Sans"
                                    })]
                                })]
                            }),
                            new TableCell({
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `${roof.roofAge} years`,
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                })]
                            })
                        ]
                    })
                );
            });
            
            return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: tableRows
            });
        })(),
        
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: aerialImage && aerialImage.buffer ? [
                new ImageRun({
                    data: aerialImage.buffer,
                    transformation: {
                        width: 400,
                        height: 267
                    }
                })
            ] : [
                new TextRun({
                    text: "[Aerial image will be inserted here]",
                    italics: true,
                    size: 22,
                    font: "Open Sans"
                })
            ]
        })
    );
    
    // Process Section
    children.push(
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "Our Process",
                    bold: true,
                    size: 32,
                    color: "D4AF37",
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 75 },
            children: [
                new TextRun({
                    text: "Efficient, Simple, Permanent.",
                    bold: true,
                    size: 28,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "Our specialists apply our GoNano treatments in three simple steps:",
                    size: 20,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 33, type: WidthType.PERCENTAGE },
                            margins: {
                                top: 100,
                                bottom: 100,
                                left: 100,
                                right: 100
                            },
                            children: [
                                new Paragraph({
                                    spacing: { after: 100 },
                                    children: [
                                        new TextRun({
                                            text: "Step 1",
                                            bold: true,
                                            size: 26,
                                            color: "D4AF37",
                                            font: "Montserrat"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    spacing: { after: 100 },
                                    children: [
                                        new TextRun({
                                            text: "Inspection",
                                            bold: true,
                                            size: 22,
                                            font: "Montserrat"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Our experts inspect your roof or other surface free of charge to verify its condition will allow us to honor our 10-15 year warranty.",
                                            size: 18,
                                            font: "Open Sans"
                                        })
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            width: { size: 33, type: WidthType.PERCENTAGE },
                            margins: {
                                top: 100,
                                bottom: 100,
                                left: 100,
                                right: 100
                            },
                            children: [
                                new Paragraph({
                                    spacing: { after: 100 },
                                    children: [
                                        new TextRun({
                                            text: "Step 2",
                                            bold: true,
                                            size: 26,
                                            color: "D4AF37",
                                            font: "Montserrat"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    spacing: { after: 100 },
                                    children: [
                                        new TextRun({
                                            text: "Preparation",
                                            bold: true,
                                            size: 22,
                                            font: "Montserrat"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "If your surface qualifies, we prep your surface for application of GoNano. This might require minor repairs or pressure washing.",
                                            size: 18,
                                            font: "Open Sans"
                                        })
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            width: { size: 33, type: WidthType.PERCENTAGE },
                            margins: {
                                top: 100,
                                bottom: 100,
                                left: 100,
                                right: 100
                            },
                            children: [
                                new Paragraph({
                                    spacing: { after: 100 },
                                    children: [
                                        new TextRun({
                                            text: "Step 3",
                                            bold: true,
                                            size: 26,
                                            color: "D4AF37",
                                            font: "Montserrat"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    spacing: { after: 100 },
                                    children: [
                                        new TextRun({
                                            text: "Application",
                                            bold: true,
                                            size: 22,
                                            font: "Montserrat"
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "We apply GoNano to your surface in a single day. Your surface is then protected for up to 15 years.",
                                            size: 18,
                                            font: "Open Sans"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    );
    
    children.push(
        new Paragraph({
            children: [new PageBreak()]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: "Proposed ",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                }),
                new TextRun({
                    text: "GoNano",
                    bold: true,
                    size: 42,
                    color: "2E8B57",
                    font: "Montserrat"
                }),
                new TextRun({
                    text: " Solution",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        })
    );
    
    // Generate sections for each unique product
    Object.keys(roofsByProduct).forEach((productName, index) => {
        const productInfo = getProductInfo(productName);
        const roofsForProduct = roofsByProduct[productName];
        
        // Load product image
        let productImageBuffer = null;
        if (productInfo.imagePath) {
            try {
                productImageBuffer = fs.readFileSync(path.join(__dirname, productInfo.imagePath));
            } catch (err) {
                console.error('Product image not found:', err);
            }
        }
        
        // Intro paragraph with roof list
        const roofLabels = roofsForProduct.map(r => r.label || 'your roof').join(', ');
        const introText = roofsForProduct.length > 1 || roofsForProduct[0].label
            ? `Based on our inspection and analysis, we recommend the following for ${roofLabels}:`
            : "Based on our inspection and analysis of your roof, we recommend:";
        
        if (productImageBuffer) {
            children.push(
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 60, type: WidthType.PERCENTAGE },
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            spacing: { after: 200 },
                                            children: [
                                                new TextRun({
                                                    text: introText,
                                                    size: 22,
                                                    font: "Open Sans"
                                                })
                                            ]
                                        }),
                                        new Paragraph({
                                            spacing: { after: 150 },
                                            children: [
                                                new TextRun({
                                                    text: productName,
                                                    bold: true,
                                                    size: 42,
                                                    color: "2E8B57",
                                                    font: "Montserrat"
                                                })
                                            ]
                                        }),
                                        new Paragraph({
                                            spacing: { after: 200 },
                                            children: [
                                                new TextRun({
                                                    text: productInfo.subtitle,
                                                    italics: true,
                                                    size: 22,
                                                    font: "Open Sans"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new TableCell({
                                    width: { size: 40, type: WidthType.PERCENTAGE },
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new ImageRun({
                                                    data: productImageBuffer,
                                                    transformation: {
                                                        width: 250,
                                                        height: 250
                                                    }
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            );
        } else {
            children.push(
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: introText,
                            size: 22,
                            font: "Open Sans"
                        })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 150 },
                    children: [
                        new TextRun({
                            text: productName,
                            bold: true,
                            size: 42,
                            color: "2E8B57",
                            font: "Montserrat"
                        })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: productInfo.subtitle,
                            italics: true,
                            size: 22,
                            font: "Open Sans"
                        })
                    ]
                })
            );
        }
        
        children.push(
            new Paragraph({
                spacing: { before: 150, after: 200 },
                children: [
                    new TextRun({
                        text: "Product Overview",
                        bold: true,
                        size: 42,
                        font: "Montserrat"
                    })
                ]
            }),
            
            new Paragraph({
                spacing: { after: 150 },
                children: [
                    new TextRun({
                        text: productInfo.overview,
                        size: 22,
                        font: "Open Sans"
                    })
                ]
            }),
            
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 50, type: WidthType.PERCENTAGE },
                                shading: { fill: "E8F5E9" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "KEY FEATURES",
                                                bold: true,
                                                size: 22,
                                                color: "2E8B57",
                                                font: "Open Sans"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                width: { size: 50, type: WidthType.PERCENTAGE },
                                shading: { fill: "E8F5E9" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "PROVEN RESULTS",
                                                bold: true,
                                                size: 22,
                                                color: "2E8B57",
                                                font: "Open Sans"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                children: (() => {
                                    const featureParagraphs = [];
                                    productInfo.features.forEach(feature => {
                                        featureParagraphs.push(
                                            new Paragraph({
                                                spacing: { after: 150 },
                                                children: [
                                                    new TextRun({
                                                        text: feature.icon,
                                                        bold: true,
                                                        color: "2E8B57",
                                                        size: 20,
                                                        font: "Open Sans"
                                                    }),
                                                    new TextRun({
                                                        text: `\n${feature.description}`,
                                                        size: 20,
                                                        font: "Open Sans"
                                                    })
                                                ]
                                            })
                                        );
                                    });
                                    return featureParagraphs;
                                })()
                            }),
                            new TableCell({
                                children: (() => {
                                    const resultParagraphs = [];
                                    productInfo.results.forEach(result => {
                                        resultParagraphs.push(
                                            new Paragraph({
                                                spacing: { after: 100 },
                                                children: [
                                                    new TextRun({
                                                        text: result,
                                                        size: 20,
                                                        font: "Open Sans"
                                                    })
                                                ]
                                            })
                                        );
                                    });
                                    return resultParagraphs;
                                })()
                            })
                        ]
                    })
                ]
            })
        );
        
        children.push(
            new Paragraph({
                spacing: { before: 150, after: 600 },
                children: [
                    new TextRun({
                        text: "Additional Notes: ",
                        bold: true,
                        size: 22,
                        font: "Open Sans"
                    }),
                    new TextRun({
                        text: productInfo.notes,
                        size: 22,
                        font: "Open Sans"
                    })
                ]
            })
        );
        
        // Page break after each product section
        if (index < Object.keys(roofsByProduct).length - 1) {
            children.push(new Paragraph({
                children: [new PageBreak()]
            }));
        }
    });
    
    // Final page break before next section
    children.push(
        new Paragraph({
            children: [new PageBreak()]
        })
    );
    
    // THE GONANO DIFFERENCE PAGE
    children.push(
        new Paragraph({
            spacing: { before: 200, after: 400 },
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: "THE GONANO DIFFERENCE",
                    bold: true,
                    size: 42,
                    color: "2E8B57",
                    font: "Montserrat"
                })
            ]
        })
    );
    
    // Comparison chart image
    const comparisonChartPath = path.join(__dirname, 'attached_assets', 'GoNano VS Competition chart_Square Format copy_1761943938309.png');
    let comparisonChartBuffer;
    try {
        comparisonChartBuffer = fs.readFileSync(comparisonChartPath);
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 150, after: 400 },
                children: [
                    new ImageRun({
                        data: comparisonChartBuffer,
                        transformation: {
                            width: 400,
                            height: 500
                        }
                    })
                ]
            })
        );
    } catch (err) {
        console.error('Comparison chart not found:', err);
    }
    
    // Authorized Reseller Banner
    const resellerBannerPath = path.join(__dirname, 'attached_assets', 'gonano-authorized-reseller-banner_1761943967489.png');
    let resellerBannerBuffer;
    try {
        resellerBannerBuffer = fs.readFileSync(resellerBannerPath);
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 400 },
                children: [
                    new ImageRun({
                        data: resellerBannerBuffer,
                        transformation: {
                            width: 500,
                            height: 150
                        }
                    })
                ]
            })
        );
    } catch (err) {
        console.error('Reseller banner not found:', err);
    }
    
    children.push(
        new Paragraph({
            children: [new PageBreak()]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 300 },
            children: [
                new TextRun({
                    text: "INVESTMENT & SAVINGS ANALYSIS",
                    bold: true,
                    size: 42,
                    color: "2E8B57",
                    font: "Montserrat"
                })
            ]
        }),
        
        (() => {
            const invRows = [];
            
            // Header row
            invRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 70, type: WidthType.PERCENTAGE },
                            shading: { fill: "E8F5E9" },
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: "Description", 
                                    bold: true,
                                    size: 22,
                                    font: "Open Sans"
                                })]
                            })]
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            shading: { fill: "E8F5E9" },
                            children: [new Paragraph({ 
                                alignment: AlignmentType.RIGHT,
                                children: [new TextRun({ 
                                    text: "Amount", 
                                    bold: true,
                                    size: 22,
                                    font: "Open Sans"
                                })]
                            })]
                        })
                    ]
                })
            );
            
            // Per-roof application costs and installation costs
            costs.roofs.forEach(roof => {
                const roofLabel = roof.label ? `${roof.label} ` : '';
                
                // Application cost
                invRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `${roofLabel}GoNano Application (${roof.squareFeet} sq ft)`,
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                })]
                            }),
                            new TableCell({
                                children: [new Paragraph({ 
                                    alignment: AlignmentType.RIGHT,
                                    children: [new TextRun({ 
                                        text: formatCurrency(roof.applicationCost),
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                })]
                            })
                        ]
                    })
                );
                
                // Installation cost
                invRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `${roofLabel}Installation`,
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                })]
                            }),
                            new TableCell({
                                children: [new Paragraph({ 
                                    alignment: AlignmentType.RIGHT,
                                    children: [new TextRun({ 
                                        text: formatCurrency(roof.installationCost),
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                })]
                            })
                        ]
                    })
                );
            });
            
            // Optional services
            if (costs.totals.customServicesTotal > 0) {
                if (data.service1Description && parseFloat(data.service1Price) > 0) {
                    invRows.push(
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ 
                                        children: [new TextRun({ 
                                            text: data.service1Description,
                                            size: 22,
                                            font: "Open Sans"
                                        })]
                                    })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        alignment: AlignmentType.RIGHT,
                                        children: [new TextRun({ 
                                            text: formatCurrency(parseFloat(data.service1Price)),
                                            size: 22,
                                            font: "Open Sans"
                                        })]
                                    })]
                                })
                            ]
                        })
                    );
                }
                
                if (data.service2Description && parseFloat(data.service2Price) > 0) {
                    invRows.push(
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ 
                                        children: [new TextRun({ 
                                            text: data.service2Description,
                                            size: 22,
                                            font: "Open Sans"
                                        })]
                                    })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        alignment: AlignmentType.RIGHT,
                                        children: [new TextRun({ 
                                            text: formatCurrency(parseFloat(data.service2Price)),
                                            size: 22,
                                            font: "Open Sans"
                                        })]
                                    })]
                                })
                            ]
                        })
                    );
                }
                
                if (data.service3Description && parseFloat(data.service3Price) > 0) {
                    invRows.push(
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ 
                                        children: [new TextRun({ 
                                            text: data.service3Description,
                                            size: 22,
                                            font: "Open Sans"
                                        })]
                                    })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        alignment: AlignmentType.RIGHT,
                                        children: [new TextRun({ 
                                            text: formatCurrency(parseFloat(data.service3Price)),
                                            size: 22,
                                            font: "Open Sans"
                                        })]
                                    })]
                                })
                            ]
                        })
                    );
                }
            }
            
            // Total row
            invRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            shading: { fill: "2E8B57" },
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: "Total Investment", 
                                    bold: true,
                                    size: 22,
                                    color: "FFFFFF",
                                    font: "Open Sans"
                                })]
                            })]
                        }),
                        new TableCell({
                            shading: { fill: "2E8B57" },
                            children: [new Paragraph({ 
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.totals.totalCost),
                                        bold: true,
                                        size: 22,
                                        color: "FFFFFF",
                                        font: "Open Sans"
                                    })
                                ]
                            })]
                        })
                    ]
                })
            );
            
            return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: invRows
            });
        })(),
        
        new Paragraph({
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: "Cost Comparison",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 70, type: WidthType.PERCENTAGE },
                            shading: { fill: "FFE0E0" },
                            children: [
                                new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: "Full Roof Replacement", 
                                        bold: true,
                                        size: 22,
                                        font: "Open Sans"
                                    })]
                                }),
                                new Paragraph({ 
                                    children: [new TextRun({ 
                                        text: `(Typical cost: ${formatCurrency(data.replacementCostPerSqFt)}/sq ft)`, 
                                        italics: true,
                                        size: 20,
                                        font: "Open Sans"
                                    })]
                                })
                            ]
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            shading: { fill: "FFE0E0" },
                            children: [new Paragraph({ 
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.totals.replacementCost),
                                        bold: true,
                                        size: 22,
                                        color: "B71C1C",
                                        font: "Open Sans"
                                    })
                                ]
                            })]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            shading: { fill: "E0FFE0" },
                            children: [new Paragraph({ 
                                children: [new TextRun({ 
                                    text: "GoNano Protection", 
                                    bold: true,
                                    size: 22,
                                    font: "Open Sans"
                                })]
                            })]
                        }),
                        new TableCell({
                            shading: { fill: "E0FFE0" },
                            children: [new Paragraph({ 
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.totals.totalCost),
                                        bold: true,
                                        size: 22,
                                        color: "2E8B57",
                                        font: "Open Sans"
                                    })
                                ]
                            })]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            shading: { fill: "4CAF50" },
                            children: [new Paragraph({ 
                                children: [
                                    new TextRun({
                                        text: "Your Savings:",
                                        bold: true,
                                        size: 24,
                                        color: "FFFFFF",
                                        font: "Montserrat"
                                    })
                                ]
                            })]
                        }),
                        new TableCell({
                            shading: { fill: "4CAF50" },
                            children: [new Paragraph({ 
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.totals.savingsAmount),
                                        bold: true,
                                        size: 24,
                                        color: "FFFFFF",
                                        font: "Montserrat"
                                    })
                                ]
                            })]
                        })
                    ]
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 300 },
            children: []
        }),
        
        new Paragraph({
            children: [new PageBreak()]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 300 },
            children: [
                new TextRun({
                    text: "AUTHORIZATION TO PROCEED",
                    bold: true,
                    size: 42,
                    color: "2E8B57",
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "By signing below, you authorize Roof Recharge by Green Energy Construction & Consulting to proceed with the GoNano application as outlined in this proposal.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: "_______________________________",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Customer Signature",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: "_______________________________",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Customer Name (Print)",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: "_______________________________",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "Date",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: "_______________________________",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: data.repName || 'Jennifer Martinez',
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: "_______________________________",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 300 },
            children: [
                new TextRun({
                    text: "Date",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            children: [new PageBreak()]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 300 },
            children: [
                new TextRun({
                    text: "TERMS AND CONDITIONS",
                    bold: true,
                    size: 42,
                    color: "2E8B57",
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "1. SCOPE OF WORK",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Roof Recharge will apply GoNano nanotechnology protection to the specified roof area. This includes roof inspection, cleaning as necessary, and professional application of the GoNano product.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "2. WARRANTY",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "GoNano products are warranted for 10-15 years depending on roof condition. This warranty covers the performance of the GoNano coating and does not void existing shingle manufacturer warranties.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "3. PAYMENT TERMS",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Payment is due upon completion of application. We accept cash, check, and major credit cards.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "4. WEATHER CONDITIONS",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Application requires dry conditions. If weather prevents application, we will reschedule at the earliest convenient time.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "5. LIABILITY",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Roof Recharge and GoNano are not responsible for pre-existing roof conditions or damage. Our inspection will identify any issues that may affect warranty coverage.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "6. ENVIRONMENTAL SAFETY",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "GoNano products are environmentally friendly with no harmful chemicals. The products are safe for vegetation, animals, and humans.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
                new TextRun({
                    text: "7. ADDITIONAL FEES",
                    bold: true,
                    size: 42,
                    font: "Montserrat"
                })
            ]
        }),
        
        new Paragraph({
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Additional fees may apply for structural changes, shingle replacements, or specialized installation equipment such as boom trucks. Any such additional costs will be discussed and approved before work proceeds.",
                    size: 22,
                    font: "Open Sans"
                })
            ]
        })
    );
    
    // Create simple footer with page number centered
    const footerChildren = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 20,
                    font: "Open Sans"
                })
            ]
        })
    ];
    
    const doc = new Document({
        sections: [{
            properties: {
                titlePage: true
            },
            footers: {
                default: new Footer({
                    children: footerChildren
                }),
                first: new Footer({
                    children: []
                })
            },
            children: children
        }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    return buffer;
}

module.exports = { generateProposal };
