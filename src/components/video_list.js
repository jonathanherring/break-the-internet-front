import React from 'react'
import VideoListItem from './video_list_item'

const VideoList = (props) => {
  const videoItems = props.videos.map((video) => {
    return(
       <VideoListItem
       onVideoSelect={props.onVideoSelect}
       key={video.id}
       video={video} />

    )
  })
  return (
  <div className="">
    <ul className="flex-row list-group">
        {videoItems}
    </ul>
    <div className="click-text"><h3>Click video to blow it up!</h3></div>
  </div>

  )
}

export default VideoList
