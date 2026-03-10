import axios from "axios";
import React, { useState } from "react";
import treequestions from "./treequestions.txt"


const App = () => {
	const [name, setName] = useState("");
	const [age, setAge] = useState("");
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      await axios.post("http://localhost:3000/append",{name,age});
      alert("Appended name and age to treequestions");
      setName("");
      setAge("");
    }
    catch(err){
      console.log(err);
      alert("Failed to append");
    }

  }
	return (
		<div >
			<h1>Form</h1>
      <form onSubmit={handleSubmit}>
        <p>Name</p>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
        <p>age</p>
        <input type="text" value={age} onChange={(e)=>{setAge(e.target.value)}}/>
        <br/>
        <button type="submit">Submit</button>
      </form>
		</div>
	);
};

export default App;




// const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/append", { name, age });
//       alert("Appended to treequestions.txt");
//       setName("");
//       setAge("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to append");
//     }
//   };

//   return (
//     <div>
//       <h1 className="bg-red-200">Form</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Name</label>
//           <input
//             id="name"
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="age">Age</label>
//           <input
//             id="age"
//             type="text"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//           />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>




// import logo from './logo.svg';
// import './App.css';
// import { useState } from 'react';
// import react from 'react';
// import axios from 'axios';

// function App() {
//  const [selectedFile,setSelectedFile]=useState(null);
//  const onFileChange=(e)=>{
//   setSelectedFile(e.target.files[0]);
//  }
//  const onFileUpload=()=>{
//   const formData=new FormData();
//   formData.append("myfile",selectedFile,selectedFile.name);
//   console.log(selectedFile);
//   axios.post(`./treequestions.txt`,formData)
//  }
//  const fileData=()=>{
//   if(selectedFile){
//     return(
//       <div>
//         <h2>File Upload:</h2>
//         <p>File Name: {selectedFile.name}</p>
//         <p>File Size: {selectedFile.size}</p>
//         <p>File Type: {selectedFile.type}</p>
//         <p>Last modified: {selectedFile.lastModifiedDate.toDateString()}</p>
//       </div>
//     )
//   }
//   else{
//     return (
// 				<div>
// 					<br />
// 					<h4>Choose before Pressing the Upload button</h4>
// 				</div>
// 			);
//   }
//  }
//     return (
//         <div>
// 			<h1>GeeksforGeeks</h1>
// 			<h3>File Upload using React!</h3>
// 			<div>
// 				<input type="file" onChange={onFileChange} />
// 				<button onClick={onFileUpload}>Upload!</button>
// 			</div>
// 			{fileData()}
// 		</div>
//     );
// }

// export default App;
