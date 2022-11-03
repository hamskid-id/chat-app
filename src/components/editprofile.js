import {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setEditProfile } from './store/profileSlice';
import { storage,db } from './firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, query, where,getDocs} from "firebase/firestore";
import { Header } from './header';
import { Footer } from './footer';

export const EditProfile =()=>{

    const auth = useSelector((state)=>state.auth)
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        username:"",
        userpicture:{},
        usercity:"",
        about:""
    });
    const [userId, setId] =useState('')
    const[isLoading, setIsLoading] = useState(false);

    const handleSubmit =(e)=>{
        setIsLoading(true);
        e.preventDefault();
        const storageRef= ref(storage, user.userpicture.name);
        const uploadTask = uploadBytesResumable(storageRef,user.userpicture);
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
                (error) => {
                   console.log(error)
                }, 
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                        dispatch(setEditProfile({
                            name:user.username,
                            city:user.usercity,
                            about:user.about,
                            picture:downloadURL,
                            id:userId
                        }))
                        
                    });
                    setIsLoading(false);
                    toast.error('Update succesfull',{
                        position:"top-right",
                    })
                }
            );
    }

    useEffect(()=>{
        
        const fetchdata = async ()=>{
            try{

                const profileRef = collection(db, "profiles");
                const pq = query(profileRef, where("email", "==", auth.token.email));
                const pquerySnapshot = await getDocs(pq);
                pquerySnapshot.forEach((doc) => {
                    setId((doc.id));
                    console.log(userId)
                 })
               
            }catch(error){
                console.log(error)
            }  
        }
        fetchdata();
       
        
    })
    return(
        <div>
            <Header/>
            <Footer/>
            <div className="container border profile-p mt-5">
                <form className="login-wrapper m-auto" onSubmit={handleSubmit}>
                    <h3 className='text-center h4'>Create A profile</h3>
                    <p><input className="w-100" type="text" name="userName"  placeholder="Enter your name" onChange={(e)=>setUser({...user, username:e.target.value})} required/></p>
                    <p><input  className="w-100" type="file" name="password" placeholder="Upload your picture" onChange={(e)=>setUser({...user,userpicture:e.target.files[0]})} required/></p>
                    <p><input  className="w-100" type="text" name="city" placeholder="Enter your city" onChange={(e)=>setUser({...user,usercity:e.target.value})} required/></p>
                    <p><input  className="w-100" type="text" name="about" placeholder="Say something about yourself" onChange={(e)=>setUser({...user,about:e.target.value})} required/></p>
                    {isLoading?<button className="btn btn-success w-100">Submit...</button>:<button className="btn btn-success w-100">Submit</button>}
                </form>
            </div>
        </div>
        
    )
}