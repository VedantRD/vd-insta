import React, { useState, useContext } from 'react'
import axios from 'axios'
import Moment from 'react-moment'
import { UserContext } from '../../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default function RenderPost({ item, removePostRender }) {

    function sortByProperty(property) {
        return function (a, b) {
            if (a[property] < b[property])
                return 1;
            else if (a[property] > b[property])
                return -1;

            return 0;
        }
    }

    const user = useContext(UserContext).state
    const [postLikes, setPostLikes] = useState(item.likes)
    const [postComments, setPostComments] = useState(item.comments.sort(sortByProperty('created')))
    const commentBox = document.getElementById('clrInput')

    // {/* --------- Like Post ---------- */ }
    const likeThePost = (postId, postedByID) => {
        // console.log(postedByID)
        setPostLikes([...postLikes, user._id])
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'patch',
            url: '/like',
            headers,
            data: {
                postId, postedByID
            }
        })
            .then((res) => {
                // console.log(res.data)
            })
            .catch(err => console.error(err));
    }

    // {/* --------- Unlike Post ---------- */ }
    const unlikeThePost = (postId) => {
        let filtered = postLikes.filter((value, index, arr) => { return value !== user._id; })
        setPostLikes(filtered)
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'patch',
            url: '/unlike',
            headers,
            data: {
                postId
            }
        })
            .then((res) => {
                //console.log(res.data)
            })
            .catch(err => console.error(err));
    }

    // {/* --------- Comment on Post ---------- */ }
    const commentThePost = (text, postId, postedByID) => {
        const postedBy = {
            name: user.name
        }
        setPostComments([{ text, created: new Date(), postedBy, _id: '123' }, ...postComments])
        toast.info(' Added New Comment', {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
        document.getElementById('clrInput').value = ''
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'patch',
            url: '/comment',
            headers,
            data: {
                postId,
                text,
                created: new Date(),
                postedByID
            }
        })
            .then((res) => {
                // console.log(res.data)
                commentBox.value = ''
            })
            .catch(err => console.error(err));
    }

    // {/* ----------- Delete Post -------------- */}
    const deletePost = (postId) => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'delete',
            url: `/deletepost/${postId}`,
            headers,
        })
            .then((res) => {
                // console.log(res.data)
                removePostRender(postId)
                toast.info(' Post Successfully Deleted', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            })
            .catch(err => console.error(err));
    }

    return (
        <div className='card home-card' style={{ margin: '5px 270px' }}>
            {user ?
                <div>

                    {/* --------- Card Header ---------- */}
                    <div className='card-header row no-gutters justify-content-start align-items-center py-2' style={{ backgroundColor: 'white' }}>
                        <img
                            style={{ height: 50, width: 50, borderRadius: 25, border: '1px solid #eee', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.3)' }}
                            src={item.postedBy.profilePhoto !== '' ? item.postedBy.profilePhoto : 'https://image.flaticon.com/icons/png/512/149/149071.png'}
                            alt='profile'
                        />
                        <Link to={user._id !== item.postedBy._id ?
                            `/profile/${item.postedBy._id}`
                            :
                            '/profile'} className='text-dark'>
                            <span className='ml-3' style={{ fontSize: 20, cursor: 'pointer' }}>{item.postedBy.name}</span>
                        </Link>
                        {item.postedBy._id === user._id &&
                            <div className="dropdown ml-auto">
                                <i className="fa fa-ellipsis-v dropdown-toggle my-dropdown-toggle mr-1 pt-2" id="dropdownMenuButton" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                </i>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <span className="dropdown-item" onClick={() => deletePost(item._id)}>Delete</span>
                                </div>
                            </div>
                        }
                    </div>

                    {/* --------- Card Image ---------- */}
                    <div>
                        <img className='card-img' src={item.photo} alt='thisisaphoto'></img>
                    </div>

                    {/* --------- Card Body ---------- */}
                    <div className='card-body pb-0 pt-3'>
                        {/* <Moment format="DD MMM, YYYY">{item.postedAt}</Moment> */}

                        {/* ---------------- Like and Comment Row ----------------- */}
                        <div className='mb-3 row no-gutters align-items-center' style={{ fontSize: 20 }}>

                            <div className="text-muted small"><Moment fromNow ago>{item.postedAt}</Moment>  ago</div>

                            {/* --------- Like Unlike Logic ---------- */}
                            <div className='ml-auto'>
                                {postLikes.includes(user._id) ?
                                    <span onClick={() => unlikeThePost(item._id)} style={{ cursor: 'pointer' }}>
                                        <i className='fa fa-heart mr-2' aria-hidden='true' style={{ color: 'red' }}></i>
                                        {postLikes.length}
                                    </span>
                                    :
                                    <span onClick={() => likeThePost(item._id, item.postedBy._id)} style={{ cursor: 'pointer' }}>
                                        <i className='fa fa-heart-o mr-2' aria-hidden='true'></i>{postLikes.length}
                                    </span>
                                }
                            </div>

                            {/* --------- Comment Icon ---------- */}
                            <div className='mr-2' style={{ cursor: 'pointer' }} data-toggle='collapse' data-target={`#showComments-${item._id}`}>
                                <i className='fa fa-comment-o ml-4 mr-2' aria-hidden='true'></i>
                                {postComments.length}
                                <i className='fa fa-angle-down ml-2' aria-hidden='true'></i>
                            </div>

                        </div>

                        {/* --------- Title and Caption ---------- */}
                        <h5>{item.title}</h5>
                        <p>{item.body}</p>

                    </div>

                    {/* --------- Card Footer ---------- */}
                    <div className='card-footer p-0' style={{ backgroundColor: 'white' }}>

                        {/* --------- Comment Form ---------- */}
                        <form className='px-3 py-2 big' onSubmit={(e) => {
                            e.preventDefault()
                            commentThePost(e.target[0].value, item._id, item.postedBy._id)
                        }}>
                            <div className='row no-gutters align-items-center'>
                                <div className='col-11'>
                                    <input type="text" className="form-control commentInput ml-0 pl-0" placeholder="Add Comment" id='clrInput' />
                                </div>
                                <div className='col-1 postCommentBtn'>
                                    <button type='submit' className='btn text-primary ml-auto p-0 pr-2' style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                                        <span style={{ fontSize: 19 }} className='postCommentBtnText'>Post</span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {postComments.length !== 0 && <hr className='m-0 p-0'></hr>}

                        {/* --------- Show Comments ---------- */}
                        <div className='px-3 py-2 collapse' id={`showComments-${item._id}`}>
                            {postComments ?
                                postComments.map(comment => {
                                    return (
                                        <div key={comment._id} className='mb-1'>
                                            <div>
                                                <Link to={user._id !== comment.postedBy._id ?
                                                    `/profile/${comment.postedBy._id}`
                                                    :
                                                    '/profile'} className='text-dark mr-2'>
                                                    <b style={{ fontSize: 16, cursor: 'pointer' }}>{comment.postedBy.name}</b>
                                                </Link>
                                                <span>{comment.text}</span>
                                            </div>
                                            <small className='text-muted '><Moment fromNow ago>{comment.created}</Moment> ago</small>
                                        </div>
                                    )
                                })
                                :
                                <p>loading comments</p>
                            }
                        </div>
                    </div>

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
