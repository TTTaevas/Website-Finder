# Website-Finder: Javascript

While this is called Javascript, it also makes use of HTML (and CSS, somewhat)

## HOW TO RUN

It is already being run by [GitHub Pages](https://tttaevas.github.io/Website-Finder/Javascript/index.html), but you may run it yourself simply by opening [index.html](./index.html) in your web browser

Do note that using arguments and launching the search is done through the HTML, so you cannot use the cli/terminal to use arguments, and opening the file will not instantly trigger the search

```sh
# You should be able to double-click the file or drag the file to the web browser, but if you wanna be fancy

# Linux
$ xdg-open index.html

# Windows 10
$ explorer index.html

# macOS
$ open index.html
```

## REGARDING REPORTS

Your web browser should be unable to create files on your computer, so unlike other scripts, no report in json is made

Instead, a report is created in real time within the HTML, while the logging is done by the browser in its development tools

## REGARDING ARGUMENTS

The GitHub Pages version cannot use HTTP due to [Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)

The default arguments may not match the ones specified in [defaults.json](../defaults.json), as they have to be independent from each other

## OTHER STUFF

More details are available on [the readme in the root folder](../README.md)
