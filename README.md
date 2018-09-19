# paint-it
Annotation plugin that can annotate any Highcharts independent of the UI of the buttons i.e., you can use your own UI for your buttons and bind the event listeners to it.

#### Supports Annotation for Pie Chart and Donut Chart from Highcharts Library.

### Dependencies
* JQuery
* Material Icons (If you want to use icons)

### How to Use
* Take reference from index.html about how to bind events to the buttons.
* Include the css & plugin.js file into your project.
* Initialize the annotation plugin via following command:

```
$("#container").annotate() /// 'container' is the 'id' of the highcharts containing container.
```
* That's it you are ready to go.

P.S.: Will soon be published as an NPM Package and a JQuery plugin.
