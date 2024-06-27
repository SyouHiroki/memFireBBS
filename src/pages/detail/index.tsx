import { View, Text } from '@tarojs/components'
import { Image, FixedView, Textarea, Button } from '@taroify/core'
import { useState } from 'react'
import { formatDate } from '@/lib/time'
import { supabase } from '@/lib/supabase'
import CommentImg from '@/assets/imgs/comment.png'
import HomeImg from '@/assets/imgs/home.png'
import LikeImg from '@/assets/imgs/like.png'
import LikeOnImg from '@/assets/imgs/like-on.png'
import Taro, { useDidShow } from '@tarojs/taro'
import { string2Array, stringArrayHas } from '@/lib/stringUtils'
import Loading from '@/components/Loading'
import { PostDetailType } from '../../../types/post'
import './index.scss'

export default function Detail() {
  const { id } = Taro.getCurrentInstance().router!.params
  const [userInfo, setUserInfo] = useState(Taro.getStorageSync('userInfo') as any)
  const [showInput, setShowInput] = useState(false)
  const [inputText, setInputText] = useState('')
  const [detail, setDetail] = useState<PostDetailType[]>([])
  const [mode, setMode] = useState<'评论' | '回复'>('评论')
  const [commentId, setCommentId] = useState(0)

  const getDetail = async () => {
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
        like (like_val, likers),
        page_views (views),
        comment (
          id, created_at, commentator, responder, comment_content, reply_content, post_id,
          reply (id, created_at, commentator, responder, reply_content, comment_id)
        )
      `)
      .eq('id', id)

      if (error) {
        throw error
      }

      setDetail(data)
  }

  const updateViews = async () => {
    let { data: selectData, error: selectErr } = await supabase
    .from('page_views')
    .select('views')
    .eq('post_id', id)

    if (selectErr) {
      throw selectErr
    }

    const { error: updateErr } = await supabase
    .from('page_views')
    .update({ views: Number(selectData?.[0].views) + 1 })
    .eq('post_id', id)
    .select()

    if (updateErr) {
      throw updateErr
    }
  }

  const handleLike = async () => {
    const { data: selectData, error: selectErr } = await supabase
    .from('like')
    .select('like_val, likers')
    .eq('post_id', id)

    if (selectErr) {
      throw selectErr
    }

    const newData = { like_val: Number(selectData?.[0].like_val) + 1, likers: JSON.stringify([...string2Array(selectData?.[0].likers), userInfo.nickName]) }
    const { error: updateErr } = await supabase
    .from('like')
    .update(newData)
    .eq('post_id', id)
    .select()

    if (updateErr) {
      throw updateErr
    } 

    getDetail()
  }

  const handleCancleLike = async () => {
    const { data: selectData, error: selectErr } = await supabase
    .from('like')
    .select('like_val, likers')
    .eq('post_id', id)

    if (selectErr) {
      throw selectErr
    }

    const newData = { like_val: Number(selectData?.[0].like_val) - 1, likers: JSON.stringify([...string2Array(selectData?.[0].likers)].filter(item => item != userInfo.nickName)) }
    if (newData.like_val < 0) {
      newData.like_val = 0
    }
    if (newData.likers === '[]') {
      newData.likers = ''
    }

    const { error: updateErr } = await supabase
    .from('like')
    .update(newData)
    .eq('post_id', id)
    .select()

    if (updateErr) {
      throw updateErr
    }

    getDetail()
  }

  const handleGoToHome = () => {
    Taro.navigateBack()
  }

  const handleComment = async () => {
    const { error } = await supabase
    .from('comment')
    .insert([{
      commentator: userInfo.nickName,
      comment_content: inputText,
      post_id: id
    }])
    .select()

    if (error) {
      throw error
    } else {
      Taro.showToast({title: '评论成功！', icon: 'none'}).then(() => {
        handleCloseInput()
        getDetail()
      })
    }
  }

  const handleReply = async () => {
    const { error } = await supabase
    .from('reply')
    .insert([{
      responder: userInfo.nickName,
      reply_content: inputText,
      post_id: id,
      comment_id: commentId
    }])
    .select()

    if (error) {
      throw error
    } else {
      Taro.showToast({title: '回复成功！', icon: 'none'}).then(() => {
        handleCloseInput()
        getDetail()
      })
    }
  }

  const handleSend = () => {
    if (mode === '回复') {
      handleReply()
    } else if (mode === '评论') {
      handleComment()
    } else {
      console.error('暂不支持该模式！')
    }
  }

  const handleOpenInput = (inputMode: '评论' | '回复', comment_id?: number) => {
    if (comment_id) {
      setCommentId(comment_id)
    }
    setMode(inputMode)
    setShowInput(true)
  }

  const handleCloseInput = () => {
    setShowInput(false)
    setInputText('')
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
      await updateViews()
      getDetail()
    }
  })

  return (userInfo && detail) ? (
    <View className='detail'>
      <View className='detail-pd'>
        <View className='detail-pd-user'>
          {detail?.[0]?.avatar ? <Image src={detail?.[0]?.avatar} className='detail-pd-user-avatar' /> : <View className='detail-pd-user-avatar-void'>{detail?.[0]?.userName[0]}</View>}
          <View className='detail-pd-user-info'>
            <Text>{detail?.[0]?.userName}</Text>
            <Text className='detail-time'>{formatDate(detail?.[0]?.created_at)}</Text>
          </View>
        </View>

        <Text className='detail-pd-content'>{detail?.[0]?.content}</Text>

        {
          detail?.[0]?.content_imgs &&
          <View>
            {string2Array(detail?.[0]?.content_imgs).map((item, index) => <Image key={index} src={item} className='detail-pd-img' />)}
          </View>
        }

        <Text className='detail-pd-meta'>
          <Text className='detail-pd-meta-tag'>#{detail?.[0]?.tag_val}</Text>
          全部评论（{detail?.[0]?.comment?.length}）
        </Text>

        {detail?.[0]?.comment && <View className='detail-pd-comment'>
          {detail?.[0]?.comment.map(cItem => (
            <View key={cItem.id} className='detail-pd-comment-wrapper'>
              <View className='detail-pd-comment-wrapper-user'>
                <Text className='detail-pd-comment-wrapper-user-commentator'>{cItem.commentator}</Text>
                <Image mode='scaleToFill' src={CommentImg} className='detail-pd-comment-wrapper-user-icon' />
                <Text onClick={() => handleOpenInput('回复', cItem.id)}>回复</Text>
              </View>

              <Text className='detail-pd-comment-wrapper-content'>{cItem.comment_content}</Text>
              <Text className='detail-time'>{formatDate(cItem.created_at)}</Text>

              {cItem?.reply && cItem?.reply?.map(rItem => (
                <View className='detail-pd-comment-wrapper-user-reply' key={rItem.id}>
                  <Text className='detail-pd-comment-wrapper-user-reply-responder'>{rItem.responder}</Text>
                  <Text className='detail-pd-comment-wrapper-user-reply-content'>{rItem.reply_content}</Text>
                  <Text className='detail-time'>{formatDate(rItem.created_at)}</Text>
                </View>
              ))}
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

          <View className='detail-tabbar-item' onClick={() => handleOpenInput('评论')}>
            <Image src={CommentImg} className='detail-tabbar-item-icon' />
            <Text>评论</Text>
          </View>

          <View className='detail-tabbar-item' onClick={() => stringArrayHas(detail?.[0]?.like?.[0].likers as string, userInfo.nickName) ? handleCancleLike() : handleLike()}>
            <Image src={stringArrayHas(detail?.[0]?.like?.[0].likers as string, userInfo.nickName) ? LikeOnImg : LikeImg} className='detail-tabbar-item-icon' />
            <Text>点赞</Text>
          </View>
        </View>

        {showInput && <View className='detail-input'>
          <Text className='detail-input-desc'>{mode}</Text>
          <Textarea placeholder='请输入内容' className='detail-input-textarea' value={inputText} onChange={(e)=> setInputText(e.detail.value)} />
          
          <View className='detail-input-btns'>
            <Button className='detail-input-btns-btn' onClick={handleCloseInput}>取消</Button>
            <Button className='detail-input-btns-btn' onClick={handleSend}>发送</Button>
          </View>
        </View>}
      </FixedView>
    </View>
  ) 
  :
  (
    <Loading />
  )
}