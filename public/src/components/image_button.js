import React, { Component } from "react"

export default class ImageButton extends Component {
  constructor() {
    super()
    this.state = {
      grabbedCanvas: "",
      grabbedImage: "",
      numChildren: 0
    }
  }
  // componentDidMount() {
  //   this.props.canvas(canvasGrab)
  //   document.getElementById('image-button').addEventListener('click', convertCanvasToImage)
  // }
  grabCanvas = () => {
    const canvasGrab = document.querySelector(".canvas")
    this.setState({ grabbedCanvas: canvasGrab }, function(){
        var image = new Image()
        image.src = this.state.grabbedCanvas.toDataURL("image/png")
        this.setState({ grabbedImage: image }, function () {
            console.log('img ', this.state.grabbedImage)
        })
    })
    
  }
  convertCanvasToImage = () => {
    //console.log("hit click")
    this.grabCanvas()
  }
  

  render() {
    let children = []
    children.push(<img src={this.state.grabbedImage.src} />)
    return (
      <div>
        <a
          id="image-button"
          className="btn btn-default"
          onClick={this.convertCanvasToImage}
        >
          Button
        </a>
        <div className="image-home">{children}</div>
      </div>
    )
  }
}
