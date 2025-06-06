// Compact serialization/deserialization for array of integers 1..300
// Only ASCII output, order not important

// Serialize: array of numbers -> string
function serialize(nums) {
    // Use a 300-bit bitset (38 bytes)
    const bits = new Uint8Array(38); // 38*8=304 bits
    for (const n of nums) {
        if (n < 1 || n > 300) throw new Error('Out of range: ' + n);
        const idx = n - 1;
        bits[idx >> 3] |= 1 << (idx & 7);
    }
    // Convert to base64 for ASCII compactness
    let bin = '';
    for (let i = 0; i < bits.length; ++i) bin += String.fromCharCode(bits[i]);
    return btoa(bin); // base64
}

// Deserialize: string -> array of numbers
function deserialize(str) {
    const bin = atob(str);
    if (bin.length !== 38) throw new Error('Invalid input length');
    const bits = new Uint8Array(38);
    for (let i = 0; i < 38; ++i) bits[i] = bin.charCodeAt(i);
    const res = [];
    for (let i = 0; i < 300; ++i) {
        if (bits[i >> 3] & (1 << (i & 7))) res.push(i + 1);
    }
    return res;
}

// --- TESTS ---
function testCompression(nums, label) {
    const orig = JSON.stringify(nums);
    const ser = serialize(nums);
    const deser = deserialize(ser);
    const ratio = (ser.length / orig.length).toFixed(2);
    const ok = JSON.stringify(deser.sort((a,b)=>a-b)) === JSON.stringify(nums.slice().sort((a,b)=>a-b));
    console.log(label + ':');
    console.log('  Original:', orig.length, 'chars');
    console.log('  Compressed:', ser.length, 'chars');
    console.log('  Ratio:', ratio);
    console.log('  Correct:', ok);
    console.log('  Compressed string:', ser);
    console.log('  ---');
}

// Simple short
// 1. Empty
// 2. One number
// 3. Two numbers
// 4. All numbers 1..9
// 5. All numbers 10..99
// 6. All numbers 100..300
// 7. All numbers 1..300
// 8. Each number 1..300 three times (should deduplicate)
// 9. 50 random
// 10. 100 random
// 11. 500 random
// 12. 1000 random

function uniqueRandomArray(size, min, max) {
    const set = new Set();
    while (set.size < size) set.add(Math.floor(Math.random() * (max - min + 1)) + min);
    return Array.from(set);
}

testCompression([], 'Empty');
testCompression([42], 'One number');
testCompression([1,2], 'Two numbers');
testCompression([1,2,3,4,5,6,7,8,9], 'All 1..9');
testCompression(Array.from({length:90}, (_,i)=>i+10), 'All 10..99');
testCompression(Array.from({length:201}, (_,i)=>i+100), 'All 100..300');
testCompression(Array.from({length:300}, (_,i)=>i+1), 'All 1..300');
testCompression(Array.from({length:300}, (_,i)=>((i%300)+1)).concat(Array.from({length:300},(_,i)=>((i%300)+1))).concat(Array.from({length:300},(_,i)=>((i%300)+1))), 'Each 1..300 three times');
testCompression(uniqueRandomArray(50,1,300), '50 random');
testCompression(uniqueRandomArray(100,1,300), '100 random');
testCompression(uniqueRandomArray(300,1,300), '300 random');
// For 500 and 1000, allow duplicates
function randomArray(size, min, max) {
    const arr = [];
    for (let i = 0; i < size; ++i) arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    return arr;
}
testCompression(randomArray(500,1,300), '500 random (with dups)');
testCompression(randomArray(1000,1,300), '1000 random (with dups)');
