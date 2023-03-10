import platformUrl from '../img/platform.png'
import hillsUrl from '../img/hills.png'
import backgroundUrl from '../img/background.png'
import platformSmallTallUrl from '../img/platformSmallTall.png'

import spriteRunLeftUrl from '../img/spriteRunLeft.png'
import spriteRunRightUrl from '../img/spriteRunRight.png'
import spriteStandLeftUrl from '../img/spriteStandLeft.png'
import spriteStandRightUrl from '../img/spriteStandRight.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.5
const jump = 20
canvas.width = 1024
canvas.height = 576

function createImage(url) {
  const image = new Image()
  image.src = url
  return image
}

const platformImage = createImage(platformUrl)
const platformSmallTallImage = createImage(platformSmallTallUrl)
const spriteStandRightImage = createImage(spriteStandRightUrl)
const spriteStandLeftImage = createImage(spriteStandLeftUrl)
const spriteRunRightImage = createImage(spriteRunRightUrl)
const spriteRunLeftImage = createImage(spriteRunLeftUrl)

class Player {
  constructor() {
    this.speed = 10
    this.position = {
      x: 100,
      y: 100
    }
    this.velocity = {
      x: 0,
      y: 1
    }
    this.width = 66
    this.height = 150
    this.image = spriteStandRightImage
    this.frames = 0
    this.sprites = {
      stand: {
        right: {
          image: spriteStandRightImage,
          cropWidth: 177,
          width: 66
        },
        left: {
          image: spriteStandLeftImage,
          cropWidth: 177,
          width: 66
        },
      },
      run: {
        right: {
          image: spriteRunRightImage,
          cropWidth: 341,
          width: 127.875
        },
        left: {
          image: spriteRunLeftImage,
          cropWidth: 341,
          width: 127.875
        },
      }
    }
    this.currentSprite = this.sprites.stand.right
  }

  draw() {
    c.drawImage(
      this.currentSprite.image,
      this.currentSprite.cropWidth * this.frames,
      0,
      this.currentSprite.cropWidth,
      400,
      this.position.x,
      this.position.y,
      this.currentSprite.width,
      this.height
    )
  }

  update() {
    this.frames++
    if (
      this.frames > 59 && (
        this.currentSprite.image === this.sprites.stand.right.image ||
        this.currentSprite.image === this.sprites.stand.left.image
      )
    ) {
      this.frames = 0
    } else if (
      this.frames > 29 && (
        this.currentSprite.image === this.sprites.run.right.image || 
        this.currentSprite.image === this.sprites.run.left.image
      )
    ) {
      this.frames = 0
    }
    this.draw()
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

let player = new Player()
let platforms = []
let genericObjects = []
let scrollOffset = 0
let lastKey;

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  },
}

function init() {
  player = new Player()
  platforms = [
    new Platform({
      x: platformImage.width * 4 + 300 -2 + platformImage.width - platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage
    }),
    new Platform({
      x: -1,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width -3,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 4 + 300 -2,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 5 + 700 -2,
      y: 470,
      image: platformImage
    }),
    
  ]
  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(backgroundUrl)
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hillsUrl)
    }),
  ]
  scrollOffset = 0
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)
  
  genericObjects.forEach( genericObject => {
    genericObject.draw()
  })

  platforms.forEach( platform => {
    platform.draw()
  })
  player.update()

  if (
    keys.right.pressed &&
    player.position.x < 400
  ) {
    player.velocity.x = player.speed
  } else if (
    (
      keys.left.pressed &&
      player.position.x > 100
      ) || (
      keys.left.pressed &&
      scrollOffset === 0 &&
      player.position.x > 0
    )
  ) {
    player.velocity.x = -player.speed
  } else {
    player.velocity.x = 0
    if (keys.right.pressed) {
      scrollOffset += player.speed
      platforms.forEach( platform => {
        platform.position.x -= player.speed
      })
      genericObjects.forEach( genericObject => {
        genericObject.position.x -= player.speed * 0.66
      })
    } else if (
      keys.left.pressed &&
      scrollOffset > 0
    ) {
      scrollOffset -= player.speed
      platforms.forEach( platform => {
        platform.position.x += player.speed
      })
      genericObjects.forEach( genericObject => {
        genericObject.position.x += player.speed * 0.66
      })
    }
  }

  /* if (
    keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite.image !== player.sprites.run.right.image
  ) {
    player.frames = 1
    player.currentSprite = player.sprites.run.right
  } else if (
    keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite.image !== player.sprites.run.left.image
  ) {
    player.frames = 1
    player.currentSprite = player.sprites.run.left
  } else if (
    !keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite.image !== player.sprites.stand.right.image
  ) {
    // player.frames = 1
    player.currentSprite = player.sprites.stand.right
  } else if (
    !keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite.image !== player.sprites.stand.left.image
  ) {
    // player.frames = 1
    player.currentSprite = player.sprites.stand.left
  } */

  if (lastKey === 'right') {
    if (
      keys.right.pressed &&
      player.currentSprite.image !== player.sprites.run.right.image
    ) {
      player.frames = 1
      player.currentSprite = player.sprites.run.right
    } else if(
      !keys.right.pressed &&
      player.currentSprite.image !== player.sprites.stand.right.image
    ) {
      player.currentSprite = player.sprites.stand.right
    }
  } else if (lastKey === 'left') {
    if (
      keys.left.pressed &&
      player.currentSprite.image !== player.sprites.run.left.image
      ) {
      player.frames = 1
      player.currentSprite = player.sprites.run.left
    } else if(
      !keys.left.pressed &&
      player.currentSprite.image !== player.sprites.stand.left.image
    ) {
      player.currentSprite = player.sprites.stand.left
    }
  }


  if (scrollOffset > platformImage.width * 5 + 300 -2) {
    // win
  }

  if (player.position.y > canvas.height) {
    init()
  }

  // platform collision detecting
  platforms.forEach( platform => {
    if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x && 
        player.position.x  <= platform.position.x + platform.width
      ) {
      player.velocity.y = 0
    }
  })
}
init()
animate()

addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 38:
      // up
      player.velocity.y -= jump
      break;

    case 40:
      // down
      break;

    case 37:
      // left
      keys.left.pressed = true
      lastKey = 'left'
      break;
    case 39:
      // right
      keys.right.pressed = true
      lastKey = 'right'
      break;

    default:
      break;
  }
})

addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 38:
      // up
      break;

    case 40:
      // down
      break;

    case 37:
      // left
      keys.left.pressed = false
      // player.currentSprite = player.sprites.stand.left
      break;
    case 39:
      // right
      keys.right.pressed = false
      // player.currentSprite = player.sprites.stand.right
      break;

    default:
      break;
  }
})