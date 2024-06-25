import { View, Text } from '@tarojs/components'
import { Radio, Textarea, Uploader, Button } from "@taroify/core"
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { supabase } from '@/lib/supabase'
import './index.scss'

export default function Publish() {
  const [uploaderFile, setUploaderFile] = useState<Uploader.File>()

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

  return (
    <View className='publish'>
      <View className='publish-input'>
        <Textarea placeholder='请输入留言' className='publish-input-textarea' />
        <Uploader value={uploaderFile} multiple onUpload={handleUpload} onChange={handleDel} />
      </View>

      <View className='publish-dock'>
        <Text>选择文章类型</Text>
        
        <View className='publish-dock-btns'>
          <Radio.Group defaultValue='1' direction='horizontal' className='publish-dock-btns-radio' >
            <Radio name='1'>生活</Radio>
            <Radio name='2'>学习</Radio>
            <Radio name='3'>问答</Radio>
            <Radio name='4'>情感</Radio>
          </Radio.Group>

          <Button className='publish-dock-btns-btn'>立即发布</Button>
        </View>
      </View>
    </View>
  )
}