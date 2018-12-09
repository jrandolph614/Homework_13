// @TODO: YOUR CODE HERE!
//Setting Margins
function makeRsponsive() {
var svgWidth = 960;
var svgHeight = 660;
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
};
//Adjusting Dimensions
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
//Svg Wrapper
var svg = d3
    .select("#Chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
// Inital Params
var chosenXAxis ="poverty";
var chosenYAxis ="obesity";
// function to update x scale on click
function xScale(censusData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => d[chosenXAxis]))
        .range([0, chartWidth]);
        console.log("xScale Called - " + chosenXAxis) 
    return xLinearScale;}
function yScale(censusData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => d[chosenYAxis]))
        .range([chartHeight, 0]);
    console.log("yScale Called - " + chosenYAxis)
    return yLinearScale;}
// Func to update xAxis and yAxis on Click
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;}
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;}
function renderCircle(circlesGroup, newXScale, chosenXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}
function renderXCircle(movingGroup, newXScale, chosenXAxis){
    movingGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return movingGroup;
}
function renderYCircle(movingGroup, newYScale, chosenYAxis){
    movingGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return movingGroup;
}
// Func for Moving Text
function renderXText(movingText, newXScale, chosenXAxis){
    movingText.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return movingText;
}
function renderYText(movingText, newYScale, chosenYAxis){
    movingText.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return movingText;
}
    // Func to update circlesGroup with new tooltip
// function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis){
//     if (chosenXAxis === "poverty") {
//         var xlabel = "In Poverty (%):";
//     }
//     else if (chosenXAxis === "age") {
//         var xlabel = "Age (Median):";
//     }
//     else {
//         var xlabel = "Household Income (Median):";
//     }
//     if (chosenYAxis === "healthcare") {
//         var ylabel = "Lacks Healthcare (%):";
//     }
//     else if (chosenYAxis === "obesity") {
//         var ylabel = "Obese (%):";
//     }
//     else {
//         var ylabel = "Smokes (%):";
//     }
//     return circlesGroup;
// }

//Load Data 
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);
    // on click to deploy different charts 
    // use transformations on the on click 
    censusData.forEach(function(data) {
        
        data.abbr = data.abbr;
        // x data
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        // y data
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });
        
    

    // xLinearScale func
    var xLinearScale = xScale(censusData, chosenXAxis);
    // y scale func
    var yLinearScale = yScale(censusData, chosenYAxis);
    // inital axis func
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("axisText", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("axisText", true)
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("g")
        .attr("class", "point")
    var movingGroup = circlesGroup.append("circle")
    .attr("cx", d=> xLinearScale(d[chosenXAxis]))
    .attr("cy", d=> yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "#87bbd4")
    .attr("opacity", ".75")
    var movingText = circlesGroup.append("text")
    .attr("cx", d=> xLinearScale(d[chosenXAxis]))
    .attr("cy", d=> yLinearScale(d[chosenYAxis]))
    .attr("text-anchor", "middle")
    .style("font-size", "11")
    .text(function(data) {return data.abbr}).on("click", function(text){
        toolTip.show(text, this)}).on("mouseout", function(text){toolTip.hide(text)});
    
    
    
    // Create Points for axis lables
    var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${svgWidth / 2}, ${svgHeight + 20})`);
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(${svgWidth +20}, ${svgHeight / 2})`);
    // x Lables
    var poveryLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("Value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    var ageLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("Value", "age")
        .classed("inactive", true)
        .text("Age (Median)");
    var incomeLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("Value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");
    // y Labels
    var healthcareLable = labelsGroupY.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .attr("transform", "rotate(-90)")
        .attr("Value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    var obesityLable = labelsGroupY.append("text")
        .attr("x", 40)
        .attr("y", 0)
        .attr("Value", "obesity")
        .classed("inactive", true)
        .attr("transform", "rotate(-90)")
        .text("Obese (%)");
    var smokesLable = labelsGroupY.append("text")
        .attr("x", 60)
        .attr("y", 0)
        .attr("transform", "rotate(-90)")
        .attr("Value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");
    //updateToolTip Func
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
        return (`${data.state}<hr>Y-Data: ${data[chosenYAxis]}%<hr>Y-Data: ${data[chosenXAxis]}%`);
    });

    chartGroup.call(toolTip);

    movingGroup.on("mouseover", function(data){
        toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });
    

    // x axis lable event listener
    labelsGroupX.selectAll("text")
        .on("click", function(){
            var Value = d3.select(this).attr("Value");
            if (Value !== chosenXAxis) {
                // replaces chosen XAxis
                chosenXAxis = Value;
                // updates x scale new data
                xLinearScale = xScale(censusData, chosenXAxis);
                // update x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                // update circles with new x values
                movingGroup = renderXCircle(movingGroup, xLinearScale, chosenXAxis);
                // update circles with new info
                movingText = renderXText(movingText, xLinearScale, );

                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    poveryLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    poveryLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    poveryLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
    labelsGroupY.selectAll("text")
        .on("click", function(){
            var Value = d3.select(this).attr("Value");
            if (Value !== chosenYAxis){
                chosenYAxis = Value;
                yLinearScale = yScale(censusData, choseYAxis);
                yAxis = renderYAxes(yLinearScale, yAxis);
                movingGroup = renderYCircle(movingGroup, yLinearScale, chosenYAxis);
                movingText = renderYText(movingText, yLinearScale, chosenYAxis);

                if (chosenYAxis === "healthcare") {
                    obesityLable
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLable
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLable
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    obesityLable
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLable
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLable
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    obesityLable
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLable
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLable
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
    });
}


makeRsponsive();