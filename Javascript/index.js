function findWebsites() {

	async function main_loop() {
		for (let i = 0; i < times; i++) {
			count.innerHTML = `COUNT: ${i+1}/${times}`
			const url = url_generator()
			url_show.innerHTML = `CHECKING: ${url}`
			
			try {
				const response = await fetch(url, {mode: "no-cors"})
				let li = document.createElement("LI")
				let a = document.createElement("A")
				a.innerHTML = url
				a.href = url
				li.appendChild(a)
				list.appendChild(li)
				audio.play()
			}
			catch (e) {} // No server for this URL
		}

		console.log('\nFinished at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm')
		status.innerHTML = "STATUS: STOPPED"
		document.getElementById("btn").disabled = false
	}

	function url_generator() {
		let result = protocols[Math.round(Math.random() * (protocols.length - 1))] + "://"
		const url_length = Math.floor(Math.random() * (max - min) + min)
		const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
		for (let i = 0; i < url_length; i++) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
		result += `.${domains[Math.floor(Math.random() * domains.length)]}`
		if (Math.floor(Math.random() * (100 - 1) + 1) <= second) result += domains[Math.floor(Math.random() * domains.length)]
		return result
	}

	const audio = new Audio("found.mp3")

	const times = document.getElementById("times").value ? Math.round(Number(document.getElementById("times").value)) : 2000
	const protocols = document.getElementById("protocols").value ? document.getElementById("protocols").value.split(", ") : ['https']
	const domains = document.getElementById("domains").value ? document.getElementById("domains").value.split(", ") : ["com", "org", "net", "tk", "cn", "de", "ru", "uk", "nl", "ca", "au", "in", "ir", "tv", "live", "gov", "edu"]
	const second = document.getElementById("second").value ? Math.round(Number(document.getElementById("second").value)) : 0
	const min = document.getElementById("min").value ? Math.round(Number(document.getElementById("min").value)) : 2
	const max = document.getElementById("max").value ? Math.round(Number(document.getElementById("max").value)) : 15

	const list = document.getElementsByTagName("UL")[0]
	const status = document.getElementsByTagName("P")[0]
	const count = document.getElementsByTagName("P")[1]
	const url_show = document.getElementsByTagName("P")[2]

	console.log('Started at', String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm\n')
	console.log('Number of URLs being checked:', times)
	console.log('Domains used in URLs:', domains)
	console.log('How many URLs out of 100 will feature two domains:', second)
	console.log('Application protocols used by URLs:', protocols)
	console.log('Minimum length of URLs:', min)
	console.log('Maximum length of URLs:', max)


	status.innerHTML = "STATUS: ACTIVE"
	document.getElementById("btn").disabled = true

	main_loop()

}
