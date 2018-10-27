import React from "react"
var video,
    copy,
    copycanvas,
    draw,
    timerRef,
    SOURCERECT = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    randomJump = false,
    debug = false

const TILE_WIDTH = 32,
    TILE_HEIGHT = 24,
    TILE_CENTER_WIDTH = 16,
    TILE_CENTER_HEIGHT = 12,
    PAINTRECT = {
        x: 0,
        y: 0,
        width: 1000,
        height: 600
    },
    RAD = Math.PI / 180,
    tiles = []

init = () => {
    video = document.getElementById('sourcevid');
    copycanvas = document.getElementById('sourcecopy');
    copy = copycanvas.getContext('2d');
    var outputcanvas = document.getElementById('output');
    draw = outputcanvas.getContext('2d');
    clearInterval(timerRef)
    timerRef = setInterval(processFrame, 33)
    // timerRef = window.rInterval(processFrame, 100);
}

window.rInterval = (callback, delay) => {
    var dateNow = Date.now,
        requestAnimation = window.requestAnimationFrame,
        start = dateNow(),
        stop,
        intervalFunc = function () {
            dateNow() - start < delay || (start += delay, callback());
            stop || requestAnimation(intervalFunc)
        }
    requestAnimation(intervalFunc);
    return {
        clear: function () {
            stop = 1
        }
    }
}

createTiles = () => {
    var offsetX = TILE_CENTER_WIDTH + (PAINTRECT.width - SOURCERECT.width) / 2,
        offsetY = TILE_CENTER_HEIGHT + (PAINTRECT.height - SOURCERECT.height) / 2,
        y = 0;
    while (y < SOURCERECT.height) {
        var x = 0;
        while (x < SOURCERECT.width) {
            var tile = new Tile();
            tile.videoX = x;
            tile.videoY = y;
            tile.originX = offsetX + x;
            tile.originY = offsetY + y;
            tile.currentX = tile.originX;
            tile.currentY = tile.originY;
            tiles.push(tile);
            x += TILE_WIDTH;
        }
        y += TILE_HEIGHT;
    }
}

processFrame = () => {
    if (!isNaN(video.duration)) {
        if (SOURCERECT.width == 0) {
            SOURCERECT = {
                x: 0,
                y: 0,
                width: video.videoWidth,
                height: video.videoHeight
            };
            createTiles();
        }
        if (video.currentTime == video.duration) {
            video.currentTime = 0;
        }
    }
    var debugStr = "";
    //copy tiles
    copy.drawImage(video, 0, 0);
    draw.clearRect(PAINTRECT.x, PAINTRECT.y, PAINTRECT.width, PAINTRECT.height);

    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile.force > 0.0001) {
            //expand
            tile.moveX *= tile.force;
            tile.moveY *= tile.force;
            tile.moveRotation *= tile.force;
            tile.currentX += tile.moveX;
            tile.currentY += tile.moveY;
            tile.rotation += tile.moveRotation;
            tile.rotation %= 360;
            tile.force *= 0.9;
            if (tile.currentX <= 0 || tile.currentX >= PAINTRECT.width) {
                tile.moveX *= -1;
            }
            if (tile.currentY <= 0 || tile.currentY >= PAINTRECT.height) {
                tile.moveY *= -1;
            }
        } else if (tile.rotation != 0 || tile.currentX != tile.originX || tile.currentY != tile.originY) {
            //contract
            var diffx = (tile.originX - tile.currentX) * 0.2,
                diffy = (tile.originY - tile.currentY) * 0.2,
                diffRot = (0 - tile.rotation) * 0.2

            if (Math.abs(diffx) < 0.5) {
                tile.currentX = tile.originX;
            } else {
                tile.currentX += diffx;
            }
            if (Math.abs(diffy) < 0.5) {
                tile.currentY = tile.originY;
            } else {
                tile.currentY += diffy;
            }
            if (Math.abs(diffRot) < 0.5) {
                tile.rotation = 0;
            } else {
                tile.rotation += diffRot;
            }
        } else {
            tile.force = 0;
        }
        draw.save();
        draw.translate(tile.currentX, tile.currentY);
        draw.rotate(tile.rotation * RAD);
        draw.drawImage(copycanvas, tile.videoX, tile.videoY, TILE_WIDTH, TILE_HEIGHT, -TILE_CENTER_WIDTH, -TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        draw.restore();
    }
    if (debug) {
        debug = false;
        document.getElementById('trace').innerHTML = debugStr;
    }
}

