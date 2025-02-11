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
                <li className='nav-item' key='1'>
                    <Link className='nav-link' to="/">
                        <i className="fa fa-home mr-2" aria-hidden="true" style={{ fontSize: 21 }}></i>
                        Home
                    </Link>
                </li>,
                <li className='nav-item' key='22'>
                    <Link className='nav-link' to="/search">
                        <i className="fa fa-search mr-2" aria-hidden="true"></i>
                        Search
                    </Link>
                </li>,
                <li className='nav-item' key='2'>
                    <Link className='nav-link' to="/explore">
                        <i className="fa fa-rocket mr-2" aria-hidden="true"></i>
                        Explore
                    </Link>
                </li>,
                <li className='nav-item' key='33'>
                    <Link className='nav-link' to="/activity">
                        <i className="fa fa-bell mr-2" aria-hidden="true"></i>
                    Notifications
                </Link>
                </li>,
                <li className='nav-item' key='3'>
                    <Link className='nav-link' to="/createpost">
                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                        Create
                    </Link>
                </li>,
                <li className='nav-item' key='4'>
                    <Link className='nav-link' to="/profile">
                        <i className="fa fa-user mr-2" aria-hidden="true"></i>
                        Profile
                    </Link>
                </li>,
                <li className='nav-item' key='5'>
                    <Link className='btn btn-danger nav-link logout-btn' to='/signin' onClick={logoutUser}>
                        <span className=''>
                            Logout
                        <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                        </span>
                    </Link>
                </li>
            ]
        }
        else {
            return [
                <li className='nav-item' key='10'>
                    <Link className='nav-link' to="/signin">
                        <i className="fa fa-sign-in mr-2" aria-hidden="true"></i>
                    Login
                    </Link>
                </li>,
                <li className='nav-item' key='11'>
                    <Link className='nav-link' to="/signup">
                        <i className="fa fa-user-plus mr-2" aria-hidden="true"></i>
                        Register
                    </Link>
                </li>
            ]
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark one-edge-shadow px-4 fixed-top">

            <Link to={state ? '/' : '/signin'} className="navbar-brand">VD Insta</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="nav navbar-nav ml-auto align-items-center">
                    {renderList()}
                </ul>
            </div>

        </nav>
    )
}
