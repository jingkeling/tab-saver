import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"
import '~src/main'
import empty_icon from 'data-base64:~/assets/imgs/emptyicon.png'
import TButton from "~src/components/TButton"
import { Modal, Input, Message, Popconfirm, Popover, Button } from '@arco-design/web-react'
import copy from 'copy-to-clipboard'
import { QRCodeCanvas } from 'qrcode.react';

function TabIndex() {
  const [tabGroups, setTabGroups] = useStorage<TabGroup[]>("tabGroups")
  const openURL = (date, url) => {
    const arr = tabGroups
      .map((tabGroup) => {
        if (tabGroup.date === date) {
          tabGroup.tabs = tabGroup.tabs.filter((tab) => tab.url !== url)
        }
        return tabGroup
      })
      .filter((tabGroup) => tabGroup.tabs.length > 0)
    setTabGroups(arr)
    // chrome.tabs.create({ url })
  }
  // 打开所有储存的url
  const recoverAll = async () => {
    const tabs = tabGroups?.reduce((acc, cur) => acc.concat(cur.tabs), []) // 将所有的tabs合并成一个数组
    await tabs?.forEach((tab) => {
      chrome.tabs.create({ url: tab.url })
    })
    setTabGroups([])
  }

  const recover = async (date) => {
    const tabs = tabGroups?.find((tabGroup) => tabGroup.date === date)?.tabs
    await tabs?.forEach((tab) => {
      chrome.tabs.create({ url: tab.url })
    })
    const filter = tabGroups.filter((tabGroup) => tabGroup.date !== date)
    setTabGroups(filter)
  }
  const del = (date) => {
    const arr = tabGroups.filter((tabGroup) => tabGroup.date !== date)
    setTabGroups(arr)
  }

  const TextExport = () => JSON.stringify(tabGroups, null, 2)

  const exportAll = async () => {
    Modal.confirm({
      icon: null,
      content: <Input.TextArea
        placeholder='Please enter ...'
        style={{ height: 300 }}
        defaultValue={TextExport()} />,
      okText: '复制',
      okButtonProps: {
        type: 'primary',
      },
      hideCancel: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            copy(TextExport())
            Message.success('复制成功')
            resolve(null)
          }, 200);
        })
      },
    })
  }

  const getFavIcon = (url) => {
    // js 获取网站的 favicon，判断 favicon.ico 是否存在，不存在则使用默认的
    return new URL(url).origin + '/favicon.ico'
  }

  const [textImport, setTextImport] = useState('')
  const [visibleImportAll, setVisibleImportAll] = useState(false)

  const openImportAll = () => setVisibleImportAll(true)
  const importAll = () => {
    const text = textImport.trim()
    if (!text) return
    try {
      const data = JSON.parse(text)
      const filterdata = tabGroups
        ?.filter(item => !data.map(tabGroup => tabGroup.date).includes(item.date))
        .concat(data)
      setTabGroups(filterdata)
      Message.success('导入成功')
      setVisibleImportAll(false)
    } catch (error) {
      Message.error('导入失败')
    }

    setVisibleImportAll(false)
  }

  const delAll = () => {
    setTabGroups([])
  }

  return (
    <>
      <div
        className="flex flex-col p-6">
        <div className="flex gap-2">
          <Popconfirm
            focusLock
            title='删除全部?'
            onOk={() => {
              delAll()
            }}
          >
            {/* <TButton>删除所有</TButton> */}
            <TButton status='danger' type='outline'>删除全部</TButton>
          </Popconfirm>
          <TButton type='outline' onClick={recoverAll}>
            恢复所有
          </TButton>
          <TButton type='outline' onClick={exportAll}>
            导出
          </TButton>
          <TButton status="default" type='outline' onClick={openImportAll}>
            导入
          </TButton>
          {/* <Input style={{ width: 350 }} allowClear placeholder='搜索' /> */}
        </div>
        <div className="flex flex-col gap-3 mt-4">
          {
            tabGroups?.map((tabGroup, index) => (
              <div key={tabGroup.date} className="bg-slate-100 rounded-sm p-6 dark:bg-slate-800">
                <div className="mb-3 flex gap-3">
                  <span className="text-gray-400">{tabGroup.date}</span>
                  <span onClick={() => recover(tabGroup.date)} className="text-blue-500 cursor-pointer">恢复分组</span>
                  <span onClick={() => del(tabGroup.date)} className="text-blue-500 cursor-pointer">删除分组</span>
                </div>
                <div className="flex flex-col gap-2">
                  {
                    tabGroup.tabs.map((tab) => (
                      <div key={tab.url} className="flex items-center gap-2">
                        <img src={getFavIcon(tab.url)}
                          style={{ width: '16px', height: '16px' }}
                          onError={(e) => e.target.src = empty_icon} />
                        <Popover
                          content={
                            <QRCodeCanvas value={tab.url} size={250} />
                          }
                        >
                        <a
                          className="text-blue-500 cursor-pointer"
                          href={tab.url}
                          onClick={() => openURL(tabGroup.date, tab.url)}>
                          {tab.title}
                        </a>
                      </Popover>
                    </div>
                ))
                  }
              </div>
              </div>
        ))
          }
      </div>
    </div >
      <Modal
        title='导入'
        visible={visibleImportAll}
        okText='确认导入'
        onOk={importAll}
        onCancel={() => setVisibleImportAll(false)}
        autoFocus={false}
        focusLock={true}
        hideCancel={true}
        closeIcon={false}
        escToExit={true}
        maskClosable={true}
      >
        <Input.TextArea
          placeholder='Please enter ...'
          style={{ height: 300 }}
          value={textImport}
          onChange={setTextImport} />
      </Modal>
    </>

  )
}

export default TabIndex