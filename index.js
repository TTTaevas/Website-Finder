const https = require('https')
const http = require('http')
const fs = require('fs')

async function main_loop() {
	for (let i = 0; i < times; i++) {
		const url = await url_generator(domains, mode, log)
		try {
			const result = await fetch(url)
			console.log(`${url} exists!`)
			fs.appendFile("JS_report.txt", "\n" + url + " | STATUS_CODE: " + String(result.statusCode), function(err) {if (err) throw err})
		}
		catch(e) {
			if (e.errno != 'ENOTFOUND') {
				console.log(`${url} exists!`)
				fs.appendFile("JS_report.txt", "\n" + url + " | ERROR_CODE: " + e.errno, function(err) {if (err) throw err})
			}
		}
	}
	fs.appendFile("JS_report.txt", "\n---\n", function(err) {if (err) throw err})
	console.log('\nFinished at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm')
}

function url_generator(domains, mode, log) {
	let result = mode + "://"
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
		if (!url) return reject(new Error('URL was not provided'))

		const { body, method = 'GET', ...restOptions } = options
		const client = url.startsWith('https') ? https : http
		const request = client.request(url, { method, ...restOptions }, (res) => {
			let chunks = ''
			res.setEncoding('utf8')
			res.on('data', (chunk) => {
				chunks += chunk
			})
			res.on('end', () => {
				resolve({ statusCode: res.statusCode, body: chunks })
			})
		})
		request.on('error', (err) => {
			reject(err)
		})
		if (body) {
			request.setHeader('Content-Length', body.length)
			request.write(body)
		}
		request.end()
	})
}

const times = process.argv.indexOf('-t') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-t') + 1])) : 3000
if (isNaN(times)) return console.error("-t argument expected a number!")
const domains = process.argv.indexOf('-d') > -1 ? process.argv[process.argv.indexOf('-d') + 1].split(',') : ['.com', '.net', '.edu', '.gov', '.cn', '.org']
const mode = process.argv.indexOf('-m') > -1 ? process.argv[process.argv.indexOf('-m') + 1] : "http"
if (!["http", "https"].includes(mode)) return console.error("-m argument expected either http or https!")
const log = process.argv.indexOf('-l') > -1

process.stdout.write(`I am going to look for images through ${times} random URLs with the following domains: `)
console.log(domains)
console.log('Started at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm\n')

fs.appendFile("JS_report.txt", "---", function(err) {if (err) throw err})
main_loop()
