<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emmanuel Adutwum | Quantitative Researcher & Data Scientist</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #1a1a2e;
            --secondary: #16213e;
            --accent: #0fccce;
            --light: #e6f7ff;
            --text: #333;
            --text-light: #777;
            --white: #fff;
            --shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: var(--text);
            background-color: var(--white);
        }

        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }

        /* Header & Navigation */
        header {
            background-color: var(--primary);
            color: var(--white);
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: var(--shadow);
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--white);
        }

        .logo span {
            color: var(--accent);
        }

        .nav-links {
            display: flex;
            list-style: none;
        }

        .nav-links li {
            margin-left: 2rem;
        }

        .nav-links a {
            color: var(--white);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--accent);
        }

        .hamburger {
            display: none;
            cursor: pointer;
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: var(--white);
            padding: 10rem 0 5rem;
            text-align: center;
        }

        .hero-content {
            max-width: 800px;
            margin: 0 auto;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }

        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            color: var(--light);
        }

        .btn {
            display: inline-block;
            background-color: var(--accent);
            color: var(--primary);
            padding: 0.8rem 1.5rem;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
        }

        .btn:hover {
            background-color: var(--white);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        /* Profile Section */
        .profile {
            padding: 5rem 0;
            background-color: var(--white);
        }

        .section-title {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title h2 {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
        }

        .section-title h2::after {
            content: '';
            position: absolute;
            width: 70px;
            height: 4px;
            background-color: var(--accent);
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
        }

        .profile-content {
            display: flex;
            align-items: center;
            gap: 3rem;
        }

        .profile-image {
            flex: 1;
            text-align: center;
        }

        .profile-image-placeholder {
            width: 300px;
            height: 300px;
            background-color: #f5f5f5;
            border-radius: 50%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 5px solid var(--accent);
            overflow: hidden;
        }

        .profile-image-placeholder i {
            font-size: 5rem;
            color: var(--text-light);
        }

        .profile-text {
            flex: 2;
        }

        .profile-text h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }

        .profile-text p {
            margin-bottom: 1.5rem;
            color: var(--text-light);
        }

        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 1.5rem;
        }

        .skill-tag {
            background-color: var(--light);
            color: var(--primary);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        /* Experience & Education */
        .experience-education {
            padding: 5rem 0;
            background-color: #f9f9f9;
        }

        .timeline {
            position: relative;
            max-width: 800px;
            margin: 0 auto;
        }

        .timeline::after {
            content: '';
            position: absolute;
            width: 4px;
            background-color: var(--accent);
            top: 0;
            bottom: 0;
            left: 50%;
            margin-left: -2px;
        }

        .timeline-item {
            padding: 10px 40px;
            position: relative;
            width: 50%;
            box-sizing: border-box;
        }

        .timeline-item:nth-child(odd) {
            left: 0;
        }

        .timeline-item:nth-child(even) {
            left: 50%;
        }

        .timeline-content {
            padding: 20px;
            background-color: var(--white);
            border-radius: 8px;
            box-shadow: var(--shadow);
            position: relative;
        }

        .timeline-content::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: var(--white);
            border: 4px solid var(--accent);
            border-radius: 50%;
            top: 15px;
            right: -10px;
            z-index: 1;
        }

        .timeline-item:nth-child(even) .timeline-content::after {
            left: -10px;
            right: auto;
        }

        .timeline-date {
            font-weight: 600;
            color: var(--accent);
            margin-bottom: 5px;
        }

        .timeline-title {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: var(--primary);
        }

        .timeline-subtitle {
            font-weight: 500;
            color: var(--text-light);
            margin-bottom: 10px;
        }

        /* Projects Section */
        .projects {
            padding: 5rem 0;
            background-color: var(--white);
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }

        .project-card {
            background-color: var(--white);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: transform 0.3s;
        }

        .project-card:hover {
            transform: translateY(-10px);
        }

        .project-image {
            height: 200px;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .project-image i {
            font-size: 3rem;
            color: var(--text-light);
        }

        .project-content {
            padding: 1.5rem;
        }

        .project-title {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            color: var(--primary);
        }

        .project-description {
            color: var(--text-light);
            margin-bottom: 1rem;
        }

        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 1rem;
        }

        .tech-tag {
            background-color: var(--light);
            color: var(--primary);
            padding: 0.3rem 0.7rem;
            border-radius: 15px;
            font-size: 0.8rem;
        }

        .project-link {
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        /* Publications Section */
        .publications {
            padding: 5rem 0;
            background-color: #f9f9f9;
        }

        .publication-list {
            max-width: 800px;
            margin: 0 auto;
        }

        .publication-item {
            background-color: var(--white);
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow);
            margin-bottom: 1.5rem;
        }

        .publication-title {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: var(--primary);
        }

        .publication-role {
            font-weight: 500;
            color: var(--accent);
            margin-bottom: 0.5rem;
        }

        .publication-description {
            color: var(--text-light);
        }

        /* Contact Section */
        .contact {
            padding: 5rem 0;
            background-color: var(--primary);
            color: var(--white);
        }

        .contact-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .contact h2 {
            color: var(--white);
            margin-bottom: 2rem;
        }

        .contact-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .contact-link {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--white);
            text-decoration: none;
            transition: color 0.3s;
        }

        .contact-link:hover {
            color: var(--accent);
        }

        .contact-link i {
            font-size: 1.2rem;
        }

        /* Footer */
        footer {
            background-color: var(--secondary);
            color: var(--white);
            padding: 2rem 0;
            text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: var(--primary);
                padding: 1rem 0;
            }

            .nav-links.active {
                display: flex;
            }

            .nav-links li {
                margin: 0.5rem 0;
                text-align: center;
            }

            .hamburger {
                display: block;
            }

            .hero h1 {
                font-size: 2.5rem;
            }

            .profile-content {
                flex-direction: column;
            }

            .timeline::after {
                left: 31px;
            }

            .timeline-item {
                width: 100%;
                padding-left: 70px;
                padding-right: 25px;
            }

            .timeline-item:nth-child(even) {
                left: 0;
            }

            .timeline-content::after {
                left: -10px;
                right: auto;
            }
        }
    </style>
