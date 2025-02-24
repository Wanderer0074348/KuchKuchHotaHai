class ExplorePage {
    constructor() {
        this.currentCategory = 'All';
        this.categories = [];
        this.hobbies = [];
        this.trendingUsers = [];
        this.initialize();
    }

    async initialize() {
        await this.loadData();
        this.setupCategoryFilters();
        this.setupSearch();
        this.renderHobbies();
        this.renderTrendingUsers();
    }

    async loadData() {
        try {
            const response = await fetch('database/explore.json');
            const data = await response.json();
            this.categories = data.categories;
            this.hobbies = data.hobbies;
            this.trendingUsers = data.users;
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupCategoryFilters() {
        const categoryContainer = document.querySelector('.category-chips');
        if (categoryContainer) {
            categoryContainer.innerHTML = this.categories.map(category => 
                `<button class="category-chip ${category === 'All' ? 'active' : ''}">${category}</button>`
            ).join('');

            categoryContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('category-chip')) {
                    document.querySelectorAll('.category-chip').forEach(chip => chip.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentCategory = e.target.textContent;
                    this.renderHobbies();
                }
            });
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredHobbies = this.hobbies.filter(hobby => 
                    hobby.name.toLowerCase().includes(searchTerm) || 
                    hobby.description.toLowerCase().includes(searchTerm) ||
                    hobby.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                );
                this.renderHobbies(filteredHobbies);
            });
        }
    }

    renderHobbies(hobbies = null) {
        const hobbyGrid = document.querySelector('.hobby-grid');
        if (hobbyGrid) {
            const filteredHobbies = hobbies || (this.currentCategory === 'All' 
                ? this.hobbies 
                : this.hobbies.filter(h => h.category === this.currentCategory));
            
            hobbyGrid.innerHTML = filteredHobbies.map(hobby => this.createHobbyCard(hobby)).join('');
        }
    }

    createHobbyCard(hobby) {
        return `
            <div class="hobby-card" data-id="${hobby.id}">
                <img src="${hobby.image}" alt="${hobby.name}" class="hobby-image">
                <div class="hobby-info">
                    <h3>${hobby.name}</h3>
                    <p>${hobby.description}</p>
                    <div class="hobby-meta">
                        <span class="followers"><i class="fas fa-users"></i> ${hobby.followers}</span>
                        <span class="difficulty">${hobby.difficulty}</span>
                    </div>
                    <button class="follow-btn ${hobby.isFollowing ? 'following' : ''}" 
                            onclick="explorePage.toggleFollow(${hobby.id})">
                        ${hobby.isFollowing ? 'Following' : '<i class="fas fa-plus"></i> Follow'}
                    </button>
                </div>
            </div>
        `;
    }

    renderTrendingUsers() {
        const usersContainer = document.querySelector('.users-container');
        if (usersContainer) {
            usersContainer.innerHTML = this.trendingUsers.map(user => this.createUserCard(user)).join('');
        }
    }

    createUserCard(user) {
        return `
            <div class="user-card" data-id="${user.id}">
                <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>${user.hobby}</p>
                    <p class="user-description">${user.description}</p>
                    <p class="user-location">
                        <i class="fas fa-map-marker-alt"></i> ${user.location}
                    </p>
                    <div class="social-links">
                        ${Object.entries(user.socialLinks).map(([platform, handle]) => `
                            <a href="#" title="${platform}: ${handle}">
                                <i class="fab fa-${platform.toLowerCase()}"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
            <button class="follow-btn ${user.isFollowing ? 'following' : ''}" 
                    onclick="explorePage.toggleUserFollow(${user.id})">
                ${user.isFollowing ? '' : '<i class="fas fa-plus"></i> Follow'}
            </button>
            </div>
        `;
    }
    toggleFollow(hobbyId) {
        const hobby = this.hobbies.find(h => h.id === hobbyId);
        if (hobby) {
            hobby.isFollowing = !hobby.isFollowing;
            hobby.followers += hobby.isFollowing ? 1 : -1;
            // Re-render the specific card
            const card = document.querySelector(`.hobby-card[data-id="${hobbyId}"]`);
            if (card) {
                card.outerHTML = this.createHobbyCard(hobby);
            }
            this.saveToLocalStorage();
        }
    }
    
    toggleUserFollow(userId) {
        const user = this.trendingUsers.find(u => u.id === userId);
        const button = document.querySelector(`.user-card[data-id="${userId}"] .follow-btn`);
        
        if (user && button) {
            user.isFollowing = !user.isFollowing;
            user.followers += user.isFollowing ? 1 : -1;
            button.classList.toggle('following');
            this.saveToLocalStorage();
        }
    }
    saveToLocalStorage() {
        localStorage.setItem('hobbyhive_hobbies', JSON.stringify(this.hobbies));
    }
}


// Initialize the explore page
document.addEventListener('DOMContentLoaded', () => {
    window.explorePage = new ExplorePage();
});
