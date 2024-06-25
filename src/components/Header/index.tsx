import { Navbar, ConfigProvider } from "@taroify/core";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

type HeaderPropsType = {
  title: string
  bgColor?: string
  textColor?: string
}

export default function Header({ title, bgColor, textColor }: HeaderPropsType) {
  const sysInfo = Taro.getSystemInfoSync()
  
  return (
    <View>
      <ConfigProvider theme={{
        '—navbar-background-color': bgColor || '#ffffff',
        '—navbar-title-color': textColor || '#000000'
        }}
      >
        <Navbar title={title} style={{paddingTop: `${sysInfo.statusBarHeight}px`}} />
      </ConfigProvider>
    </View>
  )
}