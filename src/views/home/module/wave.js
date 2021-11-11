//波浪特效
function waveEffect (className) {
  var waveCanvases = [],
    counter = 0

  function init (wrap) {
    for (var can of wrap.querySelectorAll('canvas')) {
      waveCanvases.push(new WaveCanvas(can))
    }
  }

  function update () {
    for (var c of waveCanvases) {
      var self = c
      self.contxt.fillStyle = '#fff'
      self.contxt.globalCompositeOperation = 'source-over'
      self.contxt.fillRect(0, 0, self.cvs.width, self.cvs.height)
      self.contxt.globalCompositeOperation = 'vivid-light'
      for (var i = 0; i < self.waves.length; i++) {
        self.waves[i].bounce()
        self.waves[i].drawWave()
      }
      self.contxt.fillStyle = '#fff'
    }
    requestAnimationFrame(update)
  }

  function WaveCanvas (canvas) {
    this.cvs = canvas
    this.contxt = this.cvs.getContext('2d')
    this.wrap = this.cvs.parentNode
    this.nodes = Math.floor(Math.random() * (7 - 5)) + 5
    this.waves = []
    this.waveHeight = Math.floor(Math.random() * (140 - 110)) + 110
    this.colour = '#4fc3f720'

    resizeCanvas(this.cvs)

    for (var i = 0; i < Math.floor(Math.random() * (3 - 2)) + 2; i++) {
      this.waves.push(
        new Wave(this.cvs, this.waveHeight, this.colour, 1, this.nodes)
      )
    }
  }

  function Wave (cvs, waveh, colour, lambda, nodes) {
    this.canvs = cvs
    this.ctx = this.canvs.getContext('2d')
    this.highTide = this.canvs.classList.contains('high-tide');
    this.waveh = waveh
    this.colour = colour
    this.lambda = lambda
    this.nodes = []

    for (var i = 0; i <= nodes + 2; i++) {
      var temp = [
        ((i - 1) * this.canvs.width) / nodes,
        0,
        Math.random() * 200,
        0.1
      ]
      this.nodes.push(temp)
    }
  }

  Wave.prototype.bounce = function () {
    var self = this,
      nodeArr = self.nodes,
      tide = this.highTide ? this.canvs.height*.6 - this.waveh : this.canvs.height - this.waveh;

    for (var j = 0; j < nodeArr.length; j++) {
      nodeArr[j][1] =
        (this.waveh / 2) * Math.sin(nodeArr[j][2] / 20) +
        tide
      nodeArr[j][2] = nodeArr[j][2] + nodeArr[j][3]
    }
  }

  Wave.prototype.drawWave = function () {
    var diff = function (a, b) {
      return (b - a) / 2 + a
    }
    var self = this

    self.ctx.fillStyle = this.colour
    self.ctx.beginPath()
    self.ctx.moveTo(0, self.canvs.height)
    self.ctx.lineTo(self.nodes[0][0], self.nodes[0][1])

    for (var i = 0; i < self.nodes.length; i++) {
      if (self.nodes[i + 1]) {
        self.ctx.quadraticCurveTo(
          self.nodes[i][0],
          self.nodes[i][1],
          diff(self.nodes[i][0], self.nodes[i + 1][0]),
          diff(self.nodes[i][1], self.nodes[i + 1][1])
        )
      } else {
        self.ctx.lineTo(self.nodes[i][0], self.nodes[i][1])
        self.ctx.lineTo(self.canvs.width, self.canvs.height)
      }
    }
    self.ctx.closePath()
    self.ctx.fill()
  }

  function resizeCanvas (canvas, width, height) {
    if (width && height) {
      canvas.width = width
      canvas.height = height
    } else {
      if (window.innerWidth > 1920) {
        canvas.width = window.innerWidth
      } else {
        canvas.width = 1920
      }

      canvas.height = canvas.parentNode.offsetHeight/2
    }
  }

  for (var wcw of document.querySelectorAll(className)) {
    init(wcw)
  }
  update()
}

export default waveEffect
