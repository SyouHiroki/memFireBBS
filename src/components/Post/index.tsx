import { View, Text } from "@tarojs/components";
import { Image } from "@taroify/core"
import { formatDate } from "@/lib/time";
import WatchImg from '@/assets/imgs/watch.png'
import LikeImg from '@/assets/imgs/like.png'
import CommentImg from '@/assets/imgs/comment.png'
import { PostListType } from "../../../types/post";
import './index.scss'

type PostPropsType = {
  data: PostListType
}

export default function Post({ data }: PostPropsType) {

  return (
    <View className='com-post' >
      <View className='com-post-pd'>
        <View className='com-post-pd-user'>
          {data?.avatar ? <Image className='com-post-pd-user-avatar' src={data?.avatar}  /> : <View className='com-post-pd-user-avatar-void'>{data?.userName[0]}</View>}
          <Text>{data?.userName}</Text>
        </View>

        <Text className='com-post-pd-content'>{data?.content.length > 80 ? data?.content.slice(0, 80).trim() + '...' : data?.content}</Text>

        {data.content_imgs && <View>
          {(() => {
              const imgs = JSON.parse(data.content_imgs)
              if (typeof imgs === 'object' && Array.isArray(imgs)) {
                return imgs.map((item, index) => (
                  <Image key={index} src={item} className='com-post-pd-img' />
                ))
              }
          })()}
        </View>}

        <View className='com-post-pd-dock'>
          <Text className='com-post-pd-dock-time'>{formatDate(data.created_at)}</Text>
          <View className='com-post-pd-dock-btns'>
            <View className='com-post-pd-dock-btns-wrapper'>
              <Image mode='scaleToFill' src={WatchImg} className='com-post-pd-dock-btns-wrapper-btn' />
              {data?.page_views?.[0]?.views || 0}
            </View>
            <View className='com-post-pd-dock-btns-wrapper'>
              <Image mode='scaleToFill' src={CommentImg} className='com-post-pd-dock-btns-wrapper-btn' />
              {data?.comment?.[0]?.count || 0}
            </View>
            <View className='com-post-pd-dock-btns-wrapper'>
              <Image mode='scaleToFill' src={LikeImg} className='com-post-pd-dock-btns-wrapper-btn' />
              {data?.like?.[0]?.like_val || 0}
            </View>
          </View>
        </View>

      </View>
    </View>
  )
}