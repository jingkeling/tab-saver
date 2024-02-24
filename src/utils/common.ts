/// 不推荐用chrome.storage.get和set，因为他们不是响应式的，而且不支持promise，并且获取的数据是字符串形式。


// 获取所有tab
export const getAllTabs = (): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      resolve(tabs)
    })
  })
}
// 获取当前窗口的所有tab
export const getCurTabs = (): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => resolve(tabs))
  })
}
// 获取当前窗口激活的tab
export const getCurTab = (): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs))
  })
}
// 清除所有tab
export const clearStorage = async () => {
  await chrome.storage.sync.clear()
}
// 通过key或者key数组，获取storage
export const getStorage = (...keys) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (result) => {
      resolve(result)
    })
  })
}