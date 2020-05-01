import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Moment from 'react-moment'
import { Link } from 'react-router-dom';

export default function Activity() {

    const [activities, setActivities] = useState(null)
    toast.configure()

    useEffect(() => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        axios({
            method: 'get',
            url: '/activities',
            headers
        })
            .then(res => {
                if (res.data.activity.length === 0) {
                    setActivities([])
                }
                else {
                    setActivities(res.data.activity)
                }

                // console.log(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className='container activity-container'>
            {activities !== null && activities.length > 0 ?
                <div className='card activityCard' style={{
                    margin: '0 150px'
                }}>

                    <div className=''>
                        <ul className="list-group">
                            {activities.map(activity => {
                                return (
                                    <li className='text-muted list-group-item' id='sr' key={activity._id} style={{ border: 0, borderBottom: '1px solid rgba(0,0,0,.125)' }}>
                                        <div className='d-flex justify-content-between activity-text'>
                                            <span>
                                                <Link to={`/profile/${activity.doneBy._id}`} className='text-dark font-weight-bold'>{activity.doneBy.name}</Link> {activity.text}
                                            </span>
                                            <div className="text-muted small"><Moment fromNow ago>{activity.createdAt}</Moment>  ago</div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                :
                activities === null ?
                    <div className="d-flex justify-content-center mt-5">
                        <h3 className='text-muted text-center mr-4'>
                            Loading Data
                    </h3>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    :
                    <div className="d-flex justify-content-center mt-5">
                        <h3 className='text-muted text-center mr-4'>
                            No Recent Activities
                        </h3>
                    </div>
            }
        </div>
    )
}
