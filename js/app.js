async function getData() {
    //#region fetch data
    let response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    let values = await response.json();
    let dataset = values.data;
    console.table(dataset);
    //#endregion

    //#region variables
    let height = 400,
        width = 800,
        barWidth = width/dataset.length;
    //#endregion

    //#region  Tooltip
    let tooltip = d3.select(".box").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);  

//#endregion

    //#region  graphSVG
    let graphSVG = d3.select('#chart')
        .append('svg')
        .attr('width', width + 100)
        .attr('height', height + 100);

    //#endregion  
    
    //#region Axis
    let years = dataset.map(item => {
        let quarter;
        let temp = item[0].substring(5, 7);
        
        if(temp === '01') {
          quarter = 'Q1';
        }
        else if (temp === '04'){
          quarter = 'Q2';
        }
        else if(temp === '07') {
          quarter = 'Q3';
        }
        else if(temp ==='10') {
          quarter = 'Q4';
        }
    
        return item[0].substring(0, 4) + ' ' + quarter
    })

    let yearsDate = dataset.map(item => new Date(item[0]));
    let max = new Date(d3.max(yearsDate));
    /* max.setMonth(max.getMonth() + 3); */
    let xScale = d3.scaleTime()
        .domain([d3.min(yearsDate), max])
        .range([0, width]);
    
    let GDP = dataset.map(item => item[1]);
    let gdpMax = d3.max(GDP)
    let gdpMin = d3.min(GDP)
    
    let yScale = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([height, 0]);

    let linearScale =  d3.scaleLinear()
        .domain([0, gdpMax])
        .range([0, height]);

    let axisX = d3.axisBottom().scale(xScale);
    let axisY = d3.axisLeft().scale(yScale);


    graphSVG.append('g')
    .attr('transform', 'translate(50, 450)')
    .attr('id', 'x-axis')
    .call(axisX);

    graphSVG.append('g')
    .attr('transform', 'translate(50, 50)')
    .attr('id', 'y-axis')
    .call(axisY);
    //#endregion
        
    let scaledGDP = GDP.map(item =>  linearScale(item))

    d3.select('svg').selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', (d,i) => dataset[i][0])
        .attr('data-gdp', (d,i) => GDP[i])
        .attr('width', barWidth)
        .attr('height', (d,i) => d)
        .attr('x', (d,i) => xScale(yearsDate[i]))
        .attr('y', (d,i) => height - d)
        .attr('transform', 'translate(50, 50)')
        .on('mouseover', (d,i) => {
            tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9)
                    .attr('data-date', dataset[i][0])
                    .attr('data-gdp', (d,i) => GDP[i])
            tooltip.html(`
                <p>${years[i]}<p>
                <p>$ ${GDP[i]} Billion<p>
            `)
            .style('left', (i*barWidth) + 10 + 'px' )
            .style('top', height - 200 + 'px')
            .style('transform', 'translateX(60px)');
        })
        .on('mouseout', (d,i) => {
            tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        })


   



}
window.onload = getData;


 
