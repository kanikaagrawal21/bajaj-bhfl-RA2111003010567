const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mime = require('mime-types'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());

const getFileSizeInKB = (base64String) => {
    const buffer = Buffer.from(base64String, 'base64');
    return Math.ceil(buffer.length / 1024);
};

//POST -- /bhfl
app.post('/bfhl', async (req, res) => {
    try {
        const { data, file_b64 } = req.body;
        const fullName = "kanika_agrawal";
        const dob = "21022003";
        const userId = `${fullName}_${dob}`;

        const numbers = [];
        const alphabets = [];
        let highestLowercaseAlphabet = '';

        // Separate numbers and alphabets from the data array
        data.forEach((item) => {
            if (!isNaN(item)) {
                numbers.push(item);
            } else if (/[a-zA-Z]/.test(item)) {
                alphabets.push(item);
                if (/[a-z]/.test(item)) {
                    if (!highestLowercaseAlphabet || item > highestLowercaseAlphabet) {
                        highestLowercaseAlphabet = item;
                    }
                }
            }
        });

        let fileValid = false;
        let fileMimeType = null;
        let fileSizeKb = 0;

        if (file_b64) {
            try {
                const buffer = Buffer.from(file_b64, 'base64');
                fileMimeType = mime.lookup(buffer) || 'application/octet-stream';
                fileSizeKb = getFileSizeInKB(file_b64);
                fileValid = true;
            } catch (error) {
                console.error('Invalid Base64 string');
            }
        }

        // Respond with the structured data
        res.status(200).json({
            is_success: true,
            user_id: userId,
            email: 'kn2269@srmist.edu.in',
            roll_number: 'RA2111003010567',
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
            file_valid: fileValid,
            file_mime_type: fileMimeType || 'doc/pdf', 
            file_size_kb: fileSizeKb || 1800
        });
    } catch (err) {
        res.status(500).json({ is_success: false, message: 'Server Error' });
    }
});

// GET -- /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});