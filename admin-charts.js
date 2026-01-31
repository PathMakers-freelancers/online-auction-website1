document.addEventListener('DOMContentLoaded', () => {
    // Helper to get CSS variable value
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    // Function to update chart colors based on current theme
    const updateChartTheme = () => {
        const textColor = getCssVar('--text-color');
        const gridColor = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)';

        // Update defaults
        Chart.defaults.color = textColor;
        Chart.defaults.scale.grid.color = gridColor;

        // Update specific chart instance datasets if needed (usually handled by re-render, 
        // but for simple text/grid updates, modifying defaults + update() works if we track instances)
    };

    // Initial Setup
    updateChartTheme();
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 10;

    // Capture colors once or on update (but for simplicity, we'll fetch them here)
    const ctxPrimary = getCssVar('--primary-color');
    const ctxAccent = getCssVar('--accent-color');
    const ctxSuccess = getCssVar('--success-color');
    const ctxWarning = getCssVar('--warning-color');
    const ctxDanger = getCssVar('--danger-color');

    // Store chart instances to update them later
    const charts = [];

    // 1. Revenue Performance (Bar/Column Chart)
    const revenueCtx = document.getElementById('revenueBarChart').getContext('2d');
    charts.push(new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue ($)',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                backgroundColor: ctxPrimary,
                borderRadius: 8,
                hoverBackgroundColor: ctxAccent
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } }
            }
        }
    }));

    // 2. User Growth (Line/Area Chart)
    const growthCtx = document.getElementById('growthLineChart').getContext('2d');
    charts.push(new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'New Users',
                data: [40, 65, 50, 85, 120, 100, 140],
                borderColor: ctxAccent,
                backgroundColor: 'rgba(247, 37, 133, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: ctxAccent
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } }
            }
        }
    }));

    // 3. Market Share (Pie Chart)
    const deviceCtx = document.getElementById('devicePieChart').getContext('2d');
    charts.push(new Chart(deviceCtx, {
        type: 'pie',
        data: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
                data: [55, 35, 10],
                backgroundColor: [ctxPrimary, ctxAccent, ctxSuccess],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20 } }
            }
        }
    }));

    // 4. User Engagement (Scatter Plot)
    const engagementCtx = document.getElementById('engagementScatterChart').getContext('2d');
    charts.push(new Chart(engagementCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Engagement Score',
                data: [
                    { x: 10, y: 20 }, { x: 15, y: 10 }, { x: 20, y: 30 },
                    { x: 25, y: 45 }, { x: 30, y: 40 }, { x: 35, y: 60 },
                    { x: 40, y: 80 }, { x: 45, y: 75 }, { x: 50, y: 90 }
                ],
                backgroundColor: ctxSuccess
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Sessions/Day' } },
                y: { title: { display: true, text: 'Engagement %' } }
            }
        }
    }));

    // 5. Traffic Density (Area Chart Mixed)
    const trafficCtx = document.getElementById('trafficAreaChart').getContext('2d');
    charts.push(new Chart(trafficCtx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Visits',
                data: [2000, 3500, 2800, 5000, 4200, 6000, 5500],
                borderColor: ctxPrimary,
                backgroundColor: 'rgba(67, 97, 238, 0.2)',
                fill: 'origin',
                tension: 0.5
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } }
            }
        }
    }));

    // 6. Regional Sales (Horizontal Bar Chart)
    const regionalCtx = document.getElementById('regionalBarChart').getContext('2d');
    charts.push(new Chart(regionalCtx, {
        type: 'bar',
        data: {
            labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America'],
            datasets: [{
                label: 'Sales ($)',
                data: [45000, 32000, 58000, 21000],
                backgroundColor: [ctxPrimary, ctxAccent, ctxSuccess, ctxWarning],
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true },
                y: { grid: { display: false } }
            }
        }
    }));

    // Theme Change Listener
    window.addEventListener('themeChanged', () => {
        updateChartTheme();

        // Re-read color variables as they might have changed with the class
        const newPrimary = getCssVar('--primary-color');
        const newAccent = getCssVar('--accent-color');
        const newSuccess = getCssVar('--success-color');
        const newWarning = getCssVar('--warning-color');

        // Update chart instances
        charts.forEach(chart => {
            // Update global defaults for this instance scales
            chart.options.scales.x && (chart.options.scales.x.grid.color = Chart.defaults.scale.grid.color);
            chart.options.scales.y && (chart.options.scales.y.grid.color = Chart.defaults.scale.grid.color);
            chart.options.color = Chart.defaults.color;

            // Note: Updating dataset colors nicely requires mapping specific datasets to vars,
            // which is a bit complex for a generic loop, but text/grid update is the priority.
            chart.update();
        });
    });
});
