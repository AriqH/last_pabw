import React from 'react';
import { sendVerificationEmail } from '../repositories/AuthRepository';

const ProfilePage = ({ user }) => {
    const onClickVerify = async () => {
        try {
            const data = await sendVerificationEmail(user.email, user.token);
            alert(data.data);
        } catch (error) {
            alert('Failed to verify email!');
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 mb-4 w-64">
                <img
                    src={user.profilePicture ?? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full mx-auto my-4"
                />
                <p className="text-lg">
                    ID: <span className="font-bold">{user.id}</span>
                </p>
                <p className="text-lg">
                    Full Name: <span className="font-bold">{user.fullname}</span>
                </p>
                <p className="text-lg">
                    Email: <span className="font-bold">{user.email}</span>
                </p>
                <p className="text-lg">
                    Age: <span className="font-bold">{user.umur}</span>
                </p>
                <p className="text-lg">
                    Role: <span className="font-bold">{user.role}</span>
                </p>
                {user.email_verified_at === null && (
                    <button
                        type="button" onClick={onClickVerify}
                        className="mt-10 w-full text-white bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Verify Email
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;