// E2E-Commerce - Sistema de E-commerce Completo
// Dados armazenados em arrays (simulação de banco de dados)

// Arrays para armazenamento de dados
let users = JSON.parse(localStorage.getItem('e2e_users')) || [];
let products = JSON.parse(localStorage.getItem('e2e_products')) || [];
let cart = JSON.parse(localStorage.getItem('e2e_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('e2e_current_user')) || null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadData();
    updateCartCount();
});

// Inicialização da aplicação
function initializeApp() {
    // Mostrar seção inicial
    showSection('home');
    
    // Verificar se há usuário logado
    if (currentUser) {
        updateUserInterface();
    }
}

// Configuração dos event listeners
function setupEventListeners() {
    // Navegação
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Botões do cabeçalho
    document.getElementById('searchBtn').addEventListener('click', searchProducts);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    document.getElementById('cartBtn').addEventListener('click', showCart);
    document.getElementById('userBtn').addEventListener('click', toggleUserMenu);

    // Formulários
    document.getElementById('userForm').addEventListener('submit', handleUserRegistration);
    document.getElementById('loginUserForm').addEventListener('submit', handleUserLogin);
    document.getElementById('productFormElement').addEventListener('submit', handleProductSubmit);

    // Botões de ação
    document.getElementById('showRegisterForm').addEventListener('click', () => showForm('registerForm'));
    document.getElementById('showLoginForm').addEventListener('click', () => showForm('loginForm'));
    document.getElementById('showProductForm').addEventListener('click', () => showForm('productForm'));
    document.getElementById('forgotPassword').addEventListener('click', handleForgotPassword);

    // Modais
    document.getElementById('closeModal').addEventListener('click', hideModal);
    document.getElementById('closeCartModal').addEventListener('click', hideCartModal);
    document.getElementById('closeModal').addEventListener('click', hideModal);

    // Clique fora do modal para fechar
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('productModal');
        const cartModal = document.getElementById('cartModal');
        if (e.target === modal) {
            hideModal();
        }
        if (e.target === cartModal) {
            hideCartModal();
        }
    });
}

// Navegação entre seções
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Atualizar navegação ativa
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Carregar dados específicos da seção
    if (sectionId === 'users') {
        loadUsers();
    } else if (sectionId === 'products') {
        loadProducts();
    }
}

// GESTÃO DE USUÁRIOS

// Validação de e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de senha
function isValidPassword(password) {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasNumber && hasSpecialChar;
}

// Verificar se e-mail já existe
function emailExists(email) {
    return users.some(user => user.email === email);
}

// Cadastro de usuário
function handleUserRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    
    // Validações
    if (!name || !email || !password) {
        showMessage('Todos os campos são obrigatórios!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('E-mail inválido!', 'error');
        return;
    }
    
    if (emailExists(email)) {
        showMessage('E-mail já cadastrado!', 'error');
        return;
    }
    
    if (!isValidPassword(password)) {
        showMessage('Senha deve ter pelo menos 8 caracteres, com número e caractere especial!', 'error');
        return;
    }
    
    // Criar usuário
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // Em produção, usar hash
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveData();
    
    showMessage('Usuário cadastrado com sucesso!', 'success');
    document.getElementById('userForm').reset();
    hideForm('registerForm');
    loadUsers();
}

// Login de usuário
function handleUserLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('e2e_current_user', JSON.stringify(currentUser));
        showMessage('Login realizado com sucesso!', 'success');
        document.getElementById('loginUserForm').reset();
        hideForm('loginForm');
        updateUserInterface();
    } else {
        showMessage('E-mail ou senha incorretos!', 'error');
    }
}

// Recuperação de senha
function handleForgotPassword() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showMessage('Digite seu e-mail primeiro!', 'error');
        return;
    }
    
    if (emailExists(email)) {
        showMessage('E-mail de recuperação enviado! (Simulação)', 'success');
    } else {
        showMessage('E-mail não encontrado!', 'error');
    }
}

// Atualizar interface do usuário
function updateUserInterface() {
    const userBtn = document.getElementById('userBtn');
    if (currentUser) {
        userBtn.innerHTML = `<i class="fas fa-user-check"></i>`;
        userBtn.title = `Logado como: ${currentUser.name}`;
    } else {
        userBtn.innerHTML = `<i class="fas fa-user"></i>`;
        userBtn.title = 'Fazer login';
    }
}

// Carregar lista de usuários
function loadUsers() {
    const usersGrid = document.getElementById('usersGrid');
    usersGrid.innerHTML = '';
    
    if (users.length === 0) {
        usersGrid.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
        return;
    }
    
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <h4>${user.name}</h4>
            <p><strong>E-mail:</strong> ${user.email}</p>
            <p><strong>Cadastrado em:</strong> ${new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
            <div class="user-actions">
                <button class="btn-warning btn-small" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger btn-small" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        usersGrid.appendChild(userCard);
    });
}

