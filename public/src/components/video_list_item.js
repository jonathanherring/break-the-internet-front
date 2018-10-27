import React from "react"
// import scrollToComponent from 'react-scroll-to-component'; //seems unused

const VideoListItem = ({ video, onVideoSelect }) => {
  // const imageUrl = video.images.fixed_height_still.url
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
