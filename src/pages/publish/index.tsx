import { View, Text } from '@tarojs/components'
import { Radio, Textarea, Uploader, Button } from "@taroify/core"
import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { supabase } from '@/lib/supabase'
import Loading from '@/components/Loading'
import { PostListType } from '../../../types/post'
import './index.scss'

export default function Publish() {
  const [userInfo, setUserInfo] = useState(Taro.getStorageSync('userInfo') as any)
  const [uploaderFile, setUploaderFile] = useState<Uploader.File>({})
  const [text, setText] = useState<string>('')
  const [tag, setTag] = useState<string>('生活')

  const checkAuthorization = () => {
    const newUserInfo = Taro.getStorageSync('userInfo')
    setUserInfo(newUserInfo)
    if (!newUserInfo) {
      Taro.switchTab({
        url: '/pages/me/index'
      })
    }
  }

  const reset = () => {
    setUploaderFile({})
    setText('')
    setTag('生活')
  }

  useDidShow(() => {
    checkAuthorization()
  })

  const handleUpload = () => {
    Taro.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      mediaType: ['image'],
      success: async (res) => {
        setUploaderFile({url: '', status: 'uploading', message: "上传中..."})

        const file = res.tempFiles[0]
        const fileExt = res.tempFiles[0].tempFilePath.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        const { error: uploadError } = await supabase.storage
          .from('avatar')
          .upload(filePath, file as any)
        if (uploadError) {
          throw uploadError
        }

        const { data } = supabase.storage
          .from('avatar')
          .getPublicUrl(filePath)
        
          setUploaderFile({url: data.publicUrl, status: 'completed', message: "上传完成"})
      },
      fail: e => {
        console.warn(JSON.stringify(e))
        setUploaderFile({url: '', status: 'failed', message: "上传失败"})
      },
    })
  }

  const handleDel = () => {
    setUploaderFile({})
  }

  const handlePublish = async () => {
    if (text === '') {
      Taro.showToast({title: '请输入内容！', icon: 'none'})
      return
    }

    const article = { userName: userInfo.nickName, content: text, avatar: userInfo.avatarUrl, tag_val: tag } as PostListType
    if (Reflect.ownKeys(uploaderFile).length !== 0 && uploaderFile?.url) {
      article.content_imgs = JSON.stringify([uploaderFile?.url])
    }

    const { error } = await supabase
    .from('post_list')
    .insert([article])
    .select()

    if (error) {
      throw error
    } else {
      Taro.showToast({title: '发布成功！', icon: 'none'}).then(() => {
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/home/index'
          })
        reset()
        }, 1000)
      })
    }
  }

  return userInfo ? (
    <View className='publish'>
      <View className='publish-input'>
        <Textarea placeholder='请输入内容' className='publish-input-textarea' value={text} onChange={(e)=> setText(e.detail.value)} />
        <Uploader value={uploaderFile} multiple maxFiles={1} onUpload={handleUpload} onChange={handleDel} />
      </View>

      <View className='publish-dock'>
        <Text>选择文章类型</Text>
        
        <View className='publish-dock-btns'>
          <Radio.Group defaultValue='生活' direction='horizontal' className='publish-dock-btns-radio' value={tag} onChange={setTag} >
            <Radio name='生活'>生活</Radio>
            <Radio name='学习'>学习</Radio>
            <Radio name='问答'>问答</Radio>
            <Radio name='情感'>情感</Radio>
          </Radio.Group>

          <Button className='publish-dock-btns-btn' onClick={handlePublish}>立即发布</Button>
        </View>
      </View>
    </View>
  )
  :
  (
    <Loading />
  )
}