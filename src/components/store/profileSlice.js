import { createSlice} from '@reduxjs/toolkit';
import {db} from '../firebaseConfig';
import { toast } from 'react-toastify';
import { collection, addDoc, updateDoc, doc,deleteDoc, arrayUnion, } from "firebase/firestore"

const profile_Slice = createSlice({
    name:"profile",
    initialState: {
        token : localStorage.getItem("apptoken")? JSON.parse(localStorage.getItem("apptoken")):[],
        username:'',
        picture:{},
        city:'',
        profilePost:[]
    },
    reducers:{
       
        setProfile(state, action){
            const name = action.payload.name
            const city = action.payload.city
            const about = action.payload.about
            const picture = action.payload.picture
            const id = action.payload.id
            console.log(state.token)
            updateDoc(doc(db, "profiles", id), {
                ame: name,
                city: city,
                about:about,
                profilePics: picture,
              }).then(()=>{
                const uploaded = "successful"
                toast.success('profile successful',{
                  position:"top-right",
               })
                if(uploaded  === "successful"){
                   window.location.replace('/');
                }
              }).catch((error)=>{
                toast.error('something went wrong',{
                  position:"top-right",
               })
              })
             
        },
        setEditProfile(state, action){
            const name = action.payload.name
            const city = action.payload.city
            const about = action.payload.about
            const picture = action.payload.picture
            const id = action.payload.id
            updateDoc(doc(db, "profiles", id), {
                ame: name,
                city: city,
                about:about,
                profilePics: picture,
              }).then(()=>{
                const uploaded = "successful"
                toast.success('profile successful',{
                  position:"top-right",
               })
                if(uploaded  === "successful"){
                   window.location.replace('/');
                }
              }).catch((error)=>{
                toast.error('something went wrong',{
                  position:"top-right",
               })
              })

              updateDoc(doc(db, "Posts", id), {
                poster: name,
                pics: picture,
              }).then(()=>{
                const uploaded = "successful"
                toast.success('profile successful',{
                  position:"top-right",
               })
                if(uploaded  === "successful"){
                   window.location.replace('/');
                }
              }).catch((error)=>{
                toast.error('something went wrong',{
                  position:"top-right",
               })
              })
      },
     sendPost(state,action){
        const post = action.payload.post;
        const poster = action.payload.poster;
        const id = action.payload.id;
        const pics = action.payload.pics;
        addDoc(collection(db, "Posts"), {
          post: post,
          poster: poster,
          replies:[],
          replier:[],
          likes: [],
          id:id,
          pics:pics,
          email:state.token.email,
          time:new Date().getDate()
        }).then(()=>{
        }).catch((error)=>{
          
        })
      },
      setDelete(state,action){
        const postId = action.payload.id;
        const postRef = doc(db, 'Posts',postId);
          deleteDoc( postRef)
          .then(()=>{
          })
          .catch((error)=>{
          })
      },
      setLike(state,action){
        const like = action.payload.like;
        const postId = action.payload.id;
        const postRef = doc(db, 'Posts',postId);
          updateDoc( postRef,{
            likes:arrayUnion(like)
          })
          .then(()=>{
            
          })
          .catch((error)=>{
            alert(error);
          })


      },
      setReply(state,action){
        const reply = action.payload.reply;
        const replier = action.payload.replier;
        const postId = action.payload.id;
        const postRef = doc(db, 'Posts',postId);
          updateDoc( postRef,{
            replies:arrayUnion({reply:reply,replier:replier}),
          })
          .then(()=>{
           
          })
          .catch((error)=>{
            alert(error);
          })

      },
      setFollow(state, action){
        const following = action.payload.following
        const follower = action.payload.follower
        const userId = action.payload.id
        const followerId = action.payload.followerId
        const followerRef =  doc(db, 'profiles',followerId)
        const userRef = doc(db, 'profiles',userId)
        if(following && follower && userId){
          updateDoc( userRef,{
            follower:arrayUnion(follower),

          })
          .then(()=>{
            toast.success(`you followed ${following}`,{
              position:"top-right",
           })
          })
          .catch((error)=>{
            toast.error('something went wrong',{
              position:"top-right",
           })
          })
          updateDoc( followerRef,{
            following:arrayUnion(following),
          })
          .then(()=>{
            
          })
          .catch((error)=>{
            alert(error);
          })
        }
          

      }
    }
})

export const {setProfile,setEditProfile, sendPost,uploadReplies,setFollower,setFollowing, setDelete, setLike,setReply,setFollow} = profile_Slice.actions
export default profile_Slice;