#!/usr/bin/env node
import * as fs from 'fs'
import Tesseract from 'tesseract.js'
import {ImgUtils} from './src/imgutils.mjs'
import {Screenshot} from './src/screenshot.mjs'
import {HttpServer, toClient} from './src/httpServer.mjs'

let settings = new Map()
const data = {
	img: Buffer.alloc(0),
	img_zoom: Buffer.alloc(0),
	text: '',
	number: '-1',
}
let client = {
	write: () => {
	},
}

const worker = Tesseract.createWorker({
	logger: m => console.log(m),
})

async function detect(imgBuf) {
	const {data: {text}} = await worker.recognize(imgBuf)
	toClient({client: client, data: text})
	data.text = text
	const num = /\d+\.0/.exec(text)?.[0] || '-1'
	
	data.number = parseInt(num, 10).toString()
	console.log(text, 'number', data.number)
}

async function takeScreenshot() {
	const screen = await Screenshot()
	if (screen.error) throw screen
	data.img = screen.buf
	
	//await fs.promises.writeFile('./output.png', screen.buf)
	
	const imgUtils = new ImgUtils(settings)
	const img = await imgUtils.zoom({src: screen.buf})
	data.img_zoom = img
	
	toClient({client, data: 'fetch imgs'})
	//await fs.promises.writeFile('./output-zoom.png', img)
	
	console.log('done')
	return img
}

function main(obj) {
	if (obj.type !== 'api') throw obj
	
	if (obj.action === 'get_settings') {
	}
	if (obj.action === 'set_settings') {
		settings = obj.data
		console.log('main set_settings', settings)
	}
	if (obj.action === 'event_client') {
		client = obj.data
		console.log('main set_settings', settings)
	}
	if (obj.action === 'take_screenshot') {
		console.log('take')
		takeScreenshot().then((i) => {
			console.log(i)
			detect(i).then(r => console.log('done detect'))
		}).catch(
			err => console.error(err))
	}
}

async function init() {
	const config = fs.promises.readFile('config.json')
		.then(i => JSON.parse(i.toString()))
		.catch(err => console.error)
	
	if (!config) {
		throw config
	}
	
	settings = new Map(Object.entries(await config))
	console.log(settings)
	
	const httpServer = HttpServer({
		port: settings.get('httpPort'),
		settings: settings,
		cb: main,
		data: data,
	})
	
	await worker.load()
	await worker.loadLanguage('eng')
	await worker.initialize('eng')
}

init()
