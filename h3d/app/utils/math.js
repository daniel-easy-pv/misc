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