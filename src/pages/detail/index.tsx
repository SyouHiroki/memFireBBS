import { View, Text } from '@tarojs/components'
import { Image, FixedView, Textarea, Button } from '@taroify/core'
import { useState } from 'react'
import { formatDate } from '@/lib/time'
import { supabase } from '@/lib/supabase'
import CommentImg from '@/assets/imgs/comment.png'
import HomeImg from '@/assets/imgs/home.png'
import LikeImg from '@/assets/imgs/like.png'
import Taro, { useDidShow } from '@tarojs/taro'
import { PostDetailType } from '../../../types/post'
import './index.scss'

export default function Detail() {
  const { id } = Taro.getCurrentInstance().router!.params
  const [userInfo, setUserInfo] = useState(Taro.getStorageSync('userInfo') as any)
  const [showInput, setShowInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [detail, setDetail] = useState<PostDetailType[]>([])

  const getDetail = async (post_id: string) => {
    const { data, error } = await supabase
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
        comment (id, created_at, commentator, responder, comment_content, reply_content, post_id)
      `)
      .eq('id', post_id)

      if (error) {
        throw error
      }

      setDetail(data)
  }

  const updateViews = async (post_id: string) => {
    let { data: selectData, error: selectErr } = await supabase
    .from('page_views')
    .select('views')
    .eq('post_id', post_id)

    if (selectErr) {
      throw selectErr
    }

    const { error: updateErr } = await supabase
    .from('page_views')
    .update({ views: Number(selectData?.[0].views) + 1 })
    .eq('post_id', post_id)
    .select()

    if (updateErr) {
      throw updateErr
    }
  }

  const handleGoToHome = () => {
    Taro.navigateBack()
  }

  const handleCloseInput = () => {
    setShowInput(false)
    setCommentText('')
  }

  const handleComment = async () => {
    const { error } = await supabase
    .from('comment')
    .insert([{
      commentator: userInfo.nickName,
      comment_content: commentText,
      post_id: id
    }])
    .select()

    if (error) {
      throw error
    } else {
      Taro.showToast({title: '评论成功！', icon: 'none'}).then(() => {
        handleCloseInput()
        getDetail(id as string)
      })
    }
  }

  const checkAuthorization = () => {
    const newUserInfo = Taro.getStorageSync('userInfo')
    setUserInfo(newUserInfo)
    if (!newUserInfo) {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
      return false
    } else {
      return true
    }
  }

  useDidShow(async () => {
    if (checkAuthorization()) {
      await updateViews(id as string)
      getDetail(id as string)
    }
  })

  return (
    <View className='detail'>
      <View className='detail-pd'>
        <View className='detail-pd-user'>
          {detail?.[0]?.avatar ? <Image src={detail?.[0]?.avatar} className='detail-pd-user-avatar' /> : <View className='detail-pd-user-avatar-void'>{detail?.[0]?.userName[0]}</View>}
          <View className='detail-pd-user-info'>
            <Text>{detail?.[0]?.userName}</Text>
            <Text className='detail-pd-user-info-time'>{formatDate(detail?.[0]?.created_at)}</Text>
          </View>
        </View>

        <Text className='detail-pd-content'>{detail?.[0]?.content}</Text>

        {detail?.[0]?.content_imgs && <View>
          {(() => {
              const imgs = JSON.parse(detail?.[0]?.content_imgs)
              if (typeof imgs === 'object' && Array.isArray(imgs)) {
                return imgs.map((item, index) => (
                  <Image key={index} src={item} className='detail-pd-img' />
                ))
              }
          })()}
        </View>}

        <Text className='detail-pd-meta'>
          <Text className='detail-pd-meta-tag'>#{detail?.[0]?.tag_val}</Text>
          全部评论（{detail?.[0]?.comment?.length}）
        </Text>

        {detail?.[0]?.comment && <View className='detail-pd-comment'>
          {detail?.[0]?.comment.map(item => (
            <View key={item.id} className='detail-pd-comment-wrapper'>
              <View className='detail-pd-comment-wrapper-content'>
                <Text className='detail-pd-comment-wrapper-content-commentator'>{item.commentator}</Text>
                <Image mode='scaleToFill' src={CommentImg} className='detail-pd-comment-wrapper-content-icon' />
                <Text>回复</Text>
              </View>

              <Text>{item.comment_content}</Text>
            </View>
          ))}
        </View>}
      </View>

      <FixedView position='bottom'>
        <View className='detail-tabbar'>
          <View className='detail-tabbar-item' onClick={handleGoToHome}>
            <Image src={HomeImg} className='detail-tabbar-item-icon' />
            <Text>首页</Text>
          </View>

          <View className='detail-tabbar-item' onClick={() => setShowInput(true)}>
            <Image src={CommentImg} className='detail-tabbar-item-icon' />
            <Text>评论</Text>
          </View>

          <View className='detail-tabbar-item'>
            <Image src={LikeImg} className='detail-tabbar-item-icon' />
            <Text>点赞</Text>
          </View>
        </View>

        {showInput && <View className='detail-input'>
          <Text className='detail-input-desc'>评论</Text>
          <Textarea placeholder='请输入内容' className='detail-input-textarea' value={commentText} onChange={(e)=> setCommentText(e.detail.value)} />
          
          <View className='detail-input-btns'>
            <Button className='detail-input-btns-btn' onClick={handleCloseInput}>取消</Button>
            <Button className='detail-input-btns-btn' onClick={handleComment}>发送</Button>
          </View>
        </View>}
      </FixedView>
    </View>
  )
}