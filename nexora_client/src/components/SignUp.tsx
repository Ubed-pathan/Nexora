import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import {useNavigate } from 'react-router-dom';

interface SignUpDataType {
    username: string,
    email: string,
    password: string
}

function SignUp() {

    const [signUpData, setSignUpData] = useState<SignUpDataType>({
        username: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setSignUpData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }

    function isBlank(value: string): boolean {
        return value.trim() === "";
      }

    async function handleSignUp(e: FormEvent): Promise<void> {
        e.preventDefault();
        
          if (isBlank(signUpData.username) || isBlank(signUpData.email) || isBlank(signUpData.password)) {
            toast.error("Fields cannot be blank or just spaces", {
              position: "top-center",
              autoClose: 2000,
              theme: "dark",
              transition: Bounce,
            });
            return;
          }
    
        try {
            const response: AxiosResponse = await axios.post(
                `${import.meta.env.VITE_SERVER_API}/public/signup`,
                signUpData
            );
    
            // ✅ Success
            if (response.status === 200) {
                toast.success("😀 Signed up successfully", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "dark",
                    transition: Bounce,
                });
    
                setSignUpData({
                    username: '',
                    email: '',
                    password: ''
                });
    
                setTimeout(() => {
                    navigate('/SignIn');
                }, 1100);
            }
    
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    toast.error(error.response.data, {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "dark",
                        transition: Bounce,
                    });
    
                    setSignUpData({
                        username: '',
                        email: '',
                        password: ''
                    });
                } else {
                    toast.error("Something went wrong!", {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "dark",
                        transition: Bounce,
                    });
                }
            }
        }
    }
    
    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center min-h-screen bg-bg-100">
                    <div className=" w-[90%] md:w-full max-w-md p-8 bg-bg-300 shadow-lg  rounded-lg">
                        <h2 className="text-3xl text-center text-text-200 mb-6">SignUp</h2>

                        <form className="space-y-8" onSubmit={handleSignUp}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder=" "
                                    required
                                    name='username'
                                    value={signUpData.username}
                                    onChange={handleChange}
                                    className="peer w-full border-b-2 border-gray-300 bg-bg-300 text-text-100  focus:outline-none focus:border-custom-blue placeholder-transparent"
                                />
                                <label
                                    className="absolute left-0 text-accent-100 top-[-16px] text-xs transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent-100 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-custom-blue"
                                >
                                    Username*
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder=" "
                                    name='email'
                                    value={signUpData.email}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full border-b-2 bg-bg-300 border-gray-300 text-text-100  focus:outline-none focus:border-custom-blue placeholder-transparent"
                                />
                                <label
                                    className="absolute left-0 text-accent-100 top-[-16px] text-xs transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent-100 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-custom-blue"
                                >
                                    Email*
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder=" "
                                    name='password'
                                    value={signUpData.password}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full border-b-2 bg-bg-300 border-gray-300 text-text-100 focus:outline-none focus:border-custom-blue placeholder-transparent"
                                />
                                <label
                                    className="absolute left-0 text-accent-100 top-[-16px] text-xs transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent-100 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-custom-blue"
                                >
                                    Password*
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-text-100 text-bg-100 py-2 px-4 rounded-lg hover:bg-accent-100 transition-colors"
                            >
                                SignUp
                            </button>
                        </form>
                        <h1 className='mt-10 text-center text-text-100'>
                            Already have an account: <a className='cursor-pointer text-primary-100 underline' onClick={() => navigate('/signin')}>
                                SignIn
                            </a>
                        </h1>
                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}
                />
            </div>
        </>
    )
}

export default SignUp