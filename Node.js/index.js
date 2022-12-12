const https = require('https')
const http = require('http')
const fs = require('fs')

async function main_loop() {
	json_object = []
	for (let i = 0; i < times; i++) {
		const url = url_generator(i, times)
		try {
			const response = await fetch(url)
			console.log(`${url} exists!`)
			json_object.push(`{"website_url":"${url}","response_type":"SUCCESS","response_code":"${response.statusCode}","response_details":"${response.statusMessage}"}`)
		}
		catch(e) {
			if (e.code != 'ENOTFOUND') {
				console.log(`${url} exists!`)
				json_object.push(`{"website_url":"${url}","response_type":"ERROR","response_code":"${e.code}","response_details":"${e.syscall}"}`)
			}
		}
	}
	fs.appendFile(report_file, '[' + String(json_object) + ']', function(err) {if (err) throw err})
	console.log('\nFinished at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm')
}

function url_generator(num_url, times) {
	let result = protocols[Math.round(Math.random() * (protocols.length - 1))] + "://"
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
	const url_length = Math.floor(Math.random() * (maxi - mini) + mini)
	for (let i = 0; i < url_length; i++) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
	result += `.${domains[Math.floor(Math.random() * domains.length)]}`
	if (Math.floor(Math.random() * (100 - 1) + 1) <= second) result += `.${domains[Math.floor(Math.random() * domains.length)]}`
	if (log) console.log(`${result} (${num_url + 1}/${times})`)
	return result
}

function fetch(url, options = {}) {
	return new Promise((resolve, reject) => {
		const client = url.startsWith('https') ? https : http
		const request = client.request(url, {method: "GET"}, (res) => {
			res.setEncoding('utf8')
			res.on('data', () => {}) // Do nothing, deleting this line actually makes the software exit upon finding a website (wtf)
			res.on('end', () => {resolve({statusCode: res.statusCode, statusMessage: res.statusMessage})})
		})
		request.on('error', (err) => {reject(err)})
		request.end()
	})
}

const defaults = require("../defaults.json")
const times = process.argv.indexOf('-t') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-t') + 1])) : defaults.times
const protocols = process.argv.indexOf('-p') > -1 ? process.argv[process.argv.indexOf('-p') + 1].split(',') : defaults.protocols
const domains = process.argv.indexOf('-d') > -1 ? process.argv[process.argv.indexOf('-d') + 1].split(',') : defaults.domains
const second = process.argv.indexOf('-s') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-s') + 1])) : defaults.second
const log = process.argv.indexOf('-l') > -1 ? true : defaults.log
const mini = process.argv.indexOf('-min') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-min') + 1])) : defaults.min
const maxi = process.argv.indexOf('-max') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-max') + 1])) : defaults.max

const date = new Date()
process.stdout.write(`\nI am going to look for websites through ${times} random URLs (min length ${mini} and max length ${maxi}) with the following domains: `)
console.log(domains)
process.stdout.write("These URLs will use the protocols ")
console.log(protocols)
console.log(`and each of them have ${second} in a 100 chance to have a second level domain`)
console.log("Started at %dh%dm\n", date.getHours(), date.getMinutes())

const report_file = "JS_report_" + String(date.getUTCDate()) + String(date.getHours()) + String(date.getMinutes()) + ".json"
fs.open(report_file, "w", function(err) {if (err) throw err})
main_loop()
