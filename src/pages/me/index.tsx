import { View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Image, Popup, Checkbox } from "@taroify/core" 
import { useState } from 'react'
import DefaultAvatarImg from '@/assets/imgs/default-avatar.jpg'
import './index.scss'

export default function Me() {
  const [userInfo, setUserInfo] = useState(Taro.getStorageSync('userInfo') as any)
  const [isShowPopup, setIsShowPopup] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [nickname, setNickname] = useState('')

  const checkAuthorization = () => {
    const newUserInfo = Taro.getStorageSync('userInfo')
    setUserInfo(newUserInfo)
    if (!newUserInfo) {
      setIsShowPopup(true)
    }
  }

  const handlePopupClose = () => {
    const newUserInfo = Taro.getStorageSync('userInfo')
    if (!newUserInfo) {
      Taro.switchTab({
        url: '/pages/home/index'
      })
    }
  }

  const handleConfirm = () => {
    Taro.setStorageSync('userInfo', {nickName: nickname, avatarUrl: avatar})
    setUserInfo({nickName: nickname, avatarUrl: avatar})
    setIsShowPopup(false)
  }

  useDidShow(() => {
    checkAuthorization()
  })

  return (
    <View className='me'>
      <View className='me-user'>
        {userInfo &&
          <>
            <Image className='me-user-avatar' src={userInfo.avatarUrl} />
            <Text>{userInfo.nickName}</Text>
          </>
        }
      </View>

      <View className='me-dock'>
        <View className='me-dock-item'>关于论坛</View>
        <View className='me-dock-item'>设置中心</View>
      </View>

      <Popup open={isShowPopup} onClose={handlePopupClose} rounded placement='bottom' style={{ height: '40%' }} >
        <View className='me-popup-container'>

          <View className='me-popup-container-wrapper'>

            <View className='me-popup-container-wrapper-input'>
              <Checkbox className='me-popup-container-wrapper-input-checkbox' checked={avatar !== ''} />
              <Text>头像：</Text>
              <Button className='me-popup-container-wrapper-input-btn' openType='chooseAvatar' onChooseAvatar={e => setAvatar(e.detail.avatarUrl)}>
                <Image className='me-popup-container-wrapper-avatar' src={avatar || DefaultAvatarImg} />
              </Button>
            </View>
            
            <View className='me-popup-container-wrapper-input'>
              <Checkbox className='me-popup-container-wrapper-input-checkbox' checked={nickname !== ''} />
              <Text>昵称：</Text>
              <Input value={nickname} onInput={e => {setNickname(e.detail.value)}} onBlur={e => {setNickname(e.detail.value)}} type='nickname' className='me-popup-container-wrapper-input-nickname' />
            </View>

            <Button className='me-popup-container-wrapper-confirm' disabled={avatar === '' && nickname === ''} onClick={handleConfirm}>确定</Button>

          </View>

        </View>
      </Popup>
    </View>
  )
}