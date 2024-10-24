const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');

async function saveToCSV(data, filePath) {
    let existingData = [];

    if (fs.existsSync(filePath)) {
        existingData = await readCSV(filePath);
    }

    const dataMap = new Map(existingData.map(item => [`${item.platform}-${item.username}`, item]));
    data.forEach(item => dataMap.set(`${item.platform}-${item.username}`, item));

    const uniqueData = Array.from(dataMap.values());

    const csvWriter = createCsvWriter({
        path: filePath,
        header: [
            { id: 'platform', title: 'Platform' },
            { id: 'username', title: 'Username' },
            { id: 'full_name', title: 'Full Name' }
        ]
    });

    try {
        await csvWriter.writeRecords(uniqueData);
    } catch (error) {
        throw new Error('Error writing to CSV');
    }
}

function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

module.exports = { saveToCSV };
