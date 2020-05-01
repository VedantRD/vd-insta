import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom'

export default function CreatePost() {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    const history = useHistory()

    toast.configure()

    const postImage = async () => {

        if (!title.trim() || !body.trim()) {
            return toast.error('Title or Content cannot be empty', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'insta-clone')
        data.append('cloud_name', 'vdcloud')
        await fetch('https://api.cloudinary.com/v1_1/vdcloud/image/upload/', { method: 'post', body: data })
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
        $(".custom-file-input").on("change", function () {
            var fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        });
    }, [])

    // TODO - Create new Post
    useEffect(() => {
        if (url) {
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

            axios({
                method: 'post',
                url: '/createpost',
                headers,
                data: { title, body, photo: url, postedAt: new Date() }
            })
                .then(res => {
                    if (res.data.status === 'success') {
                        toast.success(res.data.message, {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                        history.push('/profile')
                    }
                    else
                        toast.error(res.data.message, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                })
                .catch(err => console.log(err.message))
        }
    }, [url, body, title, history])

    return (
        <div className='container pt-3'>
            <div className='card create-card' style={{ marginTop: 85, marginLeft: 220, marginRight: 220 }}>
                <div className='card-header'>Create New Post</div>
                <div className='card-body'>
                    <form className='create-form'>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" className="form-control" placeholder="Write Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Caption</label>
                            <textarea className="form-control" placeholder="Write Caption" value={body} onChange={(e) => setBody(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <label>Add Image</label>
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" id="customFile" onChange={(e) => setImage(e.target.files[0])} />
                                <label className="custom-file-label" htmlFor="customFile">Select Image</label>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center mt-5 mb-2'>
                            <span className='btn btn-primary' onClick={() => postImage()}>Add post</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
