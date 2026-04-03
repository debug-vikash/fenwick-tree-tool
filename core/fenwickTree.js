class FenwickTree {
    constructor(size) {
        this.tree = [];
        this.size = size;

        for (let i = 0; i <= size; i++) {
            this.tree.push(0);
        }
    }

    update(index, value) {
        while (index <= this.size) {
            this.tree[index] = this.tree[index] + value;
            
            index = index + (index & -index);
        }
    }

    prefixSum(index) {
        let sum = 0;
        
        while (index > 0) {
            sum = sum + this.tree[index];
            
            index = index - (index & -index);
        }
        
        return sum;
    }
}

module.exports = FenwickTree;
