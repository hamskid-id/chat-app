import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useSelector,useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { Header } from "./header";
import { db } from "./firebaseConfig";
import { sendPost, setDelete, setLike, setReply } from "./store/profileSlice";
import { HamburgerDiv } from "./hambuger-div";
import { collection, query, where,getDocs, onSnapshot } from "firebase/firestore";
import { loadUser, setLogOut } from "./store/authSlice";
import { Footer } from "./footer";
import { Comment } from "./comment";





export const MainPage =()=>{

    const dispatch = useDispatch();
    const [loading, setLoading]= useState(false)
    const loggedInUser = useSelector((state)=>state.auth)
    const [userProfile, setUserProfile] = useState('');
    const [userProfilePics, setUserProfilePics] = useState('');
    const [userProfileEmail, setUserProfileEmail] = useState('');
    const [postEmail, setPostEmail] = useState('');
    const [rep_info, setRep_info] = useState("none");
    const [reply, setStateReply] = useState('');
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [postId, setPostId] = useState('');
    const[paramsId, setParamsId] = useState('')
    const [postVisible, setPostVisible] = useState("none")
    const [replyId, setReplyId] = useState('');
    const [toolkit, setToolKit]= useState(false);
    
    const handleRelyId =(e)=>{
        setRep_info("block")
        setReplyId(e.fid)
    }
    const handlePost =(e)=>{
        e.preventDefault();
        if(userProfileEmail){
            console.log("this is" + userProfileEmail)
            dispatch(sendPost({
                post:post,
                poster:userProfile,
                id:postId,
                pics:userProfilePics,
            }))
            setPost("");
        }else{
            toast.error('Please log In to make a post',{
                position:"top-right",
             })
           
        }
    }
 
    const navigateToFollow=(e)=>{
        if(e.email !== loggedInUser.email){
            setPostEmail(e.email)
            console.log(postEmail)
        }else{
            toast.error('please click on profile if you would like to make some changes',{
                position:"top-right",
             })
        }
        
    }
    const handleDelete=(e)=>{
            dispatch(setDelete({
                id:e.fid,
            }))
     }
    
    const handleReply =(e)=>{
        if(userProfileEmail){
            dispatch(setReply({
                id:e.fid,
                reply:reply,
                replier:userProfile,
            }))
            setStateReply('');
            setRep_info("none");
        }else{
            toast.error('Please log In to reply',{
                position:"top-right",
             })
           
        }
        
    }

    const handleLike =(e)=>{
        if(userProfileEmail){
        dispatch(setLike({
            id:e.fid,
            like:userProfile,
        }))
        console.log("liked")
         }else{
            toast.error('Please log In to like',{
                position:"top-right",
            })
        }
    }
    
       useEffect(()=>{
        setLoading(true)
        const fetchdata = async ()=>{
            try{
                const profileRef = collection(db, "profiles")
                const pq = query(profileRef, where("email", "==", postEmail));
                const querySnapshot = await getDocs(pq);
                querySnapshot.forEach((doc) => {
                    setParamsId((doc.get('id')));
                    if(paramsId){
                         window.location.replace(`/follow/${paramsId}`)
                         console.log(paramsId)
                     }
                })
            }catch(error){
                console.log(error)
            }  
        }
        fetchdata();  
    },[paramsId,postEmail])

    useEffect(()=>{
        if(loggedInUser.loggedIn){
            const fetchdata = async ()=>{
                try{
                    const profileRef = collection(db, "profiles")
                    const pq = query(profileRef, where("email", "==", loggedInUser.email));
                    const querySnapshot = await getDocs(pq);
                    querySnapshot.forEach((doc) => {
                        if(loggedInUser.email){
                            setUserProfileEmail((doc.get('email')));
                            setUserProfilePics((doc.get('profilePics')));
                            setUserProfile((doc.get('ame')));
                            setPostId((doc.get("id")))
                        }
                    })
                }catch(error){
                    console.log(error)
                }  
            }
            fetchdata();  
        }else{
            setUserProfileEmail("");
            setUserProfilePics("");
            setUserProfile("");
            setPostId("")
        } 
       
    },[loggedInUser.loggedIn])
 

    useEffect(()=>{
        const postRef = query(collection(db, "Posts"));
        let unsubscribe = onSnapshot(postRef,(querySnapshot)=>{
            let array=[]
            querySnapshot.forEach((doc)=>{
                array.push({...doc.data(), fid:doc.id})
                
            })
            setPosts(array)
            if(posts){
                setLoading(false)
            }
        })
        return ()=>{unsubscribe()}
    },[])

   useEffect(()=>{
        if(loggedInUser.loggedIn){
            setPostVisible("block")
        }else{
            setPostVisible("none")
        }
   },[loggedInUser.loggedIn])
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
    const ChangeToolkit=()=>{
        setToolKit((prevState)=>!prevState)
        console.log(toolkit)
    }
   
    return(
        <div className="mb-5 pb-5 mt-5 pt-2">
            <Header/>
                <div>
                        <div className="container main">
                            <div className="d-flex flex-row align-items-center bg bg-white p-3 mt-2  rounded">
                                {userProfilePics &&<div className="profile-d me-2">
                                    <img className="w-100 rounded " src={userProfilePics} alt="object not found"/>
                                </div> }
                                {!userProfilePics &&  (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" className="me-3" fill="purple" viewBox="0 0 512 512">
                                            <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                    )
                                }
                                    
                                    {userProfile? <h6 className="text-magenta">{userProfile}</h6>:<p className="text-magenta">{userProfileEmail}</p>}
                                    {(!userProfile && !userProfileEmail)?<p className="text-dark mb-0 fw-bold we">welcome to WEconnect please login to start</p>:null}

                            </div>
                            <div className="p-4">
                                <h4 className="add-st fw-bold" >Add a Post</h4>
                                <form onSubmit={handlePost}>
                                    <input type="text" value={post} placeholder="what's on your mind ?" className="status-inp w-100 rounded mb-3" onChange={(e)=>setPost(e.target.value)}/><br/>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="purple" className="bi bi-camera mb-3" viewBox="0 0 16 16">
                                            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                                            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </div>
                                    <div className=" p-2 rounded d-flex">
                                        <button className="btn btn-sm bg-magenta ms-auto me-2 border border-white" >POST</button>
                                    </div>
                                </form>
                            </div>
                            <div style={{background:"grey"}} className="py-1 px-2 row  justify-content-around">
                                {loading && (
                                    <div className="spin">
                                        <div className="spinner-border" style={{width: "2rem", height: "2em" }}role="status">
                                        </div>
                                        <div className="spinner-grow" style={{width: "2rem", height: "2rem" }} role="status">
                                        </div>
                                    </div>  
                                )}
                                {!loading &&(
                                    posts.length >0? posts.map((userpost, index)=>{
                                            const {post,poster,likes,replies,time,email,fid, pics} = userpost;
                                            
                                        return(
                                            <div key={index} className="bg bg-white p-1 m-1 col-md-3" style={{display:postVisible}}>
                                                <div>
                                                <div className="d-flex flex-row justify-content-between align-items-center p-1">
                                                    <div className="d-flex flex-row align-items-center" onClick={(e)=>navigateToFollow({email})}>                                                                                       
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="gainsboro" className="me-3" viewBox="0 0 512 512">
                                                            <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                            
                                                        <div>
                                                            {poster?<h6 className="poster fw-bold text-dark">{poster}</h6>:<h6 className="poster">{email}</h6>}
                                                            <h6 className="less"> {time}</h6>
                                                        </div>
                                                        </div>
                                                    <div>
                                                    <div>
                                                        <div className="div" style={{position:"relative"}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"  viewBox="0 0 448 512"><path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z"/></svg>
                                                            <span className="div2 bg bg-white shadow rounded">
                                                                {loggedInUser.email === email?<h6 className="mb-0" onClick={(e)=>handleDelete({fid, email})} >delete</h6>:null}
                                                                {loggedInUser.email !== email?<h6 className="mb-0" onClick={()=>window.location.href="/dm"}>Dm</h6>:null}
                                                             </span>
                                                        </div>                                                         
                                                    </div>
                                                   
                                                </div>
                                            </div>
                                            <div className="py-1">
                                                    <p className="post">{post}</p>
                                                    <div className="d-flex flex-row p-1 reaction">
                                                        <div className="me-4 notification"  onClick={()=>handleLike({fid, email})}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="grey" viewBox="0 0 512 512">
                                                                <path d="M96 191.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64c17.67 0 32-14.33 32-31.1V223.1C128 206.3 113.7 191.1 96 191.1zM512 227c0-36.89-30.05-66.92-66.97-66.92h-99.86C354.7 135.1 360 113.5 360 100.8c0-33.8-26.2-68.78-70.06-68.78c-46.61 0-59.36 32.44-69.61 58.5c-31.66 80.5-60.33 66.39-60.33 93.47c0 12.84 10.36 23.99 24.02 23.99c5.256 0 10.55-1.721 14.97-5.26c76.76-61.37 57.97-122.7 90.95-122.7c16.08 0 22.06 12.75 22.06 20.79c0 7.404-7.594 39.55-25.55 71.59c-2.046 3.646-3.066 7.686-3.066 11.72c0 13.92 11.43 23.1 24 23.1h137.6C455.5 208.1 464 216.6 464 227c0 9.809-7.766 18.03-17.67 18.71c-12.66 .8593-22.36 11.4-22.36 23.94c0 15.47 11.39 15.95 11.39 28.91c0 25.37-35.03 12.34-35.03 42.15c0 11.22 6.392 13.03 6.392 22.25c0 22.66-29.77 13.76-29.77 40.64c0 4.515 1.11 5.961 1.11 9.456c0 10.45-8.516 18.95-18.97 18.95h-52.53c-25.62 0-51.02-8.466-71.5-23.81l-36.66-27.51c-4.315-3.245-9.37-4.811-14.38-4.811c-13.85 0-24.03 11.38-24.03 24.04c0 7.287 3.312 14.42 9.596 19.13l36.67 27.52C235 468.1 270.6 480 306.6 480h52.53c35.33 0 64.36-27.49 66.8-62.2c17.77-12.23 28.83-32.51 28.83-54.83c0-3.046-.2187-6.107-.6406-9.122c17.84-12.15 29.28-32.58 29.28-55.28c0-5.311-.6406-10.54-1.875-15.64C499.9 270.1 512 250.2 512 227z"/></svg> {likes.length !==0?<span>{likes.length}</span>:null} Like
                                                        </div>
                                                        <div className="me-4 notification" onClick={()=>handleRelyId({fid, email})}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="grey" viewBox="0 0 512 512">
                                                                <path d="M447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z"/></svg>{replies.length !==0?<span> {replies.length}</span>:null} comment
                                                        </div>
                                                    </div>                                           
                                                    <div className="ps-4">
                                                        {
                                                            replies && replies.map((rep, index)=>{
                                                                const {reply,replier} = rep;
                                                                
                                                                    return(
                                                                        <div key={index} className=" p-1 mt-2 rounded" onClick={()=>navigateToFollow({email})}>
                                                                           
                                                                            <div className="d-flex flex-row align-items-center rounded">
                                                                                        <div>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="gainsboro" viewBox="0 0 512 512">
                                                                                                <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                                                                        </div>
                                                                                        <div className="ms-3">
                                                                                            <h6 className="replier mb-0 fw-bold">{replier}</h6>
                                                                                            <h3  className="reply">{reply}</h3>
                                                                                        </div> 
                                                                                    </div>                                               
    
                                                                        </div>
                
                                                                    )

                                                            })
                                                   
                                                        }
                                                    
                                                    </div>
                                            </div>
                                                </div>
                                            </div>

                                        )
                                    }):<h6 className="text-center">No post has been made</h6>
                                )
                                }
                            </div>
                           
                        </div>
                </div>
                <Footer/>
                <Comment rep_info={rep_info} handleReply={handleReply} fid={replyId} reply={reply} setStateReply={setStateReply}/>
                {loggedInUser.footerBurger===true? <HamburgerDiv setter={ loggedInUser.loggedIn} handleLogOut={handleLogOut}/>:null}
        </div>
    )
}