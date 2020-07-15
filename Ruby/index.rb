require 'net/http'

def main_loop
	TIMES.times do
		url = url_generator(DOMAINS, MODE)
		puts(url) if LOG
		begin
			response = Net::HTTP.get_response(URI(url))
			puts("#{url} exists!")
			File.open("RB_report.txt", 'a+') {|f| f.write("\n#{url} | STATUS_CODE: #{response.code} | DETAILS: #{response.message}")}
		rescue Exception => e # Unlike JS/PY, the number of existing websites that raise exceptions is small
			if e.class != SocketError
				puts("#{url} exists!")
				File.open("RB_report.txt", 'a+') {|f| f.write("\n#{url} | ERROR_CODE: #{e.class.to_s} | DETAILS: #{e.to_s}")}
			end
		end
	end
	File.open("RB_report.txt", 'a+') {|f| f.write("\n---\n")}
	puts("Finished at #{Time.new.hour}h#{Time.new.min}m\n")
end

def url_generator(domains, mode)
	result = mode[rand(0..mode.length - 1)] + '://'
	url_length = rand(2..30)
	result += rand(36 ** url_length).to_s(36)
	result += domains[rand(0..domains.length - 1)]
end

TIMES = ARGV.include?('-t') ? ARGV[ARGV.index("-t") + 1].to_i : 3000
DOMAINS = ARGV.include?('-d') ? ARGV[ARGV.index("-d") + 1].split(",") : ['.com', '.net', '.edu', '.gov', '.cn', '.org']
MODE = ARGV.include?('-m') ? ARGV[ARGV.index("-m") + 1].split(",") : ['http']
LOG = ARGV.index("-l").class == Integer

puts("\nI am going to look for images through #{TIMES} random URLs with the following domains: #{DOMAINS}")
puts("These URLs will use the following protocols: #{MODE}")
puts("Started at #{Time.new.hour}h#{Time.new.min}m\n")

File.open("RB_report.txt", 'a+') {|f| f.write("---")}
main_loop
