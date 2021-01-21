import {spawn} from 'child_process'

export const Screenshot = () => {
	return new Promise((resolve, reject) => {
		
		const cmd = spawn('cmd.exe', ['/c', `src\\capture_screenshot_from_fs.bat`])
		const response = {buf: null, error: null}
		
		let data = []
		cmd.stdout.on('data', (chunk) => {
			data.push(chunk)
		})
		
		cmd.stdout.on('close', (chunk) => {
			const buf = Buffer.concat(data)
			console.log('Screenshot received, len', buf.length)
			response.buf = buf
			resolve(response)
		})
		
		cmd.stderr.on('data', (data) => {
			if (data.includes(`Can't find window 'Farming Simulator 19', aborting.`)) {
				response.error = `Can't find window`
				reject(response)
			}
			console.error(`stderr: ${data}`)
		})
		
		cmd.on('close', (code) => {
			console.log(`child process exited with code ${code}`)
		})
	})
}