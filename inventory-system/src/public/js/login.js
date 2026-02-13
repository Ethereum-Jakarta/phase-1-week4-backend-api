document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target); 
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }) 
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            
            sessionStorage.setItem('accessToken', data.tokens.access.token);
            
            
        } else {
            console.error('Login failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});
