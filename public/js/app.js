document.addEventListener('DOMContentLoaded', () => {
    // Supabase client initialization
    const { createClient } = supabase;
    const supabaseClient = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

    // Add logout button to the page
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'ログアウト';
    logoutBtn.className = 'logout-btn';
    logoutBtn.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #e53e3e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; z-index: 1000;';
    document.body.appendChild(logoutBtn);

    // Logout functionality
    async function logout() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
            return;
        }
        // Clear the cookie and redirect
        document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
        window.location.href = '/landing.html';
    }

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    const reviewInput = document.getElementById('reviewInput');
    const generateBtn = document.getElementById('generateBtn');
    const outputSection = document.getElementById('outputSection');
    const replyOutput = document.getElementById('replyOutput');
    const charCount = document.getElementById('charCount');
    const copyBtn = document.getElementById('copyBtn');
    const errorMessage = document.getElementById('errorMessage');
    const btnText = generateBtn.querySelector('.btn-text');
    const loadingSpinner = generateBtn.querySelector('.loading-spinner');

    generateBtn.addEventListener('click', async () => {
        const review = reviewInput.value.trim();
        
        if (!review) {
            showError('レビューを入力してください。');
            return;
        }

        // Reset UI
        hideError();
        outputSection.style.display = 'none';
        
        // Show loading state
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';

        try {
            const response = await fetch('/api/generate-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ review }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '返信の生成に失敗しました。');
            }

            // Display the generated reply
            replyOutput.value = data.reply;
            charCount.textContent = `文字数: ${data.characterCount}`;
            outputSection.style.display = 'block';
            
            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            showError(error.message);
        } finally {
            // Hide loading state
            generateBtn.disabled = false;
            btnText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
        }
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(replyOutput.value);
            
            // Show success state
            copyBtn.classList.add('copy-success');
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10L8 13L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                コピー完了
            `;
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove('copy-success');
                copyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8 3H12C13.1046 3 14 3.89543 14 5V7M8 3H4C2.89543 3 2 3.89543 2 5V13C2 14.1046 2.89543 15 4 15H8M8 3V1C8 0.447715 8.44772 0 9 0H11C11.5523 0 12 0.447715 12 1V3M16 7H12C10.8954 7 10 7.89543 10 9V17C10 18.1046 10.8954 19 12 19H16C17.1046 19 18 18.1046 18 17V9C18 7.89543 17.1046 7 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    コピー
                `;
            }, 2000);
            
        } catch (error) {
            showError('クリップボードへのコピーに失敗しました。');
        }
    });

    // Enter key support for textarea
    reviewInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Check user auth state and render UI
    async function checkUser() {
        // ... existing code ...
    }
});