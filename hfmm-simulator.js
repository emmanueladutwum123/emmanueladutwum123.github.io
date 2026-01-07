// hfmm-simulator.js - High-Frequency Market Making Simulator
(function() {
    'use strict';
    
    class HFMMSimulator {
        constructor() {
            this.state = {
                running: false,
                simulationSpeed: 1,
                time: 0,
                orders: [],
                trades: [],
                pnl: 0,
                inventory: 0,
                spreads: [],
                marketData: [],
                strategy: 'avellaneda-stoikov'
            };
            
            this.orderBook = {
                bids: [],
                asks: [],
                midPrice: 100.00,
                bestBid: 99.95,
                bestAsk: 100.05,
                spread: 0.10
            };
            
            this.strategies = {
                'simple': this.simpleMarketMaker.bind(this),
                'avellaneda-stoikov': this.avellanedaStoikov.bind(this),
                'inventory-control': this.inventoryControl.bind(this)
            };
            
            this.init();
        }
        
        init() {
            this.createUI();
            this.bindEvents();
            this.initializeOrderBook();
            this.startSimulation();
        }
        
        createUI() {
            const container = document.getElementById('hfmmSimulatorContainer');
            if (!container) {
                console.error('HFMM simulator container not found');
                return;
            }
            
            container.innerHTML = `
                <div class="hfmm-simulator">
                    <div class="hfmm-header">
                        <h3><i class="fas fa-bolt"></i> High-Frequency Market Making Simulator</h3>
                        <div class="simulation-controls">
                            <button id="hfmm-start" class="sim-btn start-btn">
                                <i class="fas fa-play"></i> Start
                            </button>
                            <button id="hfmm-pause" class="sim-btn pause-btn">
                                <i class="fas fa-pause"></i> Pause
                            </button>
                            <button id="hfmm-reset" class="sim-btn reset-btn">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                        </div>
                    </div>
                    
                    <div class="hfmm-dashboard">
                        <div class="market-overview">
                            <div class="market-stat">
                                <div class="stat-label">Mid Price</div>
                                <div class="stat-value" id="mid-price">$100.00</div>
                            </div>
                            <div class="market-stat">
                                <div class="stat-label">Spread</div>
                                <div class="stat-value" id="spread">0.10</div>
                            </div>
                            <div class="market-stat">
                                <div class="stat-label">P&L</div>
                                <div class="stat-value" id="pnl">$0.00</div>
                            </div>
                            <div class="market-stat">
                                <div class="stat-label">Inventory</div>
                                <div class="stat-value" id="inventory">0</div>
                            </div>
                        </div>
                        
                        <div class="order-book-container">
                            <h4><i class="fas fa-book"></i> Limit Order Book</h4>
                            <div class="order-book">
                                <div class="order-book-side asks-side">
                                    <div class="side-header">Asks (Sell)</div>
                                    <div class="orders-list" id="asks-list"></div>
                                </div>
                                <div class="order-book-side bids-side">
                                    <div class="side-header">Bids (Buy)</div>
                                    <div class="orders-list" id="bids-list"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="charts-container">
                            <div class="chart-card">
                                <h4><i class="fas fa-chart-line"></i> Price & Spread</h4>
                                <div class="chart-wrapper">
                                    <canvas id="price-chart"></canvas>
                                </div>
                            </div>
                            <div class="chart-card">
                                <h4><i class="fas fa-chart-bar"></i> P&L & Inventory</h4>
                                <div class="chart-wrapper">
                                    <canvas id="pnl-chart"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="strategy-controls">
                            <h4><i class="fas fa-cogs"></i> Strategy Controls</h4>
                            <div class="controls-grid">
                                <div class="control-group">
                                    <label for="strategy-select">Strategy</label>
                                    <select id="strategy-select" class="strategy-select">
                                        <option value="avellaneda-stoikov">Avellaneda-Stoikov</option>
                                        <option value="inventory-control">Inventory Control</option>
                                        <option value="simple">Simple Market Making</option>
                                    </select>
                                </div>
                                
                                <div class="control-group">
                                    <label for="spread-target">Target Spread (bps)</label>
                                    <input type="range" id="spread-target" min="5" max="50" value="10" step="1">
                                    <span id="spread-target-value">10 bps</span>
                                </div>
                                
                                <div class="control-group">
                                    <label for="inventory-limit">Inventory Limit</label>
                                    <input type="range" id="inventory-limit" min="5" max="100" value="20" step="5">
                                    <span id="inventory-limit-value">20</span>
                                </div>
                                
                                <div class="control-group">
                                    <label for="sim-speed">Simulation Speed</label>
                                    <input type="range" id="sim-speed" min="1" max="10" value="1" step="1">
                                    <span id="sim-speed-value">1x</span>
                                </div>
                            </div>
                            
                            <div class="strategy-params" id="avellaneda-params">
                                <h5>Avellaneda-Stoikov Parameters</h5>
                                <div class="params-grid">
                                    <div class="param">
                                        <label>Risk Aversion (γ)</label>
                                        <input type="range" id="risk-aversion" min="0.01" max="1" value="0.1" step="0.01">
                                        <span id="risk-aversion-value">0.10</span>
                                    </div>
                                    <div class="param">
                                        <label>Volatility (σ)</label>
                                        <input type="range" id="volatility" min="0.1" max="2" value="0.3" step="0.1">
                                        <span id="volatility-value">0.30</span>
                                    </div>
                                    <div class="param">
                                        <label>Arrival Rate (λ)</label>
                                        <input type="range" id="arrival-rate" min="1" max="20" value="10" step="1">
                                        <span id="arrival-rate-value">10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="market-data">
                            <h4><i class="fas fa-database"></i> Recent Trades</h4>
                            <div class="trades-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Side</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody id="trades-list"></tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="simulation-info">
                            <h4><i class="fas fa-info-circle"></i> Algorithm Details</h4>
                            <div class="info-content">
                                <p><strong>Avellaneda-Stoikov Model:</strong> Optimal market making strategy balancing profit from spreads with inventory risk.</p>
                                <div class="formula">
                                    <p>Reservation Price: r = s - qγσ²(T-t)</p>
                                    <p>Spread: δ = γσ²(T-t) + (2/γ) ln(1 + γ/κ)</p>
                                    <p>Bid/Ask Prices: p_bid = r - δ/2, p_ask = r + δ/2</p>
                                </div>
                                <p><strong>Key Metrics:</strong> Sharpe Ratio, Inventory Risk, Adverse Selection, Market Impact</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.updateOrderBookDisplay();
            this.initializeCharts();
        }
        
        initializeOrderBook() {
            // Generate initial order book levels
            for (let i = 1; i <= 10; i++) {
                const bidPrice = this.orderBook.midPrice - i * 0.05;
                const askPrice = this.orderBook.midPrice + i * 0.05;
                
                this.orderBook.bids.push({
                    price: bidPrice,
                    quantity: Math.floor(Math.random() * 100) + 50,
                    id: `bid_${i}`
                });
                
                this.orderBook.asks.push({
                    price: askPrice,
                    quantity: Math.floor(Math.random() * 100) + 50,
                    id: `ask_${i}`
                });
            }
            
            this.orderBook.bids.sort((a, b) => b.price - a.price);
            this.orderBook.asks.sort((a, b) => a.price - b.price);
            this.updateBestPrices();
        }
        
        updateBestPrices() {
            if (this.orderBook.bids.length > 0) {
                this.orderBook.bestBid = this.orderBook.bids[0].price;
            }
            if (this.orderBook.asks.length > 0) {
                this.orderBook.bestAsk = this.orderBook.asks[0].price;
            }
            this.orderBook.midPrice = (this.orderBook.bestBid + this.orderBook.bestAsk) / 2;
            this.orderBook.spread = this.orderBook.bestAsk - this.orderBook.bestBid;
        }
        
        updateOrderBookDisplay() {
            const bidsList = document.getElementById('bids-list');
            const asksList = document.getElementById('asks-list');
            
            if (!bidsList || !asksList) return;
            
            // Update bids
            bidsList.innerHTML = '';
            this.orderBook.bids.slice(0, 8).forEach(order => {
                const depth = (order.quantity / 500) * 100;
                bidsList.innerHTML += `
                    <div class="order-row bid-row">
                        <div class="order-price">${order.price.toFixed(2)}</div>
                        <div class="order-quantity">${order.quantity}</div>
                        <div class="order-depth" style="width: ${depth}%"></div>
                    </div>
                `;
            });
            
            // Update asks
            asksList.innerHTML = '';
            this.orderBook.asks.slice(0, 8).forEach(order => {
                const depth = (order.quantity / 500) * 100;
                asksList.innerHTML += `
                    <div class="order-row ask-row">
                        <div class="order-price">${order.price.toFixed(2)}</div>
                        <div class="order-quantity">${order.quantity}</div>
                        <div class="order-depth" style="width: ${depth}%"></div>
                    </div>
                `;
            });
            
            // Update market overview
            document.getElementById('mid-price').textContent = `$${this.orderBook.midPrice.toFixed(2)}`;
            document.getElementById('spread').textContent = this.orderBook.spread.toFixed(2);
            document.getElementById('pnl').textContent = `$${this.state.pnl.toFixed(2)}`;
            document.getElementById('inventory').textContent = this.state.inventory;
        }
        
        initializeCharts() {
            // Price chart
            this.priceChart = new Chart(document.getElementById('price-chart'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Mid Price',
                            data: [],
                            borderColor: '#64ffda',
                            backgroundColor: 'rgba(100, 255, 218, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Spread',
                            data: [],
                            borderColor: '#ff6b6b',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            tension: 0.4,
                            fill: false,
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
                            display: false
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Price ($)'
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
                                text: 'Spread'
                            },
                            grid: {
                                drawOnChartArea: false
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
            
            // P&L chart
            this.pnlChart = new Chart(document.getElementById('pnl-chart'), {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'P&L',
                            data: [],
                            backgroundColor: 'rgba(100, 255, 218, 0.6)',
                            borderColor: '#64ffda',
                            borderWidth: 1
                        },
                        {
                            label: 'Inventory',
                            data: [],
                            type: 'line',
                            borderColor: '#ffd166',
                            backgroundColor: 'rgba(255, 209, 102, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'P&L ($)'
                            },
                            grid: {
                                color: 'rgba(136, 146, 176, 0.1)'
                            }
                        },
                        y1: {
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Inventory'
                            },
                            grid: {
                                drawOnChartArea: false
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
        
        bindEvents() {
            // Simulation controls
            document.getElementById('hfmm-start').addEventListener('click', () => {
                this.state.running = true;
            });
            
            document.getElementById('hfmm-pause').addEventListener('click', () => {
                this.state.running = false;
            });
            
            document.getElementById('hfmm-reset').addEventListener('click', () => {
                this.resetSimulation();
            });
            
            // Strategy controls
            document.getElementById('strategy-select').addEventListener('change', (e) => {
                this.state.strategy = e.target.value;
                this.updateStrategyParams();
            });
            
            // Parameter controls
            const params = ['spread-target', 'inventory-limit', 'sim-speed', 
                          'risk-aversion', 'volatility', 'arrival-rate'];
            
            params.forEach(param => {
                const element = document.getElementById(param);
                const valueElement = document.getElementById(`${param}-value`);
                
                if (element && valueElement) {
                    element.addEventListener('input', (e) => {
                        let value = parseFloat(e.target.value);
                        if (param === 'sim-speed') {
                            valueElement.textContent = `${value}x`;
                            this.state.simulationSpeed = value;
                        } else if (param === 'spread-target') {
                            valueElement.textContent = `${value} bps`;
                        } else {
                            valueElement.textContent = value.toFixed(2);
                        }
                    });
                }
            });
        }
        
        updateStrategyParams() {
            const paramsDiv = document.getElementById('avellaneda-params');
            if (this.state.strategy === 'avellaneda-stoikov') {
                paramsDiv.style.display = 'block';
            } else {
                paramsDiv.style.display = 'none';
            }
        }
        
        startSimulation() {
            const simulationLoop = () => {
                if (this.state.running) {
                    this.updateMarket();
                    this.runStrategy();
                    this.updateCharts();
                    this.updateOrderBookDisplay();
                }
                
                setTimeout(simulationLoop, 1000 / this.state.simulationSpeed);
            };
            
            simulationLoop();
        }
        
        updateMarket() {
            this.state.time++;
            
            // Simulate market movements (Brownian motion)
            const volatility = parseFloat(document.getElementById('volatility').value) || 0.3;
            const drift = 0.0001;
            const shock = (Math.random() - 0.5) * volatility * 0.1;
            
            this.orderBook.midPrice *= (1 + drift + shock);
            this.orderBook.midPrice = Math.max(50, Math.min(150, this.orderBook.midPrice));
            
            // Update order book prices
            this.orderBook.bids.forEach(bid => {
                bid.price = this.orderBook.midPrice - Math.random() * 0.5;
            });
            
            this.orderBook.asks.forEach(ask => {
                ask.price = this.orderBook.midPrice + Math.random() * 0.5;
            });
            
            this.orderBook.bids.sort((a, b) => b.price - a.price);
            this.orderBook.asks.sort((a, b) => a.price - b.price);
            this.updateBestPrices();
            
            // Simulate random market orders
            if (Math.random() > 0.7) {
                this.simulateMarketOrder();
            }
        }
        
        simulateMarketOrder() {
            const side = Math.random() > 0.5 ? 'buy' : 'sell';
            const quantity = Math.floor(Math.random() * 50) + 10;
            
            if (side === 'buy') {
                // Buy market order hits asks
                let remaining = quantity;
                while (remaining > 0 && this.orderBook.asks.length > 0) {
                    const bestAsk = this.orderBook.asks[0];
                    const fillQty = Math.min(remaining, bestAsk.quantity);
                    
                    // Record trade
                    this.recordTrade('sell', bestAsk.price, fillQty);
                    
                    // Update order book
                    if (bestAsk.quantity === fillQty) {
                        this.orderBook.asks.shift();
                    } else {
                        bestAsk.quantity -= fillQty;
                    }
                    
                    remaining -= fillQty;
                }
            } else {
                // Sell market order hits bids
                let remaining = quantity;
                while (remaining > 0 && this.orderBook.bids.length > 0) {
                    const bestBid = this.orderBook.bids[0];
                    const fillQty = Math.min(remaining, bestBid.quantity);
                    
                    // Record trade
                    this.recordTrade('buy', bestBid.price, fillQty);
                    
                    // Update order book
                    if (bestBid.quantity === fillQty) {
                        this.orderBook.bids.shift();
                    } else {
                        bestBid.quantity -= fillQty;
                    }
                    
                    remaining -= fillQty;
                }
            }
            
            this.updateBestPrices();
        }
        
        recordTrade(side, price, quantity) {
            const trade = {
                time: this.state.time,
                side: side,
                price: price,
                quantity: quantity,
                value: price * quantity
            };
            
            this.state.trades.unshift(trade);
            
            // Update P&L
            if (side === 'buy') {
                this.state.inventory += quantity;
                this.state.pnl -= trade.value;
            } else {
                this.state.inventory -= quantity;
                this.state.pnl += trade.value;
            }
            
            // Update trades table
            this.updateTradesTable();
            
            // Keep only last 20 trades
            if (this.state.trades.length > 20) {
                this.state.trades.pop();
            }
        }
        
        updateTradesTable() {
            const tradesList = document.getElementById('trades-list');
            if (!tradesList) return;
            
            tradesList.innerHTML = this.state.trades.slice(0, 10).map(trade => `
                <tr class="trade-row ${trade.side}-trade">
                    <td>${trade.time}s</td>
                    <td><span class="trade-side ${trade.side}">${trade.side.toUpperCase()}</span></td>
                    <td>$${trade.price.toFixed(2)}</td>
                    <td>${trade.quantity}</td>
                    <td>$${trade.value.toFixed(2)}</td>
                </tr>
            `).join('');
        }
        
        runStrategy() {
            const strategy = this.strategies[this.state.strategy];
            if (strategy) {
                strategy();
            }
        }
        
        simpleMarketMaker() {
            const spreadTarget = parseFloat(document.getElementById('spread-target').value) / 10000;
            const halfSpread = spreadTarget / 2;
            
            // Cancel existing market maker orders
            this.orderBook.bids = this.orderBook.bids.filter(o => !o.id.startsWith('mm_'));
            this.orderBook.asks = this.orderBook.asks.filter(o => !o.id.startsWith('mm_'));
            
            // Place new orders
            if (Math.abs(this.state.inventory) < 50) {
                const bidPrice = this.orderBook.midPrice - halfSpread;
                const askPrice = this.orderBook.midPrice + halfSpread;
                
                this.orderBook.bids.push({
                    price: bidPrice,
                    quantity: 100,
                    id: 'mm_bid'
                });
                
                this.orderBook.asks.push({
                    price: askPrice,
                    quantity: 100,
                    id: 'mm_ask'
                });
            }
            
            this.orderBook.bids.sort((a, b) => b.price - a.price);
            this.orderBook.asks.sort((a, b) => a.price - b.price);
        }
        
        avellanedaStoikov() {
            const gamma = parseFloat(document.getElementById('risk-aversion').value) || 0.1;
            const sigma = parseFloat(document.getElementById('volatility').value) || 0.3;
            const kappa = parseFloat(document.getElementById('arrival-rate').value) || 10;
            const T = 1.0; // Time horizon
            const t = this.state.time / 100; // Current time
            
            // Calculate reservation price
            const reservationPrice = this.orderBook.midPrice - 
                this.state.inventory * gamma * sigma * sigma * (T - t);
            
            // Calculate optimal spread
            const optimalSpread = gamma * sigma * sigma * (T - t) + 
                (2 / gamma) * Math.log(1 + gamma / kappa);
            
            // Calculate bid and ask prices
            const bidPrice = reservationPrice - optimalSpread / 2;
            const askPrice = reservationPrice + optimalSpread / 2;
            
            // Cancel existing orders
            this.orderBook.bids = this.orderBook.bids.filter(o => !o.id.startsWith('as_'));
            this.orderBook.asks = this.orderBook.asks.filter(o => !o.id.startsWith('as_'));
            
            // Place new orders
            this.orderBook.bids.push({
                price: bidPrice,
                quantity: 100,
                id: 'as_bid'
            });
            
            this.orderBook.asks.push({
                price: askPrice,
                quantity: 100,
                id: 'as_ask'
            });
            
            this.orderBook.bids.sort((a, b) => b.price - a.price);
            this.orderBook.asks.sort((a, b) => a.price - b.price);
        }
        
        inventoryControl() {
            const inventoryLimit = parseFloat(document.getElementById('inventory-limit').value) || 20;
            
            // Adjust spread based on inventory
            let spreadMultiplier = 1;
            if (Math.abs(this.state.inventory) > inventoryLimit * 0.8) {
                // Wide spread to reduce trading
                spreadMultiplier = 2;
            }
            
            const spread = this.orderBook.spread * spreadMultiplier;
            const bidPrice = this.orderBook.midPrice - spread / 2;
            const askPrice = this.orderBook.midPrice + spread / 2;
            
            // Cancel existing orders
            this.orderBook.bids = this.orderBook.bids.filter(o => !o.id.startsWith('ic_'));
            this.orderBook.asks = this.orderBook.asks.filter(o => !o.id.startsWith('ic_'));
            
            // Place new orders
            this.orderBook.bids.push({
                price: bidPrice,
                quantity: 100,
                id: 'ic_bid'
            });
            
            this.orderBook.asks.push({
                price: askPrice,
                quantity: 100,
                id: 'ic_ask'
            });
            
            this.orderBook.bids.sort((a, b) => b.price - a.price);
            this.orderBook.asks.sort((a, b) => a.price - b.price);
        }
        
        updateCharts() {
            // Update price chart
            if (this.priceChart.data.labels.length > 50) {
                this.priceChart.data.labels.shift();
                this.priceChart.data.datasets[0].data.shift();
                this.priceChart.data.datasets[1].data.shift();
            }
            
            this.priceChart.data.labels.push(this.state.time);
            this.priceChart.data.datasets[0].data.push(this.orderBook.midPrice);
            this.priceChart.data.datasets[1].data.push(this.orderBook.spread);
            
            // Update P&L chart
            if (this.pnlChart.data.labels.length > 20) {
                this.pnlChart.data.labels.shift();
                this.pnlChart.data.datasets[0].data.shift();
                this.pnlChart.data.datasets[1].data.shift();
            }
            
            this.pnlChart.data.labels.push(this.state.time);
            this.pnlChart.data.datasets[0].data.push(this.state.pnl);
            this.pnlChart.data.datasets[1].data.push(this.state.inventory);
            
            // Update charts
            this.priceChart.update('none');
            this.pnlChart.update('none');
        }
        
        resetSimulation() {
            this.state = {
                running: false,
                simulationSpeed: 1,
                time: 0,
                orders: [],
                trades: [],
                pnl: 0,
                inventory: 0,
                spreads: [],
                marketData: [],
                strategy: 'avellaneda-stoikov'
            };
            
            this.orderBook = {
                bids: [],
                asks: [],
                midPrice: 100.00,
                bestBid: 99.95,
                bestAsk: 100.05,
                spread: 0.10
            };
            
            this.initializeOrderBook();
            this.updateOrderBookDisplay();
            
            // Reset charts
            this.priceChart.data.labels = [];
            this.priceChart.data.datasets.forEach(dataset => dataset.data = []);
            this.pnlChart.data.labels = [];
            this.pnlChart.data.datasets.forEach(dataset => dataset.data = []);
            
            this.priceChart.update();
            this.pnlChart.update();
        }
    }
    
    // Add CSS for HFMM simulator
    const style = document.createElement('style');
    style.textContent = `
        .hfmm-simulator {
            background: var(--secondary);
            border-radius: 10px;
            padding: 2rem;
            margin: 2rem 0;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .hfmm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .hfmm-header h3 {
            color: var(--white);
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
        }
        
        .simulation-controls {
            display: flex;
            gap: 0.5rem;
        }
        
        .sim-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .start-btn {
            background: rgba(100, 255, 218, 0.2);
            color: var(--accent);
            border: 1px solid var(--accent);
        }
        
        .pause-btn {
            background: rgba(255, 209, 102, 0.2);
            color: #ffd166;
            border: 1px solid #ffd166;
        }
        
        .reset-btn {
            background: rgba(255, 107, 107, 0.2);
            color: #ff6b6b;
            border: 1px solid #ff6b6b;
        }
        
        .sim-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(2,12,27,0.3);
        }
        
        .hfmm-dashboard {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .market-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .market-stat {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .stat-label {
            color: var(--text-light);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .stat-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--accent);
        }
        
        .order-book-container {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .order-book-container h4 {
            color: var(--white);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .order-book {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            min-height: 300px;
        }
        
        .order-book-side {
            display: flex;
            flex-direction: column;
        }
        
        .side-header {
            color: var(--text-light);
            font-weight: 600;
            padding: 0.5rem;
            border-bottom: 1px solid rgba(136, 146, 176, 0.2);
            margin-bottom: 0.5rem;
        }
        
        .orders-list {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        
        .order-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            position: relative;
            margin-bottom: 2px;
        }
        
        .bid-row {
            background: rgba(0, 255, 0, 0.05);
        }
        
        .ask-row {
            background: rgba(255, 0, 0, 0.05);
        }
        
        .order-price {
            color: var(--text);
            font-weight: 500;
            z-index: 1;
        }
        
        .order-quantity {
            color: var(--text-light);
            z-index: 1;
        }
        
        .order-depth {
            position: absolute;
            top: 0;
            height: 100%;
            opacity: 0.3;
            transition: width 0.3s ease;
        }
        
        .bid-row .order-depth {
            right: 0;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.3));
        }
        
        .ask-row .order-depth {
            left: 0;
            background: linear-gradient(90deg, rgba(255, 0, 0, 0.3), transparent);
        }
        
        .charts-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
        }
        
        .chart-card {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .chart-card h4 {
            color: var(--white);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .chart-wrapper {
            height: 250px;
            position: relative;
        }
        
        .strategy-controls {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .strategy-controls h4 {
            color: var(--white);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .controls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .control-group label {
            color: var(--text-light);
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .strategy-select {
            background: var(--secondary);
            color: var(--text);
            border: 1px solid rgba(100, 255, 218, 0.2);
            padding: 0.5rem;
            border-radius: 4px;
            font-family: 'Inter', sans-serif;
        }
        
        .control-group input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: rgba(100, 255, 218, 0.1);
            border-radius: 3px;
            outline: none;
        }
        
        .control-group input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: var(--accent);
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid var(--primary);
        }
        
        .control-group span {
            color: var(--accent);
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .strategy-params {
            background: rgba(10, 25, 47, 0.5);
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .strategy-params h5 {
            color: var(--white);
            margin-bottom: 1rem;
        }
        
        .params-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        .param {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .param label {
            color: var(--text-light);
            font-size: 0.85rem;
        }
        
        .market-data {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .market-data h4 {
            color: var(--white);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .trades-table {
            overflow-x: auto;
        }
        
        .trades-table table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .trades-table th {
            color: var(--text-light);
            font-weight: 600;
            text-align: left;
            padding: 0.75rem;
            border-bottom: 1px solid rgba(136, 146, 176, 0.2);
            font-size: 0.85rem;
        }
        
        .trades-table td {
            padding: 0.75rem;
            border-bottom: 1px solid rgba(136, 146, 176, 0.1);
            font-size: 0.9rem;
        }
        
        .trade-row:hover {
            background: rgba(100, 255, 218, 0.05);
        }
        
        .trade-side {
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
            font-weight: 600;
            font-size: 0.8rem;
        }
        
        .trade-side.buy {
            background: rgba(0, 255, 0, 0.1);
            color: #00ff00;
        }
        
        .trade-side.sell {
            background: rgba(255, 0, 0, 0.1);
            color: #ff6b6b;
        }
        
        .simulation-info {
            background: var(--primary);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .simulation-info h4 {
            color: var(--white);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-content p {
            color: var(--text-light);
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }
        
        .formula {
            background: rgba(10, 25, 47, 0.5);
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
            border-left: 3px solid var(--accent);
        }
        
        .formula p {
            font-family: monospace;
            color: var(--accent);
            margin-bottom: 0.25rem;
        }
        
        @media (max-width: 968px) {
            .hfmm-header {
                flex-direction: column;
                align-items: stretch;
            }
            
            .simulation-controls {
                justify-content: center;
            }
            
            .charts-container {
                grid-template-columns: 1fr;
            }
            
            .order-book {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .controls-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .market-overview {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .controls-grid {
                grid-template-columns: 1fr;
            }
            
            .params-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .market-overview {
                grid-template-columns: 1fr;
            }
            
            .hfmm-simulator {
                padding: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize simulator when DOM is ready
    function initHFMMSimulator() {
        if (document.getElementById('hfmmSimulatorContainer')) {
            window.hfmmSimulator = new HFMMSimulator();
            console.log('✅ HFMM Simulator initialized');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHFMMSimulator);
    } else {
        initHFMMSimulator();
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = HFMMSimulator;
    }
})();
