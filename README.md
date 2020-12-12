# Website-Finder

Website-Finder is a collection of light scripts written in various programming languages without the need for external libraries that finds websites of all sorts for you and make reports of that either in the form of automatically generated json files or in the form of a webpage.

Keep in mind that this software will find ANY website that exists, no matter how morally wrong it may be. It may also (on purpose) find websites which are hosted by a server that simply doesn't reply to requests.

## REQUIREMENTS

Each script has its own requirements.

* index.py, the Python script, requires [Python 3](https://www.python.org/downloads/)
* index.js, the Node.js script, requires [Node.js](https://nodejs.org/en/download/)
* index.rb, the Ruby script, requires [Ruby](https://rubyinstaller.org/downloads/)
* index.html, the Javascript script within a HTML webpage, only requires a web browser

## HOW TO RUN

You can run the Python or Ruby script by simply double clicking on it or going into the command-line, moving into the right directory and entering the file name.

To run the Node.js script, you will have to use the command-line.

```sh
$ cd Website-Finder/Node.js
$ node index.js
```

For the Javascript script, you can: 

* Run the HTML file into your web browser, by either double-clicking it or by dragging the file into it
* Visit that same file hosted on [GitHub Pages](https://tttaevas.github.io/Website-Finder/Javascript/index.html)

In both cases, I *personally* recommend using the [NoScript extension](https://noscript.net/), just in case for your satefy, so only the JS file used to find websites is executed, and nothing gets executed from the websites it finds. I'm no security expert so that may be useless as no JS should get executed from other websites in the first place, but hey, better safe than sorry. 

## ARGUMENTS

Unless you're using the Javascript script, if you wish to use arguments, you are required to use the command line in order to launch the script with arguments.

- "-t" defines the number of URLs the script will go through.
- "-d" defines all the top-level domains the URLs will use, separated only by a ",".
- "-m" defines the application protocol used. Multiple protocols can be defined by separating them with a ",".
- "-l" defines by whether or not it is present whether or not all URLs will be logged in the command-line.
- "-s" defines how likely it will be that the URLs feature a second level domain, <=0 being impossible and >=100 being always.
- "-MIN" defines the minimum length of the URLs.
- "-MAX" defines the maximul length of the URLs.

* "-t" defaults to 3000.
* "-d" defaults to a lot of popular top-level domains.
* "-m" defaults to "http", but the Javascript script defaults to "https" due to [requests made with the "http" application protocol being blocked when not run locally](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content).
* "-l" makes it so URLs will be logged.
* "-s" defaults to 1.
* "-MIN" defaults to 2.
* "-MAX" defaults to 50.

Using arguments with the Javascript script is simple, as you can enter values in labeled fields. Leaving those fields empty will make the script use the default values.

```sh
# To make the Python script go through 3000 URLs in HTTP with various top-level domains without logging:
$ index.py

# To make the Ruby script go through 500 URLs of min length 5 and max length 7 in HTTP and HTTPS with only the .com and .fr top-level domains with a 30% chance for each URL to feature a second level domain with logging:
$ index.rb -MAX 7 -t 500 -MIN 5 -m http,https -l -s 30 -d .com,.fr

# To make the Node.js script go through 3000 URLs in HTTPS with various top-level domains with logging:
$ node index.js -m https -l
```

## FAQ

Q: Is there a script that is better than the other?  
A: As far as I am aware, nope! However, the reports are generated differently depending of the script and some websites send different codes depending of the script.

Q: Why does the "-m" argument default to "http" rather than "https"?  
A: Requests in "http" receive more status codes than error codes compared to "https". I suspect it's because some websites don't support "https" very well, even in the current year.