</head>
<body>
    <!-- Header & Navigation -->
    <header>
        <div class="container">
            <nav class="navbar">
                <div class="logo">Emmanuel<span>Adutwum</span></div>
                <ul class="nav-links">
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="#experience">Experience</a></li>
                    <li><a href="#education">Education</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#publications">Publications</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div class="hamburger">
                    <i class="fas fa-bars"></i>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Emmanuel Adutwum</h1>
                <p>Economics, Data Science, and Mathematics Student | Quantitative Researcher | Machine Learning Engineer</p>
                <a href="#contact" class="btn">Get In Touch</a>
            </div>
        </div>
    </section>

    <!-- Profile Section -->
    <section id="profile" class="profile">
        <div class="container">
            <div class="section-title">
                <h2>Profile</h2>
            </div>
            <div class="profile-content">
                <div class="profile-image">
                    <div class="profile-image-placeholder">
                        <i class="fas fa-user"></i>
                    </div>
                    <p style="margin-top: 1rem; font-style: italic;">Upload your professional photo here</p>
                </div>
                <div class="profile-text">
                    <h3>About Me</h3>
                    <p>Economics, Data Science, and Mathematics student with a proven track record in quantitative modeling and data analysis. Seeking a Summer Analyst role in Software Engineering, Machine Learning, Quantitative Research, FICC & Equities Quantitative Strategies to apply expertise in C++, Python, statistical modeling, SQL, and financial mathematics to solve complex problems in pricing, risk, and electronic trading.</p>
                    
                    <h3>Technical Skills</h3>
                    <div class="skills">
                        <span class="skill-tag">C++</span>
                        <span class="skill-tag">Python</span>
                        <span class="skill-tag">Java</span>
                        <span class="skill-tag">SQL</span>
                        <span class="skill-tag">R</span>
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">Statistical Modeling</span>
                        <span class="skill-tag">Machine Learning</span>
                        <span class="skill-tag">Quantitative Finance</span>
                        <span class="skill-tag">Data Structures & Algorithms</span>
                        <span class="skill-tag">Financial Mathematics</span>
                        <span class="skill-tag">Power BI</span>
                        <span class="skill-tag">Tableau</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Experience & Education -->
    <section id="experience" class="experience-education">
        <div class="container">
            <div class="section-title">
                <h2>Experience</h2>
            </div>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">June 2025 – Aug 2025</div>
                        <h3 class="timeline-title">Consumer Banking Safe Deposit Data Analytics Intern</h3>
                        <div class="timeline-subtitle">Wells Fargo – Charlotte, NC</div>
                        <ul>
                            <li>Designed and implemented a Power Automate (Microsoft Flow) solution to automate control tracking, reducing manual processes by 80% and improving accuracy.</li>
                            <li>Created automated workflows to monitor compliance controls, generate alerts for overdue tasks, and produce monthly reports using Python programming.</li>
                            <li>Integrated SharePoint and Excel to streamline data collection, approval workflows, and notifications.</li>
                            <li>Reduced human error by automating data validation and ensuring real-time updates across systems.</li>
                        </ul>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">May 2024 – June 2024</div>
                        <h3 class="timeline-title">Risk & Valuation Analyst Intern</h3>
                        <div class="timeline-subtitle">CNO Financial Group – Carmel, Indiana</div>
                        <ul>
                            <li>Engineered and refined actuarial projection models using Python, SQL, and SAS, boosting predictive accuracy by 15% to enhance premium pricing and financial valuation.</li>
                            <li>Leveraged a versatile tech stack (Python, C++, SQL, R, SAS, VBA) to automate data pipelines and develop robust statistical models for risk assessment.</li>
                        </ul>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">Aug 2020 – Oct 2021</div>
                        <h3 class="timeline-title">Quantitative Finance Intern</h3>
                        <div class="timeline-subtitle">Council For Scientific & Industrial Research – Accra, Ghana</div>
                        <ul>
                            <li>Developed and deployed automated financial data pipelines to generate daily sales/purchase journals, reducing reporting latency by 70% and enabling real-time P&L tracking.</li>
                            <li>Engineered a digitized invoice processing system that automated reconciliation workflows, accelerating the month-end close process and providing directors with accurate, audit-ready financial data.</li>
                            <li>Served as the divisional technical expert, optimizing IT infrastructure to ensure high availability of critical trading and reporting systems.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="education" class="experience-education">
        <div class="container">
            <div class="section-title">
                <h2>Education</h2>
            </div>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">Aug 2023 – May 2027</div>
                        <h3 class="timeline-title">Soka University of America</h3>
                        <div class="timeline-subtitle">Economics & Mathematics</div>
                        <ul>
                            <li>Concentration GPA: 3.925/4.0 | Overall GPA: 3.628</li>
                            <li>GRE General Test Scores: 323/340 (Quantitative Reasoning: 165/170, Verbal Reasoning: 158/170)</li>
                            <li>GRE Subject Mathematics Test Scores: 910/990</li>
                            <li>Coursework: Data Structures & Algorithms, Calculus I-II, Linear Algebra, Probability & Statistics, Statistical Modeling, Machine Learning, Cryptography, Mathematical Logic, Macroeconomics, Microeconomics, International Economics, Advanced Math(Real Analysis), Financial Accounting, Quantitative Modeling, Discrete Mathematics & Mathematical Physics</li>
                        </ul>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">May 2024 – May 2026</div>
                        <h3 class="timeline-title">Massachusetts Institute of Technology</h3>
                        <div class="timeline-subtitle">Micromasters in Statistics & Data Science</div>
                        <ul>
                            <li>Passed 3/4 courses; 1 Course In-progress</li>
                            <li>Coursework: Statistical Modeling and Computation in Applications, Probability - The Science of Uncertainty and Data, Machine Learning with Python-From Linear Models to Deep Learning</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
        <div class="container">
            <div class="section-title">
                <h2>Projects</h2>
            </div>
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-image">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">Black Scholes Delta Hedging</h3>
                        <p class="project-description">Implemented the Black-Scholes model and a binomial tree in Python to price European/American options. Simulated a delta-hedging strategy to manage the risk of a short option position.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Python</span>
                            <span class="tech-tag">Quantitative Finance</span>
                            <span class="tech-tag">Options Pricing</span>
                        </div>
                        <a href="#" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card">
                    <div class="project-image">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">High-Frequency Market Making Simulation</h3>
                        <p class="project-description">Engineered a high-frequency market making simulator featuring limit order book implementation with heap-based price priority and real-time feature engineering pipeline.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Python</span>
                            <span class="tech-tag">Algorithmic Trading</span>
                            <span class="tech-tag">Market Microstructure</span>
                        </div>
                        <a href="#" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card">
                    <div class="project-image">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">Machine Learning Pipeline</h3>
                        <p class="project-description">Implemented Support Vector Regression (SVR) with comprehensive preprocessing, feature engineering, and hyperparameter tuning using GridSearchCV and RandomizedSearchCV.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Python</span>
                            <span class="tech-tag">Machine Learning</span>
                            <span class="tech-tag">SVR</span>
                        </div>
                        <a href="#" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card">
                    <div class="project-image">
                        <i class="fas fa-lock"></i>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">Cryptography Research</h3>
                        <p class="project-description">Research in cryptographic protocols and implementations. Focus on secure communication and data protection mechanisms.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Cryptography</span>
                            <span class="tech-tag">Security</span>
                            <span class="tech-tag">Research</span>
                        </div>
                        <a href="#" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Publications Section -->
    <section id="publications" class="publications">
        <div class="container">
            <div class="section-title">
                <h2>Publications</h2>
            </div>
            <div class="publication-list">
                <div class="publication-item">
                    <h3 class="publication-title">The Economic and Environmental Impact of Gold Mining in Ghana</h3>
                    <div class="publication-role">Research Collaborator | With Caroline Hofe | Present</div>
                    <p class="publication-description">Co-authoring research paper analyzing Ghana's gold mining sector using econometric modeling. Investigating relationships between mining revenues, environmental degradation, and community development. Incorporating GIS data and World Bank datasets for spatial-economic analysis. Target journals: Resources Policy or Journal of Cleaner Production.</p>
                </div>
                <div class="publication-item">
                    <h3 class="publication-title">Equilateral Triangle Geometry Problem</h3>
                    <div class="publication-role">Problem Solver | Pi Mu Epsilon Problem #1131</div>
                    <p class="publication-description">Solved quadrilateral geometry problem proving \( AC^2 = AD^2 + AB^2 \) in a convex quadrilateral. Problem Statement: PME Journal Spring 2006, Problem #1131. Solution completed, submitted, accepted, and yet to be officially recognized in Pi Mu Epsilon Journal.</p>
                </div>
                <div class="publication-item">
                    <h3 class="publication-title">Continued Fractions, a-Fibonacci Numbers, and the Middle b-Noise</h3>
                    <div class="publication-role">Published Problem Solver | Pi Mu Epsilon Problem #1385</div>
                    <p class="publication-description">Solved the continued fraction problem proposed by Hongwei Chen. Published Solution: PME Journal Fall 2022, Problem #1385. Officially recognized in Pi Mu Epsilon Journal.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <div class="contact-content">
                <div class="section-title">
                    <h2>Get In Touch</h2>
                </div>
                <p>I'm currently looking for internship opportunities in quantitative research, data science, and software engineering. Feel free to reach out if you'd like to discuss potential collaborations or opportunities.</p>
                <div class="contact-links">
                    <a href="mailto:emmanueladutwum900@yahoo.com" class="contact-link">
                        <i class="fas fa-envelope"></i> emmanueladutwum900@yahoo.com
                    </a>
                    <a href="tel:+19293777654" class="contact-link">
                        <i class="fas fa-phone"></i> (+1) 929-377-7654
                    </a>
                    <a href="https://linkedin.com/in/emmanuel-adutwum" class="contact-link">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="https://github.com/emmanueladutwum123" class="contact-link">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 Emmanuel Adutwum. All Rights Reserved.</p>
        </div>
    </footer>

    <script>
        // Mobile Navigation Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }
                }
            });
        });
    </script>
</body>
</html>
