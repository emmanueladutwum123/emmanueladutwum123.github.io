// skills-chart.js - Interactive Radar Chart for Quantitative Skills
(function() {
    'use strict';
    
    function createSkillsChart() {
        const ctx = document.getElementById('skillsChart');
        if (!ctx) {
            console.warn('Skills chart canvas not found');
            return;
        }
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }
        
        // Quantitative skills data for a quant researcher
        const skillsData = {
            labels: [
                'C++ Programming', 
                'Python Development', 
                'Statistical Modeling', 
                'Quant Finance', 
                'Machine Learning', 
                'Algorithms', 
                'Mathematics', 
                'Data Structures'
            ],
            datasets: [{
                label: 'Technical Proficiency',
                data: [96, 98, 94, 95, 92, 97, 99, 96],
                fill: true,
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                borderColor: '#64ffda',
                pointBackgroundColor: '#64ffda',
                pointBorderColor: '#0a192f',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 9,
                pointHoverBackgroundColor: '#64ffda',
                pointHoverBorderColor: '#0a192f',
                pointHoverBorderWidth: 3
            }]
        };
        
        // Create radar chart
        const chart = new Chart(ctx, {
            type: 'radar',
            data: skillsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(136, 146, 176, 0.3)',
                            lineWidth: 1
                        },
                        grid: {
                            color: 'rgba(136, 146, 176, 0.2)',
                            circular: true
                        },
                        pointLabels: {
                            color: '#ccd6f6',
                            font: {
                                size: 14,
                                family: "'Inter', sans-serif",
                                weight: '500'
                            },
                            padding: 15
                        },
                        ticks: {
                            display: true,
                            backdropColor: 'transparent',
                            color: 'rgba(136, 146, 176, 0.6)',
                            font: {
                                size: 10
                            },
                            stepSize: 10,
                            maxTicksLimit: 6,
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        suggestedMin: 70,
                        suggestedMax: 100,
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#ccd6f6',
                            font: {
                                size: 14,
                                family: "'Inter', sans-serif"
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 25, 47, 0.95)',
                        titleColor: '#64ffda',
                        bodyColor: '#ccd6f6',
                        borderColor: '#64ffda',
                        borderWidth: 1,
                        cornerRadius: 6,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                return skillsData.labels[tooltipItems[0].dataIndex];
                            },
                            label: function(context) {
                                const value = context.raw;
                                let proficiency = '';
                                
                                if (value >= 95) proficiency = 'Expert';
                                else if (value >= 85) proficiency = 'Advanced';
                                else if (value >= 75) proficiency = 'Intermediate';
                                else proficiency = 'Basic';
                                
                                return `${value}% - ${proficiency} Level`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
        
        // Add animation on scroll
        let animated = false;
        function animateOnScroll() {
            const chartPosition = ctx.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (!animated && chartPosition.top < windowHeight * 0.8) {
                animated = true;
                
                // Animate data points
                const originalData = [...skillsData.datasets[0].data];
                skillsData.datasets[0].data = originalData.map(() => 70);
                
                chart.update();
                
                // Animate to actual values
                let progress = 0;
                const duration = 1500;
                const startTime = Date.now();
                
                function animateChart() {
                    const currentTime = Date.now();
                    progress = Math.min(1, (currentTime - startTime) / duration);
                    
                    skillsData.datasets[0].data = originalData.map(value => 
                        70 + (value - 70) * progress
                    );
                    
                    chart.update();
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateChart);
                    }
                }
                
                requestAnimationFrame(animateChart);
            }
        }
        
        // Check on load and scroll
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
        
        // Export chart for debugging
        window.skillsChart = chart;
        
        console.log('✅ Skills chart created successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSkillsChart);
    } else {
        createSkillsChart();
    }
    
    // Export for module systems (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { createSkillsChart };
    }
})();
