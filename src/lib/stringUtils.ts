export const string2Array = (stringArray: string) => {
  if (stringArray === '') {
    return []
  }

  const regex = /^\[.+\]$/

  if (regex.test(stringArray)) {
    const array = JSON.parse(stringArray)
    if (typeof array === 'object' && Array.isArray(array)) {
      return array
    }else {
      console.error('stringArray 参数无法转换为对象数组')
      return []
    }
  }else {
    return [stringArray]
  }
}

export const stringArrayHas = (stringArray: string, stringElement: string) => {
  return string2Array(stringArray).includes(stringElement)
}