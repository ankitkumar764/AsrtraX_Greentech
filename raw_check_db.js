const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const checkRawDB = async () => {
    const url = process.env.MONGODB_URI;
    console.log(`Connecting to: ${url}`);
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected!');
        const db = client.db();
        
        const historyCols = await db.collection('histories').find({}).sort({timestamp: -1}).limit(5).toArray();
        const reportCols = await db.collection('soilreports').find({}).sort({timestamp: -1}).limit(5).toArray();

        console.log(`\nHistories count: ${await db.collection('histories').countDocuments()}`);
        console.log(JSON.stringify(historyCols, null, 2));

        console.log(`\nSoilReports count: ${await db.collection('soilreports').countDocuments()}`);
        console.log(JSON.stringify(reportCols, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
};

checkRawDB();
