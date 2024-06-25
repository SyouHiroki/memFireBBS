import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { PostType } from '../../types/postList'

const usePaginatedQuery = (tableName: string, size: number) => {
  const [data, setData] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [pageSize] = useState(size)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = useCallback(async (currentPage: number, isRefresh: boolean = false) => {
    setLoading(true)
    try {
      const { data: newData, error: fetchError  } = await supabase
      .from(tableName)
      .select(`
        id,
        created_at,
        userName,
        content,
        avatar,
        content_imgs,
        tag_val,
        like(like_val),
        page_views(views),
        comment(count)
      `)
      .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1)

      if (fetchError) {
        throw fetchError
      }

      if (isRefresh) {
        setData(newData ?? [])
      } else {
        setData((prevData) => [...prevData, ...(newData ?? [])])
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
  }, [tableName, pageSize])

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

  return { data, loading, error, loadMore, hasMore, refresh }
}

export default usePaginatedQuery
