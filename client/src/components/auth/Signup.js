import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom'
import $ from 'jquery'

export default function Signup() {
    const history = useHistory()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    // console.log(url)

    toast.configure()

    const toggle = () => {
        var temp = document.getElementById("regPass");
        if (temp.type === "password") {
            temp.type = "text";
        }
        else {
            temp.type = "password";
        }
    }

    const registerUser = async () => {
        await axios.post('/signup', { name, email, password, profilePhoto: url })
            .then(res => {
                if (res.data.status === 'success') {
                    toast.success(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    history.push('/signin')
                }
                else
                    toast.error(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
            })
            .catch(err => console.log(err.message))
    }

    const postData = () => {
        if (image) {
            uploadProfilePhoto()
        }
        else {
            registerUser()
        }
    }

    const uploadProfilePhoto = async () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'insta-clone')
        data.append('cloud_name', 'vdcloud')
        await fetch('https://api.cloudinary.com/v1_1/vdcloud/image/upload', { method: 'post', body: data })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    return toast.error('Please add Image', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
                setUrl(data.url)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        $(".custom-file-input").on("change", function () {
            var fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        });

    }, [])

    useEffect(() => {
        if (url) {
            registerUser()
        }
    }, [url])

    return (
        <div className='container loginForm'>
            <div className='row justify-content-center my-2'>
                {!localStorage.getItem('user') ?
                    <div className="card p-3 loginForm-shadow mt-5 register-card" style={{ width: 370 }}>
                        <form>
                            <div className="card-body">
                                <h1 className="card-title text-center mb-4 loginFont">Register</h1>

                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <small className='form-text text-muted'>
                                        this will be your username
                                </small>
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <small className="form-text text-muted">
                                        your info is safe with us.
                                </small>
                                </div>
                                <div className="form-group">
                                    <div className='input-group'>
                                        <input type="password" className="form-control" placeholder="Enter Password" id='regPass' style={{ marginRight: -30, zIndex: 0 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <i className="fa fa-eye align-self-center pr-3" aria-hidden="true" onClick={toggle} style={{ cursor: 'pointer', zIndex: 1 }}></i>
                                    </div>
                                    <small className="form-text text-muted">
                                        minimum 8 characters long.
                                </small>
                                </div>
                                <div className='form-group mt-5'>
                                    <div className="custom-file profilePicInput">
                                        <input type="file" className="custom-file-input profilePicInput" id="customFile" onChange={(e) => setImage(e.target.files[0])} />
                                        <label className="custom-file-label" htmlFor="customFile">Add Profile Photo</label>
                                    </div>
                                </div>

                                <div className='text-center mt-5'>
                                    <p className="btn btn-primary text-center px-3" onClick={() => postData()}>
                                        Register
                                </p>
                                </div>
                            </div>
                        </form>
                    </div>
                    :
                    <h3 className='text-muted text-center'>You are now logged in</h3>
                }
            </div>
        </div>
    )
}
