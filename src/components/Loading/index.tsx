import { View } from "@tarojs/components"
import { Loading as LoadingComp } from "@taroify/core"
import './index.scss'

export default function Loading() {

  return (
    <View className='com-loading'>
      <LoadingComp className='com-loading-comp' size={50}  />
    </View>
  )
}