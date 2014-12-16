
var WESBLOG = (function() {
  //= private data 
  var monthNames = new Array(
      "January", "February", "March", 
      "April", "May", "June", "July", "August", "September", 
      "October", "November", "December");

  var dayNames = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

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
    trimContent: function(content) {
      var nwords = 0;
      var type = content['type'];
      if (type == 'text') {
        return content['$t'];
      }

      var t = content['$t'];
      var n = t.search('<a name="more"');
      if (n != -1) {
        // has jump marker, cut here and return
        return t.substring(0, n) + '...';
      }

      // count characters
      if (t.length > 140)
        return t.substring(0, 140) + '...';

      return t;
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
        var content = this.trimContent(entry['content']);
        var datestr = this.formatDate(entry['published']['$t']);
        result.posts[i] = {
          title: title, pubdate: datestr, link: link, snippet: content
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

