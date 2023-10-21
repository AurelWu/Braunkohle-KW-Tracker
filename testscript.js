// Function to fetch the JSON data and create the chart
function createChart() {
    // Replace 'your_s3_json_url' with the actual URL of your JSON data in the S3 bucket
    fetch('your_s3_json_url')
        .then((response) => response.json())
        .then((data) => {
            const timestamps = data.map((item) => item.timestamp);
            const languages = data.map((item) => item.languages);

            const chartData = {
                labels: timestamps,
                series: [],
            };

            for (const language of Object.keys(languages[0])) {
                if (languages.some((langObj) => langObj[language] > 0)) {
                    chartData.series.push({
                        name: language,
                        data: languages.map((langObj) => langObj[language] || 0),
                    });
                }
            }

            const chartOptions = {
                fullWidth: true,
                chartPadding: {
                    right: 40,
                },
                axisY: {
                    onlyInteger: true,
                },
                plugins: [
                    Chartist.plugins.legend({
                        legendNames: chartData.series.map((series) => series.name),
                    }),
                ],
            };

            new Chartist.Line('.ct-chart', chartData, chartOptions);
        })
        .catch((error) => {
            console.error('Error fetching data: ', error);
        });
}

// Call the function to create the chart
createChart();
