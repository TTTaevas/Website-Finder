package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

// Note to self: In type structs, everything will be falsey/empty if properties do not start with an uppercased letter
type Defaults struct {
	Times     int
	Protocols []string
	Domains   []string
	Second    int
	Log       bool
	Min       int
	Max       int
}

// Note to self: The strings after the type defines what names'll be used in the json file (it'll use uppercased 1st letter version otherwise)
type Website struct {
	Website_url      string `json:"website_url"`
	Response_type    string `json:"response_type"`
	Response_code    string `json:"response_code"`
	Response_details string `json:"response_details"`
}

func indexOf(arr []string, element string) int { // 💀💀💀💀
	for i := 0; i < len(arr); i++ {
		if arr[i] == element {
			return i
		}
	}
	return -1
}

func main_loop(times int, domains, protocols []string, logging bool, min, max, second int, report_file_name string) {
	var json_text []Website
	for i := 0; i < times; i++ {
		var url string = url_generator(protocols, domains, min, max, second)
		if logging {
			log.Printf("%s (%d/%d)", url, i+1, times)
		}
		response, err := http.Get(url)
		if err != nil { // Unlike in, say, Crystal, errors in Go are kinda just strings instead of having different types
			var str = err.Error()
			if !strings.Contains(str, "no such host") {
				log.Printf("%s exists!", url)
				json_text = append(json_text, Website{
					Website_url:      url,
					Response_type:    "ERROR",
					Response_code:    "UNKNOWN", // No Go error contains such a thing
					Response_details: str,
				})
			}
			continue
		}
		log.Printf("%s exists!", url)
		json_text = append(json_text, Website{
			Website_url:      url,
			Response_type:    "SUCCESS",
			Response_code:    strconv.Itoa(response.StatusCode),
			Response_details: response.Status[4:],
		})
	}

	json_object, err := json.Marshal(json_text)
	if err != nil {
		log.Print("Error while creating the report: ", err)
		log.Fatal("Here was the json_text: ", json_text)
	}
	report_file, err := os.Create(report_file_name)
	if err != nil {
		log.Fatal("Error while creating the report file: ", err)
	}
	defer report_file.Close()
	report_file.Write(json_object)
	if err != nil {
		log.Fatal("Error while writing in the report file: ", err)
	}

	end_date := time.Now()
	log.Printf("\nFinished at %sh%sm", strconv.Itoa(end_date.Hour()), strconv.Itoa(end_date.Minute()))
}

func url_generator(protocols, domains []string, min, max, second int) string {
	var result string = protocols[rand.Intn(len(protocols))] + "://"
	var url_length int = rand.Intn(max-min) + min
	var characters string = "abcdefghijklmnopqrstuvwxyz0123456789"
	for i := 0; i < url_length; i++ {
		result += string(characters[rand.Intn(len(characters))])
	}
	if rand.Intn(99)+1 <= second {
		result += "." + domains[rand.Intn(len(domains))]
	}
	result += "." + domains[rand.Intn(len(domains))]
	return result
}

func main() {
	log.SetFlags(0)

	content, err := ioutil.ReadFile("../defaults.json")
	if err != nil {
		log.Fatal("Error opening defaults.json: ", err)
	}

	var defaults Defaults
	err = json.Unmarshal(content, &defaults)
	if err != nil {
		log.Fatal("Error parsing defaults.json: ", err)
	}

	var times int
	if indexOf(os.Args, "-t") != -1 {
		times, err = strconv.Atoi(os.Args[indexOf(os.Args, "-t")+1])
		if err != nil {
			log.Fatal("Error understanding the -t argument: ", err)
		}
	} else {
		times = defaults.Times
	}
	var protocols []string
	if indexOf(os.Args, "-p") != -1 {
		protocols = strings.Split(os.Args[indexOf(os.Args, "-p")+1], ",")
	} else {
		protocols = defaults.Protocols
	}
	var domains []string
	if indexOf(os.Args, "-d") != -1 {
		domains = strings.Split(os.Args[indexOf(os.Args, "-p")+1], ",")
	} else {
		domains = defaults.Domains
	}
	var second int
	if indexOf(os.Args, "-s") != -1 {
		second, err = strconv.Atoi(os.Args[indexOf(os.Args, "-s")+1])
		if err != nil {
			log.Fatal("Error understanding the -s argument: ", err)
		}
	} else {
		second = defaults.Second
	}
	var logging bool // "log", unlike in other scripts, refers to a package we are using
	if indexOf(os.Args, "-l") != -1 {
		logging = true
	} else {
		logging = defaults.Log
	}
	var min int
	if indexOf(os.Args, "-min") != -1 {
		min, err = strconv.Atoi(os.Args[indexOf(os.Args, "-min")+1])
		if err != nil {
			log.Fatal("Error understanding the -min argument: ", "err")
		}
	} else {
		min = defaults.Min
	}
	var max int
	if indexOf(os.Args, "-max") != -1 {
		max, err = strconv.Atoi(os.Args[indexOf(os.Args, "-max")+1])
		if err != nil {
			log.Fatal("Error understanding the -max argument: ", err)
		}
	} else {
		max = defaults.Max
	}

	date := time.Now()
	log.Printf("\nI am going to look for websites through %d random URLS (min length %d and max length %d) with the following domains: %+q", times, min, max, domains)
	log.Printf("These URLs will use the protocols %+q", protocols)
	log.Printf("and each of those URLs have %d in a 100 chance to have a second level domain", second)
	log.Printf("Started at %sh%sm", strconv.Itoa(date.Hour()), strconv.Itoa(date.Minute()))

	var report_file_name string = "GO_report_" + strconv.Itoa(date.Day()) + strconv.Itoa(date.Hour()) + strconv.Itoa(date.Minute()) + ".json"
	main_loop(times, domains, protocols, logging, min, max, second, report_file_name)
}
