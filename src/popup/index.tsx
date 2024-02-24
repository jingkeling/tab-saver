import { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { getCurTabs } from "~src/utils/common"
import '~src/main'
import { Button } from "@arco-design/web-react"



function IndexPopup() {
  const [data, setData] = useState("")

  const openTab = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/index.html") })
  }
  // 获取所有tabs

  // 关闭当前窗口的tabs
  // const closeCurrentTabs = async () => {
  //   chrome.tabs.query({ currentWindow: true }, (tabs) => {
  //     tabs.forEach((tab) => {
  //       chrome.tabs.remove(tab.id)
  //     })
  //   })
  // }

  const [tabGroups, setTabGroups] = useStorage<TabGroup[]>("tabGroups", [])
  // 1。打开自己的tabs页面 2.关闭其他的tabs并储存tabs的网址 3.在打开的tabs页面中获取储存的tabs网址并打开
  const saveCloaseTabs = async () => {
    let tabs = await getCurTabs()
    const noEmptyTabs = tabs.filter(tab => !!tab.url)
    if (noEmptyTabs.length === 0) return chrome.tabs.create({ url: chrome.runtime.getURL("tabs/index.html") })
    const tabGroup: TabGroup = {
      date: new Date().toLocaleString(),
      description: data,
      tabs: noEmptyTabs.map((tab) => ({
          url: tab.url,
          title: tab.title
        }))
    }
    setTabGroups((tabGroups) => [tabGroup].concat(tabGroups))
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/index.html") })
    tabs.forEach((tab) => chrome.tabs.remove(tab.id))
  }

  return (
    <div
      className="p-4 flex gap-3">
      <Button type="secondary" onClick={openTab}>主页</Button>
      <Button type="primary" onClick={saveCloaseTabs}>一键保存</Button>
    </div>
  )
}

export default IndexPopup
