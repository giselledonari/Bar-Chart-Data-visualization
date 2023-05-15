fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then((response)=>response.json())
.then((data)=>{
   let realData=data.data
    information(realData)
})
.catch((error)=>{
console.log(error)})



let information=(data)=>{
    //set dimensions and margins of the graph
    const margin={top:30, right:30, bottom:70, left:60};
    const width=800-margin.left-margin.right;
    const height=500-margin.top-margin.bottom

    //min-max X,Y
    let minX=(new Date(d3.min(data,(d)=>d[0])))
    let maxX=(new Date(d3.max(data,(d)=>d[0])))
    let minY=d3.min(data,(d)=>d[1]);
    let maxY=d3.max(data,(d)=>d[1]);
    
    //apend the svg object
    let svg=d3.select("#grafico")
    .append("svg")
        .attr("width",width+margin.left+margin.right)
        .attr("height",height+margin.top+margin.bottom)
        .attr("class","grafico")
    .append("g")
        .attr("transform", `translate (${margin.left},${margin.top})`)
    

    //X axis
    let x=d3.scaleBand()
    .range([0,width])
    .domain(data.map(d=>d[0]))
    .padding(0.2);

    //X axisScale
    let xAxisScale=d3.scaleTime()
    .domain([minX,maxX])
    .range([0.2,width-0.2]) //padding,width-padding

    svg.append("g")
    .attr("id","x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xAxisScale))
    .selectAll("text")

    

    //Y axis
    let y=d3.scaleLinear()
    .domain([0,maxY])
    .range([height,0])

    svg.append("g")
    .attr("id","y-axis")
    .call(d3.axisLeft(y))

    //mouseover tooltip
    let tooltip = d3.select("#grafico")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .attr("id", "tooltip")

    // funciones del mouseover
    var mouseover = function(event,d) {
        let fecha=d[0]
        let valor= d[1];
        tooltip
            .html(`Fecha: ${fecha} <br>Valor: ${valor}`)
            .style("opacity", 1);
        
        d3.select(this).attr("class","barOn");
        document.querySelector("#tooltip").setAttribute("data-date",d[0])
    }
    var mousemove = function(event,d) {
        tooltip.style("transform","translateY(10%)")
        .style("left",(event.x)*0.7+"px")
        .style("top",(event.y)*0.7-30+"px")
    }
    var mouseleave = function(event,d) {
        tooltip.style("opacity", 0);
        
        d3.select(this).attr("class","bar")
    }

    //bars
    svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
        .attr("class","bar")
        .attr("x",(d)=>{return x(d[0])})
        .attr("y",(d)=>{return y(d[1])})
        .attr("width", x.bandwidth())
        .attr("height",(d)=>{return height-y(d[1])})
        .attr("data-date",(d)=>{return (d[0])})
        .attr("data-gdp",(d)=>{return (d[1])})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)   
      
    //titulos

    svg.append("text")
    .attr("transform",`translate(${(width/2 )-60},-5)`)
    .attr("class","titulo")
    .attr("id","title")
    .text("United States GDP")
  
    svg.append("text")
    .attr("class","eje")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product");

    svg.append("text")
    .attr("class","eje")
    .attr("transform", `translate(${(width-200)}, ${(height + margin.top+20)})`)
    .style("text-anchor", "middle")
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");
}

