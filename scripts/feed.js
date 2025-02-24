class SocialFeed {
    constructor() {
        this.posts = [];
        this.initialize();
    }

    initialize() {
        this.postButton = document.querySelector('.post-button');
        this.postInput = document.querySelector('.post-input textarea');
        this.feedContainer = document.getElementById('mainFeed');
        
        this.postButton.addEventListener('click', () => this.createPost());
        this.setupImageUpload();
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
            };
            reader.readAsDataURL(file);
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
