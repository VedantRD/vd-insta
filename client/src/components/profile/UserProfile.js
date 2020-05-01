import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserProfile() {

    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const { state, dispatch } = useContext(UserContext)
    toast.configure()

    useEffect(() => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'get',
            url: `/user/${userId}`,
            headers
        })
            .then((res) => {
                // console.log(res.data.user)
                setUserPosts(res.data.posts)
                setUser(res.data.user)
            })
            .catch(err => console.error(err));

    }, [])

    // Follow the User
    const followUser = () => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'patch',
            url: `/follow`,
            headers,
            data: {
                followId: userId
            }
        })
            .then((res) => {
                //console.log(res.data)
                dispatch({ type: 'UPDATE', payload: { following: res.data.result.following, followers: res.data.result.followers } })
                localStorage.setItem('user', JSON.stringify(res.data.result))
                setUser((prev) => {
                    return {
                        ...prev,
                        followers: [...prev.followers, res.data.result._id]
                    }
                })
                toast.info(` You are now following ${user.name}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            })
            .catch(err => console.error(err));
    }

    // Unfollow the User
    const unfollowUser = () => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'patch',
            url: `/unfollow`,
            headers,
            data: {
                unfollowId: userId
            }
        })
            .then((res) => {
                //console.log(res.data)
                dispatch({ type: 'UPDATE', payload: { following: res.data.result.following, followers: res.data.result.followers } })
                localStorage.setItem('user', JSON.stringify(res.data.result))
                let filtered = user.followers.filter(item => item !== res.data.result._id)
                setUser({
                    ...user,
                    followers: filtered
                })
                // console.log(user)
            })
            .catch(err => console.error(err));
    }

    return (
        <div className='container profile-container'>
            {user ?
                <div className='card p-5 userProfileCard' style={{ margin: '20px 200px' }}>

                    {/* ====== Profile Pic Row ======= */}
                    <div className='row mt-3 mb-2 no-gutters'>
                        <div className='col-5 col-md-3 d-flex justify-content-center'>
                            <img
                                className='profilePhoto'
                                src={user.profilePhoto ? user.profilePhoto : 'https://image.flaticon.com/icons/png/512/149/149071.png'}
                                alt='profile'
                            />
                        </div>
                        <div className='col-7 col-md-4 align-self-center showName pl-3'>
                            <h3 className='mb-0 pb-0'>{user.name}</h3>
                            <span>
                                <i className=" fa fa-map-marker mr-2" aria-hidden="true" style={{ color: 'red' }}></i>
                                India
                            </span>
                        </div>

                        {/* ====== Follow Unfollow Button ======= */}
                        <div className='col-5 col-md-4 align-self-start fuBtn d-flex justify-content-end'>
                            {state.following.includes(userId) ?
                                <button className='btn btn-outline-danger' onClick={unfollowUser}>
                                    Unfollow
                                </button>
                                :
                                <button className='btn btn-info' onClick={followUser}>
                                    Follow
                                </button>
                            }
                        </div>
                    </div>

                    {/* ========== Second Row ========= */}
                    <div className='row no-gutters p-3 pt-4'>
                        <div className='col-12 align-self-baseline'>
                            <span><b>Bio :</b></span>
                            <span className='ml-2'>{user.bio}</span>
                        </div>
                    </div>

                    <hr></hr>

                    {/* ====== Third Row showing followers following ======= */}
                    <div className='mt-2'>
                        <ul className='row list-unstyled no-gutters'>
                            <li className='col d-flex flex-column text-center'>
                                <span>{userPosts.length}</span>
                                <span>All Posts</span>

                            </li>
                            <li className='col'>
                                <Link to={`/showfollowing/${user._id}`} className='d-flex flex-column text-dark text-center'>
                                    <span>{user.following.length}</span>
                                    <span>Following</span>
                                </Link>
                            </li>
                            <li className='col'>
                                <Link to={`/showfollowers/${user._id}`} className='d-flex flex-column text-dark text-center'>
                                    <span>{user.followers.length}</span>
                                    <span>Followers</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <hr></hr>

                    {/* ============== Images ============== */}
                    {userPosts.length === 0 ?
                        <div>
                            <p className='text-center text-muted'>No Posts Yet</p>
                        </div>

                        :

                        <div className='row no-gutters'>
                            {userPosts.map(userPost => {
                                return (
                                    <div className='col-6 p-1' key={userPost._id}>
                                        <Link to={`/openpost/${userPost._id}`}>
                                            <img src={userPost.photo} alt='onepost' className='img-fluid w-100'></img>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    }

                </div>
                :
                <div className="d-flex justify-content-center mt-5">
                    <h3 className='text-muted text-center mr-4'>
                        Loading Data
                    </h3>
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
        </div>
    )
}
