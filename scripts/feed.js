class SocialFeed {
    constructor() {
        this.posts = this.loadPostsFromStorage() || [];
        this.loadPremadePosts();
        this.initialize();
    }

    async loadPremadePosts() {
        try {
            const response = await fetch('database/posts.json');
            const data = await response.json();
            
            data.premadePosts.forEach(post => {
                post.timestamp = new Date(post.timestamp);
            });
            
            this.posts = [...this.posts, ...data.premadePosts];
            this.renderAllPosts();
        } catch (error) {
            console.error('Error loading premade posts:', error);
        }
    }

    loadPostsFromStorage() {
        try {
            const savedPosts = localStorage.getItem('hobbyHivePosts');
            const posts = savedPosts ? JSON.parse(savedPosts) : [];
            
            posts.forEach(post => {
                post.timestamp = new Date(post.timestamp);
            });
            return posts;
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
            this.cleanupOldPosts();
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
            event.target.value = null;
        }
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
            this.savePostsToStorage();
        });
    }

    formatTimestamp(timestamp) {
        const now = new Date('2025-02-24T21:42:00+04:00');
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return timestamp.toLocaleDateString();
    }

    cleanupOldPosts() {
        const maxPosts = 10;
        if (this.posts.length > maxPosts) {
            this.posts = this.posts.slice(0, maxPosts);
            this.savePostsToStorage();
        }
    }

    resetPostInput() {
        this.postInput.value = '';
        this.currentImage = null;
        const previewContainer = document.querySelector('.image-preview');
        if (previewContainer) {
            previewContainer.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const feed = new SocialFeed();
});
