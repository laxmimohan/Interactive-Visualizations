function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
   d3.json(`/metadata/${sample}`).then((bio) => {
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var biopanel = Object.entries(bio);
    biopanel.forEach((biopair) => {
     panel.append("h6").text(`${biopair[0]}:${biopair[1]}`);
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 });}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
   d3.json(`/samples/${sample}`).then((biobar) => {
    const sampleValues = biobar.sample_values;
    const otuIDs = biobar.otu_ids;
    const otu_labels = biobar.otu_labels;
    console.log(sampleValues,otuIDs,otu_labels)
    
    var bubbleLayout = {
      margin:{t:0},


     };
    var trace = [{
          x: otuIDs,
          y: sampleValues,
          text:otu_labels,
          mode: "markers",
          marker:{
            color: otuIDs,
            size: sampleValues,
            colorscale: 'Earth'
          }
          }];
    Plotly.newPlot('bubble',trace,bubbleLayout);

    
    var fig = [{
      values: sampleValues.slice(0,10), 
      labels: otuIDs.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: 'hovertext',
      type: 'pie'
     }];
          
     var pieLayout = {
      margin:{t:0,1:0},
      xaxis:{ title:"OTU ID"}
     };
   
      Plotly.newPlot('pie',fig,pieLayout);

    // var PLOT = document.getElementById('bubble');
          

      // Plotly.style(PLOT, "x", [trace.x]);

      // Plotly.style(PLOT, "y", [trace.y]);
      // Plotly.style(PLOT, "marker.color", [trace.x]);

      });
     }
   
    // @TODO: Build a Bubble Chart using the sample data
    

    // @TODO: Build a Pie Chart
    // function updateBubbleChart(newdata) {
    //   url='/samples/'+newdata;
    //   Plotly.d3.json(url, function(error, data){
    //       if (error) return console.warn(error);
  
    //       console.log("UPDATING BUBBLE CHART")
    //       console.log(data)

    //   })
    // }

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
