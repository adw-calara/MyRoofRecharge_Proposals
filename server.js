const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { generateProposal } = require('./proposalGenerator');

const app = express();
const PORT = 5000;

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/generate-proposal', upload.single('aerialImage'), async (req, res) => {
    try {
        const proposalData = req.body;
        const aerialImage = req.file;
        
        console.log('Generating proposal for:', proposalData.customerName);
        if (aerialImage) {
            console.log('Aerial image uploaded:', aerialImage.originalname);
        }
        
        const buffer = await generateProposal(proposalData, aerialImage);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="GoNano_Proposal_${proposalData.customerName.replace(/\s+/g, '_')}.docx"`);
        
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
