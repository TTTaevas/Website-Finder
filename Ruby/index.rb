require 'net/http'
require 'json'

def main_loop
	json_object = []
	TIMES.times do
		url = url_generator()
		puts(url) if LOG
		begin
			response = Net::HTTP.get_response(URI(url))
			puts("#{url} exists!")
			json_object << Hash["website_url" => url, "response_type" => "SUCCESS", "response_code" => response.code, "response_details" => response.message]
		rescue Exception => e # Unlike JS/PY, the number of existing websites that raise exceptions is small
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
	result = MODE[rand(0...MODE.length)] + '://'
	url_length = rand(MINI..MAXI)
	result += rand(36 ** url_length).to_s(36)
	result += DOMAINS[rand(0...DOMAINS.length)] if rand(1...100) <= SECOND
	result += DOMAINS[rand(0...DOMAINS.length)]
end

TIMES = ARGV.include?('-t') ? ARGV[ARGV.index('-t') + 1].to_i : 3000
DOMAINS = ARGV.include?('-d') ? ARGV[ARGV.index('-d') + 1].split(",") : ['.co', '.com', '.net', '.edu', '.gov', '.cn', '.org', '.cc', '.us', '.mil', '.ac', '.it', '.de']
MODE = ARGV.include?('-m') ? ARGV[ARGV.index('-m') + 1].split(",") : ['http']
LOG = ARGV.index('-l').class == Integer
MINI = ARGV.include?('-MIN') ? ARGV[ARGV.index('-MIN') + 1].to_i : 2
MAXI = ARGV.include?('-MAX') ? ARGV[ARGV.index('-MAX') + 1].to_i : 50
SECOND = ARGV.include?('-s') ? ARGV[ARGV.index('-s') + 1].to_i : 1

REPORT_FILE = "RB_report_#{Time.new.day}#{Time.new.hour}#{Time.new.min}.json"

puts("\nI am going to look for websites through #{TIMES} random URLs (min length #{MINI} and max length #{MAXI}) with the following domains: #{DOMAINS}")
puts("These URLs will use the protocols #{MODE} and each of those URLs have #{SECOND} in 100 chance to have a second level domain.")
puts("Started at #{Time.new.hour}h#{Time.new.min}m\n")

File.open(REPORT_FILE, 'a+')
main_loop
