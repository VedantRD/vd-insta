import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import RenderPost from './post/RenderPost'
import { UserContext } from '../App'

export default function Home() {

    const [posts, setPosts] = useState([])
    const { state } = useContext(UserContext)

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
            {posts.length !== 0 ?

                posts.map(item => {
                    return (
                        <RenderPost item={item} removePostRender={removePostRender} key={item._id}></RenderPost>
                    )
                })

                :

                posts.length === 0 ?

                    <div class="d-flex justify-content-center mt-5">
                        <h3 className='text-muted text-center mr-4'>
                            Loading Data
                            </h3>
                        <div class="spinner-border text-secondary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>

                    :

                    state.following.length === 0 ?
                        <h3 className='text-muted text-center mt-5'>You are not following anyone</h3>
                        :
                        <h3 className='text-muted text-center mt-5'>People you follow haven't posted anything yet</h3>

            }
        </div >
    )
}
