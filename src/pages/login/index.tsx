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
      desc: '确认授权',
      success: (res) => {
        Taro.setStorageSync('userInfo', res.userInfo);
        Taro.navigateBack()
      },
      fail: () => {
        Taro.switchTab({
          url: '/pages/home/index'
        })
      }
    })
  }

  const cancel = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  const test = () => {
    Taro.navigateToMiniProgram({
      shortLink:'#小程序://小红书/hmKxu3kewmzc2Db'
    })
  }

  return (
    <View className='login'>
      <Header title='登陆' bgColor='#2a3886' textColor='#ffffff' />
      <View className='login-center'>
        <Info size={50} color='#2a3886' />
        <Text>提示授权</Text>
        <Button className='login-center-btn' onClick={handleAuthorize}>确定授权</Button>
        <Button className='login-center-btn' onClick={cancel}>回到主页</Button>
        <Button className='login-center-btn' onClick={test}>测试：跳转到小红书</Button>
      </View>
    </View>
  )
}