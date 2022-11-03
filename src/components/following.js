import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db } from "./firebaseConfig";
import { collection, query, where, onSnapshot,getDocs } from "firebase/firestore";
import { Footer } from "./footer";
import { Header } from "./header";
import { getAuth, signOut } from "firebase/auth";
import { setLogOut } from "./store/authSlice";
import { HamburgerDiv } from "./hambuger-div";

export const Following =()=>{
    const dispatch= useDispatch();
    const [following, setFollowing] = useState([])
    const [profilePics, setProfilePics] = useState('')
    const [paramsId,setParamsId] = useState('')
    const [name,setName] = useState('')
    const [isLoading, setIsLoading]= useState(false)
    const loggedInUser = useSelector((state)=>state.auth)

            useEffect(()=>{
                setIsLoading(true)
                const profileRef = collection(db, "profiles");
                const q = query(profileRef, where("email", "==", loggedInUser.email));
                let unsubscribe = onSnapshot(q,(querySnapshot)=>{
                querySnapshot.forEach((doc) => {
                    setFollowing(doc.get("following"))
                    setProfilePics(doc.get('profilePics'))
                })
                setIsLoading(false)
            })
            return ()=>{unsubscribe()}
            },[loggedInUser.email])
            useEffect(()=>{
               
                const fetchdata = async ()=>{
                    try{
                        const profileRef = collection(db, "profiles")
                        const pq = query(profileRef, where("ame", "==", name));
                        const querySnapshot = await getDocs(pq);
                        querySnapshot.forEach((doc) => {
                            setParamsId((doc.get('id')));
                            console.log("clicked")
                            console.log(paramsId)
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

            },[name])

            const navigateToFollowing =(e)=>{
                setName(e.follow)
            }
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

    return(
        <div>
            <Header/>
            {
                isLoading ? <p className="mt-5 pt-5 p-2">fetching...</p>:(
                    <div  className="mt-5 pt-5 p-2" >
                        {
                            following && (
                                following.map((follow,index)=>{
                                    return(

                                        <div  key={index} className="d-flex flex-row align-items-center mb-1" onClick={(e)=>{navigateToFollowing({follow})}}>
                                            
                                           
                                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="gainsboro" className="me-3" viewBox="0 0 512 512">
                                            <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
                                            <div>
                                                <h6 className="mb-0">{follow}</h6>
                                            </div>
                                        </div>
                                    )
                                })
                            )   
                        }
                        {following.length ===0?<p className="text-center pt-5 mt-5">No one has followed you</p>:null}
                        </div>
                )
            }
            <Footer/>
            {loggedInUser.footerBurger===true? <HamburgerDiv setter={ loggedInUser.loggedIn} handleLogOut={handleLogOut}/>:null}
        </div>
    )
}