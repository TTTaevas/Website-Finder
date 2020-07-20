import sys
import random
import datetime
import urllib.request

def main_loop():
	json_object = []
	for i in range(times):
		url = url_generator(domains, log)
		try:
			response = urllib.request.urlopen(url)
			print(url + " exists!")
			json_object.append('{"website_url":"' + url + '","response_type":"SUCCESS","response_code":"' + str(response.getcode()) + '","response_details":"Server seems to be ' + str(response.info()["Server"]) + '"}')
		except Exception as e:
			if "[Errno 11001]" in str(e): continue
			print(url + " exists!")
			err_code = str(e)[str(e).index("[") + 1:str(e).index("]")] if "[" in str(e) and "]" in str(e) else "NONE FOUND"
			json_object.append('{"website_url":"' + url + '","response_type":"ERROR","response_code":"' + err_code + '","response_details":"' + str(e).replace("\\", "") + '"}')

	f.write(str(json_object).replace("'", ""))
	f.close()
	print("Finished at " + str(datetime.datetime.now().time())[0:5].replace(":", "h") + "m")

def url_generator(domains, log):
	result = mode[random.randint(0, len(mode) - 1)] + "://"
	characters = "abcdefghijklmnopqrstuvwxyz0123456789"
	url_length = random.randint(2, 30)
	result += ''.join(random.choice(characters) for i in range(url_length))
	result += domains[random.randint(0, len(domains) - 1)]
	if log: print(result)
	return result

times = sys.argv[sys.argv.index('-t') + 1] if '-t' in sys.argv else 3000
try:
	times = int(times)
except:
	print("-t argument expected a number!")
	sys.exit()
domains = sys.argv[sys.argv.index('-d') + 1] if '-d' in sys.argv else ['.co', '.com', '.net', '.edu', '.gov', '.cn', '.org', '.cc']
mode = sys.argv[sys.argv.index('-m') + 1].split(",") if '-m' in sys.argv else ['http']
log = '-l' in sys.argv

print("\nI am going to look for images through " + str(times) + " random URLs with the following domains: " + str(domains))
print("These URLs use the following protocols: " + str(mode))
print("Started at " + str(datetime.datetime.now().time())[0:5].replace(":", "h") + "m")

f = open("PY_report_" + str(datetime.datetime.now().strftime("%d%H%M")) + ".json", "a+")
main_loop()
