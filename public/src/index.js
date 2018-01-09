import _ from "lodash"
import React, { Component } from "react"
import ReactDOM from "react-dom"
import SearchBar from "./components/search_bar"
import VideoList from "./components/video_list"
import VideoDetail from "./components/video_detail"
import ImageButton from "./components/image_button"
import gifApi from "./lib/gif_api"


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      videos: [],
      selectedVideo: {}
    }
    this.gifSearch = this.gifSearch.bind(this)
    this.gifSearch("cat")
  }
  gifSearch(term) {
    let result = gifApi.search(term)
    result.then(videos => {
      this.setState({
        videos: videos.data,
        selectedVideo: videos.data[0]
      })
    })
  }
  onVideoSelect(selectedVideo) {
    this.setState({ selectedVideo })
    setTimeout(() => {
      this.forceUpdate()
    }, 0)
  }
  render() {
    const giphySearch = _.debounce((term) => {this.gifSearch(term) }, 300)
    return (
      <div>
        <SearchBar onSearchTermChange={giphySearch} />
        <VideoList
          onVideoSelect={selectedVideo => this.onVideoSelect(selectedVideo)}
          videos={this.state.videos}
        />
        <VideoDetail
          key={this.state.selectedVideo.id}
          video={this.state["selectedVideo"]}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector(".thing"))
