const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign } = require('docx');

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
    
    const service1Price = parseFloat(data.service1Price) || 0;
    const service2Price = parseFloat(data.service2Price) || 0;
    const service3Price = parseFloat(data.service3Price) || 0;
    
    const applicationCost = sqft * pricePerSqFt;
    const customServicesTotal = service1Price + service2Price + service3Price;
    const totalCost = applicationCost + installCost + customServicesTotal;
    const replacementCost = sqft * replacementPerSqFt;
    const savingsAmount = replacementCost - totalCost;
    
    return {
        applicationCost,
        installationCost: installCost,
        service1Price,
        service2Price,
        service3Price,
        customServicesTotal,
        totalCost,
        replacementCost,
        savingsAmount
    };
}

function getProductDescription(productName) {
    const descriptions = {
        'GoNano Shingle Saver': {
            description: 'Designed for newer roofs (0-7 years), GoNano Shingle Saver provides advanced protection to preserve your roof\'s integrity and extend its lifespan. This premium coating creates a protective barrier against UV damage, moisture, and environmental wear.',
            benefits: [
                'UV protection and heat reflection',
                'Prevents granule loss',
                'Enhances shingle adhesion',
                'Extends roof life by 10-15 years',
                'Eco-friendly formula'
            ]
        },
        'GoNano Revive': {
            description: 'Perfect for mid-life roofs (8-15 years), GoNano Revive rejuvenates aging shingles and restores their protective properties. This advanced formula penetrates deep into the shingle material to restore flexibility and prevent further deterioration.',
            benefits: [
                'Restores shingle flexibility',
                'Fills micro-cracks and gaps',
                'Improves water resistance',
                'Prevents further aging',
                'Extends roof life by 8-12 years'
            ]
        },
        'GoNano BioBoost': {
            description: 'Engineered for older roofs (15+ years), GoNano BioBoost combines advanced restoration technology with powerful bio-resistance. This specialized treatment revitalizes aged shingles while providing superior protection against algae, moss, and biological growth.',
            benefits: [
                'Maximum restoration for aged roofs',
                'Powerful algae and moss resistance',
                'Seals and waterproofs damaged areas',
                'Prevents biological growth',
                'Extends roof life by 5-10 years'
            ]
        }
    };
    
    return descriptions[productName] || descriptions['GoNano Shingle Saver'];
}

