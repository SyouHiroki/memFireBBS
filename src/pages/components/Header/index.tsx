import { Navbar } from "@taroify/core";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

type HeaderPropsType = {
  title: string
  bgColor?: string
}

export default function Header({title, bgColor}: HeaderPropsType) {
  const sysInfo = Taro.getSystemInfoSync()
  
  return (
    <View>
      <Navbar title={title} style={{paddingTop: `${sysInfo.statusBarHeight}px`, backgroundColor: bgColor}} />
    </View>
  )
}