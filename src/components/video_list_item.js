import React from "react"

const VideoListItem = ({ video, onVideoSelect }) => {
  const imageUrl = video.images.fixed_height_still.url
  return (
    <li onClick={() => onVideoSelect(video)} className="list-group-item col-md-2">
      <div className="video-list media">
        <div className="media-middle">
          <img className="media-object" src={imageUrl} />
        </div>
      </div>
    </li>
  )
}

export default VideoListItem
