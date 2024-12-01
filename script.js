// Ambil data dari Local Storage saat halaman dimuat
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;

// Simpan data ke Local Storage
function saveData() {
  localStorage.setItem('posts', JSON.stringify(posts));
  localStorage.setItem('users', JSON.stringify(users));
  if (currentUser) {
    localStorage.setItem('currentUser', currentUser);
  }
}

// Login atau Register
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Please fill in both fields!');
    return;
  }

  if (!users[username]) {
    users[username] = { followers: 0 };
  }

  currentUser = username;
  saveData();

  document.getElementById('userDisplay').innerText = currentUser;
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('uploadSection').style.display = 'block';
  renderPosts();
}

// Upload Post
function uploadPost() {
  const content = document.getElementById('content').value;
  const imageFile = document.getElementById('imageUpload').files[0];

  if (!content && !imageFile) {
    alert('Please write something or upload an image!');
    return;
  }

  const newPost = {
    id: posts.length + 1,
    username: currentUser,
    content: content,
    image: imageFile ? URL.createObjectURL(imageFile) : null,
    likes: 0,
    replies: []
  };

  posts.push(newPost);
  saveData();
  renderPosts();

  document.getElementById('content').value = '';
  document.getElementById('imageUpload').value = '';
}

// Render Posts
function renderPosts() {
  const postList = document.getElementById('postList');
  postList.innerHTML = '';

  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    postDiv.innerHTML = `
      <h4>${post.username}</h4>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" alt="User upload">` : ''}
      <div class="post-actions">
        <button onclick="likePost(${post.id})">Like</button>
        <span>Likes: ${post.likes}</span>
      </div>
    `;

    postList.appendChild(postDiv);
  });
}

// Like Post
function likePost(postId) {
  const post = posts.find(p => p.id === postId);
  post.likes++;
  saveData();
  renderPosts();
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  document.getElementById('authSection').style.display = 'block';
  document.getElementById('uploadSection').style.display = 'none';
}

// Tampilkan data awal saat halaman dimuat
window.onload = function() {
  if (currentUser) {
    document.getElementById('userDisplay').innerText = currentUser;
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
  } else {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('uploadSection').style.display = 'none';
  }
  renderPosts();
};