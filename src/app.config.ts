export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/publish/index',
    'pages/me/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    // custom: true,
    color: "#707070",
    selectedColor: "#2a3886",
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/imgs/home.png',
        selectedIconPath: 'assets/imgs/home-on.png'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布',
        iconPath: 'assets/imgs/plus.png',
        selectedIconPath: 'assets/imgs/plus-on.png'
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
        iconPath: 'assets/imgs/me.png',
        selectedIconPath: 'assets/imgs/me-on.png'
      },
    ],
  },
})
