# Website-Finder: Webpage

This version of Website-Finder differs a lot from the scripts available in this repository, as it runs in a web browser and uses external dependencies to look fancy

The reason why is because this version is geared towards people who just want something cool-looking that does something cool, without the hassle of installing a new programming language

![website-finder](https://user-images.githubusercontent.com/67872932/223705587-cc434c4b-9458-48fe-ae53-46f1aaf8f2bc.gif)


## HOW TO RUN

It is already being run on [finder.taevas.xyz](https://finder.taevas.xyz), but you may run it yourself simply by cloning the repository and opening index.html in your web browser

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

Instead, a report is created in real time within the HTML, and some logging is done by the browser in its development tools

## REGARDING ARGUMENTS

If the page is served to you through HTTPS, you won't be able to use the HTTP application protocol due to [Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)

The default arguments do not match the ones specified in [defaults.json](../defaults.json)

## OTHER STUFF

More details are available on [the readme in the root folder](../README.md)
