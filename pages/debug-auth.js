import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function DebugAuth() {
    const [config, setConfig] = useState({});
    const [domain, setDomain] = useState('');
    const [status, setStatus] = useState('Ready');
    const [error, setError] = useState(null);

    useEffect(() => {
        setDomain(window.location.hostname);
        setConfig({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set (Starts with ' + process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5) + '...)' : 'MISSING',
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING',
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
        });
    }, []);

    const testLogin = async () => {
        setStatus('Testing Login...');
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setStatus('Success! Login worked.');
        } catch (err) {
            console.error(err);
            setStatus('Failed');
            setError({
                code: err.code,
                message: err.message,
                fullError: JSON.stringify(err, null, 2)
            });
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Firebase Auth Debugger</h1>

            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>Environment Check</h3>
                <p><strong>Current Hostname:</strong> {domain}</p>
                <p><strong>Auth Domain (Env):</strong> {config.authDomain}</p>
                <p><strong>Project ID (Env):</strong> {config.projectId}</p>
                <p><strong>API Key (Env):</strong> {config.apiKey}</p>
            </div>

            <div style={{ background: '#e0e7ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>Instructions</h3>
                <ol>
                    <li>Check if <strong>Auth Domain</strong> above matches your Firebase Console Project ID (e.g., <code>{config.projectId}.firebaseapp.com</code>).</li>
                    <li>Check if <strong>Current Hostname</strong> is listed in Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains.</li>
                </ol>
            </div>

            <button
                onClick={testLogin}
                style={{ padding: '15px 30px', fontSize: '16px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
                Test Google Login
            </button>

            {status && <h3 style={{ marginTop: '20px' }}>Status: {status}</h3>}

            {error && (
                <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '8px', marginTop: '20px', color: '#991b1b' }}>
                    <h3>Error Details</h3>
                    <p><strong>Code:</strong> {error.code}</p>
                    <p><strong>Message:</strong> {error.message}</p>
                    <pre style={{ overflow: 'auto' }}>{error.fullError}</pre>
                </div>
            )}
        </div>
    );
}
