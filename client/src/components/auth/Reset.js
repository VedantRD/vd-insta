import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Reset() {

    const [email, setEmail] = useState('')

    toast.configure()

    const sendEmailForReset = async () => {

        await axios.post('/reset', { email })
            .then(res => {
                if (res.data.status === 'success') {
                    toast.success(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    // console.log(res.data)
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
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" placeholder="Account Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='text-center mt-5 pt-3'>
                                <p className="btn btn-primary text-center px-3" onClick={sendEmailForReset}>Reset Password</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
