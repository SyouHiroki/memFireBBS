import { useRef, useState } from "react"
import { View } from "@tarojs/components"
import { Tabs, ConfigProvider, List, PullRefresh } from "@taroify/core"
import usePaginatedQuery from "@/hooks/usePagination"
import Post from "@/components/Post"
import Taro from "@tarojs/taro"
import "./index.scss"

export default function Home() {
  const [currentTab, setCurrentTab] = useState('全部')
  const [currentSort, setCurrentSort] = useState('默认')
  const {data, loading, hasMore, refresh, loadMore, filter, updateFilterType} = usePaginatedQuery(10, currentTab, currentSort)

  const tabList1 = useRef([
    {id: 0, title: '全部'},
    {id: 2, title: '生活'},
    {id: 3, title: '学习'},
    {id: 4, title: '问答'},
    {id: 5, title: '情感'}
  ])

  const tabList2 = useRef([
    {id: 0, title: '默认'},
    {id: 1, title: '最新'},
    {id: 2, title: '热门'},
    {id: 3, title: '我的'}
  ])

  const handleSwitchTab1 = (tabName: string) => {
    setCurrentTab(tabName)
    filter(tabName)
  }

  const handleSwitchTab2 = (tabName: string) => {
    setCurrentSort(tabName)
    updateFilterType(tabName)
  }

  const handleGoToDetail = (id: number) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  return (
    <View className='home'>
      <ConfigProvider theme={{
          '—tabs-nav-background-color': '#2a3886',
          '—tab-color': '#ffffff',
          '—tab-active-color': '#ffffff',
          '—tab-active-font-weight': 'bolder',
          '—tabs-active-color': '#ffffff'
        }}
      >
        <Tabs value={currentTab} onChange={handleSwitchTab1} >
          {tabList1.current.map(t1Item => (
            <Tabs.TabPane title={t1Item.title} value={t1Item.title} key={t1Item.id} >
              <ConfigProvider theme={{
                '—tabs-nav-background-color': '#eeeeee',
                '—tab-color': '#000000',
                '—tab-active-color': '#2a3886',
                '—tab-active-font-weight': 'bolder',
                '—tabs-active-color': '#2a3886'
                }}
              >
                <Tabs value={currentSort} onChange={handleSwitchTab2} >
                  {tabList2.current.map(t2Item => (
                    <Tabs.TabPane title={t2Item.title} value={t2Item.title} key={t2Item.id} >
                      <PullRefresh loading={loading} onRefresh={refresh}>
                        <List className='home-post' fixedHeight loading={loading} hasMore={hasMore} onLoad={loadMore}>
                          {
                            data.map(dItem => <View key={dItem.id} onClick={() => handleGoToDetail(dItem.id)}><Post data={dItem} /></View>)
                          }
                        </List>
                      </PullRefresh>
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </ConfigProvider>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </ConfigProvider>
    </View>
  );
}
