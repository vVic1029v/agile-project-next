import React from "react";
import NavBar from "./NavBar";
const BodyComponent = ({children}: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div className='"w-full h-screen flex '>
      <div className="w-1/6">
      <NavBar/>
      </div>
      <div className="w-5/6">
      {children}
      </div>
  
 
      {/* <div className=" w-full flex gap-10 mt-[-50]">
        <div className="max-w-1/3 ml-5 ">
        <NavBar/>
        </div>
     <div className="p-2 w-2/3">
     {children}
     </div>
     
     
      </div> */}
       
     
      </div>
  )
}

export default BodyComponent