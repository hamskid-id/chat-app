import './App.css';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { MainPage } from './components/mainpage';
import { Profile } from './components/profile';
import { LogInPage } from './components/login';
import { RegisterUser } from './components/register';
import store from './components/store';
import { Provider } from 'react-redux';
import { CreateProfile } from './components/createprofile';
import { EditProfile } from './components/editprofile';
import { Follow } from './components/follow';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Followers } from './components/follower';
import { Following } from './components/following';
import { Dm } from './components/dm';



function App(){
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route exact path='/' element={ <MainPage/> }/>
          <Route  path='/profile' element={ <Profile/> }/>
          <Route  path='/login' element={ <LogInPage/> }/>
          <Route  path='/register' element={ <RegisterUser/> }/>
          <Route path='/createProfile' element={ <CreateProfile/> }/>
          <Route  path="/editProfile" element={<EditProfile/>}/>
          <Route  path="/follower" element={<Followers/>}/>
          <Route  path="/following" element={<Following/>}/>
          <Route  path="/follow/:id" element={<Follow/>}/>
          <Route  path="/dm" element={<Dm/>}/>
          
        </Routes>
      </Router>
      <ToastContainer/>
    </Provider>
      
  );
}

export default App;

