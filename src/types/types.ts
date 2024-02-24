type TabGroup = {
  date: string
  description: string
  // tabs: chrome.tabs.Tab[]
  tabs: ITab[]
}

type ITab = {
  url: string
  title: string
}