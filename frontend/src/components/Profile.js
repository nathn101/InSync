const Profile = () => {
    return ( 
        <div className="relative flex justify-center items-center flex-grow bg-gradient-to-b from-black via-gray-900 to-green-900 min-h-screen">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center text-white max-w-lg w-full">
                <h1 className="text-3xl mb-6">My Profile</h1>
                <form action="" className="profile-form-container space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-left mb-2">Name</label>
                        <input type="text" name="name" className="w-full p-2 rounded bg-gray-800 border border-gray-700" placeholder="Enter your name" required/>
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-left mb-2">Age</label>
                        <input type="number" name="age" className="w-full p-2 rounded bg-gray-800 border border-gray-700" placeholder="Enter your age" required/>
                    </div>
                    <div>
                        <p className="text-left mb-2">Gender</p>
                        <div className="flex items-center space-x-4">
                            <label htmlFor="male" className="flex items-center">
                                <input type="radio" name="gender" value="male" id="male" className="mr-2" required/>
                                Male
                            </label>
                            <label htmlFor="female" className="flex items-center">
                                <input type="radio" name="gender" value="female" id="female" className="mr-2" required/>
                                Female
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-left mb-2">Email</label>
                        <input type="email" name="email" className="w-full p-2 rounded bg-gray-800 border border-gray-700" placeholder="Enter your email" required/>
                    </div>
                    <button type="submit" className="btn w-full p-2 rounded bg-green-500 hover:bg-green-600 text-white">Save Changes</button>
                </form>
            </div>
        </div>
    );
}
 
export default Profile;