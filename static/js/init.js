(function($){
  $(function(){

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

   
$(document).ready(function() { // init function
  $('.tabs').tabs();
  $('.modal').modal();
});

// below function taken from stackoverflow.com
function cross(a, b) {
  var c = [],
      n = a.length,
      m = b.length,
      i, j;
  for (i = -1; ++i < n;)
      for (j = -1; ++j < m;) c.push({
          x: a[i],
          i: i,
          y: b[j],
          j: j
      });
  return c;
}