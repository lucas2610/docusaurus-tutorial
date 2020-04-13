const PAGE_IDENTIFIER = window.location.pathname;
const BASE_URL = "http://nxp.nddigital.local/";
const PAGE_URL = BASE_URL + PAGE_IDENTIFIER;

 /**
 *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
 */
var disqus_config = function() {
  this.page.url = PAGE_URL; // Page's canonical URL variable
  this.page.identifier = PAGE_IDENTIFIER; // Page's unique identifier variable
};

 function loadDisqus() {
  (function() {
    // DON'T EDIT BELOW THIS LINE
    var d = document,
      s = d.createElement("script");
    s.src = "https://nxp.disqus.com/embed.js";
    s.setAttribute("data-timestamp", +new Date());
    (d.head || d.body).appendChild(s);
  })();
}

 function maybeLoadDisqus() {
  const hr = document.createElement("hr");
  const disqusContainer = document.createElement("disqus");
  disqusContainer.id = "disqus_thread";  
  const isDocsPage = PAGE_IDENTIFIER.indexOf("/docs") !== -1;
  const isBlogPost = PAGE_IDENTIFIER.search("/blog/(\\d+)/") !== -1;

  if (isDocsPage) {      
    const postContainer = document.querySelectorAll(".post article")[0];
    if(postContainer)
    {
        postContainer.appendChild(hr);
        postContainer.appendChild(disqusContainer);
        loadDisqus();
    }
  } else if (isBlogPost) {
    const blogContainer = document.querySelectorAll(".blogSocialSection")[0];
    if(blogContainer) {
        blogContainer.appendChild(hr);
        blogContainer.appendChild(disqusContainer);
        loadDisqus();
    }   
  }
}

 document.addEventListener("DOMContentLoaded", function() {
  maybeLoadDisqus();
});