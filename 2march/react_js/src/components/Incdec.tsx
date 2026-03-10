import React from "react";
import { useState } from "react";

const Incdec=()=>{
    const [count,setCount]=useState(0);
    const [dec,setDec]=useState(0);
    const handleIncrement=()=>{
        setCount(count+1);
        console.log(count);
    }
    const handleDecrement=()=>{
        setDec(dec-1);
        console.log(dec);
    }
    const handleReset=()=>{
        setCount(0);
        setDec(0);
    }
    return(
        <div>
            {count}
            <button onClick={handleIncrement}>Increment</button>
            {dec}
            <button onClick={handleDecrement}>Decrement</button>
            <button onClick={handleReset}>Reset</button>
        </div>
    )
}

export default Incdec;