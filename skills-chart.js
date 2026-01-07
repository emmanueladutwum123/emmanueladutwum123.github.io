// skills-chart.js
function createSkillsChart() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        // Load Chart.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = initChart;
        document.head.appendChild(script);
    } else {
        initChart();
    }
    
    function initChart() {
        const ctx = document.getElementById('skillsChart');
        if (!ctx) {
            console.log('Skills chart canvas not found');
            return;
        }
        
        const skillsData = {
            labels: ['C++', 'Python', 'Statistical Modeling', 'Quant Finance', 'Machine Learning', 'Algorithms', 'Mathematics', 'Data Structures'],
            datasets: [{
                label: 'Technical Proficiency',
                data: [95, 98, 92, 94, 90, 96, 97, 95],
                fill: true,
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                borderColor: '#64ffda',
                pointBackgroundColor: '#64ffda',
                pointBorderColor: '#0a192f',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        };
        
        new Chart(ctx, {
            type: 'radar',
            data: skillsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(136, 146, 176, 0.3)'
                        },
                        grid: {
                            color: 'rgba(136, 146, 176, 0.2)'
                        },
                        pointLabels: {
                            color: '#ccd6f6',
                            font: {
                                size: 13,
                                family: "'Inter', sans-serif"
                            }
                        },
                        ticks: {
                            display: false,
                            maxTicksLimit: 5
                        },
                        suggestedMin: 70,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ccd6f6',
                            font: {
                                size: 14,
                                family: "'Inter', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 25, 47, 0.9)',
                        titleColor: '#64ffda',
                        bodyColor: '#ccd6f6',
                        borderColor: '#64ffda',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSkillsChart);
} else {
    createSkillsChart();
}
