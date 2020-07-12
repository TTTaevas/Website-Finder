# Website-Finder

Website-Finder is a collection of light scripts written in various programming languages without the need for external libraries that finds websites of all sorts for you and make reports of that in the form of automatically generated text files.

## REQUIREMENTS

Each script has its own requirements.

* index.py, the Python script, requires [Python 3](https://www.python.org/downloads/)
* index.js, the Node.js script, requires [Node.js](https://nodejs.org/en/download/)

## HOW TO RUN

You can run the Python script by simply double clicking on it or going into the command-line, moving into the right directory and entering the file name, which is index.py.

To run the Node.js script, you will have to use the command-line.

```sh
$ cd Website-Finder
$ node index.js
```

No matter which script, if you wish to use arguments, you are required to use the command line in order to launch the script with arguments.

## ARGUMENTS

- "-t" defines the number of URLs the script will go through.
- "-d" defines all the top-level domains the URLs will use, separated only by a ",".
- "-m" defines the application protocol used.
- "-l" defines by whether or not it is present whether or not all URLs will be logged in the command-line.

* "-t" defaults to 3000.
* "-d" defaults to a lot of popular top-level domains.
* "-m" defaults to "http".
* "-l" defaults to False.

```sh
# To make the Python script go through 3000 URLs in HTTP with various top-level domains without logging:
$ index.py

# To make the Python script go through 500 URLs in HTTP with only the .com and .fr top-level domains with logging:
$ index.py -t 500 -l -d .com,.fr

# To make the Node.js script go through 3000 URLs in HTTPS with various top-level domains with logging:
$ node index.js -m https -l
```

## FAQ

Q: Is there a script that is better than the other?  
A: As far as I am aware, nope! However, some scripts may receive different status or error codes for the same website, and the Python script error codes have more length than those by the other scripts.

Q: Why does the "-m" argument defaults to "http" rather than "https"?  
A: Requests in "http" receive more status codes than error codes compared to "https". I suspect it's because some websites don't support "https" very well, even in the current year.

## TO DO

- Allow "-m" to support multiple application protocols like "-d".
- Add more languages.
