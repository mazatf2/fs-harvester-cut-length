import canvas from 'canvas'

export class ImgUtils {
	
	constructor(settings) {
		this.x = settings.get('x')
		this.y = settings.get('y')
		this.width = settings.get('width')
		this.height = settings.get('height')
		this.zoomFac = settings.get('zoom')
		this.size = {width: this.width * this.zoomFac, height: this.height * this.zoomFac}
		this.canvas = canvas.createCanvas(this.size.width, this.size.height)
		this.ctx = this.canvas.getContext('2d')
	}
	
	async zoom({src}) {
		const img = await canvas.loadImage(src)
		
		const crop = {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		}
		
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
		this.ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, this.size.width, this.size.height)
		
		return this.canvas.toBuffer()
	}
}
