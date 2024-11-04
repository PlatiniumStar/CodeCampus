const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 46000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const filePath = path.join(__dirname, 'devoirs.json');

function loadDevoirs() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        if (data.trim().length === 0) {
            return [];
        }
        return JSON.parse(data);
    }
    return [];
}

function saveDevoirs(devoirs) {
    fs.writeFileSync(filePath, JSON.stringify(devoirs, null, 2));
}

app.get('/devoirs', (req, res) => {
    const devoirs = loadDevoirs();
    res.json(devoirs);
});

app.post('/devoirs', (req, res) => {
    const devoirs = loadDevoirs();
    const newDevoir = req.body;
    newDevoir.dateAjout = new Date().toISOString();
    devoirs.push(newDevoir);
    saveDevoirs(devoirs);
    res.status(201).json(newDevoir);
});

app.put('/devoirs', (req, res) => {
    const devoirs = loadDevoirs();
    const updatedDevoir = req.body;
    const index = devoirs.findIndex(devoir => devoir.dateAjout === updatedDevoir.dateAjout);
    if (index !== -1) {
        devoirs[index] = updatedDevoir;
        saveDevoirs(devoirs);
        res.status(200).json(updatedDevoir);
    } else {
        res.status(404).json({message: 'Devoir not found'});
    }
});

app.delete('/devoirs/:index', (req, res) => {
    const devoirs = loadDevoirs();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < devoirs.length) {
        devoirs.splice(index, 1);
        saveDevoirs(devoirs);
        res.status(204).end();
    } else {
        res.status(404).json({message: 'Devoir not found'});
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});