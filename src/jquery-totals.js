;(function ($, window, undefined) {
  $.fn.getEDHTotals = function(options) {
    // Format money including commas for amounts over 1,000.
    // TODO: Replace this nonsense.
    Number.prototype.formatMoney = function(c, d, t){
      var n = this; c = isNaN(c = Math.abs(c)) ? 2 : c, d = d === undefined ? "," : d, t = t === undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    // Defaults options.
    $.fn.getEDHTotals.defaults = {
      type: 'campaign',
      ids: ['au-0'],
      onComplete: null,
      render: null,
      offset: 0
    };

    var settings       = $.extend({}, $.fn.getEDHTotals.defaults, options);
    var element        = $(this.selector);
    var totalCents     = 0;
    var currencySymbol = '';
    var endpointUrl    = 'https://everydayhero.com/api/v2/search/totals.jsonp?';
    var typeString     = settings.type + "_id[]=";
    var requestString  = settings.ids.length > 1 ? settings.ids.join("&" + typeString) : settings.ids;
    var url            = endpointUrl + typeString + requestString;

    var renderTotal = function(totalFormatted) {
      $(element).text(totalFormatted);
    };

    var request = $.getJSON(url + '&callback=?', function(data) {
      currencySymbol = '$';
      totalCents     = settings.offset + data.total_amount_cents.sum;

      var totalFormatted = currencySymbol + (totalCents / 100).formatMoney(2,'.',',');
      var returnObj = {
        currencySymbol: currencySymbol,
        totalFormatted: totalFormatted,
        totalCents: totalCents
      };

      if ($.isFunction(settings.render)) {
        settings.render.call(element, returnObj);
      } else {
        renderTotal(totalFormatted);
      }

      if ($.isFunction(settings.onComplete)) {
        settings.onComplete.call(element);
      }
    });
  };
}(jQuery, window));
