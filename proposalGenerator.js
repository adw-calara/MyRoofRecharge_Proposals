const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, ImageRun, TabStopType, TabStopPosition } = require('docx');

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
    const sqft = parseFloat(data.squareFeet) || 0;
    const pricePerSqFt = parseFloat(data.pricePerSqFt) || 0;
    const installCost = parseFloat(data.installationCost) || 0;
    const replacementPerSqFt = parseFloat(data.replacementCostPerSqFt) || 0;
    
    const applicationCost = sqft * pricePerSqFt;
    const totalCost = applicationCost + installCost;
    const replacementCost = sqft * replacementPerSqFt;
    const savingsAmount = replacementCost - totalCost;
    
    return {
        applicationCost,
        installationCost: installCost,
        totalCost,
        replacementCost,
        savingsAmount
    };
}

function getProductInfo(productName) {
    const products = {
        'GoNano Shingle Saver': {
            subtitle: 'Perfect for your newer roof (0-7 years old), this advanced nanotechnology formula will protect your investment for decades to come.',
            overview: 'GoNano Shingle Saver is a nanotechnology-driven clear and breathable penetrating sealer for asphalt shingles. Using advanced nano-particles that connect to the aggregate and bitumen, it creates a hydrophobic environment that dramatically extends roof life.',
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
            subtitle: 'Engineered for older roofs (15+ years), combining restoration technology with powerful bio-resistance.',
            overview: 'GoNano BioBoost is a specialized nanotechnology treatment for older asphalt shingles. It combines advanced restoration with superior bio-resistance, revitalizing aged shingles while preventing algae, moss, and biological growth.',
            features: [
                { icon: '✓ REVITALIZE', description: 'Maximum restoration for aged roofs' },
                { icon: '✓ BIO-RESIST', description: 'Powerful algae and moss resistance' },
                { icon: '✓ SEAL', description: 'Waterproofs damaged areas' },
                { icon: '✓ LONGEVITY', description: 'Extends roof life 5-10 years' }
            ],
            results: [
                '• Maximum aging reduction',
                '• Bio-resistance protection',
                '• Seals and waterproofs',
                '• Prevents organic growth',
                '• Natural flat finish',
                '• UL & IBHS tested',
                '• 5-10 year warranty'
            ],
            notes: "Customer's older roof will benefit from GoNano BioBoost's advanced restoration and bio-resistance, sealing damaged areas and preventing further deterioration."
        }
    };
    
    return products[productName] || products['GoNano Shingle Saver'];
}

