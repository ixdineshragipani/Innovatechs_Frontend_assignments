// const fun1=async ()=>{
//     try{
//         let promise= await new Promise((res,rej)=>{
//             setTimeout(()=>{
//                 const suc=true;
//                 if(suc){
//                     res("Success");
//                 }
//                 else{
//                     rej(new Error("Error"));
//                 }
//             },4000);
//         });
//         await console.log(promise);
//         // return promise;
//     }
//     catch(e){
//         console.log("Error");
//     }
// }

// fun1();

const apicall =async()=> {
    try{
        let call=await new fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(e=>e.json());
        console.log(call);

    }
    catch(e){
        console.log("There is an error");
    }
}

apicall();