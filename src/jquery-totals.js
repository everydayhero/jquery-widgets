(function ($) {
  $.fn.getEDHTotals = function(options) {

    // Format money including commas for amounts over 1,000.
    // TODO: Replace this nonsense.
    Number.prototype.formatMoney = function(c, d, t){
      var n = this; c = isNaN(c = Math.abs(c)) ? 2 : c, d = d === undefined ? "," : d, t = t === undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    // Defaults options.
    var settings = $.extend({
      type: 'campaign',
      ids: ['au-0'],
      callback: function() {}
    }, options);

    var element        = this.selector;
    var campaigns      = [];
    var jxhr           = [];
    var totalCents     = 0;
    var currencySymbol = '';
    var endpointUrl    = 'https://everydayhero.com/api/v2/search/totals.jsonp?';
    var url            = '';

    if (options.type === 'campaign') {
      url = endpointUrl + 'campaign_id=';
    } else if (options.type === 'charity') {
      url = endpointUrl + 'charity_id=';
    } else {
      url = endpointUrl + 'page_id=';
    }

    $.each(options.ids, function(i, id) {
      jxhr.push(
        $.getJSON(url + id + '&callback=?', function(data) {
          campaigns.push(data.total_amount_cents.sum);
        })
      );
    });

    $.when.apply($, jxhr).done(function(){
      $.each(campaigns, function(i, campaign){
        currencySymbol = '$';
        totalCents += campaign;
      });

      var totalFormatted = currencySymbol + (totalCents / 100).formatMoney(2,'.',',');
      var returnObj = {
        currencySymbol: currencySymbol,
        totalFormatted: totalFormatted,
        totalCents: totalCents
      };

      $(element).text(totalFormatted);
      options.callback.call(returnObj);
    });
  };
}(jQuery));
