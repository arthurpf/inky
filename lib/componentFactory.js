var format = require('util').format;
var $ = require('cheerio');

/**
 * Returns output for desired custom element
 * @param {object} element - Element as a Cheerio object.
 * @returns {string} HTML converted from a custom element to table syntax.
 */
module.exports = function(element) {
  var inner = element.html();

  switch (element[0].name) {
    // <column>
    case this.components.columns:
      return this.makeColumn(element, 'columns');

    // <row>
    case this.components.row:
      var classes = ['row'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table cellpadding="0" cellspacing="0" border="0" class="%s"><tbody><tr>%s</tr></tbody></table>', classes.join(' '), inner);

    // <column>
    case this.components.columns2:
      return this.makeColumn2(element, 'columns2');

    // <space>
    case this.components.space:
        if(element.attr('height')){
          return format('<td class="space-height" height="'+parseInt(element.attr('height'))+'"></td>');
        }
        if(element.attr('width')){
          return format('<td class="space-width" width="'+parseInt(element.attr('width'))+'"></td>');
        }
        return '';

    // <row>
    case this.components.row2:
      var classes = ['row2'];
      var maginArrString = [];
      var attrs = {
        cellpadding:0,
        cellspacing:0,
        border:0,
        width:'100%'
      };

      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }


      if(element.attr('width')){
        attrs['width'] = element.attr('width');
      }
      
      

      maginArrString['up'] = '';
      maginArrString['right'] = '';
      maginArrString['bottom'] =  '';
      maginArrString['left'] = '';

      if (element.attr('margin')){
        margin = element.attr('margin').split(' ');

        if(margin.length == 1){
          margin = [margin[0],margin[0],margin[0],margin[0]];
        }
        else if(margin.length == 2){
          margin = [margin[0],margin[1],margin[0],margin[1]];

        }
        else if(margin.length == 3){
          margin = [margin[0],margin[1],margin[2],margin[1]];
        }
        else if(margin.length == 4){
          margin = [margin[0],margin[1],margin[2],margin[3]];
        }

        maginArrString['up'] =  parseInt(margin[0]) > 0 ? format('<tr><td class="space" colspan="42" height="'+parseInt(margin[0])+'"></td></tr>') : '';
        maginArrString['right'] = parseInt(margin[1]) > 0 ? format('<td class="space" width="'+parseInt(margin[1])+'"></td>') : '';
        maginArrString['bottom'] =  parseInt(margin[2]) > 0 ? format('<tr><td class="space" colspan="42" height="'+parseInt(margin[2])+'"></td></tr>') : '';
        maginArrString['left'] = parseInt(margin[3]) > 0 ? format('<td class="space" width="'+parseInt(margin[3])+'"></td>') : '';
      }

      return format('<table cellpadding="'+attrs.cellpadding+'" cellspacing="'+attrs.cellspacing+'" border="'+attrs.border+'" width="'+attrs.width+'" class="%s"><tbody>'+maginArrString['up']+'<tr>'+maginArrString['left']+'%s'+maginArrString['right']+'</tr>'+maginArrString['bottom']+'</tbody></table>', classes.join(' '), inner);


    // <button>
    case this.components.button:
      var expander = '';

      // If we have the href attribute we can create an anchor for the inner of the button;
      if (element.attr('href')) {
        inner = format('<a target="_blank" href="%s">%s</a>', element.attr('href'), inner);
      }

      // If the button is expanded, it needs a <center> tag around the content
      if (element.hasClass('expand')) {
        inner = format('<center>%s</center>', inner);
        expander = '\n<td class="expander"></td>';
      }

      // The .button class is always there, along with any others on the <button> element
      var classes = ['button'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table class="%s"><tr><td><table><tr><td>%s</td></tr></table></td>%s</tr></table>', classes.join(' '), inner, expander);

    // <container>
    case this.components.container:
      var classes = ['container'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table class="%s"><tbody><tr><td>%s</td></tr></tbody></table>', classes.join(' '), inner);

    // <inky>
    case this.components.inky:
      return '<tr><td><img src="https://raw.githubusercontent.com/arvida/emoji-cheat-sheet.com/master/public/graphics/emojis/octopus.png" /></tr></td>';

    // <block-grid>
    case this.components.blockGrid:
      var classes = ['block-grid', 'up-'+element.attr('up')];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }
      return format('<table class="%s"><tr>%s</tr></table>', classes.join(' '), inner);

    // <menu>
    case this.components.menu:
      var classes = ['menu'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }
      var centerAttr = element.attr('align') ? 'align="center"' : '';
      return format('<table class="%s"%s><tr><td><table><tr>%s</tr></table></td></tr></table>', classes.join(' '), centerAttr, inner);

    // <item>
    case this.components.menuItem:
      var classes = ['menu-item'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }
      return format('<th class="%s"><a href="%s">%s</a></th>', classes.join(' '), element.attr('href'), inner);

    // <center>
    case this.components.center:
      if (element.children().length > 0) {
        element.children().each(function() {
          $(this).attr('align', 'center');
          $(this).addClass('text-center');
        });
        element.find('item, .menu-item').addClass('float-center');
      }

      element.attr('data-parsed', '');

      return format('%s', $.html(element));

    // <callout>
    case this.components.callout:
      var classes = ['callout-inner'];
      if (element.attr('class')) {
        classes = classes.concat(element.attr('class').split(' '));
      }

      return format('<table class="callout"><tr><th class="%s">%s</th><th class="expander"></th></tr></table>', classes.join(' '), inner);

    default:
      // If it's not a custom component, return it as-is
      return format('<tr><td>%s</td></tr>', $.html(element));
  }
}
