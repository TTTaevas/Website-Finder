# Website-Finder

Website-Finder is a collection of light scripts written in various programming languages without the need for external libraries that finds websites of all sorts for you and automatically makes reports of that, usually in the form of a json file

## ARGUMENTS

You can use arguments when launching scripts through the cli/terminal

- "-t" (times) defines the number of URLs the script will go through
- "-p" (protocols) defines the application protocol used, multiple protocols can be defined by separating them with a ","
- "-d" (domains) defines all the top-level and second-level domains the URLs will use, separated only by a ","
- "-s" (second) defines how likely it will be that the URLs feature a second-level domain, 0 being impossible and 100 being always
- "-l" (log) will make all URLs be logged in the cli/terminal if it's present
- "-min" (minimum) defines the minimum length of the URLs
- "-max" (maximum) defines the maximul length of the URLs

Default values can be found in [defaults.json](./defaults.json)

## REPORTS

Once a script is done running, it will fill a .json report in its directory

## OTHER STUFF

For information exclusive to a script, read the README.md file in its directory
