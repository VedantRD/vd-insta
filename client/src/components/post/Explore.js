import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import Moment from 'react-moment'
// import { UserContext } from '../App'
import RenderPost from './RenderPost'

export default function Explore() {

    const [posts, setPosts] = useState([])

    const removePostRender = (itemId) => {
        let filtered = posts.filter(post => { return post._id !== itemId })
        setPosts(filtered)
        console.log('deletion successful')
    }

    useEffect(() => {
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
        <div className='container'>
            {posts.length !== 0 ?
                posts.map(item => {
                    return (
                        <RenderPost item={item} removePostRender={removePostRender} key={item._id}></RenderPost>
                    )
                })
                :
                <h3 className='text-center text-muted mt-5'>No Posts Yet</h3>
            }
        </div>
    )
}
