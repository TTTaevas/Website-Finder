require "option_parser"
require "http"
require "uri"
require "json"

def main_loop(times, domains, protocols, log, min, max, second, report_file)
	json_text = JSON.build do |json|
		json.array do
			i = 0
			while i < times
				url = url_generator(domains, protocols, min, max, second)
				puts "#{url} (#{i + 1}/#{times})" if log
				client = HTTP::Client.new(URI.parse url)
				client.connect_timeout = 40.seconds
				begin
					response = client.get("/")
					puts "#{url} exists!"
					json.object do
						json.field "website_url", url
						json.field "response_type", "SUCCESS"
						json.field "response_code", "#{response.status_code}"
						json.field "response_details", HTTP::Status.new(response.status_code)
					end
				rescue e : Socket::Addrinfo::Error
					# Website essentially does not exist
				rescue err : Socket::Error | IO::TimeoutError
					# Website essentially does exist
					puts "#{url} exists!"
					json.object do
						json.field "website_url", url
						json.field "response_type", "ERROR"
						json.field "response_code", "UNKNOWN" # afaik no way to get a status code out of an exception
						json.field "response_details", err.message
					end
				ensure
					i += 1
				end
			end
		end
	end

	File.write(report_file, json_text)
	end_date = Time.local 
	puts "\nFinished at #{end_date.hour}h#{end_date.minute}m"
end

def url_generator(domains, protocols, min, max, second)
	result = String.build do |str|
		str << "#{protocols[Random.rand(protocols.size)]}://"
		url_length = Random.rand(min..max)
		characters = "abcdefghijklmnopqrstuvwxyz0123456789"
		i = 0
		while i < url_length
			str << characters[Random.rand(characters.size - 1)]	
			i += 1
		end
		str << ".#{domains[Random.rand(domains.size)]}" if Random.rand(1..100) <= second
		str << ".#{domains[Random.rand(domains.size)]}"
	end
	result
end

defaults = JSON.parse(File.read("../defaults.json"))
times = defaults["times"].as_i
protocols = defaults["protocols"].as_a
domains = defaults["domains"].as_a
second = defaults["second"].as_i
log = defaults["log"].as_bool
min = defaults["min"].as_i
max = defaults["max"].as_i

OptionParser.parse do |parser|
	parser.banner = "Website-Finder"
	parser.on "-h", "--help", "Show help" do 
		puts parser
		exit 
	end
	parser.on("-t TIMES", "--times=TIMES", "Number of requests / DEFAULT: #{times}") {|p_times| times = p_times.to_i}
	parser.on("-d DOMAINS", "--domains=DOMAINS", "Domains used in URLS, like: .com,.net,.gov / DEFAULT: #{domains}") {|p_domains| domains = p_domains.split(",")}
	parser.on("-p protocols", "--protocols=PROTOCOLS", "You may choose between: http | https | http,https / DEFAULT: #{protocols}") {|p_protocols| protocols = p_protocols.split(",")}
	parser.on("-l", "--log", "Log all requests / DEFAULT: #{log}") {log = true}
	parser.on("", "--min=LENGTH", "Minimum length of URLs / DEFAULT: #{min}") {|p_length| min = p_length.to_i}
	parser.on("", "--max=LENGTH", "Maximum length of URLs / DEFAULT: #{max}") {|p_length| max = p_length.to_i}
	parser.on("-s SECOND", "--second=SECOND", "Likelihood of a URL featuring a second-level domain / DEFAULT: #{second}") {|p_second| second = p_second.to_i}
end

date = Time.local
puts "\nI am going to look for websites through #{times} random URLs (min length #{min} and max length #{max} with the following domains: #{domains}"
puts "These URLs will use the protocols #{protocols}"
puts "and each of those URLs have #{second} in a 100 chance to have a second level domain"
puts "Started at #{date.hour}h#{date.minute}m\n"

report_file = "CR_report_#{date.day}#{date.hour}#{date.minute}.json"
main_loop(times, domains, protocols, log, min, max, second, report_file)
