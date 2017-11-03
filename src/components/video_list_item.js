import React from "react"

const VideoListItem = ({ video, onVideoSelect }) => {
  const imageUrl = video.images.downsized_medium.url
  return (
    <li onClick={() => onVideoSelect(video)} className="list-group-item" id="selection-items">
      <div className="video-list media">
        <div className="">
          <img className=" img-responsive" src={imageUrl} />
        </div>
      </div>
    </li>
  )
}

export default VideoListItem
