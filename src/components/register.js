import React,{useState} from "react";
import { db } from "./firebaseConfig";
import { getAuth,createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc} from "firebase/firestore";

export const RegisterUser =()=>{

    const auth = getAuth();
    const [loading,setLoading]= useState(false);
    const [errorMessage, setErrorMessage]= useState("");
    const [user, setUser] = useState({
        email:"",
        password:"",
        name:""
    });

    const handleSubmit=(e)=>{
        setLoading(true)
        e.preventDefault();
        createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
            addDoc(collection(db, "profiles"), {
                ame:user.name,
                city: "",
                email:user.email,
                profilePics: "",
                id:new Date().getTime().toString(),
                follower:[],
                following:[]
                }).then(()=>{
                setLoading(false)
                }).then(()=>{
                    localStorage.setItem("apptoken",JSON.stringify( {
                        email:user.email,
                        name:user.name
                    }))
                    console.log("data created")
                    if(localStorage){
                        window.location.replace('/login')
                    } 
                }).catch((error)=>{
                    alert(error);
                 })
                })
                .catch((error) => {
                    setLoading(false)
                    const errorMessage = error.message;
                    setErrorMessage(errorMessage)
                });
        
    }

    return(
        <div className="container profile-p">
            <form className="register-wrapper m-auto" onSubmit={handleSubmit}>
                <h3 className="text-center h4">Register</h3>
                <p><input className="w-100" type="text" name="name"  placeholder="Enter your name" onChange={(e)=>setUser({...user,name:e.target.value})} required/></p>
                <p><input className="w-100" type="email" name="email"  placeholder="Enter your email" onChange={(e)=>setUser({...user,email:e.target.value})} required/></p>
                <p><input  className="w-100" type="password" name="password"  placeholder="Enter your password" onChange={(e)=>setUser({...user,password:e.target.value})}/></p>
                <button className="btn btn-success w-100">{loading?<h6>submitting...</h6>:<h6>submit</h6>}
                </button>
                {errorMessage?<p>{errorMessage}</p>:null}
               
            </form>
        </div>
    )
}