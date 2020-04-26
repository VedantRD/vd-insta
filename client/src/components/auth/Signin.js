import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../App'

export default function Signin() {

    const { dispatch } = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    toast.configure()

    const toggle = () => {
        var temp = document.getElementById("logPass");
        if (temp.type === "password") {
            temp.type = "text";
        }
        else {
            temp.type = "password";
        }
    }

    const loginUser = async () => {

        await axios.post('/signin', { email, password })
            .then(res => {
                if (res.data.status === 'success') {
                    toast.success(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    history.push('/')
                    // console.log(res.data)
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    dispatch({ type: 'USER', payload: res.data.user })
                }
                else
                    toast.error(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
            })
            .catch(err => console.log(err.message))
    }

    return (
        <div className='container loginForm'>
            <div className='row justify-content-center mt-5'>
                {!localStorage.getItem('user') ?
                    <div className="card mt-5 p-3 loginForm-shadow login-card" style={{ width: 370 }}>
                        <form>
                            <div className="card-body">
                                <h1 className="card-title text-center mb-5 loginFont">Login</h1>
                                <div className="form-group">
                                    <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group mt-4">
                                    <div className='input-group'>
                                        <input type="password" className="form-control" placeholder="Enter Password" id='logPass' style={{ marginRight: -30, zIndex: 0 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <i className="fa fa-eye align-self-center pr-3" aria-hidden="true" onClick={toggle} style={{ cursor: 'pointer', zIndex: 1 }}></i>
                                    </div>
                                </div>
                                <div className='text-center mt-5 pt-3'>
                                    <p className="btn btn-primary text-center px-3" onClick={() => loginUser()}>Login</p>
                                </div>
                                <p className='text-center'>Forgot Password ?
                            <Link to='/reset' className='ml-2'>Click Here</Link>
                                </p>
                            </div>
                            <div className="card-footer text-right mt-0 pt-0 text-muted" style={{ backgroundColor: 'white', border: 0 }}>
                                <Link to='/signup' className='text-muted' style={{ textDecoration: 'none' }}>
                                    <span className='mr-2'>Create New Account</span>
                                    <i className="fa fa-angle-right fa-lg" aria-hidden="true"></i>
                                </Link>
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
