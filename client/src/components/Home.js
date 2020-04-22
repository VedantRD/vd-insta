import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RenderPost from './post/RenderPost'

export default function Home() {

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
            url: '/followposts',
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
            {posts.length === 0 ?
                <div>
                    <h3 className='text-muted text-center mt-5'>You are not following anyone</h3>
                    {/* <p className='small text-muted text-center'>Go to explore section to see latest updates</p> */}
                </div>

                :

                posts.map(item => {
                    return (
                        <RenderPost item={item} removePostRender={removePostRender} key={item._id}></RenderPost>
                    )
                })
            }
        </div>
    )
}
