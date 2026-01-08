// github-stats.js - GitHub API Integration for Statistics Display
(function() {
    'use strict';
    
    class GitHubStats {
        constructor(username = 'emmanueladutwum123') {
            this.username = username;
            this.cacheKey = `githubStats_${username}`;
            this.cacheDuration = 3600000; // 1 hour in milliseconds
            this.init();
        }
        
        async init() {
            try {
                await this.loadStats();
            } catch (error) {
                console.error('GitHub Stats Error:', error);
                this.displayFallback();
            }
        }
        
        async loadStats() {
            // Check cache first
            const cachedData = this.getCachedData();
            if (cachedData) {
                console.log('📦 Using cached GitHub data');
                this.displayStats(cachedData);
                return;
            }
            
            try {
                console.log('🌐 Fetching fresh GitHub data...');
                const stats = await this.fetchGitHubData();
                this.cacheData(stats);
                this.displayStats(stats);
            } catch (error) {
                throw error;
            }
        }
        
        async fetchGitHubData() {
            try {
                // Fetch user data
                const userResponse = await fetch(`https://api.github.com/users/${this.username}`);
                if (!userResponse.ok) throw new Error(`User API error: ${userResponse.status}`);
                const userData = await userResponse.json();
                
                // Fetch repositories
                const reposResponse = await fetch(`https://api.github.com/users/${this.username}/repos?per_page=100&sort=updated`);
                if (!reposResponse.ok) throw new Error(`Repos API error: ${reposResponse.status}`);
                const reposData = await reposResponse.json();
                
                // Calculate statistics
                const stats = {
                    // Basic info
                    username: userData.login,
                    name: userData.name || this.username,
                    avatar: userData.avatar_url,
                    bio: userData.bio || '',
                    
                    // Counts
                    publicRepos: userData.public_repos || 0,
                    followers: userData.followers || 0,
                    following: userData.following || 0,
                    
                    // Repository stats
                    totalStars: reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
                    totalForks: reposData.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
                    totalWatchers: reposData.reduce((sum, repo) => sum + (repo.watchers_count || 0), 0),
                    
                    // Language analysis
                    languages: this.analyzeLanguages(reposData),
                    
                    // Recent activity
                    lastUpdated: new Date().toISOString(),
                    
                    // Popular repositories
                    popularRepos: reposData
                        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
                        .slice(0, 3)
                        .map(repo => ({
                            name: repo.name,
                            description: repo.description,
                            stars: repo.stargazers_count,
                            forks: repo.forks_count,
                            language: repo.language,
                            url: repo.html_url
                        }))
                };
                
                return stats;
            } catch (error) {
                console.error('GitHub API Error:', error);
                throw error;
            }
        }
        
        analyzeLanguages(repos) {
            const languageCounts = {};
            let totalReposWithLanguage = 0;
            
            repos.forEach(repo => {
                if (repo.language) {
                    languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
                    totalReposWithLanguage++;
                }
            });
            
            // Convert to array and sort
            const languages = Object.entries(languageCounts)
                .map(([name, count]) => ({
                    name,
                    count,
                    percentage: totalReposWithLanguage > 0 ? (count / totalReposWithLanguage) * 100 : 0
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6); // Top 6 languages
            
            return languages;
        }
        
        cacheData(data) {
            const cache = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cache));
        }
        
        getCachedData() {
            try {
                const cached = localStorage.getItem(this.cacheKey);
                if (!cached) return null;
                
                const { data, timestamp } = JSON.parse(cached);
                
                // Check if cache is still valid
                if (Date.now() - timestamp < this.cacheDuration) {
                    return data;
                }
                
                return null;
            } catch (error) {
                console.error('Cache read error:', error);
                return null;
            }
        }
        
        displayStats(stats) {
            const container = document.getElementById('githubStats');
            if (!container) {
                console.error('GitHub stats container not found');
                return;
            }
            
            container.innerHTML = `
                <div class="github-stats-widget">
                    <div class="github-header">
                        <h3><i class="fab fa-github"></i> GitHub Activity</h3>
                        <div class="github-username">@${stats.username}</div>
                    </div>
                    
                    <div class="github-stats-grid">
                        <div class="github-stat">
                            <div class="github-stat-icon">
                                <i class="fas fa-code-branch"></i>
                            </div>
                            <div class="github-stat-content">
                                <div class="github-stat-value">${stats.publicRepos}</div>
                                <div class="github-stat-label">Repositories</div>
                            </div>
                        </div>
                        
                        <div class="github-stat">
                            <div class="github-stat-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="github-stat-content">
                                <div class="github-stat-value">${stats.totalStars}</div>
                                <div class="github-stat-label">Stars</div>
                            </div>
                        </div>
                        
                        <div class="github-stat">
                            <div class="github-stat-icon">
                                <i class="fas fa-code-fork"></i>
                            </div>
                            <div class="github-stat-content">
                                <div class="github-stat-value">${stats.totalForks}</div>
                                <div class="github-stat-label">Forks</div>
                            </div>
                        </div>
                        
                        <div class="github-stat">
                            <div class="github-stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="github-stat-content">
                                <div class="github-stat-value">${stats.followers}</div>
                                <div class="github-stat-label">Followers</div>
                            </div>
                        </div>
                    </div>
                    
                    ${stats.languages.length > 0 ? `
                    <div class="github-languages">
                        <h4><i class="fas fa-code"></i> Top Languages</h4>
                        <div class="language-bars">
                            ${stats.languages.map(lang => `
                                <div class="language-bar">
                                    <div class="language-info">
                                        <span class="language-name">${lang.name}</span>
                                        <span class="language-percentage">${lang.percentage.toFixed(1)}%</span>
                                    </div>
                                    <div class="language-bar-bg">
                                        <div class="language-bar-fill" 
                                             style="width: ${lang.percentage}%"
                                             data-percentage="${lang.percentage}">
                                        </div>
                                    </div>
                                    <div class="language-count">${lang.count} repo${lang.count !== 1 ? 's' : ''}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${stats.popularRepos.length > 0 ? `
                    <div class="popular-repos">
                        <h4><i class="fas fa-fire"></i> Popular Repositories</h4>
                        <div class="repo-list">
                            ${stats.popularRepos.map(repo => `
                                <a href="${repo.url}" class="repo-card" target="_blank" rel="noopener">
                                    <div class="repo-header">
                                        <span class="repo-name">${repo.name}</span>
                                        <span class="repo-stars">
                                            <i class="fas fa-star"></i> ${repo.stars || 0}
                                        </span>
                                    </div>
                                    ${repo.description ? `
                                    <p class="repo-description">${repo.description}</p>
                                    ` : ''}
                                    ${repo.language ? `
                                    <div class="repo-footer">
                                        <span class="repo-language">
                                            <span class="language-dot" style="background-color: ${this.getLanguageColor(repo.language)}"></span>
                                            ${repo.language}
                                        </span>
                                    </div>
                                    ` : ''}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="github-actions">
                        <a href="https://github.com/${stats.username}" 
                           class="github-profile-link" 
                           target="_blank" 
                           rel="noopener">
                            <i class="fab fa-github"></i>
                            View Full GitHub Profile
                            <i class="fas fa-arrow-right"></i>
                        </a>
                        <div class="github-update-time">
                            <i class="fas fa-sync-alt"></i>
                            Updated: ${new Date(stats.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                </div>
            `;
            
            // Animate language bars
            this.animateLanguageBars();
            
            console.log('✅ GitHub stats displayed successfully');
        }
        
        getLanguageColor(language) {
            const colors = {
                'Python': '#3572A5',
                'JavaScript': '#f1e05a',
                'TypeScript': '#2b7489',
                'Java': '#b07219',
                'C++': '#f34b7d',
                'C': '#555555',
                'R': '#198CE7',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
                'Jupyter Notebook': '#DA5B0B',
                'Shell': '#89e051',
                'PHP': '#4F5D95',
                'Ruby': '#701516',
                'Go': '#00ADD8',
                'Rust': '#dea584',
                'Scala': '#c22d40',
                'Kotlin': '#F18E33',
                'Swift': '#ffac45',
                'MATLAB': '#e16737',
                'Julia': '#a270ba'
            };
            
            return colors[language] || '#64ffda';
        }
        
        animateLanguageBars() {
            // Animate language bars on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bars = entry.target.querySelectorAll('.language-bar-fill');
                        bars.forEach(bar => {
                            const percentage = bar.getAttribute('data-percentage');
                            bar.style.width = '0%';
                            
                            setTimeout(() => {
                                bar.style.transition = 'width 1.5s ease-out';
                                bar.style.width = percentage + '%';
                            }, 100);
                        });
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            const widget = document.querySelector('.github-stats-widget');
            if (widget) {
                observer.observe(widget);
            }
        }
        
        displayFallback() {
            const container = document.getElementById('githubStats');
            if (!container) return;
            
            container.innerHTML = `
                <div class="github-stats-widget">
                    <div class="github-header">
                        <h3><i class="fab fa-github"></i> GitHub Activity</h3>
                    </div>
                    
                    <div class="github-error">
                        <i class="fas fa-wifi-slash"></i>
                        <p>Unable to load GitHub statistics at the moment.</p>
                        <p>You can still visit my GitHub profile to see my projects.</p>
                    </div>
                    
                    <div class="github-actions">
                        <a href="https://github.com/${this.username}" 
                           class="github-profile-link" 
                           target="_blank" 
                           rel="noopener">
                            <i class="fab fa-github"></i>
                            View GitHub Profile
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
            
            console.log('⚠️ Displaying fallback GitHub stats');
        }
    }
    
    // Add additional CSS for GitHub stats
    const style = document.createElement('style');
    style.textContent = `
        .github-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .github-username {
            color: var(--text-light);
            font-size: 0.9rem;
            background: var(--primary);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            border: 1px solid rgba(100, 255, 218, 0.2);
        }
        
        .github-stat {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: var(--primary);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
            transition: var(--transition);
        }
        
        .github-stat:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(2,12,27,0.3);
            border-color: rgba(100, 255, 218, 0.3);
        }
        
        .github-stat-icon {
            width: 40px;
            height: 40px;
            background: rgba(100, 255, 218, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent);
        }
        
        .github-stat-content {
            flex-grow: 1;
        }
        
        .github-stat-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--accent);
            line-height: 1;
        }
        
        .github-stat-label {
            color: var(--text-light);
            font-size: 0.85rem;
            margin-top: 0.2rem;
        }
        
        .language-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.3rem;
        }
        
        .language-name {
            color: var(--text);
            font-weight: 500;
        }
        
        .language-percentage {
            color: var(--accent);
            font-weight: 600;
        }
        
        .popular-repos {
            margin-top: 2rem;
        }
        
        .repo-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            margin-top: 1rem;
        }
        
        .repo-card {
            background: var(--primary);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
            text-decoration: none;
            color: inherit;
            transition: var(--transition);
        }
        
        .repo-card:hover {
            transform: translateY(-2px);
            border-color: rgba(100, 255, 218, 0.3);
            box-shadow: 0 5px 15px rgba(2,12,27,0.2);
        }
        
        .repo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .repo-name {
            color: var(--accent);
            font-weight: 600;
            font-size: 1rem;
        }
        
        .repo-stars {
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .repo-description {
            color: var(--text-light);
            font-size: 0.9rem;
            line-height: 1.4;
            margin-bottom: 0.5rem;
        }
        
        .repo-footer {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .repo-language {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--text-light);
            font-size: 0.8rem;
        }
        
        .language-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        
        .github-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .github-profile-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
            transition: var(--transition);
        }
        
        .github-profile-link:hover {
            gap: 12px;
        }
        
        .github-update-time {
            color: var(--text-light);
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .github-error {
            text-align: center;
            padding: 2rem;
            color: var(--text-light);
        }
        
        .github-error i {
            font-size: 3rem;
            color: var(--text-light);
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        @media (max-width: 768px) {
            .github-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .github-actions {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
            
            .github-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .github-username {
                align-self: flex-start;
            }
        }
        
        @media (max-width: 480px) {
            .github-stats-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize GitHub stats
    function initGitHubStats() {
        if (document.getElementById('githubStats')) {
            window.gitHubStats = new GitHubStats();
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGitHubStats);
    } else {
        initGitHubStats();
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GitHubStats;
    }
})();
