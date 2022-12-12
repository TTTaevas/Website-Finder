import sys
import random
import datetime
import requests
import json

from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def main_loop():
	json_object = []
	for i in range(times):
		url = url_generator(i, times)
		try:
			response = requests.get(url, verify=False, timeout=40)
			print(url + " exists!")
			json_object.append('{"website_url":"' + url + '","response_type":"SUCCESS","response_code":"' + str(response.status_code) + '","response_details":"' + str(response.reason) + '"}')
		except Exception as e: # Exception should always be ConnectionError (**usually** bad) or ReadTimeout (good)
			# Exception handling seems to be a pain because most errors return ConnectionError, so ConnectionError in itself can mean the website exists OR the website does NOT exist 
			err = str(e)
			if "not known" not in err.lower() and "no address" not in err.lower():
				print(url + " exists!")
				err_code = err[err.index("[")+1 : err.index("]")] if "[" in err and "]" in err else "NO CODE FOUND"
				json_object.append('{"website_url":"' + url + '","response_type":"ERROR","response_code":"' + err_code + '","response_details":"' + err.replace("\\", "").replace('"', "") + '"}')

	report_file.write(str(json_object).replace("'", "").replace("\\", ""))
	report_file.close()
	print("Finished at " + str(datetime.datetime.now().time())[0:5].replace(":", "h") + "m")

def url_generator(num_url, times):
	result = protocols[random.randint(0, len(protocols) - 1)] + "://"
	characters = "abcdefghijklmnopqrstuvwxyz0123456789"
	url_length = random.randint(min, max)
	result += ''.join(random.choice(characters) for i in range(url_length))
	result += f".{domains[random.randint(0, len(domains) - 1)]}"
	if random.randint(1, 100) <= second: result += ".%s"%(domains[random.randint(0, len(domains) - 1)])
	if log: print(result +  " (" + str(num_url + 1) + "/" + str(times) + ")")
	return result

defaults = json.load(open("../defaults.json", "rb"))
times = int(sys.argv[sys.argv.index('-t') + 1]) if '-t' in sys.argv else defaults["times"]
protocols = sys.argv[sys.argv.index('-p') + 1].split(",") if '-p' in sys.argv else defaults["protocols"]
domains = sys.argv[sys.argv.index('-d') + 1].split(",") if '-d' in sys.argv else defaults["domains"]
second = int(sys.argv[sys.argv.index('-s') + 1]) if '-s' in sys.argv else defaults["second"]
log = True if '-l' in sys.argv else defaults["log"]
# lmao what if we literally get rid of two built-in functions
min = int(sys.argv[sys.argv.index('-min') + 1]) if '-min' in sys.argv else defaults["min"]
max = int(sys.argv[sys.argv.index('-max') + 1]) if '-max' in sys.argv else defaults["max"] # Avoid >50

date = datetime.datetime.now()
print("\nI am going to look for websites through " + str(times) + " random URLs (min length " + str(min) + " and max length " + str(max) + ") with the following domains: " + str(domains))
print("These URLs will use the protocols " + str(protocols) + " and each of those URLs have " + str(second) + " in 100 chance to have a second level domain")
print("Started at " + str(date.time())[0:5].replace(":", "h") + "m\n")

report_file = open("PY_report_" + str(date.strftime("%d%H%M")) + ".json", "a+")
main_loop()
