// Get Supabase configuration from meta tags or environment
const SUPABASE_URL = window.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loadingSpinner = submitBtn.querySelector('.loading-spinner');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const formTitle = document.getElementById('formTitle');
const switchLink = document.getElementById('switchLink');
const switchText = document.getElementById('switchText');

// State
let isLoginMode = true;

// Switch between login and signup
switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        formTitle.textContent = 'ログイン';
        btnText.textContent = 'ログイン';
        switchText.innerHTML = 'アカウントをお持ちでない方は <a href="#" id="switchLink">新規登録</a>';
    } else {
        formTitle.textContent = '新規登録';
        btnText.textContent = '登録する';
        switchText.innerHTML = 'すでにアカウントをお持ちの方は <a href="#" id="switchLink">ログイン</a>';
    }
    
    // Re-attach event listener to new switch link
    document.getElementById('switchLink').addEventListener('click', arguments.callee);
    
    // Clear messages
    hideMessages();
});

// Form submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        showError('メールアドレスとパスワードを入力してください。');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    hideMessages();
    
    try {
        let result;
        
        if (isLoginMode) {
            // Login
            result = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
        } else {
            // Signup
            result = await supabaseClient.auth.signUp({
                email,
                password
            });
        }
        
        if (result.error) {
            throw result.error;
        }
        
        if (!isLoginMode && result.data.user && !result.data.user.confirmed_at) {
            showSuccess('確認メールを送信しました。メールを確認してアカウントを有効化してください。');
            authForm.reset();
        } else if (result.data.user) {
            // Set cookie and redirect
            const { access_token } = result.data.session;
            document.cookie = `access_token=${access_token}; path=/; max-age=3600; SameSite=Lax`;
            
            showSuccess('ログインしました。リダイレクトしています...');
            setTimeout(() => {
                window.location.href = '/app';
            }, 1000);
        }
        
    } catch (error) {
        console.error('Auth error:', error);
        
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
            showError('メールアドレスまたはパスワードが正しくありません。');
        } else if (error.message.includes('User already registered')) {
            showError('このメールアドレスは既に登録されています。');
        } else if (error.message.includes('Password should be at least')) {
            showError('パスワードは6文字以上で入力してください。');
        } else {
            showError(error.message || 'エラーが発生しました。もう一度お試しください。');
        }
    } finally {
        // Hide loading state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
});

// Helper functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

// Check if already logged in
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        window.location.href = '/';
    }
}

// Check auth on page load
checkAuth();