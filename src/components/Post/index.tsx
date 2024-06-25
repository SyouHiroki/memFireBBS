import { View, Text } from "@tarojs/components";
import { Avatar, TextEllipsis, Image } from "@taroify/core"
import { formatDate } from "@/lib/time";
import WatchImg from '@/assets/imgs/watch.png'
import LikeImg from '@/assets/imgs/like.png'
import CommentImg from '@/assets/imgs/comment.png'
import { PostType } from "../../../types/postList";
import './index.scss'

type PostPropsType = {
  data: PostType
}

export default function Post({ data }: PostPropsType) {

  return (
    <View className='com-post' >
      <View className='com-post-pd'>
        <View className='com-post-pd-user'>
          <Avatar size='small' src={data.avatar}>{data.avatar ? '' : data.userName[0]}</Avatar>
          <Text>{data.userName}</Text>
        </View>

        <TextEllipsis 
          content={data.content}
          expandText='展开'
          collapseText='收起'
        />

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