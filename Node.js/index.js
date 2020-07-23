const https = require('https')
const http = require('http')
const fs = require('fs')

async function main_loop() {
	json_object = []
	for (let i = 0; i < times; i++) {
		const url = await url_generator()
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

function url_generator() {
	let result = mode[Math.round(Math.random() * (mode.length - 1))] + "://"
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
	const url_length = Math.floor(Math.random() * (maxi - mini) + mini)
	for (let i = 0; i < url_length; i++) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
	result += domains[Math.floor(Math.random() * domains.length)]
	if (Math.floor(Math.random() * (100 - 1) + 1) <= second) result += domains[Math.floor(Math.random() * domains.length)]
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
			res.on('data', (chunk) => {}) //Do nothing, it must handle receiving data but we do not need the received data
			res.on('end', () => {resolve({statusCode: res.statusCode, statusMessage: res.statusMessage})})
		})
		request.on('error', (err) => {reject(err)})
		request.end()
	})
}

const times = process.argv.indexOf('-t') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-t') + 1])) : 3000
const domains = process.argv.indexOf('-d') > -1 ? process.argv[process.argv.indexOf('-d') + 1].split(',') : ['.co', '.com', '.net', '.edu', '.gov', '.cn', '.org', '.cc', '.us', '.mil', '.ac', '.it', '.de']
const mode = process.argv.indexOf('-m') > -1 ? process.argv[process.argv.indexOf('-m') + 1].split(',') : ['http']
const log = process.argv.indexOf('-l') > -1
const mini = process.argv.indexOf('-MIN') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-MIN') + 1])) : 2
const maxi = process.argv.indexOf('-MAX') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-MAX') + 1])) : 50
const second = process.argv.indexOf('-s') > -1 ? Math.round(Number(process.argv[process.argv.indexOf('-s') + 1])) : 1

const report_file = "JS_report_" + String(new Date().getUTCDate()) + String(new Date().getHours()) + String(new Date().getMinutes()) + ".json"

process.stdout.write(`\nI am going to look for websites through ${times} random URLs (min length ${mini} and max length ${maxi}) with the following domains: `)
console.log(domains)
process.stdout.write("These URLs will use the protocols ")
console.log(mode)
console.log(`and each of them have ${second} in a 100 chance to have a second level domain.`)
console.log('Started at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm\n')

fs.open(report_file, "w", function(err) {if (err) throw err})
main_loop()
