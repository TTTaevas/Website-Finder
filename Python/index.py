import sys
import random
import datetime
import urllib.request

def main_loop():
	json_object = []
	for i in range(times):
		url = url_generator()
		try:
			response = urllib.request.urlopen(url)
			print(url + " exists!")
			json_object.append('{"website_url":"' + url + '","response_type":"SUCCESS","response_code":"' + str(response.getcode()) + '","response_details":"Server seems to be ' + str(response.info()["Server"]) + '"}')
		except Exception as e:
			if "[Errno 11001]" in str(e): continue
			print(url + " exists!")
			err_code = str(e)[str(e).index("[") + 1:str(e).index("]")] if "[" in str(e) and "]" in str(e) else "NO CODE FOUND"
			json_object.append('{"website_url":"' + url + '","response_type":"ERROR","response_code":"' + err_code + '","response_details":"' + str(e).replace("\\", "") + '"}')

	f.write(str(json_object).replace("'", "").replace("\\", ""))
	f.close()
	print("Finished at " + str(datetime.datetime.now().time())[0:5].replace(":", "h") + "m")

def url_generator():
	result = mode[random.randint(0, len(mode) - 1)] + "://"
	characters = "abcdefghijklmnopqrstuvwxyz0123456789"
	url_length = random.randint(mini, maxi)
	result += ''.join(random.choice(characters) for i in range(url_length))
	result += domains[random.randint(0, len(domains) - 1)]
	if random.randint(1, 100) <= second: result += domains[random.randint(0, len(domains) - 1)]
	if log: print(result)
	return result

times = int(sys.argv[sys.argv.index('-t') + 1]) if '-t' in sys.argv else 3000
domains = sys.argv[sys.argv.index('-d') + 1].split(",") if '-d' in sys.argv else ['.co', '.com', '.net', '.edu', '.gov', '.cn', '.org', '.cc', '.us', '.mil', '.ac', '.it', '.de']
mode = sys.argv[sys.argv.index('-m') + 1].split(",") if '-m' in sys.argv else ['http']
log = '-l' in sys.argv
mini = int(sys.argv[sys.argv.index('-MIN') + 1]) if '-MIN' in sys.argv else 2
maxi = int(sys.argv[sys.argv.index('-MAX') + 1]) if '-MAX' in sys.argv else 50 #Python cannot look for URLs longer than 50ish, so be careful!
second = int(sys.argv[sys.argv.index('-s') + 1]) if '-s' in sys.argv else 1

print("\nI am going to look for websites through " + str(times) + " random URLs (min length " + str(mini) + " and max length " + str(maxi) + ") with the following domains: " + str(domains))
print("These URLs will use the protocols " + str(mode) + " and each of those URLs have " + str(second) + " in 100 chance to have a second level domain.")
print("Started at " + str(datetime.datetime.now().time())[0:5].replace(":", "h") + "m\n")

f = open("PY_report_" + str(datetime.datetime.now().strftime("%d%H%M")) + ".json", "a+")
main_loop()
