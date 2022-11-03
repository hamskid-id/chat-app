import React from'react';
export const Comment=({rep_info, handleReply,fid,reply,setStateReply})=>{
    return(
        <div className="p-4 reply-sect bg bg-white" style={{display:rep_info}}>
                <label htmlFor="reply">Reply:</label>
                <input name="reply" className="rounded" style={{border:'none',background:'ghostwhite'}} type="text"value={reply} onChange={(e)=> setStateReply(e.target.value)}/>
                <button className="btn btn-sm bg-magenta" onClick={()=>handleReply({fid})}>post</button>                                                      
        </div>

    )
}