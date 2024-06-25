import { useRef, useState } from "react"
import { View } from "@tarojs/components"
import { Tabs, ConfigProvider, List, PullRefresh } from "@taroify/core"
// import usePaginatedQuery from "@/hooks/usePagination"
import Post from "@/components/Post"
import { PostType } from "../../../types/postList"
import "./index.scss"

export default function Home() {
  const [currentTab, setCurrentTab] = useState(0)
  const [currentSort, setCurrentSort] = useState(0)
  // const {data, loading, hasMore, refresh, loadMore} = usePaginatedQuery('post_list', 10)

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

  const testArticle = useRef<PostType[]>([
    {id: 0, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 1, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 2, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 3, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 4, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 5, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 6, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 7, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 8, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 9, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 10, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 11, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 12, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 13, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
    {id: 14, created_at: "2024-06-24T16:30:26.137545+00:00", avatar: '', content: '你好', content_imgs: '', tag_val: '生活', userName: 'ake:shime'},
  ])

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
        <Tabs value={currentTab} onChange={setCurrentTab} >
          {tabList1.current.map(t1Item => (
            <Tabs.TabPane title={t1Item.title} value={t1Item.id} key={t1Item.id} >
              <ConfigProvider theme={{
                '—tabs-nav-background-color': '#eeeeee',
                '—tab-color': '#000000',
                '—tab-active-color': '#2a3886',
                '—tab-active-font-weight': 'bolder',
                '—tabs-active-color': '#2a3886'
                }}
              >
                <Tabs value={currentSort} onChange={setCurrentSort} >
                  {tabList2.current.map(t2Item => (
                    <Tabs.TabPane title={t2Item.title} value={t2Item.id} key={t2Item.id} >
                      {/* <PullRefresh loading={loading} onRefresh={refresh}>
                        <List className='home-post' fixedHeight loading={loading} hasMore={hasMore} onLoad={loadMore}>
                          {
                            data.map(dItem => <View key={dItem.id}>{dItem.content}</View>)
                          }
                        </List>
                      </PullRefresh> */}
                      <PullRefresh >
                        <List className='home-post' fixedHeight >
                          {
                            testArticle.current.map(dItem => <Post key={dItem.id} data={dItem} />)
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