async function generateProposal(data) {
    const costs = calculateCosts(data);
    const productInfo = getProductDescription(data.gonanoProduct);
    
    const borderStyle = {
        style: BorderStyle.SINGLE,
        size: 1,
        color: "2E8B57"
    };
    
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "ROOF RECHARGE",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "ROOF RECHARGE",
                            bold: true,
                            size: 48,
                            color: "2E8B57"
                        })
                    ]
                }),
                
                new Paragraph({
                    text: "Professional Roof Treatment Proposal",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [
                        new TextRun({
                            text: "Professional Roof Treatment Proposal",
                            size: 24,
                            color: "666666"
                        })
                    ]
                }),
                
                new Paragraph({
                    text: "",
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    text: "CUSTOMER INFORMATION",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                    children: [
                        new TextRun({
                            text: "CUSTOMER INFORMATION",
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
                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({ text: "Customer Name:", bold: true })],
                                    verticalAlign: VerticalAlign.CENTER
                                }),
                                new TableCell({
                                    width: { size: 70, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({ text: data.customerName || '' })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Address:", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: data.customerAddress || '' })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "City, State ZIP:", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: data.customerCity || '' })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Proposal Date:", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: formatDate(data.proposalDate) })]
                                })
                            ]
                        })
                    ]
                }),
                
                new Paragraph({
                    text: "",
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    text: "ROOF DETAILS",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                    children: [
                        new TextRun({
                            text: "ROOF DETAILS",
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
                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({ text: "Roof Type:", bold: true })]
                                }),
                                new TableCell({
                                    width: { size: 70, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({ text: data.roofType || '' })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Roof Age:", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${data.roofAge || ''} years` })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Square Footage:", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${data.squareFeet || ''} sq ft` })]
                                })
                            ]
                        })
                    ]
                }),
                
                new Paragraph({
                    text: "",
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    text: "RECOMMENDED SOLUTION",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                    children: [
                        new TextRun({
                            text: "RECOMMENDED SOLUTION",
                            bold: true,
                            size: 28,
                            color: "2E8B57"
                        })
                    ]
                }),
                
                new Paragraph({
                    text: data.gonanoProduct || '',
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: data.gonanoProduct || '',
                            bold: true,
                            size: 24,
                            color: "2E8B57"
                        })
                    ]
                }),
                
                new Paragraph({
                    text: productInfo.description,
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    text: "Key Benefits:",
                    spacing: { after: 100 },
                    bold: true
                }),
                
                ...productInfo.benefits.map(benefit => 
                    new Paragraph({
                        text: `• ${benefit}`,
                        spacing: { after: 100 },
                        indent: { left: 360 }
                    })
                ),
                
                new Paragraph({
                    text: "",
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    text: "INVESTMENT BREAKDOWN",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                    children: [
                        new TextRun({
                            text: "INVESTMENT BREAKDOWN",
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
                                    children: [new Paragraph({ 
                                        text: `GoNano Application (${data.squareFeet} sq ft × ${formatCurrency(data.pricePerSqFt)})`,
                                        bold: true 
                                    })],
                                    shading: { fill: "E8F5E9" }
                                }),
                                new TableCell({
                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({ 
                                        text: formatCurrency(costs.applicationCost),
                                        alignment: AlignmentType.RIGHT,
                                        bold: true
                                    })],
                                    shading: { fill: "E8F5E9" }
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Professional Installation" })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        text: formatCurrency(costs.installationCost),
                                        alignment: AlignmentType.RIGHT
                                    })]
                                })
                            ]
                        }),
                        ...(data.service1Description && costs.service1Price > 0 ? [new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: data.service1Description })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        text: formatCurrency(costs.service1Price),
                                        alignment: AlignmentType.RIGHT
                                    })]
                                })
                            ]
                        })] : []),
                        ...(data.service2Description && costs.service2Price > 0 ? [new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: data.service2Description })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        text: formatCurrency(costs.service2Price),
                                        alignment: AlignmentType.RIGHT
                                    })]
                                })
                            ]
                        })] : []),
                        ...(data.service3Description && costs.service3Price > 0 ? [new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: data.service3Description })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        text: formatCurrency(costs.service3Price),
                                        alignment: AlignmentType.RIGHT
                                    })]
                                })
                            ]
                        })] : []),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ 
                                        text: "TOTAL INVESTMENT",
                                        bold: true,
                                        children: [
                                            new TextRun({
                                                text: "TOTAL INVESTMENT",
                                                bold: true,
                                                size: 24,
                                                color: "2E8B57"
                                            })
                                        ]
                                    })],
                                    shading: { fill: "2E8B57" }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        alignment: AlignmentType.RIGHT,
                                        children: [
                                            new TextRun({
                                                text: formatCurrency(costs.totalCost),
                                                bold: true,
                                                size: 24,
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
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    text: "YOUR SAVINGS COMPARISON",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                    children: [
                        new TextRun({
                            text: "YOUR SAVINGS COMPARISON",
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
                                    children: [new Paragraph({ 
                                        text: "Estimated Full Roof Replacement Cost",
                                        bold: true
                                    })],
                                    shading: { fill: "FFE0E0" }
                                }),
                                new TableCell({
                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                    children: [new Paragraph({ 
                                        text: formatCurrency(costs.replacementCost),
                                        alignment: AlignmentType.RIGHT,
                                        bold: true,
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
                                    children: [new Paragraph({ 
                                        text: "GoNano Treatment Investment",
                                        bold: true
                                    })],
                                    shading: { fill: "E0FFE0" }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ 
                                        text: formatCurrency(costs.totalCost),
                                        alignment: AlignmentType.RIGHT,
                                        bold: true,
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
                                        children: [
                                            new TextRun({
                                                text: "YOUR TOTAL SAVINGS",
                                                bold: true,
                                                size: 28,
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
                                                size: 28,
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
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    text: "By choosing Roof Recharge GoNano treatment over replacement, you save significant costs while extending your roof's life by years!",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    italics: true
                }),
                
                ...(data.notes ? [
                    new Paragraph({
                        text: "ADDITIONAL NOTES",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({
                                text: "ADDITIONAL NOTES",
                                bold: true,
                                size: 28,
                                color: "2E8B57"
                            })
                        ]
                    }),
                    new Paragraph({
                        text: data.notes,
                        spacing: { after: 400 }
                    })
                ] : []),
                
                new Paragraph({
                    text: "",
                    spacing: { after: 200 }
                }),
                
                new Paragraph({
                    text: "NEXT STEPS",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                    children: [
                        new TextRun({
                            text: "NEXT STEPS",
                            bold: true,
                            size: 28,
                            color: "2E8B57"
                        })
                    ]
                }),
                
                new Paragraph({
                    text: "1. Review this proposal and contact us with any questions",
                    spacing: { after: 100 },
                    indent: { left: 360 }
                }),
                new Paragraph({
                    text: "2. Schedule your roof treatment at your convenience",
                    spacing: { after: 100 },
                    indent: { left: 360 }
                }),
                new Paragraph({
                    text: "3. Our professional team will complete the application",
                    spacing: { after: 100 },
                    indent: { left: 360 }
                }),
                new Paragraph({
                    text: "4. Enjoy years of extended roof life and peace of mind!",
                    spacing: { after: 400 },
                    indent: { left: 360 }
                }),
                
                new Paragraph({
                    text: "",
                    spacing: { after: 200 }
                }),
                
                ...(data.repName ? [
                    new Paragraph({
                        text: "Prepared by:",
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: data.repName,
                        bold: true,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({
                                text: data.repName,
                                bold: true,
                                size: 24,
                                color: "2E8B57"
                            })
                        ]
                    }),
                    new Paragraph({
                        text: "Roof Recharge Specialist",
                        italics: true,
                        spacing: { after: 400 }
                    })
                ] : []),
                
                new Paragraph({
                    text: "",
                    spacing: { after: 400 }
                }),
                
                new Paragraph({
                    text: "Thank you for considering Roof Recharge for your roof treatment needs!",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "Thank you for considering Roof Recharge for your roof treatment needs!",
                            bold: true,
                            size: 24,
                            color: "2E8B57"
                        })
                    ]
                })
            ]
        }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    return buffer;
}

module.exports = { generateProposal };
