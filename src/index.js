import _ from 'lodash'
import React, { Component } from "react"
import ReactDOM from "react-dom"
import SearchBar from "./components/search_bar"
import VideoList from "./components/video_list"
import VideoDetail from "./components/video_detail"
import ImageButton from "./components/image_button"

const API_KEY = "6vOh5xCwnuGgudvaMLAMe9pmFit8B6Jh"
const API_LIMIT = "limit=5"
const API_URL = `https://api.giphy.com/v1/gifs/search?&api_key=${API_KEY}&${API_LIMIT}`

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      videos: [],
      selectedVideo: {}
    }

    this.giphySearch('crazy cats')
  }
  giphySearch(term){
    console.log(term)
    fetch(API_URL + `&q=${term}`)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json', json)
      return json
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
    .then( videos => {
      this.setState({
        videos: videos.data,
        selectedVideo: videos.data[0]
      })
    })
  }
  onVideoSelect(selectedVideo) {
    this.setState({ selectedVideo })
    // this.forceUpdate()
    setTimeout(() => {this.forceUpdate()}, 0)
    }
  render() {

    const giphySearch = _.debounce((term) => {this.giphySearch(term) }, 300)
    return (
      <div>
        <SearchBar onSearchTermChange={giphySearch} />
        <VideoList
          onVideoSelect={selectedVideo => this.onVideoSelect(selectedVideo)}
          videos={this.state.videos}
        />
        <VideoDetail key={this.state.selectedVideo.id} video={this.state['selectedVideo']} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector(".thing"))
