import http from 'http'
import * as fs from 'fs'

export function toClient(
	{
		client = {
			write: () => {
			},
		},
		data = '',
	},
) {
	try {
		client.write(`data: ${data}\n\n`)
		console.log('write', data)
	} catch (err) {
		console.error(err)
	}
}

export async function HttpServer(
	{
		port = 3001,
		cb = (obj) => {
		},
		settings = new Map(),
		data = {img: Buffer.alloc(0), img_zoom: Buffer.alloc(0)},
	}) {
	const indexPage = await fs.promises.readFile('public/index.html')
	const transparentImg = await fs.promises.readFile('public/transparent.webp')
	
	const apiCb = (action, data = null) => cb({type: 'api', action: action, data: data})
	
	const requestListener = async function (req, res) {
		
		const html = () => {
			res.writeHead(200, {
					'Content-Type': 'text/html',
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					'Pragma': 'no-cache',
					'Expires': 0,
				},
			)
		}
		
		const png = () => {
			res.writeHead(200, {
					'Content-Type': 'image/png',
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					'Pragma': 'no-cache',
					'Expires': 0,
				},
			)
		}
		if (req.url === '/api/text') {
			html()
			return res.end(data.text)
		}
		if (req.url === '/api/number') {
			html()
			return res.end(data.number)
		}
		if (req.url === '/api/view_img.png') {
			png()
			return res.end(data.img)
		}
		if (req.url === '/api/view_img_zoom.png') {
			png()
			return res.end(data.img_zoom)
		}
		if (req.url === '/api/event_client') {
			res.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			})
			apiCb('event_client', res)
			return res.write('data: test\n\n')
		}
		if (req.url === '/api/get_settings') {
			html()
			const result = settings
			console.log(JSON.stringify([...result]))
			apiCb('get_settings')
			
			return res.end(JSON.stringify([...result]))
		}
		if (req.url.includes('/api/set_settings/')) {
			const data = req.url.split('/api/set_settings/')[1]
			settings = new Map(Object.entries(JSON.parse(decodeURI(data))))
			console.log('settings', settings)
			apiCb('set_settings', settings)
		}
		if (req.url === '/api/take_screenshot') {
			html()
			apiCb('take_screenshot')
			
			return res.end(`<h1>Hello</h1>`)
		}
		if (req.url === '/transparent.webp') {
			return res.end(transparentImg)
		}
		
		if (req.url === '/') {
			return res.end(indexPage)
		}
		
		return res.end('Hello, World!')
	}
	
	const server = http.createServer(requestListener)
	server.listen(port)
	console.log(`http://localhost:${port}`)
}

