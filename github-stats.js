// github-stats.js
class GitHubStats {
    constructor(username = 'emmanueladutwum123') {
        this.username = username;
        this.cacheKey = 'githubStatsCache';
        this.cacheDuration = 3600000; // 1 hour
        this.init();
    }
    
    async init() {
        try {
            const stats = await this.getStats();
            this.displayStats(stats);
        } catch (error) {
            console.error('GitHub Stats Error:', error);
            this.displayFallback();
        }
    }
    
    async getStats() {
        // Check cache first
        const cached = this.getCachedStats();
        if (cached) return cached;
        
        try {
            const [userData, reposData] = await Promise.all([
                fetch(`https://api.github.com/users/${this.username}`).then(r => r.json()),
                fetch(`https://api.github.com/users/${this.username}/repos?per_page=100`).then(r => r.json())
            ]);
            
            const stats = {
                publicRepos: userData.public_repos || 0,
                followers: userData.followers || 0,
                following: userData.following || 0,
                totalStars: reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
                totalForks: reposData.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
                languages: this.extractLanguages(reposData),
                lastUpdated: new Date().toISOString()
            };
            
            this.cacheStats(stats);
            return stats;
        } catch (error) {
            throw error;
        }
    }
    
    extractLanguages(repos) {
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        return Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }
    
    cacheStats(stats) {
        localStorage.setItem(this.cacheKey, JSON.stringify({
            data: stats,
            timestamp: Date.now()
        }));
    }
    
    getCachedStats() {
        const cached = localStorage.getItem(this.cacheKey);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.cacheDuration) {
            return data;
        }
        return null;
    }
    
    displayStats(stats) {
        const container = document.getElementById('githubStats');
        if (!container) return;
        
        container.innerHTML = `
            <div class="github-stats-widget">
                <h3><i class="fab fa-github"></i> GitHub Activity</h3>
                <div class="github-stats-grid">
                    <div class="github-stat">
                        <div class="github-stat-value">${stats.publicRepos}</div>
                        <div class="github-stat-label">Repositories</div>
                    </div>
                    <div class="github-stat">
                        <div class="github-stat-value">${stats.totalStars}</div>
                        <div class="github-stat-label">Stars</div>
                    </div>
                    <div class="github-stat">
                        <div class="github-stat-value">${stats.totalForks}</div>
                        <div class="github-stat-label">Forks</div>
                    </div>
                    <div class="github-stat">
                        <div class="github-stat-value">${stats.followers}</div>
                        <div class="github-stat-label">Followers</div>
                    </div>
                </div>
                
                <div class="github-languages">
                    <h4>Top Languages</h4>
                    <div class="language-bars">
                        ${stats.languages.map(([lang, count]) => `
                            <div class="language-bar">
                                <div class="language-name">${lang}</div>
                                <div class="language-bar-bg">
                                    <div class="language-bar-fill" style="width: ${(count / stats.publicRepos) * 100}%;"></div>
                                </div>
                                <div class="language-count">${count}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <a href="https://github.com/${this.username}" class="github-link" target="_blank">
                    View Full Profile <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
    }
    
    displayFallback() {
        const container = document.getElementById('githubStats');
        if (!container) return;
        
        container.innerHTML = `
            <div class="github-stats-widget">
                <h3><i class="fab fa-github"></i> GitHub Activity</h3>
                <p style="color: var(--text-light); text-align: center; padding: 2rem;">
                    Connect to view GitHub statistics
                </p>
                <a href="https://github.com/emmanueladutwum123" class="github-link" target="_blank">
                    View GitHub Profile <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
    }
}

// Add CSS for GitHub stats
const githubStyles = document.createElement('style');
githubStyles.textContent = `
    .github-stats-widget {
        background: var(--secondary);
        border-radius: 10px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid rgba(100, 255, 218, 0.1);
    }
    
    .github-stats-widget h3 {
        color: var(--white);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .github-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .github-stat {
        background: var(--primary);
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        border: 1px solid rgba(100, 255, 218, 0.1);
    }
    
    .github-stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--accent);
        margin-bottom: 0.5rem;
    }
    
    .github-stat-label {
        color: var(--text-light);
        font-size: 0.9rem;
    }
    
    .github-languages {
        margin: 2rem 0;
    }
    
    .github-languages h4 {
        color: var(--text-light);
        margin-bottom: 1rem;
        font-size: 1rem;
    }
    
    .language-bar {
        display: flex;
        align-items: center;
        margin-bottom: 0.8rem;
        gap: 1rem;
    }
    
    .language-name {
        min-width: 100px;
        color: var(--text);
        font-weight: 500;
    }
    
    .language-bar-bg {
        flex-grow: 1;
        height: 8px;
        background: rgba(100, 255, 218, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .language-bar-fill {
        height: 100%;
        background: var(--accent);
        border-radius: 4px;
        transition: width 1s ease;
    }
    
    .language-count {
        min-width: 40px;
        text-align: right;
        color: var(--accent-light);
        font-weight: 500;
    }
    
    .github-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--accent);
        text-decoration: none;
        font-weight: 600;
        transition: var(--transition);
    }
    
    .github-link:hover {
        gap: 12px;
    }
`;
document.head.appendChild(githubStyles);

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GitHubStats();
    });
} else {
    new GitHubStats();
}
