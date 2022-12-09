require "option_parser"
require "http"
require "uri"
require "json"

def main_loop(times, domains, mode, log, mini, maxi, second, report_file)
	json_text = JSON.build do |json|
		json.array do
			i = 0
			while i < times
				url = url_generator(domains, mode, mini.as(UInt8), maxi.as(UInt8), second)
				puts "#{url} (#{i + 1}/#{times})" if log
				client = HTTP::Client.new(URI.parse url)
				client.connect_timeout = 40.seconds
				begin
					response = client.get("/")
					puts "#{url} exists!"
					json.object do
						json.field "website_url", url
						json.field "response_type", "SUCCESS"
						json.field "response_code", response.status_code
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

def url_generator(domains, mode, mini, maxi, second)
	result = String.build do |str|
		str << mode[Random.rand(mode.size)] + "://"
		url_length = Random.rand(mini..maxi)
		characters = "abcdefghijklmnopqrstuvwxyz0123456789"
		i = 0
		while i < url_length
			str << characters[Random.rand(characters.size - 1)]	
			i += 1
		end
		str << domains[Random.rand(domains.size)] if Random.rand(1..100) <= second
		str << domains[Random.rand(domains.size)]
	end
	puts result
	result
end

times = UInt32.new "3000"
domains = [".co", ".com", ".net", ".edu", ".gov", ".cn", ".org", ".cc", ".us", ".mil", ".ac", ".it", ".de"]
mode = ["http"]
log = false
mini = UInt8.new "3"
maxi = UInt8.new "50"
second = UInt8.new "1"

OptionParser.parse do |parser|
	parser.banner = "Website-Finder"
	parser.on "-h", "--help", "Show help" do 
		puts parser
		exit 
	end
	parser.on("-t TIMES", "--times=TIMES", "Number of requests / DEFAULT: #{times}") {|p_times| times = p_times.to_u32}
	parser.on("-d DOMAINS", "--domains=DOMAINS", "Domains used in URLS, like: .com,.net,.gov / DEFAULT: #{domains}") {|p_domains| domains = p_domains.split(",")}
	parser.on("-m MODE", "--modes=MODES", "You may choose between: http | https | http,https / DEFAULT: #{mode}") {|p_modes| mode = p_modes.split(",")}
	parser.on("-l", "--log", "Log all requests / DEFAULT: #{log}") {log = true}
	parser.on("", "--MIN=LENGTH", "Minimum length of URLs / DEFAULT: #{mini}") {|p_length| mini = p_length.to_u8}
	parser.on("", "--MAX=LENGTH", "Maximum length of URLs / DEFAULT: #{maxi}") {|p_length| maxi = p_length.to_u8}
	parser.on("-s SECOND", "--second=SECOND", "Likelihood of a URL featuring a second-level domain / DEFAULT: #{second}") {|p_second| second = p_second.to_u8}
end

date = Time.local
puts "\nI am going to look for websites through #{times} random URLs (min length #{mini} and max length #{maxi} with the following domains: #{domains}"
puts "These URLs will use the protocols #{mode}"
puts "and each of them have #{second} in a 100 chance to have a second level domain."
puts "Started at #{date.hour}h#{date.minute}m\n"

report_file = "CR_report_#{date.day}#{date.hour}#{date.minute}.json"
main_loop(times, domains, mode, log, mini, maxi, second, report_file)
