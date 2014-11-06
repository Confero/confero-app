# Confero
Confero is a touch based multi-conference agenda planning application.

## Installation
Simple installation process
    npm install -g gulp
    npm install

## Build
A gulp task that bundles and minifies the applicaton into the dist folder and generates an app cache manifest file.
    gulp manifest

## Deploy
A gulp deploy task has been created that bundles the app and uses rsync to deploy the app. 
The deploy tasks looks for a rsyncSecret.js file, structured the following way:
    module.exports = { hostname: "SomeServerName", dest: "SomeDestinationFolder" };

## Tests
To run the tests.
    gulp test

## License
[GNU GPL]()