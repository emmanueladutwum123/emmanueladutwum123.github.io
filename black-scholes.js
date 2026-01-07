// black-scholes.js
class BlackScholesCalculator {
    constructor() {
        this.init();
    }
    
    init() {
        this.createUI();
        this.bindEvents();
        this.calculate();
    }
    
    createUI() {
        const container = document.getElementById('bsCalculatorContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="bs-calculator">
                <h3><i class="fas fa-calculator"></i> Black-Scholes Options Pricing Calculator</h3>
                <div class="bs-controls">
                    <div class="bs-input-group">
                        <label>Stock Price (S)</label>
                        <input type="range" id="bs-stock-price" min="50" max="200" value="100" step="1">
                        <span id="bs-stock-price-value">$100</span>
                    </div>
                    <div class="bs-input-group">
                        <label>Strike Price (K)</label>
                        <input type="range" id="bs-strike-price" min="50" max="200" value="100" step="1">
                        <span id="bs-strike-price-value">$100</span>
                    </div>
                    <div class="bs-input-group">
                        <label>Time to Expiry (T)</label>
                        <input type="range" id="bs-time" min="0.1" max="2" value="1" step="0.1">
                        <span id="bs-time-value">1.0 year</span>
                    </div>
                    <div class="bs-input-group">
                        <label>Volatility (σ)</label>
                        <input type="range" id="bs-volatility" min="0.1" max="1" value="0.3" step="0.01">
                        <span id="bs-volatility-value">30%</span>
                    </div>
                    <div class="bs-input-group">
                        <label>Risk-Free Rate (r)</label>
                        <input type="range" id="bs-rate" min="0" max="0.1" value="0.05" step="0.01">
                        <span id="bs-rate-value">5%</span>
                    </div>
                </div>
                
                <div class="bs-results">
                    <div class="bs-result-card">
                        <h4>Call Option Price</h4>
                        <div class="bs-value" id="bs-call-price">$10.45</div>
                        <div class="bs-greeks">
                            <span>Δ: <span id="bs-delta">0.58</span></span>
                            <span>Γ: <span id="bs-gamma">0.02</span></span>
                            <span>Θ: <span id="bs-theta">-4.33</span>/day</span>
                        </div>
                    </div>
                    <div class="bs-result-card">
                        <h4>Put Option Price</h4>
                        <div class="bs-value" id="bs-put-price">$5.57</div>
                        <div class="bs-greeks">
                            <span>Δ: <span id="bs-put-delta">-0.42</span></span>
                            <span>Γ: <span id="bs-put-gamma">0.02</span></span>
                            <span>Θ: <span id="bs-put-theta">-3.97</span>/day</span>
                        </div>
                    </div>
                </div>
                
                <div class="bs-chart-container">
                    <canvas id="bs-chart"></canvas>
                </div>
                
                <div class="bs-explanation">
                    <h4><i class="fas fa-info-circle"></i> Implementation Details</h4>
                    <p>This calculator implements the Black-Scholes-Merton model:</p>
                    <p style="font-family: monospace; color: var(--accent); background: rgba(10,25,47,0.5); padding: 1rem; border-radius: 4px;">
                        C = S·N(d₁) - K·e^(-rT)·N(d₂)<br>
                        P = K·e^(-rT)·N(-d₂) - S·N(-d₁)<br>
                        where d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)<br>
                        d₂ = d₁ - σ√T
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
                    if (id === 'time') {
                        value.textContent = `${parseFloat(input.value).toFixed(1)} year${parseFloat(input.value) === 1 ? '' : 's'}`;
                    } else if (id === 'volatility' || id === 'rate') {
                        value.textContent = `${(parseFloat(input.value) * 100).toFixed(0)}%`;
                    } else {
                        value.textContent = `$${input.value}`;
                    }
                    this.calculate();
                });
            }
        });
    }
    
    calculate() {
        const S = parseFloat(document.getElementById('bs-stock-price').value);
        const K = parseFloat(document.getElementById('bs-strike-price').value);
        const T = parseFloat(document.getElementById('bs-time').value);
        const sigma = parseFloat(document.getElementById('bs-volatility').value);
        const r = parseFloat(document.getElementById('bs-rate').value);
        
        const { callPrice, putPrice, delta, gamma, theta, putDelta, putTheta } = this.blackScholes(S, K, T, r, sigma);
        
        document.getElementById('bs-call-price').textContent = `$${callPrice.toFixed(2)}`;
        document.getElementById('bs-put-price').textContent = `$${putPrice.toFixed(2)}`;
        document.getElementById('bs-delta').textContent = delta.toFixed(2);
        document.getElementById('bs-gamma').textContent = gamma.toFixed(3);
        document.getElementById('bs-theta').textContent = theta.toFixed(2);
        document.getElementById('bs-put-delta').textContent = putDelta.toFixed(2);
        document.getElementById('bs-put-gamma').textContent = gamma.toFixed(3);
        document.getElementById('bs-put-theta').textContent = putTheta.toFixed(2);
        
        this.updateChart(S, K, T, r, sigma);
    }
    
    blackScholes(S, K, T, r, sigma) {
        if (T <= 0) return { callPrice: 0, putPrice: 0, delta: 0, gamma: 0, theta: 0 };
        
        const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        
        // Cumulative distribution function for standard normal
        const N = x => {
            const a1 = 0.319381530;
            const a2 = -0.356563782;
            const a3 = 1.781477937;
            const a4 = -1.821255978;
            const a5 = 1.330274429;
            const L = Math.abs(x);
            const K = 1 / (1 + 0.2316419 * L);
            let N = 1 - 1 / Math.sqrt(2 * Math.PI) * Math.exp(-L * L / 2) * 
                (a1 * K + a2 * K * K + a3 * Math.pow(K, 3) + a4 * Math.pow(K, 4) + a5 * Math.pow(K, 5));
            if (x < 0) N = 1 - N;
            return N;
        };
        
        const callPrice = S * N(d1) - K * Math.exp(-r * T) * N(d2);
        const putPrice = K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
        
        const delta = N(d1);
        const gamma = (Math.exp(-d1 * d1 / 2) / (S * sigma * Math.sqrt(2 * Math.PI * T)));
        const theta = (-(S * sigma * Math.exp(-d1 * d1 / 2)) / (2 * Math.sqrt(2 * Math.PI * T)) - 
                      r * K * Math.exp(-r * T) * N(d2)) / 365;
        const putDelta = delta - 1;
        const putTheta = (-(S * sigma * Math.exp(-d1 * d1 / 2)) / (2 * Math.sqrt(2 * Math.PI * T)) + 
                         r * K * Math.exp(-r * T) * N(-d2)) / 365;
        
        return { callPrice, putPrice, delta, gamma, theta, putDelta, putTheta };
    }
    
    updateChart(S, K, T, r, sigma) {
        const ctx = document.getElementById('bs-chart');
        if (!ctx) return;
        
        if (window.bsChart) {
            window.bsChart.destroy();
        }
        
        const stockPrices = [];
        const callPrices = [];
        const putPrices = [];
        
        for (let i = 50; i <= 150; i += 2) {
            stockPrices.push(i);
            const { callPrice, putPrice } = this.blackScholes(i, K, T, r, sigma);
            callPrices.push(callPrice);
            putPrices.put(putPrice);
        }
        
        window.bsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: stockPrices,
                datasets: [
                    {
                        label: 'Call Option',
                        data: callPrices,
                        borderColor: '#64ffda',
                        backgroundColor: 'rgba(100, 255, 218, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Put Option',
                        data: putPrices,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ccd6f6'
                        }
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
                            color: '#8892b0'
                        }
                    }
                }
            }
        });
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlackScholesCalculator();
    });
} else {
    new BlackScholesCalculator();
}
