import { View, Text } from '@tarojs/components'
import { Button } from '@taroify/core'
import Header from '@/components/Header'
import { Info } from '@taroify/icons'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Login() {
  const handleAuthorize = () => {
    Taro.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料',
      success: (res) => {
        Taro.setStorageSync('userInfo', res.userInfo);
        Taro.switchTab({
          url: '/pages/me/index'
        })
      },
      fail: () => {
        Taro.switchTab({
          url: '/pages/home/index'
        })
      }
    })
  }


  return (
    <View className='login'>
      <Header title='登陆' bgColor='#2a3886' textColor='#ffffff' />
      <View className='login-center'>
        <Info size={50} color='#2a3886' />
        <Text>提示授权</Text>
        <Button className='login-center-btn' onClick={handleAuthorize}>确定授权</Button>
      </View>
    </View>
  )
}