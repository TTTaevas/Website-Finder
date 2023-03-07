$(function() {
	$("#btn").click(findWebsites)
})

function findWebsites() {
	async function main_loop() {
		$("#actual_list").html("")
		$("#log_start").html(`Started at ${new Date().toLocaleTimeString()}`)
		$("#log_length").html(`Length of domains is ≥ ${min} and ≤ ${max}`)
		$("#log_protocols").html(`Protocols are ${String(protocols).replace(/,/g, ", ")}`)
		$("#log_tlds").html(`TLDs are ${String(domains.map((d) => "."+d)).replace(/,/g, ", ")}`)
		$("#status").slideDown()
		$("#finder").slideUp()
		$("#progress").addClass("in_progress")

		for (let i = 0; i < times; i++) {
			const url = url_generator()
			$("#log_count").html(`${i+1}/${times}`)
			$("#log_checking").html(`${url}`)
			
			const controller = new AbortController()
			const signal = controller.signal
			setTimeout(() => controller.abort(), 8000)
			await fetch(url, {mode: "no-cors", signal}).then((_response) => {
				let html = `<li>${new Date().toLocaleTimeString()}: <a href=${url} target="_blank" rel="noopener noreferrer">${url}</a></li>`
				$(html).hide().appendTo($("#actual_list")).slideDown()
				audio.play()
			}).catch((e) => {})
		}
		$("#finder").slideDown()
		$("#progress").removeClass("in_progress")

		console.log("\nFinished at " + String(new Date().toLocaleTimeString()))
		document.getElementById("btn").disabled = false
	}

	function url_generator() {
		let result = protocols[Math.round(Math.random() * (protocols.length - 1))] + "://"
		const url_length = Math.floor(Math.random() * (max - min) + min)
		const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
		for (let i = 0; i < url_length; i++) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
		result += `.${domains[Math.floor(Math.random() * domains.length)]}`
		if (Math.floor(Math.random() * (100 - 1) + 1) <= second) result += `.${domains[Math.floor(Math.random() * domains.length)]}`
		return result
	}

	const audio = new Audio("found.mp3")

	const times = $("#times").val() ? Math.round(Number($("#times").val())) : 2000
	const protocols = $("#protocols").val() ? $("#protocols").val().split(", ") : ["https"]
	const domains = $("#domains").val() ? $("#domains").val().split(", ") : ["com", "org", "net", "tk", "cn", "de", "ru", "uk", "nl", "ca", "au", "in", "ir", "tv", "live", "gov", "edu"]
	const second = $("#second").val() ? Math.round(Number($("#second").val())) : 0
	const min = $("#min").val() ? Math.round(Number($("#min").val())) : 2
	const max = $("#max").val() ? Math.round(Number($("#max").val())) : 15

	console.log("Started at", String(new Date().toLocaleTimeString()))
	console.log("Number of URLs being checked:", times)
	console.log("TLDs used in URLs:", domains)
	console.log("How many URLs out of 100 will feature two domains:", second)
	console.log("Application protocols used by URLs:", protocols)
	console.log("Minimum length of URLs:", min)
	console.log("Maximum length of URLs:", max)

	document.getElementById("btn").disabled = true
	main_loop()
}
