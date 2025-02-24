document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    const navbar = new Navbar();
    const feed = new SocialFeed();
    const theme = new ThemeManager();

    // Example of adding a mock post
    window.addMockPost = () => {
        feed.createPost({
            content: "This is a test post",
            image: null,
            user: {
                name: "Test User",
                avatar: "default-avatar.jpg"
            }
        });
    };
});
