const FenwickTree = require('../core/fenwickTree');
const Data = require('../models/Data');

const myTree = new FenwickTree(100);

async function updateValue(req, res) {
    const index = Number(req.body.index);
    const value = Number(req.body.value);

    if (!index || value === undefined) {
        return res.status(400).json({ error: "Missing index or value" });
    }
    
    try {
        // 1. Update in-memory Fenwick tree
        myTree.update(index, value);
        
        // 2. Persist to MongoDB
        await Data.create({ index: index, value: value });
        
        res.json({ message: "Successfully updated tree and persisted to DB!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to persist to DB." });
    }
}

async function getPrefixSum(req, res) {
    const index = Number(req.params.index);

    if (!index) {
        return res.status(400).json({ error: "Missing index" });
    }

    const sum = myTree.prefixSum(index);

    res.json({ sum: sum });
}

async function getDbPrefixSum(req, res) {
    try {
        const index = Number(req.params.index);

        if (!index) {
            return res.status(400).json({ error: "Missing index" });
        }

        // 1. Calculate from MongoDB Aggregation
        const pipeline = [
            { $match: { index: { $lte: index } } },
            { $group: { _id: null, totalSum: { $sum: "$value" } } }
        ];
        
        const result = await Data.aggregate(pipeline);
        const dbSum = result.length > 0 ? result[0].totalSum : 0;

        // 2. Calculate from memory (Fenwick Tree)
        const fenwickSum = myTree.prefixSum(index);

        res.json({
            fenwickSum: fenwickSum,
            dbSum: dbSum,
            difference: fenwickSum - dbSum
        });
    } catch (error) {
        res.status(500).json({ error: "Aggregation Failed", details: error.message });
    }
}

async function getAllValues(req, res) {
    res.json({ array: myTree.tree });
}

module.exports = {
    updateValue: updateValue,
    getPrefixSum: getPrefixSum,
    getAllValues: getAllValues,
    getDbPrefixSum: getDbPrefixSum
};
