import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RenderPost from './RenderPost'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Explore() {

    const [posts, setPosts] = useState([])
    toast.configure()

    const removePostRender = (itemId) => {
        let filtered = posts.filter(post => { return post._id !== itemId })
        setPosts(filtered)
        //console.log('deletion successful')
    }

    useEffect(() => {

        toast.info('Getting Latest Posts For You', {
            position: toast.POSITION.BOTTOM_RIGHT,
        });

        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'get',
            url: '/allposts',
            headers,
        })
            .then((res) => {
                // console.log(res.data.posts)
                setPosts(res.data.posts)
            })
            .catch(err => console.error(err));
    }, [])

    return (
        <div className='explore-container container'>
            {posts.length !== 0 ?
                posts.map(item => {
                    return (
                        <RenderPost item={item} removePostRender={removePostRender} key={item._id}></RenderPost>
                    )
                })
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
