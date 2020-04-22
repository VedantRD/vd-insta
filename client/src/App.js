import React, { createContext, useReducer, useEffect, useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home'
import { Route, BrowserRouter, useHistory, Switch } from 'react-router-dom';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import Profile from './components/profile/Profile';
import CreatePost from './components/post/CreatePost';
import { reducer, initialState } from './reducers/userReducer'
import UserProfile from './components/profile/UserProfile';
import Explore from './components/post/Explore'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
      history.push('/')
    }
    else {
      history.push('/signin')
    }
  }, [history, dispatch])

  return (
    <Switch>
      <Route exact path='/'>
        <Home></Home>
      </Route>
      <Route path='/signup'>
        <Signup></Signup>
      </Route>
      <Route path='/signin'>
        <Signin></Signin>
      </Route>
      <Route exact path='/profile'>
        <Profile></Profile>
      </Route>
      <Route path='/profile/:userId'>
        <UserProfile></UserProfile>
      </Route>
      <Route path='/createpost'>
        <CreatePost></CreatePost>
      </Route>
      <Route path='/explore'>
        <Explore></Explore>
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routing></Routing>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
