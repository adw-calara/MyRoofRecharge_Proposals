const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateProposal } = require('./proposalGenerator');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/generate-proposal', async (req, res) => {
    try {
        const proposalData = req.body;
        
        console.log('Generating proposal for:', proposalData.customerName);
        
        const buffer = await generateProposal(proposalData);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="Roof_Recharge_Proposal_${proposalData.customerName.replace(/\s+/g, '_')}.docx"`);
        
        res.send(buffer);
        
    } catch (error) {
        console.error('Error generating proposal:', error);
        res.status(500).json({ error: 'Failed to generate proposal', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Roof Recharge Proposal Generator running on http://0.0.0.0:${PORT}`);
    console.log(`📄 Visit the app to create professional Word proposals`);
});