// Editar usuário
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newName = prompt('Novo nome:', user.name);
    if (newName && newName.trim() !== '') {
        user.name = newName.trim();
        saveData();
        loadUsers();
        showMessage('Usuário atualizado!', 'success');
    }
}

// Excluir usuário
function deleteUser(userId) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        users = users.filter(u => u.id !== userId);
        saveData();
        loadUsers();
        showMessage('Usuário excluído!', 'success');
    }
}

// GESTÃO DE PRODUTOS

// Validação de produto
function validateProduct(product) {
    const errors = [];
    
    if (!product.title || product.title.length < 5 || product.title.length > 100) {
        errors.push('Título deve ter entre 5 e 100 caracteres');
    }
    
    if (!product.description || product.description.length < 20) {
        errors.push('Descrição deve ter pelo menos 20 caracteres');
    }
    
    if (!product.category) {
        errors.push('Categoria é obrigatória');
    }
    
    if (!product.price || product.price <= 0) {
        errors.push('Preço deve ser maior que zero');
    }
    
    if (product.stock < 0) {
        errors.push('Estoque não pode ser negativo');
    }
    
    if (!product.image) {
        errors.push('URL da imagem é obrigatória');
    }
    
    return errors;
}

// Cadastro/Edição de produto
function handleProductSubmit(e) {
    e.preventDefault();
    
    const product = {
        id: document.getElementById('productFormElement').dataset.productId || Date.now(),
        title: document.getElementById('productTitle').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value.trim(),
        active: true,
        createdAt: document.getElementById('productFormElement').dataset.productId ? 
            products.find(p => p.id == document.getElementById('productFormElement').dataset.productId)?.createdAt : 
            new Date().toISOString()
    };
    
    const errors = validateProduct(product);
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return;
    }
    
    // Verificar se é edição ou novo produto
    const existingIndex = products.findIndex(p => p.id == product.id);
    if (existingIndex >= 0) {
        products[existingIndex] = product;
        showMessage('Produto atualizado com sucesso!', 'success');
    } else {
        products.push(product);
        showMessage('Produto cadastrado com sucesso!', 'success');
    }
    
    saveData();
    document.getElementById('productFormElement').reset();
    document.getElementById('productFormElement').removeAttribute('data-product-id');
    hideForm('productForm');
    loadProducts();
}

// Carregar lista de produtos
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    const activeProducts = products.filter(p => p.active);
    
    if (activeProducts.length === 0) {
        productsGrid.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        return;
    }
    
    activeProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iI0NDQyIvPgo8cGF0aCBkPSJNODAgODBIMTIwVjEwMEg4MFY4MFoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+'">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <p class="product-stock">Estoque: ${product.stock} unidades</p>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                    <button class="btn-primary" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                    <button class="btn-warning btn-small" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger btn-small" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Mostrar detalhes do produto
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="display: flex; gap: 2rem; align-items: flex-start;">
            <img src="${product.image}" alt="${product.title}" 
                 style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px;"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iI0NDQyIvPgo8cGF0aCBkPSJNODAgODBIMTIwVjEwMEg4MFY4MFoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+'">
            <div style="flex: 1;">
                <h2 style="color: #333; margin-bottom: 1rem;">${product.title}</h2>
                <p style="color: #0066cc; font-size: 1.1rem; margin-bottom: 1rem; text-transform: capitalize;">
                    <strong>Categoria:</strong> ${product.category}
                </p>
                <p style="color: #28a745; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
                    R$ ${product.price.toFixed(2).replace('.', ',')}
                </p>
                <p style="color: #666; margin-bottom: 1rem;">
                    <strong>Estoque:</strong> ${product.stock} unidades
                </p>
                <p style="color: #333; line-height: 1.6; margin-bottom: 2rem;">
                    <strong>Descrição:</strong><br>
                    ${product.description}
                </p>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn-add-cart" onclick="addToCart(${product.id}); hideModal();">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                    <button class="btn-secondary" onclick="hideModal()">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('productModal').style.display = 'block';
}

// Editar produto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Preencher formulário
    document.getElementById('productTitle').value = product.title;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    
    // Marcar como edição
    document.getElementById('productFormElement').dataset.productId = product.id;
    
    // Mostrar formulário
    showForm('productForm');
}

// Excluir produto
function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex >= 0) {
            products[productIndex].active = false;
            saveData();
            loadProducts();
            showMessage('Produto excluído!', 'success');
        }
    }
}

