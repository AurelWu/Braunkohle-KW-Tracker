// Function to fetch the JSON data and create the chart
function createChart() {
    // Replace 'your_s3_json_url' with the actual URL of your JSON data in the S3 bucket
    fetch('https://aurelwuensch-labs.s3.eu-central-1.amazonaws.com/aozora/languages.json?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJGMEQCIHM7HXlMm62g0BjvFO%2BBnt3KPtqtyauPs7RjOqvsB%2BbWAiBwbbJPajFQH6kFyb8akP4ZPNAun6FDzq%2FPgAEzClMi8CrxAgjw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDE0MjE2MDE1OTE0NCIMolhdfQkeezaXiFjXKsUC4DewI0egDMAni83QH5YWU%2BXREruuPKdg7MUtG%2Bgb9uY2tsOZYfzKp1jRe%2BuT%2Fd4jJG3NJnEJUXva7rPtYOBy%2BTYPn%2BPw%2BgrtyyB%2By76VYVe97RDEBXKxgqCORkQ440uZwygXCWtPghf2HnY2NQ59cdVkRDqiBWB9atYyje87f0l60dCQmbTjmolxcKjgLxYlZr8Ars9bEO1rz1j5ysKRNSaNLYXu40aU4E%2Bka2L9Au%2B3rGuYVUpp0yFWWnJRQSAwbZLJXYIOgy1sqbFcB5x%2BCZk8sRkx87m7Tk9fgcNHEFd%2BLxMEw7eRiD6YljYm1gV4H2T7afdI%2F%2FXHxTsOpwr4YmK8xoxrV8OjaKViMA9BuQ%2FP667e1iemiSueiNbkslL%2FzRDBvpTXxhfaipr12kJ19aJDg3XbXsOtOmtxaMbVktP4NcGrYTD40M%2BpBjq0An5kC3sU%2FLUg%2F97wkr3WoVWAb7hnS9mtReQhJAVzArY8hfTzLg4kbNJuwMx%2Bs%2F1a3zB%2FY4R6LIJEVbk6ZM3q41O0EN5uWwDo6k6wWVabSC%2B1SsbCB6hCm9CzT13AzIcQlO7nz%2B05a2DKA5wIj6f68%2FPTyXhTt%2Bz04D6FYHSOF%2BUeehSabGlYnmXXLE2%2FceSdOFqLTBSQm2NpdYl46cqyzmQEPfkQSfcv9WNC7lnD25tl4SqMdS4sH3CfxfSCN8gwzOrIv%2FMwx8t0%2BywzHoWVisB21ZhRIeKIXTxT8hCZ7Hw1sqxe17w0%2Fcz%2Bii4Hz6f53%2BprX4JU6hxax%2Btbk2O3T7ItVq%2FdEPpV9Tzig1ovxb2qDlSv1gmiY5esTtQJkJrrszI9avxI7CunqNdxE60FxOtdCiQi&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231021T181909Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIASCGLH4GUGGZQE3NI%2F20231021%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Signature=7ecd093d648fdbe218f44f79a8dbb856b5bfa3abb1dedde1e03253aee2874268')
        .then((response) => response.text())
        .then((dataText) => {
            // Split the text into individual JSON objects
            const jsonObjects = dataText.trim().split('\n');

            // Create an object to track the post counts for each language
            const languageCounts = {};

            jsonObjects.forEach((jsonObject) => {
                const data = JSON.parse(jsonObject);
                for (const language in data.languages) {
                    const count = data.languages[language] || 0;
                    languageCounts[language] = (languageCounts[language] || 0) + count;
                }
            });

            // Sort the languages by post count and select the top 5
            const topLanguages = Object.keys(languageCounts)
                .sort((a, b) => languageCounts[b] - languageCounts[a])
                .slice(0, 5);

            // Process and aggregate the data for the top 5 languages
            const labels = [];
            const datasets = {};

            jsonObjects.forEach((jsonObject) => {
                const data = JSON.parse(jsonObject);
                labels.push(data.timestamp);

                for (const language of topLanguages) {
                    if (!datasets[language]) {
                        datasets[language] = {
                            label: language,
                            data: [],
                            fill: false,
                            borderColor: getRandomColor(),
                        };
                    }
                    datasets[language].data.push(data.languages[language] || 0);
                }
            });

            const chartData = {
                labels: labels,
                datasets: Object.values(datasets),
            };

            const chartOptions = {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Timestamp',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Language Count',
                        },
                    },
                },
            };

            // Get the chart canvas element
            const chartCanvas = document.getElementById('languageChart');

            // Set the height of the chart canvas
            chartCanvas.height = 400; // Set the desired height in pixels
            chartCanvas.length = 1000;

            const ctx = chartCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions,
            });
        })
        .catch((error) => {
            console.error('Error fetching data: ', error);
        });
}

// Call the function to create the chart
createChart();

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
