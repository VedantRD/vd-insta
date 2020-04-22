import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar() {

    const { state, dispatch } = useContext(UserContext)
    toast.configure()

    const logoutUser = () => {
        localStorage.clear()
        dispatch({ type: 'CLEAR' })
        toast.success('Logout Successful', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }

    const renderList = () => {
        if (state) {
            return [
                <li className='nav-link' key='1'>
                    <Link className='nav-item' to="/">
                        <i className="fa fa-home fa-lg mr-2" aria-hidden="true"></i>
                        Home
                    </Link>
                </li>,
                <li className='nav-link' key='2'>
                    <Link className='nav-item' to="/explore">
                        <i className="fa fa-search mr-2" aria-hidden="true"></i>
                        Explore
                    </Link>
                </li>,
                <li className='nav-link' key='3'>
                    <Link className='nav-item' to="/createpost">
                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                        Create
                    </Link>
                </li>,
                <li className='nav-link' key='4'>
                    <Link className='nav-item' to="/profile">
                        <i className="fa fa-user-o mr-2" aria-hidden="true"></i>
                        Profile
                    </Link>
                </li>,
                <li className='nav-link' key='5'>
                    <Link className='btn btn-danger' to='/signin' onClick={logoutUser}>
                        <span className='nav-item'>
                            Logout
                        <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                        </span>
                    </Link>
                </li>
            ]
        }
        else {
            return [
                <li className='nav-link' key='10'>
                    <Link className='nav-item' to="/signin">
                        <i className="fa fa-sign-in mr-2" aria-hidden="true"></i>
                    Login
                    </Link>
                </li>,
                <li className='nav-link' key='11'>
                    <Link className='nav-item' to="/signup">
                        <i className="fa fa-user-plus mr-2" aria-hidden="true"></i>
                        Register
                        </Link>
                </li>
            ]
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark one-edge-shadow px-4">

            <Link to={state ? '/' : '/signin'} className="navbar-brand">Blogie</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto align-items-center">
                    {renderList()}
                </ul>
            </div>

        </nav>
    )
}
