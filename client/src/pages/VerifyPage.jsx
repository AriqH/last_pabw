import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { verifyEmail } from '../repositories/AuthRepository';

const VerifyPage = ({ onVerify }) => {
    const [loading, setLoading] = useState(true);
    const [respond, setRespond] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const token = window.location.pathname.split('/').pop();

            const verify = await verifyEmail(token);            
            setRespond(verify.data);

            setToken(token);
        };
        
        setLoading(false);
        getUser();


        onVerify(token);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
                    <p className="text-2xl text-black font-bold mb-6 text-center" dangerouslySetInnerHTML={{ __html: respond }}/>
                </div>
            )}
        </div>
    );
};

VerifyPage.propTypes = {
    onVerify: PropTypes.func.isRequired,
};

export default VerifyPage;