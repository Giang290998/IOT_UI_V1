import { memo, useRef } from 'react';
import './App.scss';
import Home from './pages/home/Home';
import { Routes, Route } from "react-router-dom";
import Topbar from './components/topbar/Topbar';
import LoginRegister from './pages/login_register/LoginRegister';
import Profile from './pages/profile/profile';
import ChatListCurrent from './components/chat/chat-list-current/ChatListCurrent';
import ToastContainer from './components/toast/ToastContainer';
import { io } from "socket.io-client";
import useForceUpdate from './hooks/useForceUpdate';
import { useSelector } from 'react-redux';
import store from './redux/store';
import { setFriendOnline } from './redux/authSlice';

function App() {
    const socket = useRef()
    const isConnectedSocketServer = useRef(false)
    const themeMode = localStorage.getItem("themeMode") === 'dark' ? ' dark' : '';
    const currentUser = useSelector(state => state.auth.login.user?.userInformation?.userId)
    const hasChatData = useSelector(state => state.chat.loadStatus) === 'OK' ? true : false
    const reRenderApp = useForceUpdate()
    if (currentUser && !isConnectedSocketServer.current) {
        socket.current = io(process.env.REACT_APP_SOCKET_URL)
        isConnectedSocketServer.current = true
        socket.current.once('serverResponseAllFriendOnline', (payload) => store.dispatch(setFriendOnline(payload)))
    }

    console.log(currentUser)

    return (
        <div className={"app"+themeMode}>
        {   
            currentUser
                ?
                <>
                    <Topbar 
                        reRenderApp={reRenderApp} socket={socket} 
                        isConnectedSocketServer={isConnectedSocketServer}
                    />
                    {
                        (currentUser && hasChatData) && <ChatListCurrent socket={socket} /> 
                    } 
                    <Routes>
                        <Route path='/' element={ <Home/> }/>
                        <Route path='/:userId' element={ <Profile reRenderApp={reRenderApp} socket={socket}/> }/>
                        <Route path='/:userId/introduce' element={ <Profile reRenderApp={reRenderApp}/> }/>
                        <Route path='/:userId/friends' element={ <Profile reRenderApp={reRenderApp}/> }/>
                        <Route path='/:userId/image' element={ <Profile reRenderApp={reRenderApp}/> }/>   
                    </Routes>
                </>
                :
                <LoginRegister />
        }
            <ToastContainer />
        </div>
    );
}

export default memo(App);
