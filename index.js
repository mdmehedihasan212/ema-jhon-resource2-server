const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpzhx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emaJhon').collection('product');

        // GET
        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (size || page) {
                products = await cursor.skip(page * size).limit(size).toArray();

            } else {
                products = await cursor.toArray();
            }
            res.send(products);
        })

        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        })

        // POST by keys
        app.post('/productByKey', async (req, res) => {
            const key = req.body;
            const id = key.map(id => ObjectId(id));
            const query = { _id: { $in: id } }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Ema john Shopping Browser!')
})

app.listen(port, () => {
    console.log('Ema john Shopping Server Is Running', port);
})