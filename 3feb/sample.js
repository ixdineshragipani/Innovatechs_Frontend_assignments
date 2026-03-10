// let sales=1234_56778_83434;
// let string="Typescript";
// let is_published=true;
// let level;
// console.log(typeof(level));
// let nums=[1,2,3,4,5];
// function fun(nums){
//     for(let i=0;i<nums.length;i++){
//         console.log(nums[i]);
//     }
// }
// fun(nums);
// let x=nums.forEach(n=>{
//     n=n*2
//     console.log(n);
// })
// console.log(nums);
// let user=[1,'Dinesh'];
// console.log(user[2]);
// const small=1;
// const medium=2;
// const large=3;
// const enum Size{small=3,medium,large};
// let mySize=Size.medium;
// console.log(mySize);
// function calculate(income:number,taxYear=2022):number{
//     if((taxYear)<2022){
//         return income+40000;
//     }
//     return income*2;   
// }
// console.log(calculate(60_000,2021));
//OBJECTS
// type Employee = {
//    readonly id:number,
//    name:string,
//    retire: (date:Date)=>void;
// }
//  let employee:Employee={
//     id:1,
//     name:"Dinesh",
//     retire:(date:Date)=>{
//         console.log(date);
//     }
//  };
// console.log(employee);
//Union types
// function kgToLbs(weight:number|string):number{
//    //norrowing
//    if(typeof weight==='number'){
//       return weight*2.2  
//    }
//    else{
//       return parseInt(weight)*2.2
//    }
// }
// console.log(kgToLbs(30));
// console.log(kgToLbs("30"));
//intrsection ypes
// type Draggable={
//    drag:()=>void;
// }
// type Resizable={
//    resize:()=>void
// }
// type UIWidget=Draggable&Resizable;
// let textBox:UIWidget={
//    drag:()=>{},
//    resize:()=>{}
// }
//Literal types
//literal(exact,specific)
// type Quantity=50|100;
// let quantity :Quantity = 50;
// type Metric = 'cm'|'inch';
// let height:Metric = 'cm';
//Nullable types
function greet(name) {
    if (name)
        console.log(name.toUpperCase());
    else
        console.log("Hello");
}
greet(null);
