import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Image } from "@taroify/core" 
import './index.scss'

export default function Me() {
  const userInfo = Taro.getStorageSync('userInfo')

  const checkAuthorization = () => {
    if (!userInfo) {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    }
  }

  useDidShow(() => {
    checkAuthorization()
  })

  return (
    <View className='me'>
      <View className='me-user'>
        <Image className='me-user-avatar' src={userInfo.avatarUrl}  />
        <Text>{userInfo.nickName}</Text>
      </View>

      <View className='me-dock'>
        <View className='me-dock-item'>关于论坛</View>
        <View className='me-dock-item'>设置中心</View>
      </View>
    </View>
  )
}