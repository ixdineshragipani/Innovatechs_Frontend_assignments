// variables

var a=10;
console.log(a);

let x=12;
console.log(x);

const p="Dinesh";
console.log(p);

console.log(typeof(a));
console.log(typeof(x));
console.log(typeof(p));

//Operators

let h=2;
var k=3;
console.log(h===k);

console.log(h!==k);

console.log(h>k);

console.log(h<k);

console.log(h>=k);

console.log(h<=k);

console.log(h||k);

if(h>k){
    console.log("H is greater than K");
}
else if (h==k){
    console.log("H is equal to K");
}
else{
    console.log("H is less than K");
}

switch(h==k){
    case(true):
    console.log("H is equal to k");
    break;
    case(false):
    console.log("H is not equal to k");
    break;
    default:
        console.log("Everything is done");
}

//loops

for(let i=0;i<10;i++){
    console.log(i);
}

while(h<3){
    console.log(h);
    h++;
}

do{
    console.log(h);
    h++;
}while(h==4)


