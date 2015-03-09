# jquery-widgets

Simple lightweight jQuery plugins intended to speed up development of everydayhero giving hubs.

## getEDHTotals

A simple jQuery plugin that fetches total funds raised (for pages, campaigns or charities) from the [everydayhero API](http://developer.everydayhero.com/totals/) and displays the result in a targetted HTML element.

#### Latest CDN Version

- Source: https://d2h3g7rbnequ8a.cloudfront.net/jquery-widgets/jquery-totals-0.0.4.js
- Minified: https://d2h3g7rbnequ8a.cloudfront.net/jquery-widgets/jquery-totals-0.0.4.min.js


#### Simple Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <div id="amount"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="https://d2h3g7rbnequ8a.cloudfront.net/jquery-widgets/jquery-totals-0.0.4.min.js"></script>
    <script>
      $(function() {
        $('#amount').getEDHTotals({
          type: 'campaign',
          ids: ['us-0']
        });
      });
    </script>
  </body>
</html>
```

#### Options

| Option    | Type      | Default Value      | Description        |
| --------- | --------- | ------------------ | ------------------ |
| `type`    | string    | `'campaign'`       | Can be `'campaign'`, `'charity'` or `'page'`. |
| `ids`     | array     | `['au-0']`         | Insert ids (of the same type) as an array. Totals for each provided id will be summed together. |
| `render`  | function  | null               | Define a callback function to replace the default render function with your own. For example render the currency in a different format. `this` contains a reference to the selected element. A second argument can be passed to retrieve an object with currency both formatted and unformatted. |
| `onComplete` | function | null               | Define a callback function to run after the total has been retrieved and rendered. `this` contains a reference to the selected element. |

#### Using a render callback to define your own format

The `render` callback can be used to retreive an object that contains the currency symbol, a total in cents and the formatted total. This can be useful if you need to display the returned amount in a different format or tamper with the returned total in some way before displaying it.

```js
<script>
  $(function() {
    $('#amount').getEDHTotals({
      type: 'campaign',
      ids: ['us-0'],
      render: function(totalObj) {
        var newTotal = '$' + (totalObj.totalCents / 100).toFixed(2);
        this.append(newTotal);
      }
    });
  });
</script>
```


## getEDHLeaderboard

A simple jQuery plugin that fetches a campaign leaderboard from the [everydayhero API](http://developer.everydayhero.com/leaderboards/) and displays the result in a targetted HTML element. It can also be used to generate a leaderboard based on multiple campaigns, e.g. Top individual fundraisers from campaign _X_, _Y_ and _Z_.

#### Latest CDN Version

- Source: https://d2h3g7rbnequ8a.cloudfront.net/jquery-widgets/jquery-leaderboard-0.0.2.js
- Minified: https://d2h3g7rbnequ8a.cloudfront.net/jquery-widgets/jquery-leaderboard-0.0.2.min.js


#### Simple Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <div id="leaderboard"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="https://d2h3g7rbnequ8a.cloudfront.net/jquery-widgets/jquery-leaderboard-0.0.2.min.js"></script>
    <script>
      $(function() {
        $('#leaderboard').getEDHLeaderboard({
          type: 'individual',
          ids: ['us-0']
        });
      });
    </script>
  </body>
</html>
```

#### Options

| Option    | Type      | Default Value      | Description        |
| --------- | --------- | ------------------ | ------------------ |
| `type`    | string    | `'individual'`     | Can be `'individual'`, `'team'` or `'all'`. |
| `ids`     | array     | `['au-0']`         | Insert ids (of the same type) as an array. Totals for each provided id will be summed together.|
| `limit`   | number    | `5`                | Define the number of results to show (and fetch from the API). |
| `render`  | function  | null               | Define a callback function to replace the default render function with your own. |
| `onComplete` | function | null             | Define a callback function to run after the leaderboard has been retrieved and rendered. |

#### Using a render callback to define custom leaderboard HTML

The `render` callback can be used to define your own custom HTML to format the leaderboard as you like. See the below example:

```js
<script>
  $(function() {
    $('#leaderboard').getEDHTotals({
      type: 'campaign',
      ids: ['us-0'],
      render: function(leaderboardItems) {
        var element = this;
        var html    = "";

        $(leaderboardItems).each(function(i, item) {
          html += '<div>' +
                    '<img src="' + item.img + '" />' +
                    '<div>' + item.name + '</div>' +
                    '<div>' + item.amount + '</div>' +
                  '</div>';
        });

        this.append(html);
      }
    });
  });
</script>
```
