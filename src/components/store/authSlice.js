import { createSlice} from '@reduxjs/toolkit';


const auth_Slice = createSlice({
    name:"auth",
    initialState: {
       token :JSON.parse(localStorage.getItem('apptoken')),
       userProfile:{},
       post:[],
        name:'',
        email:'',
        _id:'',
        registerError:'',
        footerBurger:false,
        loggedIn:false,
       LoginError:'',
       userLoaded:false,
    },
    reducers:{

        setFooterBurger(state, action){
            state.footerBurger = !state.footerBurger;
        },
        setLogOut(state, action){
            state.loggedIn = false
        },
       
        loadUser(state,action){
            const token = state.token
            console.log(token)
            if(token !== null){
                state.email = token.email;
                state.name = token.name;
                state.loggedIn = true
                console.log(state.loggedIn)
            }
        }
    }
   
})

export const {loadUser,setLogOut, setFooterBurger} = auth_Slice.actions
export default auth_Slice;