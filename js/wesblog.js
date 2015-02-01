
var WESBLOG = (function() {
  //= private data 
  var monthNames = new Array(
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December");

  var dayNames = new Array(
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

  //= public object
  return {
    // formats a date like Thu, December 11, 2014
    formatDate: function(value) {
      var d = new Date(value);
      var dayOfMonth= d.getDate();
      var dayOfWeek = dayNames[d.getDay()];
      var month = monthNames[d.getMonth()];
      var year = d.getFullYear();
      return dayOfWeek + ', ' + month + ' ' + dayOfMonth + ', ' + year;
    },
    // Finds the link with rel="alternate" which is the one to use
    findLink: function(links) {
      var i;
      for (i = links.length - 1; i >= 0; i--) {
        if (links[i]['rel'] == 'alternate') {
          return links[i]['href'];
        }
      }
      return '#'; // graceful degradation
    },
    // Trims the content down to a manageable length
    parseContent: function(content) {
      var nwords = 0;
      var type = content['type'];
      if (type == 'text') {
        return { snippet: content[$], image: null };
      }

      // create an element with this HTML to parse the HTML
      var el = document.createElement('div');
      el.innerHTML = content['$t'];

      // remove the first img from the text
      var imgsrc = null;
      var imgtag = el.querySelector('img');
      if (imgtag) {
        imgsrc = imgtag.getAttribute('src');
        imgsrc = '<img src="' + imgsrc + '" width="300">';
        var parenttag = imgtag.parentNode;
        if (parenttag.nodeName == 'A') {
          parenttag.parentNode.removeChild(parenttag);
        } else {
          parenttag.removeChild(imgtag);
        }
      }

      // Get the first span containing text
      var bestspan = null;
      var spans = el.getElementsByTagName('SPAN');
      for (var i = 0; i < spans.length; i++) {
        var span = spans[i];
        if (span.firstChild.nodeName == '#text') {
          // trim space until we see a non-space character
          var tt = span.textContent.trim();
          if (tt.length != 0) {
            bestspan = span;
            i = spans.length;
          }
        }
      }

      var thetext;
      if (bestspan) {
        thetext = bestspan.innerHTML;
      } else {
        thetext = el.innerHTML;
      }

      // Take each text node, mark its position in the text.  
      // Fragment combination into sentences.  Take first 3 sentences.
      return { snippet: thetext, image: imgsrc };
    },
    // Formats JSON data from blogger into simpler model
    formatPosts: function(data) {
      // convert entries to a list
      var entries = data['feed']['entry'];
      var result = { posts: [] }
      var i;
      for (i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var title = entry['title']['$t'];
        var link = this.findLink(entry['link']);
        var parse = this.parseContent(entry['content']);
        var datestr = this.formatDate(entry['published']['$t']);
        result.posts[i] = {
          title: title, pubdate: datestr, link: link, snippet: parse.snippet, image: parse.image
        };
      }
      return result;
    },
    showPosts: function (data) {
      var posts = WESBLOG.formatPosts(data);
      var template = $('#blog-template').html();
      var thehtml = Mustache.render(template, posts);
      $('#blog-entries').html(thehtml);
    }
  }
}());

