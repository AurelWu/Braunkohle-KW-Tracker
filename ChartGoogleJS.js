google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    // Replace 'your-bucket-name' and 'your-file-key' with the actual S3 bucket and file information.
    const s3DataUrl = 'https://aurelwuensch-labs.s3.eu-central-1.amazonaws.com/www/language_timeseries.json?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJHMEUCIQCTVlNXA%2B4Em9TA7045b14y8bv1Pjjq8ZvVmlButscqGgIgN6K7radqje%2BDSVPHp%2BXRx4cfH26PDT2GR2sISzDn7mwq6AIIERABGgwxNDIxNjAxNTkxNDQiDNqfL%2BE%2BZZ6xTXljmCrFAm6vkja4gM24PF0E2yr2RGPOPC4k9%2BlKRM0%2BPBcq57rKATPizB3s2SriT3UX6Mt69zE5jvtLwYSaThV%2B6%2FNUKJpqUcJvE1xC5ngjUXVFL98hzDf6w847DULQ6VV6z0IX00SGzUUobbJeokn0p1kTIT3PVMsJdXiG%2BBGnKh9%2BpfFR%2FMG%2BIyEGpBWEPbQRN%2BKYUm3H057BHA8hhEp4X2517FZ4UqgctH7WeDvwS%2F9kFiQjoj86Q2RAbEBiC8wYcK8JpcDAnZ9Ig%2BtjNJZnaHh1ItymVaYsFSmnD7QbxUHgIuaaGbUusyFpgw3iL%2Fpm%2B599LvfdpOvMsv9ts%2Bmx0P9mX9gRF2q9gbfA%2B%2BtM9vfXm8oUHnWLW6yS1cQ3O28E0uo9%2Ba1qHEQYg4IoX2QM2yOtvV%2BLbCthyWToM6%2BMMAm1%2BK5yp3HnUDQw%2F6XTqQY6swLXRG0yRxU8bCE%2FMrptvrFuhMtjbP21xViiVNnow3q%2B%2BFFs%2FdC80klDnh%2FX%2B%2Bl%2F8To35tNWT7F6SJI1x3EgUIQJsBY5atBt7SF4r1QMYippwqn7w3pE31V0XWhwep1oLvmw6OYVRrInfcuAp0L3rWMdRcRjj8ELtlJHS7cgykltNHwFKTXgiuvNNcZUhtaHOPdcUUoRU80VIajqOe%2BY1gSZhlCJVcdelh44Q6Y4Eq6x0Z62o1waNqLenRtDxGG0e5mKqtbX3rGvwFCJmx4TiEv8zpdtpvIXI%2FkXcrpfaCgDDFW8xc2D%2FCR7bwL%2BS2%2BP86RXL1%2FlyrAni39NZ4VTKR%2FuFstIfv4bl8LbtYu40jZBcqMM6GESJ%2B7fvdkQptZQ0SYF6GiNiUXVNTc2%2FSqsB9YZr4ln&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231022T080817Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIASCGLH4GUEHQ53KY4%2F20231022%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Signature=5661f5390baae034a6d5636f801732b8de16defbd3cd6bfb788f05afe02d85c0';

    // Load the JSON data from the S3 bucket
    fetch(s3DataUrl)
    .then(response => response.json())
    .then(data => {
        // Group the data by language_code
        const groupedData = {};
        data.forEach(item => {
            if (!groupedData[item.language_code]) {
                groupedData[item.language_code] = [];
            }
            groupedData[item.language_code].push([item.timestamp, parseFloat(item.amount)]);
        });

        // Create an array of series for the chart
        const seriesData = [['Timestamp']].concat(Object.entries(groupedData).map(([languageCode, data]) => [languageCode, ...data]));

        const chartData = google.visualization.arrayToDataTable(seriesData);

        const options = {
            title: 'Multi-Series Line Chart',
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        const chart = new google.visualization.LineChart(document.getElementById('lineChart'));
        chart.draw(chartData, options);
    })
    .catch(error => {
        console.error('Error loading JSON data from S3:', error);
    });
}
