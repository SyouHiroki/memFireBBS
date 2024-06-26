import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Taro from '@tarojs/taro'
import { PostListType } from '../../types/post'

const usePaginatedQuery = (
  size: number, 
  initialTag: string,
  initialFilterType: string
) => {
  const [data, setData] = useState<PostListType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [pageSize] = useState(size)
  const [hasMore, setHasMore] = useState(true)
  const [tag, setTag] = useState(initialTag)
  const [filterType, setFilterType] = useState(initialFilterType)
  const currentRequestRef = useRef(0)

  const fetchData = useCallback(async (currentPage: number, isRefresh: boolean = false) => {
    setLoading(true)
    try {
      const requestId = ++currentRequestRef.current
      let query = supabase
        .from('post_list')
        .select(`
          id,
          created_at,
          userName,
          content,
          avatar,
          content_imgs,
          tag_val,
          like (like_val),
          page_views (views),
          comment (count)
        `)
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1)

      // 如果tag不为'全部'，添加筛选条件
      if (tag !== '全部') {
        query = query.eq('tag_val', tag)
      }

      // 处理第二层筛选和排序
      if (filterType === '最新') {
        query = query.order('created_at', { ascending: false })
      } else if (filterType === '热门') {
        // 获取热门数据时先获取所有数据再进行排序
        query = query.order('views', { ascending: false, foreignTable: 'page_views' })
      } else if (filterType === '我的') {
        const newUserInfo = Taro.getStorageSync('userInfo')
        if (newUserInfo && newUserInfo.nickName) {
          query = query.eq('userName', newUserInfo.nickName)
        }
      }

      const { data: newData, error: fetchError } = await query

      if (requestId !== currentRequestRef.current) {
        // 如果请求不是最新的，则忽略结果
        return
      }

      if (fetchError) {
        throw fetchError
      }

      const formattedData = newData?.map((post: any) => ({
        ...post,
        like: post.like || [],
        page_views: post.page_views || [],
        comment: post.comment || []
      })) ?? []

      if (filterType === '热门') {
        // 在前端对 '热门' 数据进行排序
        formattedData.sort((a, b) => {
          const viewsA = a.page_views?.reduce((sum, view) => sum + view.views, 0) || 0
          const viewsB = b.page_views?.reduce((sum, view) => sum + view.views, 0) || 0
          return viewsB - viewsA
        })
      }

      if (isRefresh) {
        setData(formattedData)
      } else {
        setData((prevData) => [...prevData, ...formattedData])
      }

      if (newData?.length < pageSize) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }, [pageSize, tag, filterType])

  // 在tag或filterType变化时重置数据和页码，并重新获取数据
  useEffect(() => {
    setData([])
    setPage(0)
    fetchData(0, true)
  }, [tag, filterType, fetchData])

  useEffect(() => {
    fetchData(page)
  }, [page, fetchData])

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const refresh = () => {
    setPage(0)
    fetchData(0, true)
  }

  const filter = (newTag: string) => {
    setTag(newTag)
  }

  const updateFilterType = (newFilterType: string) => {
    setFilterType(newFilterType)
  }

  return { data, loading, error, loadMore, hasMore, refresh, filter, updateFilterType }
}

export default usePaginatedQuery

