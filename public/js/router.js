// Simple Router
const router = {
    currentRoute: '/login',
    
    routes: {
        '/login': function() { router.renderLogin(); },
        '/signup': function() { router.renderSignup(); },
        '/dashboard': function() { router.renderDashboard(); },
        '/admin': function() { router.renderAdmin(); }
    },

    init() {
        // Check authentication on load
        if (auth.isAuthenticated()) {
            const role = auth.getUserRole();
            if (role === 'admin' && window.location.hash === '#/admin') {
                this.currentRoute = '/admin';
            } else {
                this.currentRoute = '/dashboard';
            }
        } else {
            this.currentRoute = '/login';
        }

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || '/login';
            this.navigate(hash);
        });

        // Initial navigation
        this.navigate(this.currentRoute);
    },

    async navigate(route) {
        this.currentRoute = route;
        window.location.hash = route;
        
        // Add fade-out transition
        const app = document.getElementById('app');
        if (app && app.innerHTML.trim()) {
            app.style.opacity = '0';
            app.style.transform = 'translateY(20px)';
            app.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            // Wait for fade-out
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        if (this.routes[route]) {
            this.routes[route].call(this);
            
            // Fade-in new content
            setTimeout(() => {
                app.style.opacity = '1';
                app.style.transform = 'translateY(0)';
            }, 50);
        } else {
            this.navigate('/login');
        }
    },

    renderLogin() {
        const app = document.getElementById('app');
        app.style.opacity = '0';
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account</p>
                    </div>
                    <div id="alert-container"></div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required autocomplete="email">
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required autocomplete="current-password">
                        </div>
                        <button type="submit" class="btn btn-primary">Sign In</button>
                    </form>
                    <div class="link-text">
                        Don't have an account? <a href="#/signup">Sign up</a>
                    </div>
                </div>
            </div>
        `;

        // Add input focus animations
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            const formData = new FormData(e.target);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const alertContainer = document.getElementById('alert-container');
                alertContainer.innerHTML = '<div class="alert alert-success">Logging in...</div>';

                const response = await api.login(credentials);
                auth.setToken(response.token);
                alertContainer.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
                
                setTimeout(() => {
                    router.navigate('/dashboard');
                }, 1000);
            } catch (error) {
                const alertContainer = document.getElementById('alert-container');
                alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    },

    renderSignup() {
        const app = document.getElementById('app');
        app.style.opacity = '0';
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Create Account</h1>
                        <p>Sign up to get started</p>
                    </div>
                    <div id="alert-container"></div>
                    <form id="signup-form">
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" name="name" required autocomplete="name">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required autocomplete="email">
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required autocomplete="new-password" minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select id="role" name="role">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Account</button>
                    </form>
                    <div class="link-text">
                        Already have an account? <a href="#/login">Sign in</a>
                    </div>
                </div>
            </div>
        `;

        // Add input focus animations
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });

        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            const formData = new FormData(e.target);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role')
            };

            try {
                const alertContainer = document.getElementById('alert-container');
                alertContainer.innerHTML = '<div class="alert alert-success">Creating account...</div>';

                await api.signup(userData);
                alertContainer.innerHTML = '<div class="alert alert-success">Account created successfully! Redirecting to login...</div>';
                
                setTimeout(() => {
                    router.navigate('/login');
                }, 2000);
            } catch (error) {
                const alertContainer = document.getElementById('alert-container');
                alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    },

    renderDashboard() {
        if (!auth.isAuthenticated()) {
            router.navigate('/login');
            return;
        }

        const role = auth.getUserRole();
        const app = document.getElementById('app');
        app.style.opacity = '0';
        
        app.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <div style="margin-top: 8px;">
                            <span class="user-badge badge-${role}">${role}</span>
                        </div>
                    </div>
                    <div class="user-info">
                        <button class="btn btn-secondary" onclick="auth.logout()" style="width: auto; padding: 10px 20px;">Logout</button>
                    </div>
                </div>
                <div class="card">
                    <h2>Welcome to Your Dashboard!</h2>
                    <p>You have successfully logged in to the authentication system.</p>
                    <p>Your role: <strong>${role}</strong></p>
                    ${role === 'admin' ? `
                        <div class="nav-links">
                            <a href="#/admin" class="nav-link">Go to Admin Panel</a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    async renderAdmin() {
        if (!auth.isAuthenticated()) {
            router.navigate('/login');
            return;
        }

        const role = auth.getUserRole();
        if (role !== 'admin') {
            router.navigate('/dashboard');
            return;
        }

        const app = document.getElementById('app');
        app.style.opacity = '0';
        app.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <div>
                        <h1>Admin Panel</h1>
                        <div style="margin-top: 8px;">
                            <span class="user-badge badge-admin">Admin</span>
                        </div>
                    </div>
                    <div class="user-info">
                        <a href="#/dashboard" class="nav-link">Dashboard</a>
                        <button class="btn btn-secondary" onclick="auth.logout()" style="width: auto; padding: 10px 20px;">Logout</button>
                    </div>
                </div>
                <div class="card">
                    <div id="admin-content">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p>Loading admin data...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        try {
            const data = await api.getAdminData();
            document.getElementById('admin-content').innerHTML = `
                <h2>${data.message}</h2>
                <p>This is a protected admin-only route. Only users with the admin role can access this page.</p>
                <p>You have successfully authenticated and authorized to view this content.</p>
            `;
        } catch (error) {
            document.getElementById('admin-content').innerHTML = `
                <div class="alert alert-error">${error.message}</div>
                <p>If you believe you should have access, please check your authentication token.</p>
            `;
        }
    }
};
