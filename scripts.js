let currentUser = null;

// Funções auxiliares para o LocalStorage
const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];
const setPosts = (posts) => localStorage.setItem('posts', JSON.stringify(posts));

// Função para criar um novo usuário
function createUser(username, password) {
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        alert('Usuário já existe!');
        return false;
    }
    users.push({ username, password });
    setUsers(users);
    return true;
}

// Função para verificar se o usuário está logado
function checkLoginStatus() {
    currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        $('#loginBtn').hide();
        $('#logoutBtn').show();
        $('#postForm').show();
    } else {
        $('#loginBtn').show();
        $('#logoutBtn').hide();
        $('#postForm').hide();
    }
    renderPosts();
}

// Função para fazer login
function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        checkLoginStatus();
        return true;
    }
    return false;
}

// Função para fazer logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    checkLoginStatus();
    window.location.href = 'login.html';
}

// Função para criar um novo post
function createPost(content) {
    if (!currentUser) return;
    const posts = getPosts();
    posts.push({ id: Date.now(), user: currentUser, content, likes: [] });
    setPosts(posts);
    renderPosts();
}

// Função para dar like em um post
function likePost(postId) {
    if (!currentUser) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
        const likeIndex = post.likes.indexOf(currentUser);
        if (likeIndex === -1) {
            post.likes.push(currentUser);
        } else {
            post.likes.splice(likeIndex, 1);
        }
        setPosts(posts);
        renderPosts();
    }
}

// Função para renderizar os posts
function renderPosts() {
    const $postsContainer = $('#posts');
    if ($postsContainer.length === 0) return;
    $postsContainer.empty();
    const posts = getPosts();
    posts.forEach(post => {
        const isLiked = currentUser && post.likes.includes(currentUser);
        const $postElement = $('<div>').addClass('post').html(`
            <div class="post-header">
                <strong>${post.user}</strong>
                <button class="like-btn ${isLiked ? 'liked' : ''}">${post.likes.length} Likes</button>
            </div>
            <p>${post.content}</p>
        `);
        $postElement.find('.like-btn').on('click', () => likePost(post.id));
        $postsContainer.append($postElement);
    });
}

// Event listeners
$(document).ready(() => {
    $('#loginBtn').on('click', () => {
        window.location.href = 'login.html';
    });

    $('#logoutBtn').on('click', logout);

    $('#submitPost').on('click', () => {
        const content = $('#postContent').val();
        if (content.trim()) {
            createPost(content);
            $('#postContent').val('');
        }
    });

    checkLoginStatus();
});