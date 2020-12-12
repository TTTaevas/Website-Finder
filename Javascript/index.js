function findWebsites() {

	async function main_loop() {
		for (let i = 0; i < times; i++) {
			count.innerHTML = `COUNT: ${i+1}/${times}`
			const url = await url_generator()
			url_show.innerHTML = `CHECKING: ${url}`
			try {
				const response = await fetch(url, {mode: "no-cors"})
				let li = document.createElement("LI")
				let a = document.createElement("A")
				a.innerHTML = url
				a.href = url
				li.appendChild(a)
				list.appendChild(li)
			}
			catch (e) {
				let a = 0
			}
		}

		console.log('\nFinished at ' + String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm')
		status.innerHTML = "STATUS: STOPPED"
	}

	function url_generator() {
		let result = mode[Math.round(Math.random() * (mode.length - 1))] + "://"
		const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
		const url_length = Math.floor(Math.random() * (maxi - mini) + mini)
		for (let i = 0; i < url_length; i++) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
		result += domains[Math.floor(Math.random() * domains.length)]
		if (Math.floor(Math.random() * (100 - 1) + 1) <= second) result += domains[Math.floor(Math.random() * domains.length)]
		return result
	}

	const times = document.getElementById("times").value ? Math.round(Number(document.getElementById("times").value)) : 3000
	const domains = document.getElementById("domains").value ? document.getElementById("domains").value.split(", ") : ['.co', '.com', '.net', '.edu', '.gov', '.cn', '.org', '.cc', '.us', '.mil', '.ac', '.it', '.de']
	const second = document.getElementById("second").value ? Math.round(Number(document.getElementById("second").value)) : 1
	const mode = document.getElementById("mode").value ? document.getElementById("mode").value.split(", ") : ['https']
	const mini = document.getElementById("mini").value ? Math.round(Number(document.getElementById("mini").value)) : 2
	const maxi = document.getElementById("maxi").value ? Math.round(Number(document.getElementById("maxi").value)) : 50

	const list = document.getElementsByTagName("UL")[0]
	const status = document.getElementsByTagName("P")[0]
	const count = document.getElementsByTagName("P")[1]
	const url_show = document.getElementsByTagName("P")[2]

	console.log('Started at', String(new Date().getHours()) + 'h' + String(new Date().getMinutes()) + 'm\n')
	console.log('Number of URLs being checked:', times)
	console.log('Domains used in URLs:', domains)
	console.log('How many URLs out of 100 will feature two domains:', second)
	console.log('Application protocols used by URLs:', mode)
	console.log('Minimum length of URLs:', mini)
	console.log('Maximum length of URLs:', maxi)


	status.innerHTML = "STATUS: ACTIVE"

	main_loop()

}
