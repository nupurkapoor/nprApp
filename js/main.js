var app = angular.module('nprApp' , []); //new module

/* Should be hidden, but didnt care much since its revokable */
var apiKey = 'MDE2NjgxODUzMDE0MTA0MDg1MDUxZGVhMA001',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';



