// Function to fetch the JSON data from S3 and create the D3.js line chart
function fetchDataAndCreateChart() {
    // Replace 'your_s3_json_url' with the actual URL of your JSON data in the S3 bucket
    fetch('https://aurelwuensch-labs.s3.eu-central-1.amazonaws.com/aozora/languages.json?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJGMEQCIHM7HXlMm62g0BjvFO%2BBnt3KPtqtyauPs7RjOqvsB%2BbWAiBwbbJPajFQH6kFyb8akP4ZPNAun6FDzq%2FPgAEzClMi8CrxAgjw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDE0MjE2MDE1OTE0NCIMolhdfQkeezaXiFjXKsUC4DewI0egDMAni83QH5YWU%2BXREruuPKdg7MUtG%2Bgb9uY2tsOZYfzKp1jRe%2BuT%2Fd4jJG3NJnEJUXva7rPtYOBy%2BTYPn%2BPw%2BgrtyyB%2By76VYVe97RDEBXKxgqCORkQ440uZwygXCWtPghf2HnY2NQ59cdVkRDqiBWB9atYyje87f0l60dCQmbTjmolxcKjgLxYlZr8Ars9bEO1rz1j5ysKRNSaNLYXu40aU4E%2Bka2L9Au%2B3rGuYVUpp0yFWWnJRQSAwbZLJXYIOgy1sqbFcB5x%2BCZk8sRkx87m7Tk9fgcNHEFd%2BLxMEw7eRiD6YljYm1gV4H2T7afdI%2F%2FXHxTsOpwr4YmK8xoxrV8OjaKViMA9BuQ%2FP667e1iemiSueiNbkslL%2FzRDBvpTXxhfaipr12kJ19aJDg3XbXsOtOmtxaMbVktP4NcGrYTD40M%2BpBjq0An5kC3sU%2FLUg%2F97wkr3WoVWAb7hnS9mtReQhJAVzArY8hfTzLg4kbNJuwMx%2Bs%2F1a3zB%2FY4R6LIJEVbk6ZM3q41O0EN5uWwDo6k6wWVabSC%2B1SsbCB6hCm9CzT13AzIcQlO7nz%2B05a2DKA5wIj6f68%2FPTyXhTt%2Bz04D6FYHSOF%2BUeehSabGlYnmXXLE2%2FceSdOFqLTBSQm2NpdYl46cqyzmQEPfkQSfcv9WNC7lnD25tl4SqMdS4sH3CfxfSCN8gwzOrIv%2FMwx8t0%2BywzHoWVisB21ZhRIeKIXTxT8hCZ7Hw1sqxe17w0%2Fcz%2Bii4Hz6f53%2BprX4JU6hxax%2Btbk2O3T7ItVq%2FdEPpV9Tzig1ovxb2qDlSv1gmiY5esTtQJkJrrszI9avxI7CunqNdxE60FxOtdCiQi&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231021T181909Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIASCGLH4GUGGZQE3NI%2F20231021%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Signature=7ecd093d648fdbe218f44f79a8dbb856b5bfa3abb1dedde1e03253aee2874268')
        .then((response) => response.text())
        .then((dataText) => {
            const data = dataText.trim().split('\n').map((item) => JSON.parse(item));

            // Create an object to track the post counts for each language
            const languageCounts = {};

            // Define the interval duration in milliseconds (15 minutes)
            const intervalDuration = 15 * 60 * 1000;

            data.forEach((dataObject) => {
                const timestamp = new Date(dataObject.timestamp).getTime();
                
                // Calculate the start of the 15-minute interval
                const intervalStart = Math.floor(timestamp / intervalDuration) * intervalDuration;

                for (const language in dataObject.languages) {
                    const count = dataObject.languages[language] || 0;

                    // Create a key for the language and interval
                    const key = `${language}-${intervalStart}`;

                    // Initialize the count for this key
                    if (!languageCounts[key]) {
                        languageCounts[key] = 0;
                    }

                    // Add the count for this language and interval
                    languageCounts[key] += count;
                }
            });

            // Sort the languages by post count
            const sortedLanguages = Object.keys(languageCounts).sort(
                (a, b) => languageCounts[b] - languageCounts[a]
            );

            // Define the number of top languages to display
            const topLanguageCount = 5;

            // Separate the top N languages and group the rest as "Other"
            const topLanguages = sortedLanguages.slice(0, topLanguageCount);
            const otherLanguages = sortedLanguages.slice(topLanguageCount);

            // Process and aggregate the data for the top languages and "Other"
            const chartData = [];

            data.forEach((dataObject) => {
                const timestamp = new Date(dataObject.timestamp).getTime();
                
                // Calculate the start of the 15-minute interval
                const intervalStart = Math.floor(timestamp / intervalDuration) * intervalDuration;
                
                for (const language of topLanguages) {
                    const [languageName, intervalStart] = language.split('-');
                    if (!chartData[languageName]) {
                        chartData[languageName] = {
                            label: languageName,
                            data: [],
                        };
                    }
                    
                    // Find the count for this language and interval
                    const key = `${languageName}-${intervalStart}`;
                    chartData[languageName].data.push(languageCounts[key] || 0);
                }
                
                // Group the post counts for other languages
                const otherCount = otherLanguages.reduce((total, lang) => {
                    const [languageName, intervalStart] = lang.split('-');
                    if (intervalStart === intervalStart) {
                        return total + (languageCounts[lang] || 0);
                    }
                    return total;
                }, 0);
                
                if (!chartData.Other) {
                    chartData.Other = {
                        label: 'Other',
                        data: [],
                    };
                }
                chartData.Other.data.push(otherCount);
            });

            // Add the D3.js chart creation code here.
            // You should integrate this code into your D3.js application.
            const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleTime()
    .domain([new Date(data[0].timestamp), new Date(data[data.length - 1].timestamp)])
    .range([0, width]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(Object.values(d.languages))])
    .range([height, 0]);

const line = d3.line()
    .x(d => x(new Date(d.timestamp)))
    .y(d => y(d3.sum(Object.values(d.languages)));

const languages = Object.keys(data[0].languages);
const color = d3.scaleOrdinal(d3.schemeCategory10);

languages.forEach(language => {
    const languageData = data.map(d => {
        return {
            timestamp: new Date(d.timestamp),
            count: d.languages[language] || 0
        };
    });

    svg.append("path")
        .datum(languageData)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", color(language));
});

        })
        .catch((error) => {
            console.error('Error fetching data: ', error);
        });
}

// Call the function to fetch data and create the chart
fetchDataAndCreateChart();
