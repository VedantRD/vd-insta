import React, { useState, useEffect } from 'react'
import axios from 'axios'
import RenderPost from './RenderPost'
import { useParams, useHistory } from 'react-router-dom'

export default function OpenPost() {

    const { postId } = useParams()
    const [post, setPost] = useState('')
    const history = useHistory()

    const getPost = () => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'get',
            url: `/getOnePost/${postId}`,
            headers
        })
            .then(res => {
                setPost(res.data.post)
                // console.log(res.data.post)
            })
            .catch(err => console.log(err))
    }

    const removePostRender = (itemId) => {
        setPost('')
        history.push('/profile')
        // console.log('deletion successful')
    }

    useEffect(() => {
        getPost()
    }, [])

    return (
        <div>
            {post !== '' ?
                <div className='container'>
                    <RenderPost item={post} removePostRender={removePostRender} key={post._id}></RenderPost>
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
