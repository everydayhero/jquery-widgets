;(function ($, window, undefined) {
  $.fn.getEDHLeaderboard = function(options) {

    // Format money including commas for amounts over 1,000.
    // TODO: Replace this nonsense.
    Number.prototype.formatMoney = function(c, d, t){
      var n = this; c = isNaN(c = Math.abs(c)) ? 2 : c, d = d === undefined ? "," : d, t = t === undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    $.fn.getEDHLeaderboard.defaults = {
      ids: ['au-0'],
      limit: 5,
      groupValue: null,
      onComplete: null,
      render: null
    };

    var element = $(this.selector);
    var settings = $.extend({}, $.fn.getEDHLeaderboard.defaults, options);
    var pagesEndpoint = 'https://everydayhero.com/api/v2/pages.jsonp?ids=';

    var leaderboardEndpoints = $.map(settings.ids, function(campaignId, i) {
      return 'https://everydayhero.com/api/v2/search/pages_totals?campaign_id=' + campaignId + '&limit=' + settings.limit + '&group_value=' + settings.groupValue;
    });

    var sortPages = function(pages) {
      return pages.sort(function(a, b) {
        return b.amount.cents - a.amount.cents;
      }).slice(0, settings.limit);
    };

    var processPages = function(sortedPages) {
      return $.map(sortedPages, function(page, i) {
        return {
          name: page.name,
          url: page.url,
          iso_code: page.amount.currency.iso_code,
          amount: '$' + (page.amount.cents / 100).formatMoney(2,'.',','),
          img: page.image.medium_image_url
        };
      });
    };

    var renderLeaderboard = function(leaderboard) {
      var html = "";

      $(leaderboard).each(function(i, item) {
        html += '<a class="edhLeaderboard__item" href="' + item.url + '" title="' + item.name + '">' +
                  '<div class="edhLeaderboard__image">' +
                    '<img src="' + item.img + '" />' +
                  '</div>' +
                  '<div class="edhLeaderboard__name" title="' + item.name + '">' +
                    item.name +
                  '</div>' +
                  '<div class="edhLeaderboard__amount">' +
                    item.amount +
                  '</div>' +
                '</a>';
      });

      $(element).append(html);
    };

    var createLeaderboard = function(pageData) {
      var pages = [];

      $.each(pageData.pages, function(i, page) {
        pages.push(page);
      });

      var sortedPages = sortPages(pages);
      var leaderboard = processPages(sortedPages);

      if ($.isFunction(settings.render)) {
        settings.render.call(element, leaderboard);
      } else {
        renderLeaderboard(leaderboard);
      }

      if ($.isFunction(settings.onComplete)) {
        settings.onComplete.call(element);
      }
    };

    var fetchPageInfo = function(pageIds) {
      return $.ajax({
        url: pagesEndpoint + pageIds,
        dataType: "jsonp"
      });
    };

    var getPageIds = function() {

      var pages   = [];
      var pageIds = [];
      var jxhr    = [];

      $.each(leaderboardEndpoints, function (i, url) {
        jxhr.push(
          $.getJSON(url, function (data) {
            $.each(data.results, function(ii, result) {
              pageIds.push(result.page.id);
            });
          })
        );
      });

      $.when.apply($, jxhr).then(function() {
        fetchPageInfo(pageIds).done(function(result) {
          createLeaderboard(result);
        });
      });
    };

    getPageIds();
  };
}(jQuery, window));
