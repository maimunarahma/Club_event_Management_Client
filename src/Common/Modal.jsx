import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/Authentication';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const Modal = ({ open, onclose }) => {
    const { user, SignUp, setUser, login } = useContext(AuthContext);
    // console.log(user, SignUp,)
    const [activeTab, setActiveTab] = useState('login');
    const [uniError, setUniError] = useState('');

    // console.log(open, onclose)


    const [formData, setFormData] = useState({
        role: "",
        clubName: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        console.log("Login form submitted");

        const pass = formData.password;
        const email = formData.email;

        console.log("Trying to login with:", email, pass);

        try {
            if (activeTab === 'login') {
                const res = await login(email, pass);
                setUser(res.user);
                toast.success("Login successful! 🎉");

                setTimeout(() => {
                    onclose();
                }, 2000);
                // form.reset();
            }
        } catch (error) {

            toast.error("Login failed: " + error.message);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pass = formData.password;
        const email = formData.email;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{4,}$/;

        if (!passwordRegex.test(pass)) {
            toast.error(
                "Password must contain at least 6 characters with uppercase and lowercase letters.",
                { position: "top-center" }
            );
            return;
        }

        try {
            const [uniRes, clubRes] = await Promise.all([
                fetch('https://club-event-management-server.vercel.app/uni'),
                fetch('https://club-event-management-server.vercel.app/club')
            ]);

            const unis = await uniRes.json();
            const clubs = await clubRes.json();

            const university = unis.find(item => item.name === formData.universityName);
            const club = clubs.find(item => item?.name === formData.clubName);

            const isExist = Boolean(university);
            const isExist2 = Boolean(club);

            const user = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                universityName: formData.universityName,
            };

            // 🔹 Club Admin registration
            if (formData.role === 'club_admin' && activeTab === 'register') {
                if (!isExist) {
                    setUniError(`University '${formData.universityName}' does not exist.`);
                    return;
                }

                if (isExist2) {
                    setUniError(`This club '${club.name}' already exists. Contact admin or use a new name.`);
                    return;
                }

                await fetch('https://club-event-management-server.vercel.app/users', {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(user),
                });

                const newClub = {
                    name: formData.clubName,
                    type: formData.Type,
                    universityId: university._id,
                    clubAdminEmail: formData.email,
                };

                await fetch('https://club-event-management-server.vercel.app/club', {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(newClub),
                });

                toast.success("Club Admin registered successfully! 🎉", { position: "top-center" });
                onclose();
            }

            // 🔹 Event Manager registration
            else if (formData.role === 'event_manager' && activeTab === 'register') {
                if (!isExist) {
                    setUniError(`University '${formData.universityName}' does not exist.`);
                    return;
                }

                if (!isExist2) {
                    setUniError(`This club '${formData.clubName}' is not registered. Please register first.`);
                    return;
                }

                const event = {
                    name: formData.eventName,
                    eventManageEmail: formData.email,
                    universityId: university._id,
                    clubId: club._id,
                    eventType: formData.eventType,
                    location: formData.location,
                    registrationLink: formData.registrationLink,
                    deadline: formData.deadline,
                    eventDate: formData.eventDate,
                    prizeMoney: formData.prizeMoney,
                    registrationFee: formData.registrationFee,
                    registrationProcess: formData.registrationProcess,
                    status: 'pending'
                };

                const res = await SignUp(email, pass);
                if (res?.user) {
                    setUser(res.user);
                    await fetch('https://club-event-management-server.vercel.app/event', {
                        method: 'POST',
                        headers: { 'Content-type': 'application/json' },
                        body: JSON.stringify(event),
                    });
                    await axios.post('https://club-event-management-server.vercel.app/users', user);
                    toast.success("Event Manager registration successful! 🎉", { position: "top-center" });
                    onclose();
                }
            }

            // 🔹 General User or Super Admin registration
            else if (
                activeTab === 'register' &&
                (formData.role === 'general_user' || formData.role === 'super_admin')
            ) {
                if (!isExist) {
                    setUniError(`University '${formData.universityName}' does not exist.`);
                    return;
                }

                const res = await SignUp(email, pass);
                if (res?.user) {
                    setUser(res.user);
                    await axios.post('https://club-event-management-server.vercel.app/users', user);
                    toast.success("Registration successful! 🎉", { position: "top-center" });
                    setUniError("");
                    onclose();
                }
            }

            // 🔹 Invalid state: Club admin trying to register an existing club
            else if (
                formData.role === 'club_admin' &&
                activeTab === 'register' &&
                isExist &&
                isExist2
            ) {
                setUniError(
                    `This '${formData.universityName}' and club '${formData.clubName}' are already registered. Please contact admin.`
                );
            }

            // 🔹 New university case (handled silently)
            else if (!isExist && activeTab === 'register') {
                setUniError(`University '${formData.universityName}' is not registered.`);
                console.log("New university, proceed with registration (optional logic here).");
            }

        } catch (error) {
            console.error("Error in handleSubmit:", error);
            toast.error("Something went wrong. Please try again later.");
        }
    };


    if (!open) return null;

    return (
        <div className={`${activeTab === 'login' ? 'absolute bottom-60 right-80  left-60 flex items-center justify-center bg-black' : 'absolute bottom-20 right-80  left-60 flex items-center justify-center bg-black'}`}>
            <div className="  bg-purple-500  text-black overflow-y-auto  max-w-md p-6 rounded-lg shadow-xl ">
                <ToastContainer />
                <button
                    onClick={onclose}
                    className="absolute top-5 right-80 text-gray-500 hover:text-red-500"
                >
                    ✖
                </button>

                {/* Toggle Tabs */}
                <div className="flex justify-center mb-4">
                    <button

                        className={`px-4 py-2 font-semibold ${activeTab === "login" ? "text-white bg-blue-600" : "text-blue-600 bg-white"
                            } rounded-l-lg border border-blue-600`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 font-semibold ${activeTab === "register"
                            ? "text-white bg-blue-600"
                            : "text-blue-600 bg-white"
                            } rounded-r-lg border border-blue-600`}
                        onClick={() => setActiveTab("register")}
                    >
                        Register
                    </button>
                </div>

                {/* Forms */}
                {activeTab === "login" ? (
                    <form className="space-y-2" onSubmit={handleSubmitLogin} autoComplete="off">
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form className="space-y-1" onSubmit={handleSubmit}>
                        <input
                            name='name'
                            type='text'
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            value={formData.password}
                            type='password'

                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            name='password'
                            type='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            name='universityName'
                            type='text'
                            value={formData.universityName}
                            onChange={handleChange}
                            placeholder="University Name"
                            className="w-full p-2 border rounded"
                        />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border bg-white text-grey"
                            required>
                            <option value="">Select Role</option>
                            <option value="super_admin">Super Admin</option>

                            <option value="club_admin">Club Admin</option>
                            <option value="event_manager">Event Manager</option>
                            <option value="general_user">General User</option>
                        </select>
                        {formData.role === "club_admin" && (
                            <div>
                                <label className="block font-semibold mb-1">Enter Club Name</label>
                                <input
                                    type="text"
                                    name="clubName"
                                    value={formData.clubName}
                                    onChange={handleChange}
                                    placeholder="e.g., Robotics Club"
                                    className="w-full px-4 py-2 rounded border"
                                    required
                                />
                                <label className="block font-semibold mb-1">Enter Club Name</label>
                                <input
                                    type="text"
                                    name="Type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    placeholder="e.g., Tech"
                                    className="w-full px-4 py-2 rounded border"
                                    required
                                />
                            </div>
                        )}
                        {formData.role === "event_manager" && (
                            <div>
                                <label className="block font-semibold mb-1">Enter Club Name</label>
                                <input
                                    type="text"
                                    name="clubName"
                                    value={formData.clubName}
                                    onChange={handleChange}
                                    placeholder="e.g., Robotics Club"
                                    className="w-full px-4 py-2 rounded border"
                                    required
                                />
                                <label className="block font-semibold mb-1">Enter Event Name</label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleChange}
                                    placeholder="e.g., Robotics Club"
                                    className="w-full px-4 py-2 rounded border"
                                    required
                                />
                                <label className="block font-semibold mb-1">Select Event Type</label>
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border"
                                    required
                                >
                                    <option value="">-- Select Event Type --</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="competition">Competition</option>
                                    <option value="webinar">Webinar</option>
                                    <option value="hackathon">Hackathon</option>
                                    <option value="cultural">Cultural Program</option>
                                    <option value="sports">Sports</option>
                                    <option value="social">Social Awareness</option>
                                    <option value="tech_talk">Tech Talk</option>
                                </select>
                                <label className="block font-semibold mb-1">Enter Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Auditorium"
                                    className="w-full px-4 py-2 rounded border"
                                    required
                                />
                                <label className="block font-semibold mb-1">Registration Link</label>
                                <input
                                    type="url"
                                    name="registrationLink"
                                    value={formData.registrationLink}
                                    onChange={handleChange}
                                    placeholder="https://example.com/register"
                                    className="w-full px-4 py-2 rounded border"
                                    required
                                />
                                <label className="block font-semibold mb-1">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border"
                                    min={new Date().toISOString().split("T")[0]} // ⛔ Prevents past dates
                                    required
                                />
                                {/* 📅 Event Date */}
                                <label className="block font-semibold mb-1">Event Date</label>
                                <input
                                    type="datetime-local"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border"
                                    min={new Date().toISOString().slice(0, 16)}
                                    required
                                />

                                {/* 💸 Prize Money */}
                                <label className="block font-semibold mb-1">Prize Money (৳)</label>
                                <input
                                    type="number"
                                    name="prizeMoney"
                                    value={formData.prizeMoney}
                                    onChange={handleChange}
                                    placeholder="Enter prize amount (e.g., 5000)"
                                    className="w-full px-4 py-2 rounded border"
                                    min="0"
                                    required
                                />

                                {/* 💰 Registration Fee */}
                                <label className="block font-semibold mb-1">Registration Fee (৳)</label>
                                <input
                                    type="number"
                                    name="registrationFee"
                                    value={formData.registrationFee}
                                    onChange={handleChange}
                                    placeholder="Enter fee (e.g., 200)"
                                    className="w-full px-4 py-2 rounded border"
                                    min="0"
                                    required
                                />

                                {/* 📝 Registration Process */}
                                <label className="block font-semibold mb-1">Registration Process</label>
                                <textarea
                                    name="registrationProcess"
                                    value={formData.registrationProcess}
                                    onChange={handleChange}
                                    placeholder="Describe how participants should register"
                                    className="w-full px-4 py-2 rounded border"
                                    rows={3}
                                    required
                                />


                            </div>
                        )}
                        {uniError && (
                            <>
                                <p className="text-red-600 text-sm font-medium">{uniError}</p>

                            </>

                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Register
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Modal;