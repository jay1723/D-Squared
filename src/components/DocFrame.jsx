import React, { useState, useEffect, useRef } from "react"; 
import { useRootContext } from "../context.js";

export default function DocFrame(){
    const { state, dispatch } = useRootContext(); 
    return (
        <iframe src={"http://localhost:4000/filing?url="+state.curFiling}></iframe>
    );
}
