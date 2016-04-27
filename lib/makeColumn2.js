var format = require('util').format;
var multiline = require('multiline');
var $ = require('cheerio');

/**
 * Returns output for column elements.
 * @todo This could be refactored to handle both cols and subcols.
 * @param {string} col - Column to format.
 * @returns {string} Column HTML.
 */
module.exports = function(col) {
  var output  = '';
  var inner   = $(col).html();
  var classes = [];
  var expander = '';

  // Add 1 to include current column
  var colCount = $(col).siblings().length + 1;

  // Inherit classes from the <column> tag
  if ($(col).attr('class')) {
    classes = classes.concat($(col).attr('class').split(' '));
  }



  // Determine if it's the first or last column, or both
  if (!$(col).prev(this.components.columns2).length) classes.push('first');
  if (!$(col).next(this.components.columns2).length) classes.push('last');

  // Final HTML output
  output = multiline(function() {/*
    <td class="%s">
      %s
    </td>
  */});

  return format(output, classes.join(' '), inner, expander);
}
