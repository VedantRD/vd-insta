import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'
import { Link } from 'react-router-dom';

export default function Profile() {

    const [myposts, setMyposts] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [user, setUser] = useState(state)
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    const [bio, setBio] = useState('')

    // console.log(url)

    toast.configure()

    const updateBio = () => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

        axios({
            method: 'patch',
            url: '/updateBio',
            headers,
            data: { newBio: bio }
        })
            .then(res => {
                //console.log(res.data)
                if (res.data.status === 'success') {
                    toast.success(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    localStorage.setItem('user', JSON.stringify({ ...user, bio }))
                    dispatch({ type: 'UPDATE_BIO', payload: bio })
                    setUser({ ...user, bio })
                }
                else
                    toast.error(res.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
            })
            .catch(err => console.log(err.message))
    }

    const updateProfilePhoto = async () => {
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
        if (url) {
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

            axios({
                method: 'patch',
                url: '/updateProfilePhoto',
                headers,
                data: { newPhoto: url }
            })
                .then(res => {
                    //console.log(res.data)
                    if (res.data.status === 'success') {
                        toast.success(res.data.message, {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                        localStorage.setItem('user', JSON.stringify({ ...user, profilePhoto: url }))
                        dispatch({ type: 'UPDATE_PROFILE_PHOTO', payload: url })
                        setUser({ ...user, profilePhoto: url })
                    }
                    else
                        toast.error(res.data.message, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                })
                .catch(err => console.log(err.message))
        }
    }, [url])

    useEffect(() => {

        if (state) {
            setBio(user.bio)
        }

        $(".custom-file-input").on("change", function () {
            var fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        });

        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'get',
            url: '/myposts',
            headers,
        })
            .then((res) => {
                // console.log(res.data.posts)
                setMyposts(res.data.posts)
            })
            .catch(err => console.error(err));
    }, [])

    return (
        <div className='container profile-container'>
            {user ?
                <div className='card p-5 userProfileCard' style={{ margin: '20px 200px' }}>

                    {/* ====== Profile Pic Row ======= */}
                    <div className='row mt-3 mb-2 no-gutters'>
                        <div className='col-5 col-md-3 d-flex justify-content-center'>
                            <img className='profilePhoto'
                                src={user.profilePhoto ? user.profilePhoto : 'https://image.flaticon.com/icons/png/512/149/149071.png'}
                                alt='profile'
                            />
                        </div>
                        <div className='col-7 col-md-3 align-self-center showName pl-3'>
                            <h3 className='mb-0 pb-0'>{user.name}</h3>
                            <span>
                                <i className=" fa fa-map-marker mr-2" aria-hidden="true" style={{ color: 'red' }}></i>
                                India
                            </span>
                        </div>

                        {/* ========= Edit Settings Buttons ========= */}
                        <div className='col-md-1'></div>
                        <div className='col-12 col-md-4 no-gutters mt-2 mb-3 align-self-center'>
                            <div className='row no-gutters justify-content-between editSettingsRow'>
                                <span className='mr-3' data-toggle="collapse" data-target="#collapseExample" style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-pencil-square-o mr-2" aria-hidden="true"></i>
                                    Edit Profile
                                </span>
                                <span style={{ cursor: 'pointer' }} onClick={() => {
                                    toast.warning('this feature is still in testing phase', {
                                        position: toast.POSITION.BOTTOM_RIGHT
                                    });
                                }}>
                                    <i className="fa fa-cog mr-2" aria-hidden="true"></i>
                                    Settings
                                </span>
                            </div>
                        </div>

                        <div className="collapse p-3 mt-2" id="collapseExample">
                            <form>
                                <div className='form-group'>
                                    <label>Update Profile Photo</label>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="customFile" onChange={(e) => setImage(e.target.files[0])} />
                                        <label className="custom-file-label" htmlFor="customFile">Select New Image</label>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-2'>
                                    <span className='btn btn-primary' onClick={() => updateProfilePhoto()}>Update Profile Photo</span>
                                </div>
                            </form>
                            <form>
                                <div className='form-group'>
                                    <label>Update Bio</label>
                                    <textarea className="form-control" placeholder="Enter Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                                </div>
                                <div className='d-flex justify-content-center mt-2'>
                                    <span className='btn btn-primary' onClick={() => updateBio()}>Update Bio</span>
                                </div>
                            </form>
                        </div>

                    </div>

                    {/* ========== Second Row ========= */}
                    <div className='row no-gutters p-3 pt-4 pb-0 bio-row'>
                        <div className='col-12 align-self-baseline'>
                            <span><b>Bio :</b></span>
                            <span className='ml-2'>{user.bio}</span>
                        </div>
                    </div>

                    {/* ====== Third Row showing followers following ======= */}
                    <hr className=''></hr>
                    <div>
                        <ul className='row list-unstyled no-gutters justify-content-around pt-2'>
                            <li className='col d-flex flex-column text-center'>
                                <span>{myposts.length}</span>
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
                    <hr className=''></hr>

                    {/* ============== Images ============== */}
                    {myposts.length === 0 ?
                        <div className='mt-5'>
                            <p className='text-center text-muted'>No Posts Yet</p>
                        </div>

                        :

                        <div className='row no-gutters'>
                            {myposts.map(mypost => {
                                return (
                                    <div className='col-6 p-1' key={mypost._id}>
                                        <Link to={`/openpost/${mypost._id}`}>
                                            <img src={mypost.photo} alt='onepost' className='img-fluid w-100'></img>
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
        </div >
    )
}
