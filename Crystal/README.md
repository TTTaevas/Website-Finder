# Website-Finder: Crystal

## REQUIREMENT

[Crystal](https://crystal-lang.org)

## HOW TO RUN

Please note that using arguments with the Crystal script is slightly different from using arguments with other scripts, due to how Crystal works

To use arguments, you will need to add " -- " (without the ") between the name of the file and the first argument

In the Crystal script, the "-min" argument has been replaced by the "--min" argument, same for "-max" being replaced by "--max"

For both "--min" and "--max", you'll need to use an equal sign "=" instead of a space " " before the value

```sh
$ crystal run index.cr

# To make the script go through 1000 URLs, each of maximum length 20:
$ crystal run index.cr -- -t 1000 --max=20
```

## OTHER STUFF

More details are available on [the readme in the root folder](../README.md)
