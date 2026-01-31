document.addEventListener('DOMContentLoaded', () => {
    // Welcome Notification
    if (window.location.pathname.includes('dashboard')) {
        const welcomeToast = document.createElement('div');
        welcomeToast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            transform: translateX(200%);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        welcomeToast.innerHTML = `
            <div>
                <strong style="display: block;">Welcome back!</strong>
                <small style="opacity: 0.8;">Your dashboard is ready.</small>
            </div>
        `;
        document.body.appendChild(welcomeToast);

        setTimeout(() => {
            welcomeToast.style.transform = 'translateX(0)';
        }, 1000);

        setTimeout(() => {
            welcomeToast.style.transform = 'translateX(200%)';
        }, 5000);
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Navbar Scroll Effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 10) {
            header.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        } else {
            header.style.boxShadow = 'var(--shadow)';
        }

        lastScroll = currentScroll;
    });

    // Light/Dark Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Load saved preference or default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            if (currentTheme === 'dark') {
                icon.classList.replace('fa-sun', 'fa-moon');
            } else {
                icon.classList.replace('fa-moon', 'fa-sun');
            }

            // Dispatch event for other components (like charts) to update
            window.dispatchEvent(new Event('themeChanged'));
        });
    }

    // Dashboard Navigation (Sidebar Scroll Spy & Smooth Scroll)
    const dashboardNavLinks = document.querySelectorAll('.sidebar-link[href^="#"]');
    const sections = document.querySelectorAll('div[id]'); // Select all divs with IDs (overview, analytics, etc)

    // 1. Smooth Scroll on Click
    dashboardNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Update active class immediately
                dashboardNavLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    });

    // 2. Scroll Spy using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top/center
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');

                // Remove active class from all links
                dashboardNavLinks.forEach(link => {
                    link.classList.remove('active');
                    // Add active class to matching link
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        // Only observe sections that match our sidebar links
        const correspondingLink = document.querySelector(`.sidebar-link[href="#${section.id}"]`);
        if (correspondingLink) {
            observer.observe(section);
        }
    });

    // Counter Animation Logic
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const animatedItems = document.querySelectorAll('.counter-animate');

    if (statsSection && counters.length > 0) {
        const countTo = (counter) => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const speed = 200;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(() => countTo(counter), 1);
            } else {
                counter.innerText = target + '+';
            }
        };

        const observerOptions = {
            threshold: 0.5
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatedItems.forEach(item => item.classList.add('visible'));
                    counters.forEach(counter => countTo(counter));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statsObserver.observe(statsSection);
    }

    // Auction Countdown Timers
    const updateTimers = () => {
        const timers = document.querySelectorAll('.timer[data-time]');
        timers.forEach(timer => {
            let time = parseInt(timer.getAttribute('data-time'));
            if (time > 0) {
                time--;
                timer.setAttribute('data-time', time);

                const hours = Math.floor(time / 3600);
                const minutes = Math.floor((time % 3600) / 60);
                const seconds = time % 60;

                timer.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timer.innerText = "Auction Ended";
                timer.style.color = "var(--text-muted)";
                const card = timer.closest('.auction-card');
                if (card) {
                    const badge = card.querySelector('.bid-badge.live');
                    if (badge) {
                        badge.innerText = "Ended";
                        badge.classList.remove('live', 'animate-pulse');
                        badge.style.backgroundColor = "var(--secondary-color)";
                    }
                }
            }
        });
    };

    if (document.querySelectorAll('.timer[data-time]').length > 0) {
        setInterval(updateTimers, 1000);
    }

    // Mock Bidding Logic
    const bidButtons = document.querySelectorAll('.auction-card .btn');
    bidButtons.forEach(btn => {
        if (btn.innerText === 'Place Bid') {
            btn.addEventListener('click', (e) => {
                const card = btn.closest('.auction-card');
                if (card) {
                    const priceTag = card.querySelector('.price-tag');
                    const bidCount = card.querySelector('.bid-count');

                    if (priceTag && bidCount) {
                        e.preventDefault();
                        let currentPrice = parseFloat(priceTag.innerText.replace('$', '').replace(',', ''));
                        let currentBids = parseInt(bidCount.innerText.split(' ')[0]);

                        // Randomly increase price and bid count
                        currentPrice += Math.floor(Math.random() * 50) + 10;
                        currentBids++;

                        // Visual feedback
                        priceTag.style.animation = 'pulse 0.5s';
                        setTimeout(() => priceTag.style.animation = '', 500);

                        priceTag.innerText = `$${currentPrice.toLocaleString()}`;
                        bidCount.innerText = `${currentBids} Bids`;

                        // Notification
                        showBidNotification(card.querySelector('h3').innerText, currentPrice);
                    }
                }
            });
        }
    });

    const showBidNotification = (itemName, amount) => {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideUp 0.3s ease forwards;
        `;
        toast.innerHTML = `<i class="fas fa-check-circle"></i> Bid Placed: $${amount.toLocaleString()} for ${itemName}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
    // Initialize Falling Coins Effect
    const initFallingCoins = () => {
        const container = document.createElement('div');
        container.id = 'coin-container';
        document.body.appendChild(container);

        const createCoin = () => {
            const coin = document.createElement('div');
            coin.className = 'falling-coin';

            // Randomize position and animation properties
            const startX = Math.random() * window.innerWidth;
            const size = Math.random() * (30 - 15) + 15;
            const duration = Math.random() * (8 - 4) + 4;
            const delay = Math.random() * 5;

            coin.style.left = `${startX}px`;
            coin.style.width = `${size}px`;
            coin.style.height = `${size}px`;
            coin.style.fontSize = `${size * 0.6}px`;
            coin.style.animationDuration = `${duration}s`;
            coin.style.animationDelay = `${delay}s`;

            container.appendChild(coin);

            // Remove coin after animation ends
            setTimeout(() => {
                coin.remove();
            }, (duration + delay) * 1000);
        };

        // Create initial batch of coins
        for (let i = 0; i < 15; i++) {
            createCoin();
        }

        // Continuously create new coins
        setInterval(createCoin, 1500);
    };

    initFallingCoins();
});