// CARRINHO DE COMPRAS

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock <= 0) {
        showMessage('Produto fora de estoque!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showMessage('Quantidade máxima em estoque atingida!', 'error');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveData();
    updateCartCount();
    showMessage('Produto adicionado ao carrinho!', 'success');
}

// Mostrar carrinho
function showCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Carrinho vazio</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNDQ0MiLz4KPHBhdGggZD0iTTIwIDI1SDQwVjMwSDIwVjI1WiIgZmlsbD0iIzk5OSIvPgo8L3N2Zz4='">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="btn-danger btn-small" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    updateCartTotal();
    document.getElementById('cartModal').style.display = 'block';
}

// Atualizar quantidade
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        showMessage('Quantidade máxima em estoque atingida!', 'error');
        return;
    }
    
    item.quantity = newQuantity;
    saveData();
    showCart();
    updateCartCount();
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveData();
    showCart();
    updateCartCount();
    showMessage('Produto removido do carrinho!', 'success');
}

// Atualizar contador do carrinho
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Atualizar total do carrinho
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2).replace('.', ',');
}

// BUSCA DE PRODUTOS

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (!searchTerm) {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.active && (
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        )
    );
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iI0NDQyIvPgo8cGF0aCBkPSJNODAgODBIMTIwVjEwMEg4MFY4MFoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+'">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <p class="product-stock">Estoque: ${product.stock} unidades</p>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                    <button class="btn-primary" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// FUNÇÕES AUXILIARES

// Mostrar/esconder formulários
function showForm(formId) {
    // Esconder todos os formulários
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    // Mostrar formulário selecionado
    document.getElementById(formId).classList.add('active');
}

function hideForm(formId) {
    document.getElementById(formId).classList.remove('active');
    if (formId === 'productForm') {
        document.getElementById('productFormElement').reset();
        document.getElementById('productFormElement').removeAttribute('data-product-id');
    }
}

// Mostrar/esconder modais
function hideModal() {
    document.getElementById('productModal').style.display = 'none';
}

function hideCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// Toggle menu do usuário
function toggleUserMenu() {
    if (currentUser) {
        if (confirm('Deseja fazer logout?')) {
            currentUser = null;
            localStorage.removeItem('e2e_current_user');
            updateUserInterface();
            showMessage('Logout realizado!', 'success');
        }
    } else {
        showForm('loginForm');
    }
}

// Mostrar mensagens
function showMessage(message, type = 'info') {
    // Remover mensagens existentes
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#28a745';
    } else if (type === 'error') {
        messageDiv.style.background = '#dc3545';
    } else {
        messageDiv.style.background = '#0066cc';
    }
    
    messageDiv.innerHTML = message;
    document.body.appendChild(messageDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('e2e_users', JSON.stringify(users));
    localStorage.setItem('e2e_products', JSON.stringify(products));
    localStorage.setItem('e2e_cart', JSON.stringify(cart));
}

// Carregar dados do localStorage
function loadData() {
    users = JSON.parse(localStorage.getItem('e2e_users')) || [];
    products = JSON.parse(localStorage.getItem('e2e_products')) || [];
    cart = JSON.parse(localStorage.getItem('e2e_cart')) || [];
    currentUser = JSON.parse(localStorage.getItem('e2e_current_user')) || null;
}

// Adicionar estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Dados de exemplo (opcional)
function loadSampleData() {
    if (products.length === 0) {
        const sampleProducts = [
            {
                id: 1,
                title: 'Smartphone Samsung Galaxy S23',
                description: 'Smartphone com tela de 6.1 polegadas, câmera de 50MP, 128GB de armazenamento e processador Snapdragon 8 Gen 2.',
                category: 'eletrônicos',
                price: 2999.99,
                stock: 10,
                image: 'https://images.samsung.com/br/smartphones/galaxy-s23/images/galaxy-s23-highlights-mo.jpg',
                active: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Notebook Dell Inspiron 15',
                description: 'Notebook com processador Intel i5, 8GB RAM, SSD 256GB, tela Full HD de 15.6 polegadas e Windows 11.',
                category: 'eletrônicos',
                price: 2499.99,
                stock: 5,
                image: 'https://i.dell.com/sites/csdocuments/Shared-Content/data-sheets/pt/Dell-Inspiron-15-3520-Laptop.jpg',
                active: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Tênis Nike Air Max 270',
                description: 'Tênis esportivo com tecnologia Air Max, solado em borracha e cabedal em mesh respirável. Ideal para corrida e caminhada.',
                category: 'esportes',
                price: 399.99,
                stock: 20,
                image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-max-270-mens-shoes-KkLcGR.png',
                active: true,
                createdAt: new Date().toISOString()
            }
        ];
        
        products.push(...sampleProducts);
        saveData();
    }
}

// Carregar dados de exemplo se não houver produtos
loadSampleData();

