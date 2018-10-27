import React, { Component } from "react"

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = { term: "" }
  }
  render() {
    return (
      <div>
        <div className="search-bar">
          <h3 className="search-text">Search for a gif!</h3>
          <input
            autoFocus
            placeholder="Find your gif"
            value={this.state.term}
            onChange={event => this.onInputChange(event.target.value)}
          />
        </div>
      </div>
    )
  }

  onInputChange(term) {
    this.setState({ term })
    this.props.onSearchTermChange(term)
  }
}