explode = (x, y) => {
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i],
            xdiff = tile.currentX - x,
            ydiff = tile.currentY - y,
            dist = Math.sqrt(xdiff * xdiff + ydiff * ydiff)

        var randRange = 220 + (Math.random() * 30),
            range = randRange - dist,
            force = 3 * (range / randRange)
        if (force > tile.force) {
            tile.force = force;
            var radians = Math.atan2(ydiff, xdiff);
            tile.moveX = Math.cos(radians);
            tile.moveY = Math.sin(radians);
            tile.moveRotation = 0.5 - Math.random();
        }
    }
    tiles.sort(zindexSort);
    processFrame();
}

zindexSort = (a, b) => {
    return (a.force - b.force);
}

dropBomb = (evt, obj) => {
    var posx = 0;
    var posy = 0;
    var e = evt || window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var canvasX = posx - obj.offsetLeft;
    var canvasY = posy - obj.offsetTop;
    explode(canvasX, canvasY);
}

function Tile() {
    this.originX = 0;
    this.originY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.force = 0;
    this.z = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.moveRotation = 0;
    this.videoX = 0;
    this.videoY = 0;
}
/*
    getPixel
    return pixel object {r,g,b,a}
*/
getPixel = (imageData, x, y) => {
    var data = imageData.data;
    var pos = (x + y * imageData.width) * 4;
    return {
        r: data[pos],
        g: data[pos + 1],
        b: data[pos + 2],
        a: data[pos + 3]
    }
}
/*
    setPixel
    set pixel object {r,g,b,a}
*/
setPixel = (imageData, x, y, pixel) => {
    var data = imageData.data;
    var pos = (x + y * imageData.width) * 4;
    data[pos] = pixel.r;
    data[pos + 1] = pixel.g;
    data[pos + 2] = pixel.b;
    data[pos + 3] = pixel.a;
}
/*
    copyPixel
    faster then using getPixel/setPixel combo
*/
copyPixel = (sImageData, sx, sy, dImageData, dx, dy) => {
    var spos = (sx + sy * sImageData.width) * 4;
    var dpos = (dx + dy * dImageData.width) * 4;
    dImageData.data[dpos] = sImageData.data[spos]; //R
    dImageData.data[dpos + 1] = sImageData.data[spos + 1]; //G
    dImageData.data[dpos + 2] = sImageData.data[spos + 2]; //B
    dImageData.data[dpos + 3] = sImageData.data[spos + 3]; //A
}

export default class VideoDetail extends React.Component {
    componentDidMount() {
      init()
    }
    render() {
      const video = this.props.video
  
      if(!video) {
        return <div>loading...</div>
    }
    const videoWidth = video['images']
    const videoHeight = video.images
    const gifUrl = `https://i.giphy.com/media/${video.id}/giphy.mp4`
      return (
        <div className="">
  
        <div className="canvas-div">
            <div className="copies">
                <video id="sourcevid" autoPlay="true" loop="false" width="800" height="500" >
                    <source src={gifUrl} />
                </video>
                <canvas id="sourcecopy" width="800" height="500"
                ></canvas>
            </div>
            <div id="canvas-focus">
                <center><canvas id="output" width="1000" height="600" onMouseDown={(event) => dropBomb(event, event.target)} className="canvas"></canvas></center>
            </div>
        </div>
        </div>
      )
    }
  
  }