import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "./firebaseConfig";
import { setFollow } from "./store/profileSlice";
import { collection, query, where, getDocs,onSnapshot} from "firebase/firestore";



export const Follow =()=>{
    const dispatch =useDispatch()
    const {id} = useParams()
    const auth = useSelector((state)=>state.auth);
    const [userProfile, setUserProfile] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [posts,setPosts] = useState([]);
    const [followId,setFollowId] = useState('');
    const [profilePics, setProfilePics] = useState('')
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [followerId,setFollowerId] = useState([])
    const [about, setAbout]= useState('')


    const handleFollow =()=>{
        if(userEmail){
        dispatch(setFollow({
            follower:auth.name,
            following:userProfile,
            id:followId,
            followerId:followerId
        }))
    }else{
        toast.error('Please log In to follow',{
            position:"top-right",
         })
       
    }
    }

    useEffect(()=>{
        const fetchdata = async ()=>{
            try{
                const profileRef = collection(db, "profiles")
                const q = query(profileRef, where("id", "==", id.toString()))
                const followerq = query(profileRef, where("email", "==", auth.email))
                const followerQuerySnapshot = await getDocs(followerq);
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setFollowId(doc.id)
                    setUserEmail(doc.get("email"))
                    setUserProfile(doc.get("ame"))
                    setFollowers(doc.get("follower"))
                    setFollowing(doc.get("following"))
                    setProfilePics(doc.get("profilePics")) 
                    setAbout(doc.get('about'))
                })
                followerQuerySnapshot.forEach((doc) => {
                    setFollowerId(doc.id)
                })
            }catch(error){
                console.log(error)
            }  
        }
        fetchdata();  
    })
    useEffect(()=>{
        
        const postRef = collection(db, "Posts")
        const pq = query(postRef, where("id", "==", id.toString()))
        let unsubscribe = onSnapshot(pq,(querySnapshot)=>{
            let array=[]
            querySnapshot.forEach((doc)=>{
                array.push({...doc.data(), fid:doc.id})
                setPosts(array)
                console.log(posts)
                
            })
            
        })
        return ()=>{unsubscribe()}
    },[])

    return(
        <div className="container-fluid profileBg pt-3">
            <div className="container border profile rounded  bg bg-white">
                <p className="text-magenta text-center fs-5 fw-bold p-3">Profile</p>
                <div>
                    <div className="d-flex profile-info  justify-content-between p-3">
                        <div className="d-flex profile-info w-50">
                            <div className="w-25 me-4">
                            {profilePics?<img className="w-100 rounded" src={profilePics} alt="object not found"/>:<h6>update profile</h6>}
                            </div>
                            <div className="w-75 bimbo">
                                <h6 className="poster">{userProfile}</h6>
                               <h6 className="email">{userEmail}</h6>
                            </div> 
                        </div>
                        <div>
                            <button className="btn btn-sm bg-magenta" onClick={handleFollow}>Follow</button>
                        </div>
                    </div>
                    <div>
                        {userProfile?<h6 className="about fw-bold">Hi Im {userProfile}</h6>:<h6>Hi Im Username</h6>}
                        {about? <h6>{about}</h6>:<h6 className="about-date">No About Info</h6>}
                    </div>

                    <div>
                        <ul className="nav nav-pills mb-3  d-flex flex-row shadow justify-content-between profile-navpills navpills-pad rounded" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link navpills-pad active" id="pills-post-tab" data-bs-toggle="pill" data-bs-target="#pills-post" type="button" role="tab" aria-controls="pills-post" aria-selected="true">POST</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link navpills-pad" id="pills-following-tab" data-bs-toggle="pill" data-bs-target="#pills-following" type="button" role="tab" aria-controls="pills-following" aria-selected="false">FOLLOWING</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link navpills-pad" id="pills-followers-tab" data-bs-toggle="pill" data-bs-target="#pills-followers" type="button" role="tab" aria-controls="pills-followers" aria-selected="false">FOLLOWERS</button>
                            </li>
                        </ul>
                        <div className="tab-content " id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-post" role="tabpanel" aria-labelledby="pills-post-tab">
                               
                
                
                    {
                        posts.length >0? posts.map((userpost, index)=>{
                                const {post,poster,likes,replies, time,email,pics} = userpost;
                                
                            return(
                                <div key={index} className="my-2 bg bg-white p-1 m-1 mb-2">
                                        <div className="d-flex flex-row justify-content-between align-items-center p-1">
                                            <div className="d-flex flex-row align-items-center">                                                                                              
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="gainsboro" className="me-3" viewBox="0 0 512 512">
                                                        <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                                        
                                                <div>
                                                    {poster?<h6 className="poster fw-bold text-dark">{poster}</h6>:<h6 className="poster">{email}</h6>}
                                                    <h6 className="less"> {time}</h6>
                                                </div>

                                                </div>
                                            <div>
                                        
                                        </div>
                                    </div>
                                    <div className="py-1">
                                            <p className="post">{post}</p>
                                            <div className="d-flex flex-row p-1 reaction">
                                                <div className="me-4 notification" >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="grey" viewBox="0 0 512 512">
                                                        <path d="M96 191.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64c17.67 0 32-14.33 32-31.1V223.1C128 206.3 113.7 191.1 96 191.1zM512 227c0-36.89-30.05-66.92-66.97-66.92h-99.86C354.7 135.1 360 113.5 360 100.8c0-33.8-26.2-68.78-70.06-68.78c-46.61 0-59.36 32.44-69.61 58.5c-31.66 80.5-60.33 66.39-60.33 93.47c0 12.84 10.36 23.99 24.02 23.99c5.256 0 10.55-1.721 14.97-5.26c76.76-61.37 57.97-122.7 90.95-122.7c16.08 0 22.06 12.75 22.06 20.79c0 7.404-7.594 39.55-25.55 71.59c-2.046 3.646-3.066 7.686-3.066 11.72c0 13.92 11.43 23.1 24 23.1h137.6C455.5 208.1 464 216.6 464 227c0 9.809-7.766 18.03-17.67 18.71c-12.66 .8593-22.36 11.4-22.36 23.94c0 15.47 11.39 15.95 11.39 28.91c0 25.37-35.03 12.34-35.03 42.15c0 11.22 6.392 13.03 6.392 22.25c0 22.66-29.77 13.76-29.77 40.64c0 4.515 1.11 5.961 1.11 9.456c0 10.45-8.516 18.95-18.97 18.95h-52.53c-25.62 0-51.02-8.466-71.5-23.81l-36.66-27.51c-4.315-3.245-9.37-4.811-14.38-4.811c-13.85 0-24.03 11.38-24.03 24.04c0 7.287 3.312 14.42 9.596 19.13l36.67 27.52C235 468.1 270.6 480 306.6 480h52.53c35.33 0 64.36-27.49 66.8-62.2c17.77-12.23 28.83-32.51 28.83-54.83c0-3.046-.2187-6.107-.6406-9.122c17.84-12.15 29.28-32.58 29.28-55.28c0-5.311-.6406-10.54-1.875-15.64C499.9 270.1 512 250.2 512 227z"/></svg> {likes.length !==0?<span>{likes.length}</span>:null} Like
                                                </div>
                                                <div className="me-4 notification">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="grey" viewBox="0 0 512 512">
                                                        <path d="M447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z"/></svg>{replies.length !==0?<span> {replies.length}</span>:null} comment
                                                </div>
                                            </div>                                           
                                            <div className="ps-4">
                                                {
                                                    replies && replies.map((rep, index)=>{
                                                        const {reply,replier} = rep;
                                                        
                                                            return(
                                                                <div key={index} className=" p-1 mt-2 rounded">
                                                                    
                                                                    <div className="d-flex flex-row align-items-center rounded">
                                                                                <div>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="gainsboro" className="me-3" viewBox="0 0 512 512">
                                                                                        <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                                                                </div>
                                                                                <div>
                                                                                    <h6 className="replier mb-0  fw-bold">{replier}</h6>
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

                                )
                            }):<h6 className="text-center">No post has been made</h6>

                    }
                            </div>
                            <div className="tab-pane fade" id="pills-following" role="tabpanel" aria-labelledby="pills-following-tab">
                                {
                                    following && (
                                        following.map((follow, index)=>{
                                            return(
    
                                                <div key={index} className="mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="gainsboro" className="me-3" viewBox="0 0 512 512">
                                                        <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                                    <span>{follow}</span>
                                                </div>
                                            )
                                        })
                                    )

                                }{following.length ===0?<p>You've followed no one</p>:null}
                                                           
                            </div>
                            <div className="tab-pane fade" id="pills-followers" role="tabpanel" aria-labelledby="pills-followers-tab">
                                 {
                                    followers && (
                                        followers.map((follow,index)=>{
                                            return(
    
                                                <div key={index} className="mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="gainsboro" className="me-3" viewBox="0 0 512 512">
                                                        <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                                    <span>{follow}</span>
                                                </div>
                                            )
                                        })
                                    )

                                }{followers.length ===0?<p>You curently have no follower</p>:null}
                            </div>
                        </div>
                    </div>

                </div>
                
                <Link to="/" className="btn bg-magenta btn-sm ms-2 my-3">Back to the home page</Link>
            </div>
        </div>

    )
}