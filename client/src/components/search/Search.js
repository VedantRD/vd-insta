import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'

export default function Search() {

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const { state } = useContext(UserContext)

    const fetchUsers = (query) => {
        setSearch(query)
        if (query !== '') {
            axios.post('/search', { query })
                .then(result => {
                    // console.log(result.data.users)
                    setUsers(result.data.users)
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className='container pt-4'>

            <div className='card p-5 searchCard' style={{ margin: '0 150px', marginTop: '5%' }}>
                <h3 className='text-center mb-5'>Search People</h3>
                <form>
                    <div className="form-group">
                        <input type="email" className="form-control searchInput" placeholder="username" value={search} onChange={(e) => fetchUsers(e.target.value)} />
                    </div>
                </form>

                <div className='mt-5'>
                    <ul className="list-group">
                        {users.length > 0 ?
                            users.map(user => {
                                return (
                                    <Link to={state._id === user._id ? `/profile` : `/profile/${user._id}`} key={user._id} className='text-dark'>
                                        <li className="list-group-item">
                                            <img src={user.profilePhoto !== '' ? user.profilePhoto : 'https://image.flaticon.com/icons/png/512/149/149071.png'} style={{ height: 40, width: 40, borderRadius: 25 }} alt='alejf'></img>
                                            <span className='ml-3'>{user.name}</span>
                                        </li>
                                    </Link>
                                )
                            })
                            :
                            <p className='text-center text-muted mt-3' id='sr'>Related Searches will show up here</p>
                        }
                    </ul>
                </div>
            </div>

        </div>
    )
}
