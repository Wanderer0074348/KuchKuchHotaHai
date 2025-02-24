class Navbar {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-links');
        this.initialize();
    }

    initialize() {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    toggleMenu() {
        this.navMenu.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    }

    handleClickOutside(e) {
        if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
            this.navMenu.classList.remove('show');
            document.body.classList.remove('menu-open');
        }
    }
}
