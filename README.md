# Washington Ethical Society blog importer

Some help I'm giving to the Washington Ethical Society.   The goal is to enable them to easily edit blogs 
on blogger.com/blogspot.com (same thing) and have them show up on pages of their SimpleUpdates website
as a list of posts, rendered both into HTML and CSS the way they want.

## Tools Used

This is a javascript solution using:

* [JSONP](http://en.wikipedia.org/wiki/JSONP) output from blogger - `<feedname>/feeds/posts/default?alt=json-in-cript&callback=<function>`
* [Mustache Javascript template engine](http://en.wikipedia.org/wiki/JavaScript_templating) - Wikipedia introduces JavaScript templating, and there is currently a link there to a Mustache page on wikipedia.
* [JavaScript module pattern](http://toddmotto.com/mastering-the-module-pattern/) - there are many blog posts on this, I've linked just one.

## How to use it?

Include into the `<head>` element of the page the following files:

* `js/wesblog.js` - creates a module named `WESBLOG` with a couple of methods.
* `css/wesblog.css` - this creates styling defined by me mostly for demo purposes, it is optional.
* `lib/js/mustache.min.js` - this is the mustache JavaScript library

Somewhere in the page include a blog template for mustache:

```
<script type="text/template" id="blog-template">
{{#posts}}
  <div class="post">
    <div class="image">{{image}}</div>
    <div class="pubdate">{{pubdate}}</div>
    <div class="title"><a href="{{& link}}">{{title}}</a></div>
    <div class="snippet">{{& snippet}}</div>
  </div>
{{/posts}}
</script>
```

Where you want the posts to appear include an empty div in the page:

```
<div id="blog-entries"></div>
```

Directly below that, include a script calling the JSONP of blogger, substituting any blog we want to include:

```
<script src="http://ethicalsocietydc.blogspot.com/feeds/posts/default?alt=json-in-script&callback=WESBLOG.showPosts"></script>
```

## How does it work?

* `showPosts` is really an anonymous function in a returned anonymous object that has been assigned to the `WESBLOG`.
* The blog is configured to summarize the posts using Blogger's "Jump Break" functionality, which is similar to a LiveJournal cut, or LJ cut.
* Our JSONP script element asks blogger generates some JavaScript that the browser evaluates as a method call to the `WESBLOG.showPosts` method.
* `WESBLOG.showPosts` parses the JSON response a part in a variety of ways, and then formats it using mustache.

## Security Concerns

* We are trusting blogger.com to run JavaScript on our page.  Hopefully they are not hacked.  
* Hopefully, no one can find a way to write any code in our blogger.com posts that are executed somehow.
