function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

function isArray(item: any) {
  return item && typeof item === 'object' && Array.isArray(item)
}

function mergeDeep(target: any, source: any) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else if (isArray(source[key])) {
        if (!target[key]) target[key] = []
        mergeArrays(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return target
}

export function mergeArrays(target: any[], source: any[]) {
  source.forEach((sourceItem) => {
    if (
      !target
      || !target.find(targetItem => targetItem.name === sourceItem.name)
    ) {
      target.push(sourceItem)
    } else {
      mergeDeep(
        target.find(targetItem => targetItem.name === sourceItem.name),
        sourceItem,
      )
    }
  })
  return target
};
