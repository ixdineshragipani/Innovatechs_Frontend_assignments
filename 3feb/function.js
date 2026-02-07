

const fun1=()=>{
    console.log("This is arrow function");  //this is arrow function and it is the fastest
}
fun1();
setTimeout(fun1,2000)
var clear=setInterval(fun,400);
setTimeout(()=>{
    clearInterval(clear);
},2000)
function fun(){
    console.log("this is a normal function without arrow"); 
}
fun()