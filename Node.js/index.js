const https = require('https')
const http = require('http')
const fs = require('fs')

async function main_loop() {
	json_object = []
	for (let i = 0; i < times; i++) {
		const url = await url_generator(domains, mode, log)
		try {
			const response = await fetch(url)
			console.log(`${url} exists!`)
			json_object.push(`{"website_url":"${url}","response_type":"SUCCESS","response_code":"${String(response.statusCode)}","response_details":"${String(response.statusMessage)}"}`)
		}
		catch(e) {
			if (e.errno != 'ENOTFOUND') {
				console.log(`${url} exists!`)
				json_object.push(`{"website_url":"${url}","response_type":"ERROR","response_code":"${String(e.errno)}","response_details":"${String(e.syscall)}"}`)
			}
		}
	}
	fs.appendFile(report_file, '[' + String(json_object) + ']', function(err) {if (err) throw err})
	console.log('\nFinished at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm')
}

function url_generator(domains, mode, log) {
	let result = mode[Math.round(Math.random() * (mode.length - 1))] + "://"
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
	const url_length = Math.floor(Math.random() * (30 - 2) + 2)
	for (let i = 0; i < url_length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	result += domains[Math.floor(Math.random() * domains.length)]
	if (log) console.log(result)
	return result
}

function fetch(url, options = {}) {
	return new Promise((resolve, reject) => {
		if (!url) return reject(new Error('URL was not provided')) //Cannot happen, line may end up getting removed

		const {body, method = 'GET', ...restOptions} = options
		const client = url.startsWith('https') ? https : http
		const request = client.request(url, {method, ...restOptions}, (res) => {
			res.setEncoding('utf8')
			let chunks = ''
			res.on('data', (chunk) => {
				chunks += chunk
			})
			res.on('end', () => {
				resolve({statusCode: res.statusCode, statusMessage: res.statusMessage})
			})
		})
		request.on('error', (err) => {
			reject(err)
		})
		request.end()
	})
}

const times = process.argv.indexOf('-t') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-t') + 1])) : 3000
if (isNaN(times)) return console.error("-t argument expected a number!")
const domains = process.argv.indexOf('-d') > -1 ? process.argv[process.argv.indexOf('-d') + 1].split(',') : ['.co', '.com', '.net', '.edu', '.gov', '.cn', '.org', '.cc']
const mode = process.argv.indexOf('-m') > -1 ? process.argv[process.argv.indexOf('-m') + 1].split(',') : ['http']
const log = process.argv.indexOf('-l') > -1

const report_file = "JS_report_" + String(new Date().getUTCDate()) + String(new Date().getHours()) + String(new Date().getMinutes()) + ".json"

process.stdout.write(`\nI am going to look for images through ${times} random URLs with the following domains: `)
console.log(domains)
process.stdout.write("These URLs will use the following protocols: ")
console.log(mode)
console.log('Started at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm\n')

fs.open(report_file, "w", function(err) {if (err) throw err})
main_loop()
