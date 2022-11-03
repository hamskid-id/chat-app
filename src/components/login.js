import { useState} from 'react';
import { Link } from "react-router-dom";
import { getAuth,onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const LogInPage =()=>{
   
    const [loading,setLoading]= useState(false);
    const [errorMessage, setErrorMessage]= useState("");
    const auth = getAuth();
    const [user, setUser] = useState({
        email:"",
        password:""
    });

    const handleSubmit =(e)=>{
        e.preventDefault();    
        setLoading(true)
        signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false)
            const errorMessage = error.message;
            setErrorMessage(errorMessage)
        });
        
        onAuthStateChanged(auth, (user)=>{
            if(user && localStorage){
                console.log(user)
                const profileRef = collection(db, "profiles")
                const pq = query(profileRef, where("email", "==", user.email));
                onSnapshot(pq,(querySnapshot)=>{
                    querySnapshot.forEach((doc)=>{
                        localStorage.setItem("apptoken",JSON.stringify({
                            email:user.email,
                            name:doc.get('ame')
                        }))
                    })
                    window.location.replace('/') 
                })
                    
                
            }
        })
    }
  
    return(
        <div className="container profile-p">
            <form className="login-wrapper m-auto" onSubmit={handleSubmit}>
                <h3 className='text-center h4'>Login</h3>
                <p><input className="w-100" type="email" name="email"  placeholder="Enter your email" onChange={(e)=>setUser({...user, email:e.target.value})} required/></p>
                <p><input  className="w-100" type="password" name="password" placeholder="Enter your password" onChange={(e)=>setUser({...user,password:e.target.value})} required/></p>
                <button className="btn btn-success w-100">{loading?<h6>submitting...</h6>:<h6>submit</h6>}
                </button>
                {errorMessage?<p>{errorMessage}</p>:null}
            </form>
            <div className='account-w m-auto'>
                <div className="mt-2">
                    <label htmlFor="register">Dont have an account?</label>
                    <Link to="/register" className="btn btn-primary btn btn-sm ">register</Link>
                </div> 
            </div>

          
        </div>
    )
}