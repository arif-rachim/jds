const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'jds';

// insert to collection


class Database {
    constructor() {
        const client = new MongoClient(url);
        this.client = client;
        this.clientConnected = false;
    }



    async collection(collection) {
        if(!this.clientConnected){
            await this.client.connect();
            const db = this.client.db(dbName);
            this.db = db;
            this.clientConnected = true;
        }
        return this.db.collection(collection);
    }

    async create(collection, item) {
        let col = await this.collection(collection);
        let r = await col.insertOne(item);
        return r;

    }

    async read(collection, filter) {
        let col = await this.collection(collection);
        let result = col.find(filter).toArray();
        return result;
    }

    async update(collection, item) {
        const itemId = {_id: item._id};
        const itemUpdate = {...item};
        delete itemUpdate._id;
        let col = await this.collection(collection);
        let r = await col.updateOne(itemId, {$set: itemUpdate});
        return r;
    }

    async delete(collection, item) {
        // Remove a single document
        let col = await this.collection(collection);
        const r = await col.deleteOne(item);
        return r;
    }

    close() {
        this.client.close();
    }
}

const db = new Database();

module.exports = async (req, res) => {
    // /api/database?c=Category&a=create
    const {c, a} = req.query;
    switch (a) {
        case 'create' : {
            let result = await db.create(c, req.body);
            res.send(JSON.stringify(result));
            break;
        }

        case 'read' : {
            let result = await db.read(c, req.body);
            res.send(JSON.stringify(result));
            break;
        }

        case 'update' : {
            let result = await db.update(c, req.body);
            res.send(JSON.stringify(result));
            break;
        }

        case 'delete' : {
            let result = await db.delete(c, req.body);
            res.send(JSON.stringify(result));
            break;
        }
        default : {
            res.send(JSON.stringify({error:'Unable to process the request'}));
        }

    }

};