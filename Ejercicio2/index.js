//JavaScript part of "Ejercicio 2"

window.onload = function(){
    //Initialize attributs:
    //Will contain all Parse data    
    var allData = [];
    //Will contain data used by LineChart graph with addapted format
    var myLineSeries= [];
    //Will contain data used by PieChart graph with addapted format
    var myPieSeries= [];

    //Call function in order to get online JSon data and plot all graph
    getAndPlotData();

    function getAndPlotData(){
        //Recover data from first link
        $.getJSON("http://s3.amazonaws.com/logtrust-static/test/test/data1.json", function(data) {
        //for each set of data into json file crate a dictionary with data values and add it to our attribut allData.
        for (var i = 0; i < data.length; i++) {
            var date = new Date(data[i].d);
            allData.push(dict = {
                "date": date,
                "value": data[i].value,
                "cat": data[i].cat.toUpperCase()
              });
        }
        });

        //Recover data from second link
        $.getJSON("http://s3.amazonaws.com/logtrust-static/test/test/data2.json", function(data) {
        //for each set of data into json file crate a dictionary with data values and add it to our attribut allData.
        for (var i = 0; i < data.length; i++) {
            var date = new Date(data[i].myDate);
            allData.push(dict = {
                "date": date,
                "value": data[i].val,
                "cat": data[i].categ.toUpperCase()
                })
            }
        });

        //Recover data from thirst link
        $.getJSON("http://s3.amazonaws.com/logtrust-static/test/test/data3.json", function(data) {
        //for each set of data into json file crate a dictionary with data values and add it to our attribut allData.
        for (var i = 0; i < data.length; i++) {
            var strVal = data[i].raw;
            myDate = strVal.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
            myCat = strVal.split("#");
            myCat = myCat[1];
            var date = new Date(myDate[0]);
            allData.push(dict = {
                "date": date,
                "value": data[i].val,
                "cat": myCat.toUpperCase()
            });
        }

        //At this point we have got all the data from 3 link into our attributs all data
        //Now we need to organize all this data in the aim of realize ours plots.
        //We create a function that will return unique values of an array of values.
        const unique = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        //From array of dict we recover an array (of category)
        var catVal = allData.map(obj => obj.cat);
        //Get unique values into this array
        catVal = catVal.filter(unique);
        //For each category type (from unique value), we organize ours attribut used to make plots
        for (j=0; j<catVal.length; j++){
            //For a category add a new dict (this format is addapted for highchart serie format.)
            myLineSeries.push(dict = {
                "name": catVal[j],
                "data": [],
            });
            //Treat repeated Data
            //Sort category data by date
            var myCat = allData.filter((obj) => obj.cat == catVal[j]);
            var myCatLength = myCat.length;
            myCat = myCat.sort(function(a,b) {
                return a.date - b.date;
            });
            //Loop into all data from last to first
            for (i=myCat.length-1; i>=1; i--){
                //If date of data[i] and data[i-1] are the same
                if(myCat[i].date.getDate() == myCat[i-1].date.getDate() & myCat[i].date.getMonth() == myCat[i-1].date.getMonth()
                & myCat[i].date.getFullYear() == myCat[i-1].date.getFullYear()){
                    //Actualiza dat[i-1] value and delete data[i]
                    myCat[i-1].value += myCat[i].value 
                    myCat.splice(i,1)
                }
                else{
                    //Add to our attribut for the lineChart specific format values.
                    myLineSeries[j].data.push([Date.UTC(myCat[i].date.getFullYear(),myCat[i].date.getMonth(),myCat[i].date.getDate()), myCat[i].value])
                }
            }
            //Don't forget the first element of the array:
            myLineSeries[j].data.push([Date.UTC(myCat[0].date.getFullYear(),myCat[0].date.getMonth(),myCat[0].date.getDate()), myCat[0].value])
            //Reverse the array because HighChart prefer to have ordered values.
            myLineSeries[j].data = myLineSeries[j].data.reverse();
            //Add to our attribut for the PieChart specific format values.
            myPieSeries.push(dict = {
                "name": catVal[j],
                "y": (myCatLength*100/allData.length), //this is the percent of data of a category
            });
        }
        //All data are ready to be used in order to generate ours plots
        //We call a function in order to generate ours highcharts plots.
        actualizeChart();
        });

    }
    
    //This function is used to generate the 2 highcharts plots
    function actualizeChart(){
        //First Line Chart
        //Can see highchart documentation in order to modify specificity of the chart.
        Highcharts.chart('container', {
            title: {
                text: 'HighChart - Multi Line Chart'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 100
            },
            xAxis: {
                type: 'datetime',
            },
            series: myLineSeries
        });
        //Second Pie Chart
        //Can see highchart documentation in order to modify specificity of the chart.
        Highcharts.chart('Piecontainer', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'HighChart - Pie Chart'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Share',
                data: myPieSeries
            }]
        });
    }
    
    
}
