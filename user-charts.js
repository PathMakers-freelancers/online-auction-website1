document.addEventListener('DOMContentLoaded', () => {
    // Helper to get CSS variable value
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    // Store chart instances
    window.userCharts = {};

    // Function to update chart colors based on current theme
    const updateChartTheme = () => {
        const textColor = getCssVar('--text-color');
        const gridColor = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)';

        // Update Chart.js defaults
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = gridColor;
        Chart.defaults.scale.grid.color = gridColor;

        // If reusing instances, we could update them here. 
        // For simplicity and to ensure full config reload (like grid colors), we can re-init or update options.
        // Given existing structure used re-init, we can stick to that or just update inputs if we want smooth transitions.
        // But let's stick to the Admin dashboard pattern which is "set vars, then init/update".
    };

    const initCharts = () => {
        // Prepare colors
        updateChartTheme();
        const ctxPrimary = getCssVar('--primary-color');
        const ctxAccent = getCssVar('--accent-color');
        const ctxSuccess = getCssVar('--success-color');
        const ctxWarning = getCssVar('--warning-color');
        const ctxDanger = getCssVar('--danger-color');

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 10
                }
            },
            scales: {
                x: { grid: { display: false } }, // Clean look by default
                y: { beginAtZero: true }
            }
        };

        // Destroy existing
        Object.values(window.userCharts).forEach(chart => chart && chart.destroy());

        // 1. Bar Chart - Monthly Expenses
        const barCtx = document.getElementById('userBarChart').getContext('2d');
        window.userCharts.bar = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Expenses ($)',
                    data: [1200, 1900, 3000, 5000, 2000, 3000],
                    backgroundColor: ctxPrimary,
                    borderRadius: 5,
                    hoverBackgroundColor: ctxAccent
                }]
            },
            options: commonOptions
        });

        // 2. Line Chart - Project Completion
        const lineCtx = document.getElementById('userLineChart').getContext('2d');
        window.userCharts.line = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Tasks Completed',
                    data: [5, 12, 18, 25, 30, 42],
                    borderColor: ctxAccent,
                    backgroundColor: 'rgba(247, 37, 133, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: ctxAccent
                }]
            },
            options: commonOptions
        });

        // 3. Pie Chart - Resource Allocation
        const pieCtx = document.getElementById('userPieChart').getContext('2d');
        window.userCharts.pie = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Development', 'Design', 'Marketing', 'Research'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [ctxPrimary, ctxAccent, ctxSuccess, ctxWarning],
                    borderWidth: 0
                }]
            },
            options: {
                ...commonOptions,
                scales: {} // Pie charts don't need axes
            }
        });

        // 4. Scatter Plot
        const scatterCtx = document.getElementById('userScatterChart').getContext('2d');
        window.userCharts.scatter = new Chart(scatterCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Task Data',
                    data: [{ x: 2, y: 4 }, { x: 3, y: 7 }, { x: 5, y: 8 }, { x: 7, y: 15 }, { x: 8, y: 12 }, { x: 10, y: 20 }],
                    backgroundColor: ctxSuccess
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    x: { title: { display: true, text: 'Complexity' } },
                    y: { title: { display: true, text: 'Hours' } }
                }
            }
        });

        // 5. Column Chart
        const colCtx = document.getElementById('userColumnChart').getContext('2d');
        window.userCharts.column = new Chart(colCtx, {
            type: 'bar',
            data: {
                labels: ['Web', 'Mobile', 'UI/UX', 'SEO'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [8500, 6200, 4100, 2100],
                    backgroundColor: ctxAccent,
                    borderRadius: 5
                }]
            },
            options: commonOptions
        });

        // 6. Waterfall Chart
        // Chart.js doesn't have native waterfall, usually simulated with floating bars.
        // Keeping it simple as a bar chart for now or using the existing logic if it worked well.
        // The previous code implementation for waterfall was a standard bar but with specific data structure. 
        // We will preserve the data structure used previously.
        const waterCtx = document.getElementById('userWaterfallChart').getContext('2d');
        window.userCharts.waterfall = new Chart(waterCtx, {
            type: 'bar',
            data: {
                labels: ['Total', 'Dev', 'Ops', 'Marketing', 'Balance'],
                datasets: [{
                    label: 'Budget Flow',
                    data: [[0, 10000], [7000, 10000], [5000, 7000], [3000, 5000], [0, 3000]], // Floating bars data
                    backgroundColor: [ctxPrimary, ctxDanger, ctxDanger, ctxDanger, ctxSuccess],
                    borderRadius: 5
                }]
            },
            options: commonOptions
        });
    };

    // Initial Init
    initCharts();

    // Data Export Functionality
    const exportData = () => {
        const charts = window.userCharts;
        let csvContent = "data:text/csv;charset=utf-8,Section,Label,Value\n";

        // Collect data from various charts
        if (charts.bar) {
            charts.bar.data.labels.forEach((label, i) => {
                csvContent += `Monthly Expenses,${label},${charts.bar.data.datasets[0].data[i]}\n`;
            });
        }
        if (charts.line) {
            charts.line.data.labels.forEach((label, i) => {
                csvContent += `Completion Trend,${label},${charts.line.data.datasets[0].data[i]}\n`;
            });
        }
        if (charts.pie) {
            charts.pie.data.labels.forEach((label, i) => {
                csvContent += `Resource Allocation,${label},${charts.pie.data.datasets[0].data[i]}\n`;
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bidnexus_analytics_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Simple feedback
        const btn = document.getElementById('export-data-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Exported!';
        btn.style.background = 'var(--success-color)';
        btn.style.color = '#000';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'var(--bg-color)';
            btn.style.color = 'var(--text-color)';
        }, 2000);
    };

    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    // Theme Listener
    window.addEventListener('themeChanged', () => {
        // Re-init to pick up new CSS variable values (colors)
        initCharts();
    });
});
