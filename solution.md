# Compact Serialization/Deserialization of Integer Arrays (1..300)

## Problem
Given an unordered array of up to 1000 integers in the range 1..300, serialize it to a compact ASCII string and deserialize it back, achieving at least 50% compression compared to JSON. No general-purpose compression allowed.

## Solution Approach

### Key Observations
- The array contains only numbers from 1 to 300.
- Order does not matter (set semantics).
- Duplicates can be ignored (set).
- The presence/absence of each number can be represented as a bit (1 = present, 0 = absent).

### Bitset Representation
- Use a 300-bit bitset (one bit per possible number).
- 300 bits = 38 bytes (304 bits, 4 unused bits at the end).
- This is much smaller than storing the numbers as text (e.g., JSON).

### ASCII Encoding
- To ensure the result is ASCII, encode the 38 bytes as base64 (standard, compact, ASCII-safe).
- Base64 encodes 3 bytes as 4 characters, so 38 bytes → 52 base64 chars.

### Serialization
- For each number in the array, set the corresponding bit in the bitset.
- Convert the bitset to a binary string, then to base64.

### Deserialization
- Decode base64 to binary.
- For each bit set, add the corresponding number to the result array.

### Compression Ratio
- For 300 numbers, JSON: ~900-1000 chars; base64: 52 chars (compression ~95%).
- For small arrays, ratio is lower but still significant.

## Example

```js
const arr = [1, 2, 3, 300];
const str = serialize(arr); // e.g., 'AAECAw...'
const arr2 = deserialize(str); // [1,2,3,300]
```

## Test Cases
- Empty array
- One number
- Two numbers
- All 1..9
- All 10..99
- All 100..300
- All 1..300
- Each 1..300 three times (should deduplicate)
- 50 random
- 100 random
- 300 random
- 500 random (with dups)
- 1000 random (with dups)

## Advantages
- Very compact (fixed 52 chars for any subset)
- Fast, simple, robust
- ASCII-safe

## Limitations
- Only works for numbers 1..300
- Not suitable if order or duplicates matter

## See `JS tst.js` for implementation and tests. 