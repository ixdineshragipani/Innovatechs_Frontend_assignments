const ages = [3, 10, 81, 20];

const myAges=[];
// console.log(ages.find(checkAge))
ages.find(checkAge)
function checkAge(age){
    if(age>18){
        myAges.push(age);
    }
}
console.log(myAges);

