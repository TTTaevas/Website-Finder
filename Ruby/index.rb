require 'net/http'
require 'json'

def main_loop
	json_object = []
	TIMES.times do |i|
		url = url_generator()
		puts("#{url} (#{i + 1}/#{TIMES})") if LOG
		begin
			response = Net::HTTP.get_response(URI(url))
			puts("#{url} exists!")
			json_object << Hash["website_url" => url, "response_type" => "SUCCESS", "response_code" => response.code, "response_details" => response.message]
		rescue Exception => e # Unlike Node/PY, the number of existing websites that raise exceptions is small
			if e.class != SocketError
				puts("#{url} exists!")
				json_object << Hash["website_url" => url, "response_type" => "ERROR", "response_code" => e.class.to_s, "response_details" => e.to_s]
			end
		end
	end
	File.open(REPORT_FILE, 'a+') {|f| f << json_object.to_json} if json_object.any?
	puts("Finished at #{Time.new.hour}h#{Time.new.min}m\n")
end

def url_generator()
	result = PROTOCOLS[rand(0...PROTOCOLS.length)] + '://'
	url_length = rand(MIN..MAX)
	result += rand(36 ** url_length).to_s(36)
	result += "." + DOMAINS[rand(0...DOMAINS.length)] if rand(1...100) <= SECOND
	result += "." + DOMAINS[rand(0...DOMAINS.length)]
end

DEFAULTS = JSON.parse(File.read("../defaults.json"))
TIMES = ARGV.include?('-t') ? ARGV[ARGV.index('-t') + 1].to_i : DEFAULTS["times"]
PROTOCOLS = ARGV.include?('-p') ? ARGV[ARGV.index('-p') + 1].split(",") : DEFAULTS["protocols"]
DOMAINS = ARGV.include?('-d') ? ARGV[ARGV.index('-d') + 1].split(",") : DEFAULTS["domains"]
SECOND = ARGV.include?('-s') ? ARGV[ARGV.index('-s') + 1].to_i : DEFAULTS["second"]
LOG = ARGV.include?('-l') ? true : DEFAULTS["log"]
MIN = ARGV.include?('-min') ? ARGV[ARGV.index('-min') + 1].to_i : DEFAULTS["min"]
MAX = ARGV.include?('-max') ? ARGV[ARGV.index('-max') + 1].to_i : DEFAULTS["max"]

DATE = Time.new
puts("\nI am going to look for websites through #{TIMES} random URLs (min length #{MIN} and max length #{MAX}) with the following domains: #{DOMAINS}")
puts("These URLs will use the protocols #{PROTOCOLS} and each of those URLs have #{SECOND} in 100 chance to have a second level domain")
puts("Started at #{DATE.hour}h#{DATE.min}m\n")

REPORT_FILE = "RB_report_#{DATE.day}#{DATE.hour}#{DATE.min}.json"
File.open(REPORT_FILE, 'a+')
main_loop
