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
import Reset from './components/auth/Reset';
import ResetPassword from './components/auth/ResetPassword'
import Search from './components/search/Search';
import Activity from './components/activity/Activity';
import OpenPost from './components/post/OpenPost';
import ShowFollowing from './components/profile/ShowFollowing';
import ShowFollowers from './components/profile/ShowFollowers';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
      history.push('/')
    }
    else {
      if (!history.location.pathname.startsWith('/reset'))
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
      <Route path='/reset'>
        <Reset></Reset>
      </Route>
      <Route path='/reset-password/:resetToken'>
        <ResetPassword></ResetPassword>
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
      <Route path='/search'>
        <Search></Search>
      </Route>
      <Route path='/activity'>
        <Activity></Activity>
      </Route>
      <Route path='/openpost/:postId'>
        <OpenPost></OpenPost>
      </Route>
      <Route path='/showfollowing/:userId'>
        <ShowFollowing></ShowFollowing>
      </Route>
      <Route path='/showfollowers/:userId'>
        <ShowFollowers></ShowFollowers>
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
