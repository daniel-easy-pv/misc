export function argmin(arr, func) {
    if (arr.length === 0) {
        throw new Error('Array must not be empty')
    }
    let minIndex = 0
    let minValue = func(arr[0])
  
    for (let i = 1; i < arr.length; i++) {
        const currentValue = func(arr[i])
        if (currentValue < minValue) {
            minValue = currentValue
            minIndex = i
        }
    }
    return minIndex
}

/**
 * Given an array and a value `val`, return the smallest element in the array
 * which is bigger than `val`. If no such element exists, return `val`.
 * 
 * @param {number[]} arr - The input array.
 * @param {number} val - The value to compare.
 * @returns {number} - The next biggest element.
 */
export function nextBiggest(arr, val) {
    let next = null
    for (const element of arr) {
        if (element > val && (next === null || element < next)) {
            next = element
        }
    }
    return next !== null ? next : val
}

/**
 * Given an array and a value `val`, return the biggest element in the array
 * which is smaller than `val`. If no such element exists, return `val`.
 * 
 * @param {number[]} arr - The input array.
 * @param {number} val - The value to compare.
 * @returns {number} - The next smallest element.
 */
export function nextSmallest(arr, val) {
    let nextSmaller = null
    for (const element of arr) {
        if (element < val && (nextSmaller === null || element > nextSmaller)) {
            nextSmaller = element
        }
    }
    return nextSmaller !== null ? nextSmaller : val
}
