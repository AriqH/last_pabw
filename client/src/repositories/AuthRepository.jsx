const BASE_URL = 'http://127.0.0.1:3000';

async function login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    if (!response.ok) {
        // Handle non-successful response (e.g., 4xx or 5xx status codes)
        return { error: true, data: `Error: ${response.status} - ${responseJson.msg}` };
    }

    return { error: false, data: responseJson.data };
}

async function register({ fullname, email, password, umur, role }) {
    const response = await fetch(`${BASE_URL}/daftar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password, umur, role }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
        return { error: true };
    }

    return { error: false };
}

async function getUserLogged(token) {
    const response = await fetch(`${BASE_URL}/verifytoken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
        return { error: true, data: null };
    }

    return { error: false, data: responseJson.data };
}

async function sendVerificationEmail(email, token) {
    const response = await fetch(`${BASE_URL}/send/verify/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email, token }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
        return { error: true, data: responseJson.msg };
    }

    return { error: false, data: responseJson.msg };
}

async function verifyEmail(token) {
    const response = await fetch(`${BASE_URL}/verify/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
        return { error: true, data: responseJson.msg };
    }

    return { error: false, data: responseJson.msg };
}

async function logout() {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
}

export {
    login,
    register,
    getUserLogged,
    sendVerificationEmail,
    logout,
    verifyEmail,
};