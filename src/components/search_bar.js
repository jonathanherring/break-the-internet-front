import React, { Component } from "react"

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = { term: "" }
  }
  render() {
    return (
      <div className="search-bar">

        <h3 className="search-text">Search for a gif!</h3>

        Search for a gif: 

        <input
          value={this.state.term}
          onChange={event => this.onInputChange(event.target.value)}
        />
      </div>
    )
  }

  onInputChange(term) {
    this.setState({ term })
    this.props.onSearchTermChange(term)
  }
}

export default SearchBar
