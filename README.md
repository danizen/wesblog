# Washington Ethical Society blog importer

Some help I'm giving to the Washington Ethical Society.   The goal is to enable them to easily edit blogs 
on blogger.com/blogspot.com (same thing) and have them show up on pages of their SimpleUpdates website
as a list of posts, rendered both into HTML and CSS the way they want.

## Tools Used

This is a javascript solution using:

* JSONP output from blogger - `<feedname>/feeds/posts/default?alt=json-in-cript&callback=<function>`
* moustache Javascript template engine
* JavaScript module pattern

## How to use it?

Include into the <head> element of the page the following files:

* `js/wesblog.js` - creates a module named `WESBLOG` with a couple of methods.
* `css/wesblog.css` - this creates styling defined by me mostly for demo purposes, it is optional.
* `lib/js/mustache.min.js` - this is the mustache JavaScript library

Somewhere in the page include a blog template for mustache:

```
<script type="text/template" id="blog-template">
</script>
```

Where you want the posts to appear include an empty div in the page:

```
<div id="blog-entries"></div>
```

Directly below that, include a script calling the JSONP of blogger, substituting any blog we want to include:

```
<script src="http://<blogname>.blogspot.com/feeds/posts/default?alt=json-in-script&callback=WESBLOG.showPosts"></script>
```


