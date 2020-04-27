import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../App'

export default function ShowFollowers() {

    const { userId } = useParams()
    const [followers, setFollowers] = useState(null)
    const { state } = useContext(UserContext)

    useEffect(() => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'get',
            url: `/getfollowers/${userId}`,
            headers
        })
            .then(res => {
                setFollowers(res.data.followers)
                console.log(res)
            })
    }, [])

    return (
        <div className='container'>
            {followers && followers.length > 0 ?
                <div className=''>
                    <h5 className='text-muted text-center mt-3 ffHeader'>Followers</h5>
                    <div className='card ffCard' style={{
                        margin: '0 250px', marginTop: 50, maxHeight: '600px', overflowY: 'auto'
                    }}>

                        <ul className="list-group">
                            {followers.map(user => {
                                return (
                                    <li className='text-muted list-group-item' id='sr' key={user._id} style={{ border: 0, borderBottom: '1px solid rgba(0,0,0,.125)' }}>
                                        <Link to={state._id === user._id ? `/profile` : `/profile/${user._id}`} className='text-dark'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className='d-flex align-items-center'>
                                                    <img src={user.profilePhoto !== '' ? user.profilePhoto : 'https://image.flaticon.com/icons/png/512/149/149071.png'} style={{ height: 40, width: 40, borderRadius: 25 }} alt='alejf'></img>
                                                    <span className='ml-3'>{user.name}</span>
                                                </span>
                                                <span className="text-muted small">{user.followers.length} Followers</span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                :
                followers === null ?
                    <div className="d-flex justify-content-center mt-5">
                        <h3 className='text-muted text-center mr-4'>
                            Loading Data
                    </h3>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    :
                    <h3 className='text-muted text-center mt-5'>No Followers</h3>
            }
        </div>
    )
}