async function generateProposal(data, aerialImage) {
    const costs = calculateCosts(data);
    const productInfo = getProductInfo(data.gonanoProduct);
    
    const children = [
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: "PROJECT PROPOSAL",
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "PROJECT PROPOSAL",
                    bold: true,
                    size: 32
                })
            ]
        }),
        
        new Paragraph({
            text: "GoNano Roof Protection System",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
                new TextRun({
                    text: "GoNano Roof Protection System",
                    size: 24
                })
            ]
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: "Prepared For",
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "Prepared For",
                    bold: true,
                    size: 22
                })
            ]
        }),
        
        new Paragraph({
            text: data.customerName || '',
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: data.customerName || '',
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: data.customerAddress || '',
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 },
            children: [
                new TextRun({
                    text: data.customerAddress || '',
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: data.customerCity || '',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
                new TextRun({
                    text: data.customerCity || '',
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: `Date: ${formatDate(data.proposalDate)}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
                new TextRun({
                    text: `Date: ${formatDate(data.proposalDate)}`,
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: "Professional GoNano Application",
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "Professional GoNano Application",
                    bold: true,
                    size: 28
                })
            ]
        }),
        
        new Paragraph({
            text: "Extending Roof Life with Advanced Nanotechnology",
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
                new TextRun({
                    text: "Extending Roof Life with Advanced Nanotechnology",
                    italics: true,
                    size: 22
                })
            ]
        }),
        
        new Paragraph({
            text: "COMPANY PROFILE",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
                new TextRun({
                    text: "COMPANY PROFILE",
                    bold: true,
                    size: 28,
                    color: "2E8B57"
                })
            ]
        }),
        
        new Paragraph({
            text: "Transforming roof protection with cutting-edge nanotechnology solutions across the Mid-Atlantic United States",
            spacing: { after: 300 },
            children: [
                new TextRun({
                    text: "Transforming roof protection with cutting-edge nanotechnology solutions across the Mid-Atlantic United States",
                    italics: true,
                    size: 22
                })
            ]
        }),
        
        new Paragraph({
            text: "We believe that every property deserves protection that lasts. Our journey began with a commitment to bringing innovative nanotechnology solutions to property owners who demand excellence and longevity from their roofing investments.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "Our Experience",
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Our Experience",
                    bold: true,
                    size: 24
                })
            ]
        }),
        
        new Paragraph({
            text: "Green Energy Construction & Consulting has over 15 years of experience developing and installing thousands of renewable energy projects for home and business owners. It is through this experience we recognized a clear need and our Roof Recharge division was born.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "Why We're Different",
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Why We're Different",
                    bold: true,
                    size: 24
                })
            ]
        }),
        
        new Paragraph({
            text: "We recognized that traditional roofing treatments offered short-term protection at best. We partnered with GoNano to deliver cutting-edge nanotechnology solutions that strengthen durability and extend roof lifespan by decades, providing our customers with true long-term value.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "Our Service Area",
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Our Service Area",
                    bold: true,
                    size: 24
                })
            ]
        }),
        
        new Paragraph({
            text: "Today, we serve property owners throughout the Mid-Atlantic United States, combining our construction expertise with revolutionary GoNano technology to protect investments and reduce maintenance costs for years to come.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "Our Commitment",
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Our Commitment",
                    bold: true,
                    size: 24
                })
            ]
        }),
        
        new Paragraph({
            text: "✓ Authorized GoNano Installer - Fully certified and trained in advanced application techniques",
            spacing: { after: 100 }
        }),
        
        new Paragraph({
            text: "✓ Proven Track Record - Thousands of successful installations over 15+ years",
            spacing: { after: 100 }
        }),
        
        new Paragraph({
            text: "✓ Long-Term Protection - Solutions that extend roof life by decades, not just years",
            spacing: { after: 100 }
        }),
        
        new Paragraph({
            text: "✓ True Value - Cost-effective alternatives to premature roof replacement",
            spacing: { after: 600 }
        }),
        
        new Paragraph({
            text: "PROJECT DESCRIPTION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
                new TextRun({
                    text: "PROJECT DESCRIPTION",
                    bold: true,
                    size: 28,
                    color: "2E8B57"
                })
            ]
        }),
        
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 35, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ text: "Property Address", bold: true })]
                        }),
                        new TableCell({
                            width: { size: 65, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ text: `${data.customerAddress}, ${data.customerCity}` })]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "Roof Area", bold: true })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: `${data.squareFeet} sq ft` })]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "Roof Type", bold: true })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: data.roofType || '' })]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "Roof Age", bold: true })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: `${data.roofAge} years` })]
                        })
                    ]
                })
            ]
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 300 }
        })
    ];
    
    if (aerialImage && aerialImage.buffer) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                children: [
                    new ImageRun({
                        data: aerialImage.buffer,
                        transformation: {
                            width: 500,
                            height: 350
                        }
                    })
                ]
            })
        );
    } else {
        children.push(
            new Paragraph({
                text: "[Aerial image will be inserted here]",
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                italics: true
            })
        );
    }
    
    children.push(
        new Paragraph({
            text: "Proposed GoNano Solution",
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: "Proposed GoNano Solution",
                    bold: true,
                    size: 24
                })
            ]
        }),
        
        new Paragraph({
            text: "Based on our inspection and analysis of your roof, we recommend:",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: data.gonanoProduct || '',
            spacing: { after: 150 },
            children: [
                new TextRun({
                    text: data.gonanoProduct || '',
                    bold: true,
                    size: 26,
                    color: "2E8B57"
                })
            ]
        }),
        
        new Paragraph({
            text: productInfo.subtitle,
            spacing: { after: 400 },
            italics: true
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: "Product Overview",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: "Product Overview",
                    bold: true,
                    size: 24
                })
            ]
        }),
        
        new Paragraph({
            text: productInfo.overview,
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "KEY FEATURES",
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "KEY FEATURES",
                    bold: true,
                    size: 22,
                    color: "2E8B57"
                })
            ]
        })
    );
    
    productInfo.features.forEach(feature => {
        children.push(
            new Paragraph({
                text: "",
                spacing: { after: 100 },
                children: [
                    new TextRun({
                        text: feature.icon,
                        bold: true,
                        color: "2E8B57"
                    }),
                    new TextRun({
                        text: `\n${feature.description}`,
                    })
                ]
            })
        );
    });
    
    children.push(
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: "PROVEN RESULTS",
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "PROVEN RESULTS",
                    bold: true,
                    size: 22,
                    color: "2E8B57"
                })
            ]
        })
    );
    
    productInfo.results.forEach(result => {
        children.push(
            new Paragraph({
                text: result,
                spacing: { after: 100 }
            })
        );
    });
    
    children.push(
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: `Additional Notes: ${productInfo.notes}`,
            spacing: { after: 600 },
            children: [
                new TextRun({
                    text: "Additional Notes: ",
                    bold: true
                }),
                new TextRun({
                    text: productInfo.notes
                })
            ]
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: "INVESTMENT & SAVINGS ANALYSIS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
                new TextRun({
                    text: "INVESTMENT & SAVINGS ANALYSIS",
                    bold: true,
                    size: 28,
                    color: "2E8B57"
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
                            children: [new Paragraph({ text: "Description", bold: true })],
                            shading: { fill: "E8F5E9" }
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ text: "Amount", bold: true, alignment: AlignmentType.RIGHT })],
                            shading: { fill: "E8F5E9" }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: `GoNano Saver Application (${data.squareFeet} sq ft)` })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: formatCurrency(costs.applicationCost), alignment: AlignmentType.RIGHT })]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "Professional Installation" })]
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: formatCurrency(costs.installationCost), alignment: AlignmentType.RIGHT })]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "Total Investment", bold: true })],
                            shading: { fill: "2E8B57" }
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                text: formatCurrency(costs.totalCost), 
                                bold: true,
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.totalCost),
                                        bold: true,
                                        color: "FFFFFF"
                                    })
                                ]
                            })],
                            shading: { fill: "2E8B57" }
                        })
                    ]
                })
            ]
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 400 }
        }),
        
        new Paragraph({
            text: "Cost Comparison",
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: "Cost Comparison",
                    bold: true,
                    size: 22
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
                            children: [
                                new Paragraph({ text: "Full Roof Replacement", bold: true }),
                                new Paragraph({ text: `(Typical cost: ${formatCurrency(data.replacementCostPerSqFt)}/sq ft)`, italics: true })
                            ],
                            shading: { fill: "FFE0E0" }
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ 
                                text: formatCurrency(costs.replacementCost), 
                                bold: true,
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.replacementCost),
                                        bold: true,
                                        color: "B71C1C"
                                    })
                                ]
                            })],
                            shading: { fill: "FFE0E0" }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "GoNano Protection", bold: true })],
                            shading: { fill: "E0FFE0" }
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                text: formatCurrency(costs.totalCost), 
                                bold: true,
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.totalCost),
                                        bold: true,
                                        color: "2E8B57"
                                    })
                                ]
                            })],
                            shading: { fill: "E0FFE0" }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ 
                                text: "Your Savings:",
                                bold: true,
                                children: [
                                    new TextRun({
                                        text: "Your Savings:",
                                        bold: true,
                                        size: 26,
                                        color: "FFFFFF"
                                    })
                                ]
                            })],
                            shading: { fill: "4CAF50" }
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formatCurrency(costs.savingsAmount),
                                        bold: true,
                                        size: 26,
                                        color: "FFFFFF"
                                    })
                                ]
                            })],
                            shading: { fill: "4CAF50" }
                        })
                    ]
                })
            ]
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 600 }
        }),
        
        new Paragraph({
            text: "AUTHORIZATION TO PROCEED",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
                new TextRun({
                    text: "AUTHORIZATION TO PROCEED",
                    bold: true,
                    size: 28,
                    color: "2E8B57"
                })
            ]
        }),
        
        new Paragraph({
            text: "By signing below, you authorize Roof Recharge by Green Energy Construction & Consulting to proceed with the GoNano application as outlined in this proposal.",
            spacing: { after: 400 }
        }),
        
        new Paragraph({
            text: "_______________________________",
            spacing: { after: 50 }
        }),
        
        new Paragraph({
            text: "Customer Signature",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "_______________________________",
            spacing: { after: 50 }
        }),
        
        new Paragraph({
            text: "Customer Name (Print)",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "_______________________________",
            spacing: { after: 50 }
        }),
        
        new Paragraph({
            text: "Date",
            spacing: { after: 400 }
        }),
        
        new Paragraph({
            text: "_______________________________",
            spacing: { after: 50 }
        }),
        
        new Paragraph({
            text: data.repName || 'Jennifer Martinez',
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "_______________________________",
            spacing: { after: 50 }
        }),
        
        new Paragraph({
            text: "Date",
            spacing: { after: 600 }
        }),
        
        new Paragraph({
            text: "",
            spacing: { after: 200 }
        }),
        
        new Paragraph({
            text: "TERMS AND CONDITIONS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
                new TextRun({
                    text: "TERMS AND CONDITIONS",
                    bold: true,
                    size: 28,
                    color: "2E8B57"
                })
            ]
        }),
        
        new Paragraph({
            text: "1. SCOPE OF WORK",
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "1. SCOPE OF WORK",
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "Roof Recharge will apply GoNano nanotechnology protection to the specified roof area. This includes roof inspection, cleaning as necessary, and professional application of the GoNano product.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "2. WARRANTY",
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "2. WARRANTY",
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "GoNano products are warranted for 10-15 years depending on roof condition. This warranty covers the performance of the GoNano coating and does not void existing shingle manufacturer warranties.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "3. PAYMENT TERMS",
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "3. PAYMENT TERMS",
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "Payment is due upon completion of application. We accept cash, check, and major credit cards.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "4. WEATHER CONDITIONS",
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "4. WEATHER CONDITIONS",
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "Application requires dry conditions. If weather prevents application, we will reschedule at the earliest convenient time.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "5. LIABILITY",
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "5. LIABILITY",
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "Roof Recharge and GoNano are not responsible for pre-existing roof conditions or damage. Our inspection will identify any issues that may affect warranty coverage.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "6. ENVIRONMENTAL SAFETY",
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "6. ENVIRONMENTAL SAFETY",
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "GoNano products are environmentally friendly with no harmful chemicals. The products are safe for vegetation, animals, and humans.",
            spacing: { after: 300 }
        }),
        
        new Paragraph({
            text: "7. ADDITIONAL FEES",
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: "7. ADDITIONAL FEES",
                    bold: true,
                    size: 20
                })
            ]
        }),
        
        new Paragraph({
            text: "Additional fees may apply for structural changes, shingle replacements, or specialized installation equipment such as boom trucks. Any such additional costs will be discussed and approved before work proceeds.",
            spacing: { after: 300 }
        })
    );
    
    const doc = new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    return buffer;
}

module.exports = { generateProposal };
