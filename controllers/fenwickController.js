const FenwickTree = require('../core/fenwickTree');

const myTree = new FenwickTree(100);

async function updateValue(req, res) {
    const index = Number(req.body.index);
    const value = Number(req.body.value);

    if (!index || !value) {
        return res.status(400).json({ error: "Missing index or value" });
    }
    myTree.update(index, value);

    res.json({ message: "Successfully updated tree!" });
}

async function getPrefixSum(req, res) {
    const index = Number(req.params.index);

    if (!index) {
        return res.status(400).json({ error: "Missing index" });
    }

    const sum = myTree.prefixSum(index);

    res.json({ sum: sum });
}
module.exports = {
    updateValue: updateValue,
    getPrefixSum: getPrefixSum
};
