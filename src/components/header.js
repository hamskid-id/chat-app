import { Link } from "react-router-dom";
import { useSelector,useDispatch} from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { setFooterBurger, setLogOut } from "./store/authSlice";

export const Header =()=>{
    const dispatch = useDispatch()
    const loggedInUser = useSelector((state)=>state.auth);
    const handleLogOut=()=>{
        const auth = getAuth();
        signOut(auth).then(() => {
            localStorage.removeItem("apptoken")
            console.log(localStorage)
            dispatch(setLogOut(null))
            alert("loggged Out")
        }).catch((error) => {
            alert(error);
        });
       
    }
    const showBurgerDiv=()=>{
        dispatch(setFooterBurger(null));
    }
    return(
        <div className="container-fluid bg bg-magenta header px-2">
            <div className="d-flex flex-row justify-content-between py-2 align-items-center justify-content-center text-white">
                <div className="ms-2 d-flex flex-row align-items-center col-md-3 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="purple" className="bi bi-share me-2 bg bg-white rounded p-1" viewBox="0 0 16 16">
                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                    </svg>
                    <div className="d-flex flex-row align-items-center mt-2">
                         <h5 className="connect header-text">WE Connect</h5>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="links flex-row justify-content-between">
                        <h6 onClick={()=>window.location.href="/"}>Home</h6>
                        <h6 onClick={()=>window.location.href="/profile"}>Profile</h6>
                        <h6 onClick={()=>window.location.href="/following"}>Following</h6>
                        <h6 onClick={()=>window.location.href="/follower"}>Follower</h6>
                    </div>
                </div>
                <div>
                    <button className="btn btn-md hamburger border p-1 px-2"    onClick={showBurgerDiv}>
                    <svg xmlns="http://www.w3.org/2000/svg"  width="20" height="20" fill="white" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                    </button>
                    
                    <div className="me-2 auth">
                        {
                            loggedInUser.loggedIn &&<button className="btn btn-sm btn btn-white bg bg-white border  head-btn header-text" onClick={handleLogOut}>
                                <svg xmlns="http://www.w3.org/2000/svg"  width="20" height="20" fill="purple" viewBox="0 0 512 512"><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
                    </svg>   Log Out</button>
                        }
                        {!loggedInUser.loggedIn && <Link to="/login" className="btn btn-sm btn btn-white bg bg-white border  head-btn header-text">
                        <svg xmlns="http://www.w3.org/2000/svg"  width="20" height="20" fill="purple" viewBox="0 0 512 512"><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
                    </svg>  SIGN IN</Link>}
                    
                    </div>
                </div>
                
            </div>
        </div>
    )
}