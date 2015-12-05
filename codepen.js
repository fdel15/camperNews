$(document).ready(function(){
  $.when(getNews()).done(function(){
    setImageSizes()
  });
});

var Article = function() {}

function getNews() {
  var d1 = $.Deferred();
  $.getJSON("http://www.freecodecamp.com/news/hot", function(data) {
    data.forEach(function(obj){
      var article = new Article();
      article.image = getImage(obj);
      article.title= obj.headline.replace(/\s{2,}/g, "");
      article.author = obj.author.username;
      article.authorLink = "http://www.freecodecamp.com/" + article.author;
      article.date = getDate(obj);
      article.url = obj.link;
      article.upVotes = obj.upVotes.length
      displayArticle(article);
      })
    d1.resolve();
  })
  return d1.promise();
}

function getImage(obj) {
  if(obj.image.length > 0){
    return obj.image;
  } else {
    return obj.author.picture;
  }
}

function getTitle(obj) {
  var title = obj.headline.replace(/\s{2,}/g, "")
  var minTitle = "";

  if(title.length > 20 ) {
    title = title.split(" ");
    title.forEach(function(word){
      if(minTitle.length + word.length > 17 ){
        return false;
      } else {
        minTitle = minTitle + word + " "
      }
    })
    return minTitle.slice(0, -1) + "...";
  } else {
    return title;
  }
}

function getDate(obj) {
  return new Date(obj.timePosted).toString().slice(0, 15);
}

function getImageSize(upvotes) {
  var size = (upvotes * 3) + 125;
  if (size > 225) { return 225 }
  return size;
}

function setImageSizes() {
  $('.article .content .upvotes').each(function(){
    var size, img, article;
    var upvotes = $(this).text().split(" ")[1]
    upvotes = parseInt(upvotes);
    size = getImageSize(upvotes);

    article = $(this).closest('.article')
    if( size > 150 ) {
      article.css('width', size);
      $(this).css('color', 'red');
    }

    img = $(article).children('img')
    img.css('width', size);
    img.css('height', size)

  })
}


function displayArticle(article) {
  $('.articles').append(
    "<div class='article'>" +
      "<img src='" + article.image + "' class='post-pic'/>" +
      "<div class='content'>" +
        "<a href='" + article.url + "' target='_blank'>" +
          "<p class='title'>"+ article.title + "</p>" +
        "</a>" +
        "<a href='"+ article.authorLink + "' target='_blank'>" +
          "<p class='author'>" + article.author + "</p>" +
        "</a>" +
        "<p class='date'>" + article.date + "</p>" +
        "<p class='upvotes'>♥ " + article.upVotes + "</p>" +
      "</div>" +
    "</div>"
  )
}