// black-scholes.js - Interactive Options Pricing Calculator
(function() {
    'use strict';
    
    class BlackScholesCalculator {
        constructor() {
            this.chart = null;
            this.defaults = {
                stockPrice: 100,
                strikePrice: 100,
                timeToExpiry: 1.0,
                volatility: 0.3,
                riskFreeRate: 0.05
            };
            this.init();
        }
        
        init() {
            this.createUI();
            this.bindEvents();
            this.calculateAndUpdate();
        }
        
        createUI() {
            const container = document.getElementById('bsCalculatorContainer');
            if (!container) {
                console.error('Black-Scholes calculator container not found');
                return;
            }
            
            container.innerHTML = `
                <div class="bs-calculator">
                    <h3><i class="fas fa-calculator"></i> Interactive Black-Scholes Options Pricing Calculator</h3>
                    
                    <div class="bs-controls">
                        <div class="bs-input-group">
                            <label for="bs-stock-price">Stock Price (S)</label>
                            <div class="slider-container">
                                <input type="range" id="bs-stock-price" min="50" max="200" value="${this.defaults.stockPrice}" step="1">
                            </div>
                            <span id="bs-stock-price-value">$${this.defaults.stockPrice}</span>
                        </div>
                        
                        <div class="bs-input-group">
                            <label for="bs-strike-price">Strike Price (K)</label>
                            <div class="slider-container">
                                <input type="range" id="bs-strike-price" min="50" max="200" value="${this.defaults.strikePrice}" step="1">
                            </div>
                            <span id="bs-strike-price-value">$${this.defaults.strikePrice}</span>
                        </div>
                        
                        <div class="bs-input-group">
                            <label for="bs-time">Time to Expiry (T)</label>
                            <div class="slider-container">
                                <input type="range" id="bs-time" min="0.1" max="2" value="${this.defaults.timeToExpiry}" step="0.1">
                            </div>
                            <span id="bs-time-value">${this.defaults.timeToExpiry} year</span>
                        </div>
                        
                        <div class="bs-input-group">
                            <label for="bs-volatility">Volatility (σ)</label>
                            <div class="slider-container">
                                <input type="range" id="bs-volatility" min="0.1" max="1" value="${this.defaults.volatility}" step="0.01">
                            </div>
                            <span id="bs-volatility-value">${(this.defaults.volatility * 100).toFixed(0)}%</span>
                        </div>
                        
                        <div class="bs-input-group">
                            <label for="bs-rate">Risk-Free Rate (r)</label>
                            <div class="slider-container">
                                <input type="range" id="bs-rate" min="0" max="0.1" value="${this.defaults.riskFreeRate}" step="0.01">
                            </div>
                            <span id="bs-rate-value">${(this.defaults.riskFreeRate * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    <div class="bs-results">
                        <div class="bs-result-card">
                            <h4><i class="fas fa-arrow-up"></i> Call Option</h4>
                            <div class="bs-value" id="bs-call-price">$10.45</div>
                            <div class="bs-greeks">
                                <div class="greek">
                                    <span class="greek-label">Delta (Δ):</span>
                                    <span class="greek-value" id="bs-delta">0.58</span>
                                </div>
                                <div class="greek">
                                    <span class="greek-label">Gamma (Γ):</span>
                                    <span class="greek-value" id="bs-gamma">0.02</span>
                                </div>
                                <div class="greek">
                                    <span class="greek-label">Theta (Θ):</span>
                                    <span class="greek-value" id="bs-theta">-4.33</span>
                                    <span class="greek-unit">/day</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bs-result-card">
                            <h4><i class="fas fa-arrow-down"></i> Put Option</h4>
                            <div class="bs-value" id="bs-put-price">$5.57</div>
                            <div class="bs-greeks">
                                <div class="greek">
                                    <span class="greek-label">Delta (Δ):</span>
                                    <span class="greek-value" id="bs-put-delta">-0.42</span>
                                </div>
                                <div class="greek">
                                    <span class="greek-label">Gamma (Γ):</span>
                                    <span class="greek-value" id="bs-put-gamma">0.02</span>
                                </div>
                                <div class="greek">
                                    <span class="greek-label">Theta (Θ):</span>
                                    <span class="greek-value" id="bs-put-theta">-3.97</span>
                                    <span class="greek-unit">/day</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bs-chart-container">
                        <canvas id="bs-chart"></canvas>
                    </div>
                    
                    <div class="bs-explanation">
                        <h4><i class="fas fa-info-circle"></i> Implementation Details</h4>
                        <p>This interactive calculator implements the Black-Scholes-Merton model for European options:</p>
                        <div class="formula">
                            <p><strong>Call Option:</strong> C = S·N(d₁) - K·e^(-rT)·N(d₂)</p>
                            <p><strong>Put Option:</strong> P = K·e^(-rT)·N(-d₂) - S·N(-d₁)</p>
                            <p>where:</p>
                            <p>d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)</p>
                            <p>d₂ = d₁ - σ√T</p>
                            <p>N(x) = Cumulative distribution function of standard normal</p>
                        </div>
                        <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">
                            <i class="fas fa-lightbulb"></i> Drag the sliders to see real-time pricing updates and Greeks calculation.
                        </p>
                    </div>
                </div>
            `;
        }
        
        bindEvents() {
            const inputs = ['stock-price', 'strike-price', 'time', 'volatility', 'rate'];
            inputs.forEach(id => {
                const input = document.getElementById(`bs-${id}`);
                const value = document.getElementById(`bs-${id}-value`);
                
                if (input && value) {
                    input.addEventListener('input', () => {
                        this.updateDisplayValue(id, input.value, value);
                        this.calculateAndUpdate();
                    });
                    
                    // Initial display update
                    this.updateDisplayValue(id, input.value, value);
                }
            });
        }
        
        updateDisplayValue(id, inputValue, valueElement) {
            const val = parseFloat(inputValue);
            
            switch(id) {
                case 'time':
                    valueElement.textContent = `${val.toFixed(1)} year${val === 1 ? '' : 's'}`;
                    break;
                case 'volatility':
                    valueElement.textContent = `${(val * 100).toFixed(0)}%`;
                    break;
                case 'rate':
                    valueElement.textContent = `${(val * 100).toFixed(1)}%`;
                    break;
                default:
                    valueElement.textContent = `$${val}`;
            }
        }
        
        getInputValues() {
            return {
                S: parseFloat(document.getElementById('bs-stock-price').value),
                K: parseFloat(document.getElementById('bs-strike-price').value),
                T: parseFloat(document.getElementById('bs-time').value),
                sigma: parseFloat(document.getElementById('bs-volatility').value),
                r: parseFloat(document.getElementById('bs-rate').value)
            };
        }
        
        calculateAndUpdate() {
            const { S, K, T, sigma, r } = this.getInputValues();
            
            // Calculate Black-Scholes prices and Greeks
            const result = this.blackScholes(S, K, T, r, sigma);
            
            // Update display
            this.updateResults(result);
            
            // Update chart
            this.updateChart(S, K, T, r, sigma);
        }
        
        blackScholes(S, K, T, r, sigma) {
            if (T <= 0 || sigma <= 0) {
                return {
                    callPrice: 0,
                    putPrice: 0,
                    delta: 0,
                    gamma: 0,
                    theta: 0,
                    putDelta: 0,
                    putTheta: 0
                };
            }
            
            const sqrtT = Math.sqrt(T);
            const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * sqrtT);
            const d2 = d1 - sigma * sqrtT;
            
            // Cumulative normal distribution function
            const N = this.normCDF;
            
            const callPrice = S * N(d1) - K * Math.exp(-r * T) * N(d2);
            const putPrice = K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
            
            // Greeks
            const pdfD1 = this.normPDF(d1);
            const delta = N(d1);
            const gamma = pdfD1 / (S * sigma * sqrtT);
            const theta = (-(S * sigma * pdfD1) / (2 * sqrtT) - r * K * Math.exp(-r * T) * N(d2)) / 365;
            
            const putDelta = delta - 1;
            const putTheta = (-(S * sigma * pdfD1) / (2 * sqrtT) + r * K * Math.exp(-r * T) * N(-d2)) / 365;
            
            return {
                callPrice,
                putPrice,
                delta,
                gamma,
                theta,
                putDelta,
                putTheta
            };
        }
        
        normCDF(x) {
            // Abramowitz and Stegun approximation
            const a1 = 0.319381530;
            const a2 = -0.356563782;
            const a3 = 1.781477937;
            const a4 = -1.821255978;
            const a5 = 1.330274429;
            
            const L = Math.abs(x);
            const K = 1.0 / (1.0 + 0.2316419 * L);
            let N = 1.0 - 1.0 / Math.sqrt(2 * Math.PI) * Math.exp(-L * L / 2.0) *
                (a1 * K + a2 * K * K + a3 * Math.pow(K, 3) + a4 * Math.pow(K, 4) + a5 * Math.pow(K, 5));
            
            if (x < 0) {
                N = 1.0 - N;
            }
            
            return N;
        }
        
        normPDF(x) {
            return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
        }
        
        updateResults(result) {
            document.getElementById('bs-call-price').textContent = `$${result.callPrice.toFixed(2)}`;
            document.getElementById('bs-put-price').textContent = `$${result.putPrice.toFixed(2)}`;
            document.getElementById('bs-delta').textContent = result.delta.toFixed(3);
            document.getElementById('bs-gamma').textContent = result.gamma.toFixed(4);
            document.getElementById('bs-theta').textContent = result.theta.toFixed(2);
            document.getElementById('bs-put-delta').textContent = result.putDelta.toFixed(3);
            document.getElementById('bs-put-gamma').textContent = result.gamma.toFixed(4);
            document.getElementById('bs-put-theta').textContent = result.putTheta.toFixed(2);
        }
        
        updateChart(S, K, T, r, sigma) {
            const ctx = document.getElementById('bs-chart');
            if (!ctx) return;
            
            // Generate data for payoff diagram
            const stockPrices = [];
            const callPrices = [];
            const putPrices = [];
            
            for (let i = 50; i <= 150; i += 2) {
                stockPrices.push(i);
                const { callPrice, putPrice } = this.blackScholes(i, K, T, r, sigma);
                callPrices.push(callPrice);
                putPrices.push(putPrice);
            }
            
            // Destroy previous chart if exists
            if (this.chart) {
                this.chart.destroy();
            }
            
            // Create new chart
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: stockPrices,
                    datasets: [
                        {
                            label: 'Call Option Price',
                            data: callPrices,
                            borderColor: '#64ffda',
                            backgroundColor: 'rgba(100, 255, 218, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0,
                            pointHoverRadius: 5
                        },
                        {
                            label: 'Put Option Price',
                            data: putPrices,
                            borderColor: '#ff6b6b',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ccd6f6',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(10, 25, 47, 0.9)',
                            titleColor: '#64ffda',
                            bodyColor: '#ccd6f6',
                            borderColor: '#64ffda',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Stock Price ($)',
                                color: '#8892b0'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.1)'
                            },
                            ticks: {
                                color: '#8892b0'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Option Price ($)',
                                color: '#8892b0'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.1)'
                            },
                            ticks: {
                                color: '#8892b0',
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 300,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
    }
    
    // Initialize calculator when DOM is ready
    function initCalculator() {
        if (document.getElementById('bsCalculatorContainer')) {
            window.bsCalculator = new BlackScholesCalculator();
            console.log('✅ Black-Scholes calculator initialized');
        }
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCalculator);
    } else {
        initCalculator();
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BlackScholesCalculator;
    }
})();
