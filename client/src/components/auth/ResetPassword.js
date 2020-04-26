import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { UserContext } from '../../App'

export default function ResetPassword() {

    // const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { resetToken } = useParams()

    toast.configure()
    const toggle = () => {
        var temp = document.getElementById("logPass");
        var temp2 = document.getElementById("logPass2");
        if (temp.type === "password") {
            temp.type = "text";
            temp2.type = "text";
        }
        else {
            temp.type = "password";
            temp2.type = "password";
        }
    }

    const resetPasswordConfirm = async () => {

        if (password !== confirmPassword) {
            return toast.error('password and confirm-password does not match', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        await axios.post(`/reset-password`, { password, resetToken })
            .then(res => {
                if (res.data.status === 'success') {
                    toast.success(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    history.push('/signin')
                    //console.log(res.data)
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
                <div className="card mt-5 p-3 loginForm-shadow login-card" style={{ width: 370 }}>
                    <form>
                        <div className="card-body">
                            <h1 className="card-title text-center mb-5 loginFont">Reset Password</h1>
                            <div className="form-group mt-4">
                                <div className='input-group'>
                                    <input type="password" className="form-control" placeholder="New Password" id='logPass' style={{ marginRight: -30, zIndex: 0 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <i className="fa fa-eye align-self-center pr-3" aria-hidden="true" onClick={toggle} style={{ cursor: 'pointer', zIndex: 1 }}></i>
                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <div className='input-group'>
                                    <input type="password" className="form-control" placeholder="Confirm New Password" id='logPass2' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className='text-center mt-5 pt-3'>
                                <p className="btn btn-primary text-center px-3" onClick={resetPasswordConfirm}>Confirm Reset</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
