// cocoa-hedging.js - Ghana Cocoa Options Pricing & Delta Hedging Simulator
(function() {
    'use strict';
    
    class CocoaHedgingSimulator {
        constructor() {
            this.state = {
                simulationRunning: false,
                timeStep: 0,
                cocoaPrice: 2500, // Price per metric ton in USD
                strikePrice: 2600,
                timeToExpiry: 0.25, // 3 months
                volatility: 0.25, // 25% annual volatility
                riskFreeRate: 0.08, // 8% risk-free rate
                dividendYield: 0.02, // 2% storage/convenience yield
                optionType: 'call',
                hedgeFrequency: 'daily', // daily, weekly, monthly
                transactionCost: 0.001, // 0.1% transaction cost
                initialPosition: -100, // Short 100 options
                simulationSteps: 90 // 90 days
            };
            
            this.simulationData = {
                pricePath: [],
                deltas: [],
                hedges: [],
                portfolioValues: [],
                pnl: [],
                hedgingErrors: [],
                transactions: []
            };
            
            this.init();
        }
        
        init() {
            this.createUI();
            this.bindEvents();
            this.initializeSimulation();
        }
        
        createUI() {
            const container = document.getElementById('cocoaHedgingContainer');
            if (!container) {
                console.error('Cocoa hedging container not found');
                return;
            }
            
            container.innerHTML = `
                <div class="cocoa-hedging-simulator">
                    <div class="ghana-header">
                        <div class="ghana-flag">
                            <div class="flag-red"></div>
                            <div class="flag-yellow"></div>
                            <div class="flag-green"></div>
                            <div class="flag-star">
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                        <div class="header-content">
                            <h3><i class="fas fa-seedling"></i> Ghana Cocoa Options & Delta Hedging Simulator</h3>
                            <p class="subtitle">Simulating risk management strategies for Ghana Cocoa Board (COCOBOD)</p>
                        </div>
                    </div>
                    
                    <div class="simulation-controls">
                        <div class="control-panel">
                            <div class="control-section">
                                <h4><i class="fas fa-sliders-h"></i> Option Parameters</h4>
                                <div class="controls-grid">
                                    <div class="control-group">
                                        <label for="cocoa-price">Cocoa Price ($/MT)</label>
                                        <input type="range" id="cocoa-price" min="2000" max="3000" value="2500" step="10">
                                        <span id="cocoa-price-value">$2,500</span>
                                    </div>
                                    <div class="control-group">
                                        <label for="strike-price">Strike Price ($/MT)</label>
                                        <input type="range" id="strike-price" min="2200" max="2800" value="2600" step="10">
                                        <span id="strike-price-value">$2,600</span>
                                    </div>
                                    <div class="control-group">
                                        <label for="volatility">Volatility (σ)</label>
                                        <input type="range" id="volatility" min="0.15" max="0.4" value="0.25" step="0.01">
                                        <span id="volatility-value">25%</span>
                                    </div>
                                    <div class="control-group">
                                        <label for="time-expiry">Time to Expiry</label>
                                        <input type="range" id="time-expiry" min="0.08" max="1" value="0.25" step="0.01">
                                        <span id="time-expiry-value">3 months</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="control-section">
                                <h4><i class="fas fa-shield-alt"></i> Hedging Strategy</h4>
                                <div class="controls-grid">
                                    <div class="control-group">
                                        <label>Option Type</label>
                                        <div class="option-type-selector">
                                            <button class="option-type-btn active" data-type="call">Call Option</button>
                                            <button class="option-type-btn" data-type="put">Put Option</button>
                                        </div>
                                    </div>
                                    <div class="control-group">
                                        <label for="hedge-freq">Hedging Frequency</label>
                                        <select id="hedge-freq" class="strategy-select">
                                            <option value="daily">Daily Rebalancing</option>
                                            <option value="weekly">Weekly Rebalancing</option>
                                            <option value="monthly">Monthly Rebalancing</option>
                                        </select>
                                    </div>
                                    <div class="control-group">
                                        <label for="position-size">Position Size (options)</label>
                                        <input type="range" id="position-size" min="-200" max="200" value="-100" step="10">
                                        <span id="position-size-value">-100 (Short)</span>
                                    </div>
                                    <div class="control-group">
                                        <label for="transaction-cost">Transaction Cost</label>
                                        <input type="range" id="transaction-cost" min="0" max="0.005" value="0.001" step="0.0005">
                                        <span id="transaction-cost-value">0.1%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="simulation-actions">
                                <button id="run-simulation" class="sim-btn start-btn">
                                    <i class="fas fa-play"></i> Run Simulation
                                </button>
                                <button id="reset-simulation" class="sim-btn reset-btn">
                                    <i class="fas fa-redo"></i> Reset
                                </button>
                                <button id="export-data" class="sim-btn export-btn">
                                    <i class="fas fa-download"></i> Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="results-dashboard">
                        <div class="results-header">
                            <h4><i class="fas fa-chart-bar"></i> Live Results</h4>
                            <div class="real-time-stats">
                                <div class="real-time-stat">
                                    <div class="stat-label">Option Price</div>
                                    <div class="stat-value" id="option-price">$45.23</div>
                                </div>
                                <div class="real-time-stat">
                                    <div class="stat-label">Delta (Δ)</div>
                                    <div class="stat-value" id="delta-value">0.45</div>
                                </div>
                                <div class="real-time-stat">
                                    <div class="stat-label">Hedging P&L</div>
                                    <div class="stat-value" id="hedging-pnl">$0.00</div>
                                </div>
                                <div class="real-time-stat">
                                    <div class="stat-label">Hedging Error</div>
                                    <div class="stat-value" id="hedging-error">0.00%</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="charts-container">
                            <div class="chart-card">
                                <h5><i class="fas fa-chart-line"></i> Cocoa Price & Delta Evolution</h5>
                                <div class="chart-wrapper">
                                    <canvas id="price-delta-chart"></canvas>
                                </div>
                            </div>
                            <div class="chart-card">
                                <h5><i class="fas fa-balance-scale"></i> Hedging Performance</h5>
                                <div class="chart-wrapper">
                                    <canvas id="hedging-performance-chart"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="greek-calculator">
                            <h5><i class="fas fa-calculator"></i> Option Greeks</h5>
                            <div class="greek-grid">
                                <div class="greek-card">
                                    <div class="greek-name">Delta (Δ)</div>
                                    <div class="greek-value" id="greek-delta">0.453</div>
                                    <div class="greek-desc">Price sensitivity</div>
                                </div>
                                <div class="greek-card">
                                    <div class="greek-name">Gamma (Γ)</div>
                                    <div class="greek-value" id="greek-gamma">0.0021</div>
                                    <div class="greek-desc">Delta sensitivity</div>
                                </div>
                                <div class="greek-card">
                                    <div class="greek-name">Theta (Θ)</div>
                                    <div class="greek-value" id="greek-theta">-25.4</div>
                                    <div class="greek-desc">Time decay/day</div>
                                </div>
                                <div class="greek-card">
                                    <div class="greek-name">Vega (ν)</div>
                                    <div class="greek-value" id="greek-vega">85.6</div>
                                    <div class="greek-desc">Volatility sensitivity</div>
                                </div>
                                <div class="greek-card">
                                    <div class="greek-name">Rho (ρ)</div>
                                    <div class="greek-value" id="greek-rho">32.1</div>
                                    <div class="greek-desc">Interest rate sensitivity</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="transactions-table">
                            <h5><i class="fas fa-exchange-alt"></i> Rebalancing Transactions</h5>
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Cocoa Price</th>
                                            <th>Delta</th>
                                            <th>Hedge Trade</th>
                                            <th>Transaction Cost</th>
                                            <th>P&L Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody id="transactions-list">
                                        <tr>
                                            <td colspan="6" class="empty-table">Run simulation to see transactions</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="ghana-context">
                            <h5><i class="fas fa-map-marker-alt"></i> Ghana Context & Policy Implications</h5>
                            <div class="context-content">
                                <div class="context-section">
                                    <h6><i class="fas fa-industry"></i> Ghana Cocoa Board (COCOBOD)</h6>
                                    <p>As the world's second-largest cocoa producer, Ghana's COCOBOD manages pricing, quality control, and farmer support. Delta hedging can help:</p>
                                    <ul>
                                        <li>Stabilize farmer income against price volatility</li>
                                        <li>Secure forward sales at predictable prices</li>
                                        <li>Manage price risk in the Ghana Commodity Exchange (GCX)</li>
                                        <li>Protect government revenue from cocoa exports</li>
                                    </ul>
                                </div>
                                <div class="context-section">
                                    <h6><i class="fas fa-chart-line"></i> Ghana Commodity Exchange (GCX) Application</h6>
                                    <p>The GCX can use Black-Scholes modeling for:</p>
                                    <ul>
                                        <li>Pricing cocoa futures and options contracts</li>
                                        <li>Developing risk management tools for farmers</li>
                                        <li>Creating structured products for price protection</li>
                                        <li>Attracting international investors with hedged exposure</li>
                                    </ul>
                                </div>
                                <div class="context-section">
                                    <h6><i class="fas fa-lightbulb"></i> Research Extensions</h6>
                                    <ul>
                                        <li>Seasonality adjustments for cocoa harvest cycles</li>
                                        <li>Incorporating El Niño weather risk premiums</li>
                                        <li>Stochastic volatility models for cocoa (Heston model)</li>
                                        <li>Monte Carlo simulation for worst-case scenarios</li>
                                        <li>Multi-commodity hedging for diversified portfolios</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="black-scholes-formula">
                            <h5><i class="fas fa-square-root-alt"></i> Black-Scholes-Merton Model</h5>
                            <div class="formula-content">
                                <div class="formula-display">
                                    <p>For cocoa options with convenience yield (δ):</p>
                                    <div class="formula-equation">
                                        <p>C = S<sub>0</sub>e<sup>-δT</sup>N(d<sub>1</sub>) - Ke<sup>-rT</sup>N(d<sub>2</sub>)</p>
                                        <p>P = Ke<sup>-rT</sup>N(-d<sub>2</sub>) - S<sub>0</sub>e<sup>-δT</sup>N(-d<sub>1</sub>)</p>
                                    </div>
                                    <p>where:</p>
                                    <div class="formula-vars">
                                        <p>d<sub>1</sub> = [ln(S<sub>0</sub>/K) + (r - δ + σ²/2)T] / (σ√T)</p>
                                        <p>d<sub>2</sub> = d<sub>1</sub> - σ√T</p>
                                        <p>δ = convenience yield (storage benefit)</p>
                                    </div>
                                </div>
                                <div class="formula-variables">
                                    <h6>Variables:</h6>
                                    <ul>
                                        <li>S<sub>0</sub> = Current cocoa price ($/MT)</li>
                                        <li>K = Strike price ($/MT)</li>
                                        <li>T = Time to expiration (years)</li>
                                        <li>r = Risk-free interest rate</li>
                                        <li>σ = Cocoa price volatility</li>
                                        <li>δ = Convenience yield (storage benefit)</li>
                                        <li>N(x) = Cumulative normal distribution</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.initializeCharts();
            this.updateRealTimeValues();
        }
        
        bindEvents() {
            // Parameter controls
            const params = ['cocoa-price', 'strike-price', 'volatility', 'time-expiry', 
                          'position-size', 'transaction-cost'];
            
            params.forEach(param => {
                const element = document.getElementById(param);
                const valueElement = document.getElementById(`${param}-value`);
                
                if (element && valueElement) {
                    element.addEventListener('input', (e) => {
                        let value = parseFloat(e.target.value);
                        
                        if (param === 'cocoa-price' || param === 'strike-price') {
                            valueElement.textContent = `$${value.toLocaleString()}`;
                            this.state[param.replace('-', '_')] = value;
                        } else if (param === 'volatility') {
                            valueElement.textContent = `${(value * 100).toFixed(0)}%`;
                            this.state.volatility = value;
                        } else if (param === 'time-expiry') {
                            const months = Math.round(value * 12);
                            valueElement.textContent = `${months} month${months !== 1 ? 's' : ''}`;
                            this.state.timeToExpiry = value;
                        } else if (param === 'position-size') {
                            const position = value;
                            const type = position > 0 ? 'Long' : position < 0 ? 'Short' : 'Flat';
                            valueElement.textContent = `${position} (${type})`;
                            this.state.initialPosition = value;
                        } else if (param === 'transaction-cost') {
                            valueElement.textContent = `${(value * 100).toFixed(1)}%`;
                            this.state.transactionCost = value;
                        }
                        
                        this.updateRealTimeValues();
                    });
                }
            });
            
            // Option type selector
            document.querySelectorAll('.option-type-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.option-type-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.state.optionType = e.target.dataset.type;
                    this.updateRealTimeValues();
                });
            });
            
            // Hedging frequency
            document.getElementById('hedge-freq').addEventListener('change', (e) => {
                this.state.hedgeFrequency = e.target.value;
            });
            
            // Simulation actions
            document.getElementById('run-simulation').addEventListener('click', () => {
                this.runSimulation();
            });
            
            document.getElementById('reset-simulation').addEventListener('click', () => {
                this.resetSimulation();
            });
            
            document.getElementById('export-data').addEventListener('click', () => {
                this.exportData();
            });
        }
        
        initializeCharts() {
            // Price & Delta Chart
            this.priceDeltaChart = new Chart(document.getElementById('price-delta-chart'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Cocoa Price ($/MT)',
                            data: [],
                            borderColor: '#CF5300',
                            backgroundColor: 'rgba(207, 83, 0, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Delta (Δ)',
                            data: [],
                            borderColor: '#006B3D',
                            backgroundColor: 'rgba(0, 107, 61, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Days',
                                color: '#8892b0'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.1)'
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Price ($/MT)',
                                color: '#8892b0'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.1)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Delta',
                                color: '#8892b0'
                            },
                            grid: {
                                drawOnChartArea: false
                            },
                            min: 0,
                            max: 1
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ccd6f6'
                            }
                        }
                    }
                }
            });
            
            // Hedging Performance Chart
            this.hedgingPerformanceChart = new Chart(document.getElementById('hedging-performance-chart'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Hedged Portfolio',
                            data: [],
                            borderColor: '#64ffda',
                            backgroundColor: 'rgba(100, 255, 218, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Unhedged Portfolio',
                            data: [],
                            borderColor: '#ff6b6b',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Hedging Error',
                            data: [],
                            borderColor: '#ffd166',
                            backgroundColor: 'rgba(255, 209, 102, 0.1)',
                            borderWidth: 1,
                            tension: 0.4,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Days',
                                color: '#8892b0'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.1)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Portfolio Value ($)',
                                color: '#8892b0'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ccd6f6'
                            }
                        }
                    }
                }
            });
        }
        
        blackScholes(S, K, T, r, sigma, optionType, q = 0) {
            if (T <= 0) {
                return {
                    price: 0,
                    delta: 0,
                    gamma: 0,
                    theta: 0,
                    vega: 0,
                    rho: 0
                };
            }
            
            const sqrtT = Math.sqrt(T);
            const d1 = (Math.log(S / K) + (r - q + sigma * sigma / 2) * T) / (sigma * sqrtT);
            const d2 = d1 - sigma * sqrtT;
            
            // Cumulative normal distribution
            const N = this.normCDF;
            const NPrime = this.normPDF;
            
            const discountFactor = Math.exp(-r * T);
            const convenienceFactor = Math.exp(-q * T);
            
            let price, delta, gamma, theta, vega, rho;
            
            if (optionType === 'call') {
                price = S * convenienceFactor * N(d1) - K * discountFactor * N(d2);
                delta = convenienceFactor * N(d1);
                gamma = (convenienceFactor * NPrime(d1)) / (S * sigma * sqrtT);
                theta = -(S * convenienceFactor * NPrime(d1) * sigma) / (2 * sqrtT) 
                       - r * K * discountFactor * N(d2) 
                       + q * S * convenienceFactor * N(d1);
                theta = theta / 365; // Per day
            } else { // put
                price = K * discountFactor * N(-d2) - S * convenienceFactor * N(-d1);
                delta = convenienceFactor * (N(d1) - 1);
                gamma = (convenienceFactor * NPrime(d1)) / (S * sigma * sqrtT);
                theta = -(S * convenienceFactor * NPrime(d1) * sigma) / (2 * sqrtT)
                       + r * K * discountFactor * N(-d2)
                       - q * S * convenienceFactor * N(-d1);
                theta = theta / 365; // Per day
            }
            
            vega = S * convenienceFactor * NPrime(d1) * sqrtT;
            rho = (optionType === 'call' ? K * T * discountFactor * N(d2) : -K * T * discountFactor * N(-d2)) / 100;
            
            return { price, delta, gamma, theta, vega, rho };
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
        
        updateRealTimeValues() {
            const { cocoaPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, dividendYield, optionType } = this.state;
            
            const greeks = this.blackScholes(cocoaPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, optionType, dividendYield);
            
            // Update display
            document.getElementById('option-price').textContent = `$${greeks.price.toFixed(2)}`;
            document.getElementById('delta-value').textContent = greeks.delta.toFixed(3);
            
            // Update Greek cards
            document.getElementById('greek-delta').textContent = greeks.delta.toFixed(3);
            document.getElementById('greek-gamma').textContent = greeks.gamma.toFixed(4);
            document.getElementById('greek-theta').textContent = greeks.theta.toFixed(1);
            document.getElementById('greek-vega').textContent = greeks.vega.toFixed(1);
            document.getElementById('greek-rho').textContent = greeks.rho.toFixed(1);
        }
        
        runSimulation() {
            this.state.simulationRunning = true;
            this.simulationData = {
                pricePath: [],
                deltas: [],
                hedges: [],
                portfolioValues: [],
                pnl: [],
                hedgingErrors: [],
                transactions: []
            };
            
            const { cocoaPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, dividendYield, optionType, initialPosition, simulationSteps, transactionCost } = this.state;
            
            // Generate price path (Geometric Brownian Motion)
            let currentPrice = cocoaPrice;
            const dt = timeToExpiry / simulationSteps;
            const pricePath = [currentPrice];
            
            for (let i = 0; i < simulationSteps; i++) {
                const drift = (riskFreeRate - dividendYield - 0.5 * volatility * volatility) * dt;
                const shock = volatility * Math.sqrt(dt) * (Math.random() - 0.5) * 2;
                currentPrice = currentPrice * Math.exp(drift + shock);
                pricePath.push(currentPrice);
            }
            
            // Initialize hedging simulation
            let portfolioValue = 0;
            let cash = 0;
            let hedgePosition = 0;
            let totalTransactionCost = 0;
            
            const dailyValues = [];
            const dailyDeltas = [];
            const dailyHedges = [];
            const dailyPnL = [];
            const dailyHedgingErrors = [];
            const transactions = [];
            
            for (let day = 0; day <= simulationSteps; day++) {
                const remainingTime = timeToExpiry * (1 - day / simulationSteps);
                const currentPrice = pricePath[day];
                
                // Calculate option price and delta
                const greeks = this.blackScholes(currentPrice, strikePrice, remainingTime, riskFreeRate, volatility, optionType, dividendYield);
                
                // Target hedge position
                const targetDelta = greeks.delta * initialPosition;
                const deltaDifference = targetDelta - hedgePosition;
                
                // Check if we need to rebalance based on frequency
                let rebalance = false;
                const hedgeFreq = this.state.hedgeFrequency;
                
                if (hedgeFreq === 'daily') {
                    rebalance = true;
                } else if (hedgeFreq === 'weekly' && day % 7 === 0) {
                    rebalance = true;
                } else if (hedgeFreq === 'monthly' && day % 30 === 0) {
                    rebalance = true;
                }
                
                let hedgeTrade = 0;
                let tradeCost = 0;
                
                if (rebalance && Math.abs(deltaDifference) > 0.01) {
                    hedgeTrade = deltaDifference;
                    hedgePosition = targetDelta;
                    
                    // Calculate transaction cost
                    tradeCost = Math.abs(hedgeTrade) * currentPrice * transactionCost;
                    totalTransactionCost += tradeCost;
                    cash -= hedgeTrade * currentPrice + tradeCost;
                    
                    transactions.push({
                        day: day,
                        price: currentPrice,
                        delta: greeks.delta,
                        trade: hedgeTrade,
                        cost: tradeCost,
                        pnlImpact: -tradeCost
                    });
                }
                
                // Calculate portfolio value
                const optionValue = greeks.price * initialPosition;
                const hedgeValue = hedgePosition * currentPrice;
                portfolioValue = optionValue + hedgeValue + cash;
                
                // Store data
                dailyValues.push(portfolioValue);
                dailyDeltas.push(greeks.delta);
                dailyHedges.push(hedgePosition);
                dailyPnL.push(portfolioValue);
                
                // Calculate hedging error (compared to perfectly hedged)
                const perfectHedgeValue = 0; // Perfectly hedged should have zero value change
                const hedgingError = Math.abs(portfolioValue - perfectHedgeValue) / Math.abs(optionValue) * 100;
                dailyHedgingErrors.push(hedgingError);
            }
            
            // Store simulation data
            this.simulationData = {
                pricePath: pricePath,
                deltas: dailyDeltas,
                hedges: dailyHedges,
                portfolioValues: dailyValues,
                pnl: dailyPnL,
                hedgingErrors: dailyHedgingErrors,
                transactions: transactions
            };
            
            // Update charts
            this.updateCharts();
            
            // Update transaction table
            this.updateTransactionTable();
            
            // Update summary statistics
            const finalPnL = dailyPnL[dailyPnL.length - 1];
            const maxHedgingError = Math.max(...dailyHedgingErrors);
            
            document.getElementById('hedging-pnl').textContent = `$${finalPnL.toFixed(2)}`;
            document.getElementById('hedging-error').textContent = `${maxHedgingError.toFixed(2)}%`;
            
            this.state.simulationRunning = false;
        }
        
        updateCharts() {
            const data = this.simulationData;
            
            if (data.pricePath.length === 0) return;
            
            // Update Price & Delta Chart
            const days = Array.from({length: data.pricePath.length}, (_, i) => i);
            
            this.priceDeltaChart.data.labels = days;
            this.priceDeltaChart.data.datasets[0].data = data.pricePath;
            this.priceDeltaChart.data.datasets[1].data = data.deltas;
            this.priceDeltaChart.update();
            
            // Update Hedging Performance Chart
            this.hedgingPerformanceChart.data.labels = days;
            this.hedgingPerformanceChart.data.datasets[0].data = data.portfolioValues;
            
            // Calculate unhedged portfolio (just options)
            const unhedgedValues = data.pricePath.map((price, i) => {
                const remainingTime = this.state.timeToExpiry * (1 - i / data.pricePath.length);
                const greeks = this.blackScholes(price, this.state.strikePrice, remainingTime, 
                                                this.state.riskFreeRate, this.state.volatility, 
                                                this.state.optionType, this.state.dividendYield);
                return greeks.price * this.state.initialPosition;
            });
            
            this.hedgingPerformanceChart.data.datasets[1].data = unhedgedValues;
            this.hedgingPerformanceChart.data.datasets[2].data = data.hedgingErrors;
            this.hedgingPerformanceChart.update();
        }
        
        updateTransactionTable() {
            const transactions = this.simulationData.transactions;
            const tableBody = document.getElementById('transactions-list');
            
            if (transactions.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-table">No transactions for selected frequency</td>
                    </tr>
                `;
                return;
            }
            
            tableBody.innerHTML = transactions.map(t => `
                <tr class="transaction-row">
                    <td>${t.day}</td>
                    <td>$${t.price.toFixed(2)}</td>
                    <td>${t.delta.toFixed(3)}</td>
                    <td class="${t.trade > 0 ? 'buy-trade' : 'sell-trade'}">
                        ${t.trade > 0 ? 'BUY' : 'SELL'} ${Math.abs(t.trade).toFixed(2)}
                    </td>
                    <td>$${t.cost.toFixed(2)}</td>
                    <td class="${t.pnlImpact >= 0 ? 'positive' : 'negative'}">
                        ${t.pnlImpact >= 0 ? '+' : ''}$${t.pnlImpact.toFixed(2)}
                    </td>
                </tr>
            `).join('');
        }
        
        resetSimulation() {
            this.simulationData = {
                pricePath: [],
                deltas: [],
                hedges: [],
                portfolioValues: [],
                pnl: [],
                hedgingErrors: [],
                transactions: []
            };
            
            // Reset charts
            this.priceDeltaChart.data.labels = [];
            this.priceDeltaChart.data.datasets.forEach(d => d.data = []);
            this.priceDeltaChart.update();
            
            this.hedgingPerformanceChart.data.labels = [];
            this.hedgingPerformanceChart.data.datasets.forEach(d => d.data = []);
            this.hedgingPerformanceChart.update();
            
            // Reset transaction table
            document.getElementById('transactions-list').innerHTML = `
                <tr>
                    <td colspan="6" class="empty-table">Run simulation to see transactions</td>
                </tr>
            `;
            
            // Reset summary
            document.getElementById('hedging-pnl').textContent = '$0.00';
            document.getElementById('hedging-error').textContent = '0.00%';
        }
        
        exportData() {
            const data = this.simulationData;
            if (data.pricePath.length === 0) {
                alert('Please run simulation first to generate data');
                return;
            }
            
            // Create CSV content
            let csv = 'Day,Cocoa_Price,Delta,Hedge_Position,Portfolio_Value,Hedging_Error\n';
            
            for (let i = 0; i < data.pricePath.length; i++) {
                csv += `${i},${data.pricePath[i]},${data.deltas[i]},${data.hedges[i]},${data.portfolioValues[i]},${data.hedgingErrors[i]}\n`;
            }
            
            // Create download link
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cocoa_hedging_simulation_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }
    
    // Add CSS for Cocoa Hedging Simulator
    const style = document.createElement('style');
    style.textContent = `
        .cocoa-hedging-simulator {
            background: var(--secondary);
            border-radius: 10px;
            padding: 2rem;
            margin: 2rem 0;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .ghana-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid rgba(207, 83, 0, 0.3);
        }
        
        .ghana-flag {
            width: 80px;
            height: 50px;
            display: flex;
            flex-direction: column;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .flag-red {
            height: 33.33%;
            background: #CF5300;
        }
        
        .flag-yellow {
            height: 33.33%;
            background: #FCD116;
        }
        
        .flag-green {
            height: 33.33%;
            background: #006B3D;
        }
        
        .flag-star {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #000;
            font-size: 1.5rem;
        }
        
        .header-content {
            flex-grow: 1;
        }
        
        .header-content h3 {
            color: var(--white);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .subtitle {
            color: var(--text-light);
            font-size: 0.95rem;
        }
        
        .control-panel {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(207, 83, 0, 0.2);
            margin-bottom: 2rem;
        }
        
        .control-section {
            margin-bottom: 1.5rem;
        }
        
        .control-section h4 {
            color: var(--white);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #CF5300;
        }
        
        .controls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        
        .option-type-selector {
            display: flex;
            gap: 0.5rem;
        }
        
        .option-type-btn {
            padding: 0.5rem 1rem;
            background: var(--secondary);
            border: 1px solid rgba(100, 255, 218, 0.2);
            color: var(--text);
            border-radius: 4px;
            cursor: pointer;
            transition: var(--transition);
            flex: 1;
        }
        
        .option-type-btn.active {
            background: rgba(100, 255, 218, 0.1);
            border-color: var(--accent);
            color: var(--accent);
        }
        
        .option-type-btn:hover {
            transform: translateY(-2px);
        }
        
        .simulation-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .export-btn {
            background: rgba(207, 83, 0, 0.2);
            color: #CF5300;
            border: 1px solid #CF5300;
        }
        
        .results-dashboard {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .results-header {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(207, 83, 0, 0.2);
        }
        
        .results-header h4 {
            color: var(--white);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .real-time-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        .real-time-stat {
            background: rgba(10, 25, 47, 0.5);
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
            border: 1px solid rgba(207, 83, 0, 0.1);
        }
        
        .real-time-stat .stat-label {
            color: var(--text-light);
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
        }
        
        .real-time-stat .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #CF5300;
        }
        
        .greek-calculator {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(207, 83, 0, 0.2);
        }
        
        .greek-calculator h5 {
            color: var(--white);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .greek-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
        }
        
        .greek-card {
            background: rgba(10, 25, 47, 0.5);
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
            border: 1px solid rgba(100, 255, 218, 0.1);
            transition: var(--transition);
        }
        
        .greek-card:hover {
            transform: translateY(-3px);
            border-color: rgba(207, 83, 0, 0.3);
        }
        
        .greek-name {
            color: var(--accent);
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .greek-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--white);
            margin-bottom: 0.5rem;
        }
        
        .greek-desc {
            color: var(--text-light);
            font-size: 0.8rem;
        }
        
        .transactions-table {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(207, 83, 0, 0.2);
        }
        
        .transactions-table h5 {
            color: var(--white);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .table-container {
            overflow-x: auto;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .transactions-table table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .transactions-table th {
            color: var(--text-light);
            font-weight: 600;
            text-align: left;
            padding: 0.75rem;
            border-bottom: 1px solid rgba(136, 146, 176, 0.2);
            font-size: 0.85rem;
            background: rgba(10, 25, 47, 0.8);
            position: sticky;
            top: 0;
        }
        
        .transactions-table td {
            padding: 0.75rem;
            border-bottom: 1px solid rgba(136, 146, 176, 0.1);
            font-size: 0.9rem;
        }
        
        .transaction-row:hover {
            background: rgba(207, 83, 0, 0.05);
        }
        
        .buy-trade {
            color: #00ff00;
            font-weight: 600;
        }
        
        .sell-trade {
            color: #ff6b6b;
            font-weight: 600;
        }
        
        .positive {
            color: #00ff00;
        }
        
        .negative {
            color: #ff6b6b;
        }
        
        .empty-table {
            color: var(--text-light);
            text-align: center;
            padding: 2rem !important;
            font-style: italic;
        }
        
        .ghana-context {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(207, 83, 0, 0.2);
        }
        
        .ghana-context h5 {
            color: var(--white);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #CF5300;
        }
        
        .context-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .context-section {
            background: rgba(10, 25, 47, 0.5);
            padding: 1.5rem;
            border-radius: 6px;
            border-left: 4px solid #CF5300;
        }
        
        .context-section h6 {
            color: var(--white);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .context-section p {
            color: var(--text-light);
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .context-section ul {
            padding-left: 1.5rem;
            color: var(--text-light);
        }
        
        .context-section li {
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }
        
        .black-scholes-formula {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(207, 83, 0, 0.2);
        }
        
        .black-scholes-formula h5 {
            color: var(--white);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .formula-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }
        
        .formula-display {
            background: rgba(10, 25, 47, 0.5);
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .formula-equation {
            font-family: 'Cambria Math', serif;
            font-size: 1.2rem;
            color: var(--accent);
            margin: 1rem 0;
            line-height: 2;
            text-align: center;
        }
        
        .formula-vars {
            font-family: monospace;
            color: var(--text-light);
            font-size: 0.9rem;
            margin-top: 1rem;
        }
        
        .formula-variables {
            background: rgba(10, 25, 47, 0.5);
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .formula-variables h6 {
            color: var(--white);
            margin-bottom: 1rem;
        }
        
        .formula-variables ul {
            color: var(--text-light);
            font-size: 0.9rem;
            line-height: 1.6;
        }
        
        .formula-variables li {
            margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .ghana-header {
                flex-direction: column;
                text-align: center;
            }
            
            .controls-grid {
                grid-template-columns: 1fr;
            }
            
            .simulation-actions {
                flex-direction: column;
            }
            
            .real-time-stats {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .greek-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .formula-content {
                grid-template-columns: 1fr;
            }
            
            .context-content {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .real-time-stats {
                grid-template-columns: 1fr;
            }
            
            .greek-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize simulator when DOM is ready
    function initCocoaHedgingSimulator() {
        if (document.getElementById('cocoaHedgingContainer')) {
            window.cocoaHedgingSimulator = new CocoaHedgingSimulator();
            console.log('✅ Cocoa Hedging Simulator initialized');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCocoaHedgingSimulator);
    } else {
        initCocoaHedgingSimulator();
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CocoaHedgingSimulator;
    }
})();
