FireFoxOS uses Cordova, copy contents of dist folder into www folder created by Cordova tool. 

FireFoxOS Content Security Policy (CSP) does not allow inline JS, so need to add angular-csp.css file as 
a link tag in the index.html head and ng-csp to the <html></html> tag.

