class SocialFeed {
    constructor() {
        this.posts = this.loadPostsFromStorage() || [];
        this.initialize();
    }

    loadPostsFromStorage() {
        try {
            const savedPosts = localStorage.getItem('hobbyHivePosts');
            return savedPosts ? JSON.parse(savedPosts) : [];
        } catch (error) {
            console.error('Error loading posts:', error);
            return [];
        }
    }

    savePostsToStorage() {
        try {
            localStorage.setItem('hobbyHivePosts', JSON.stringify(this.posts));
        } catch (error) {
            console.error('Error saving posts:', error);
            this.cleanupOldPosts(); // Try to free up space
        }
    }

    initialize() {
        this.postButton = document.querySelector('.post-button');
        this.postInput = document.querySelector('.post-input textarea');
        this.feedContainer = document.getElementById('mainFeed');
        
        this.postButton.addEventListener('click', () => this.createPost());
        this.setupImageUpload();
        this.renderAllPosts();
    }

    renderAllPosts() {
        this.feedContainer.innerHTML = '';
        this.posts.forEach(post => this.renderPost(post));
    }

    createPost() {
        const content = this.postInput.value.trim();
        if (!content && !this.currentImage) return;

        const post = {
            id: Date.now(),
            content,
            image: this.currentImage,
            timestamp: new Date(),
            likes: 0,
            comments: [],
            user: {
                name: 'Current User',
                avatar: 'default-avatar.jpg'
            }
        };

        this.posts.unshift(post);
        this.savePostsToStorage();
        this.renderPost(post);
        this.resetPostInput();
    }

    setupPostInteractions(postElement, post) {
        const likeButton = postElement.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            post.likes++;
            likeButton.querySelector('span').textContent = post.likes;
            likeButton.querySelector('i').classList.replace('far', 'fas');
            this.savePostsToStorage();
        });
    }

    cleanupOldPosts() {
        const maxPosts = 50; // Keep only the latest 50 posts
        if (this.posts.length > maxPosts) {
            this.posts = this.posts.slice(0, maxPosts);
            this.savePostsToStorage();
        }
    }

    setupImageUpload() {
        const imageIcon = document.querySelector('.fa-image');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        imageIcon.parentElement.appendChild(fileInput);
        
        imageIcon.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImage = e.target.result;
                // Display a small preview of the image
                const previewContainer = document.querySelector('.image-preview');
                if (!previewContainer) {
                    const newPreview = document.createElement('div');
                    newPreview.className = 'image-preview';
                    newPreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview" style="max-width: 100px; max-height: 100px;" />`;
                    this.postInput.parentElement.appendChild(newPreview);
                } else {
                    previewContainer.innerHTML = `<img src="${e.target.result}" alt="Image Preview" style="max-width: 100px; max-height: 100px;" />`;
                }
            };
            reader.readAsDataURL(file);
            // Reset the file input value to prevent duplicate selection
            event.target.value = null;
        }
    }
    

    createPost() {
        const content = this.postInput.value.trim();
        if (!content && !this.currentImage) return;

        const post = {
            id: Date.now(),
            content,
            image: this.currentImage,
            timestamp: new Date(),
            likes: 0,
            comments: [],
            user: {
                name: 'Current User',
                avatar: 'default-avatar.jpg'
            }
        };

        this.posts.unshift(post);
        this.renderPost(post);
        this.resetPostInput();
    }

    renderPost(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="user-avatar">
                    <img src="${post.user.avatar}" alt="${post.user.name}">
                </div>
                <div class="post-user-info">
                    <div class="post-user-name">${post.user.name}</div>
                    <div class="post-timestamp">${this.formatTimestamp(post.timestamp)}</div>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
                ${post.image ? `<img src="${post.image}" class="post-image">` : ''}
            </div>
            <div class="post-actions-bar">
                <div class="action-button like-button" data-post-id="${post.id}">
                    <i class="far fa-heart"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="action-button">
                    <i class="far fa-comment"></i>
                    <span>${post.comments.length}</span>
                </div>
                <div class="action-button">
                    <i class="far fa-share-square"></i>
                </div>
            </div>
        `;

        this.feedContainer.insertBefore(postElement, this.feedContainer.firstChild);
        this.setupPostInteractions(postElement, post);
    }

    setupPostInteractions(postElement, post) {
        const likeButton = postElement.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            post.likes++;
            likeButton.querySelector('span').textContent = post.likes;
            likeButton.querySelector('i').classList.replace('far', 'fas');
        });
    }

    formatTimestamp(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        return timestamp.toLocaleDateString();
    }

    resetPostInput() {
        this.postInput.value = '';
        this.currentImage = null;
    }
}

// Initialize the feed
document.addEventListener('DOMContentLoaded', () => {
    const feed = new SocialFeed();
});
