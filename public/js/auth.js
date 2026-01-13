// Authentication State Management
const auth = {
    getToken() {
        return localStorage.getItem('token');
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    removeToken() {
        localStorage.removeItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    getUserRole() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            // Decode JWT token (without verification, just for display)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || null;
        } catch (e) {
            return null;
        }
    },

    logout() {
        this.removeToken();
        router.navigate('/login');
    }
};
