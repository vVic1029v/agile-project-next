import Link from "next/link";
import React from "react"
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { MdClass } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { GrAnnounce } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";



const menuItems=[
  {  
    items: [
        {
          icon: <FaHome></FaHome>,
          label: "Home",
          href: "/",
          visible: ["admin", "teacher", "student", "parent"],
        },
      
        {
          icon: <MdClass/>,
          label: "Classes",
          href: "/list/classes",
          visible: ["admin", "teacher"],
        },
       
        {
          icon: <FaBook/>,
          label: "Exams",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: <MdAssignment/>,
          label: "Assignments",
          href: "/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        
        {
          icon: <FaPeopleGroup/>,
          label: "Attendance",
          href: "/list/attendance",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: <FaCalendarAlt/>,
          label: "Events",
          href: "/list/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: <MdMessage/>,
          label: "Messages",
          href: "/list/messages",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: <GrAnnounce/>,
          label: "Announcements",
          href: "/list/announcements",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
            icon: <IoPersonSharp/>,
            label: "My Account",
            href: "/list/myaccount",
            visible: ["admin", "teacher", "student", "parent"],
          },
      ]
    }
];
const NavBar = () => {

   
  return (
    <div className='mt-[-50] text-sm mt-28  ml-[-17] rounded-md p-3'>
      
        {menuItems.map((i)=>(
                <div className="flex flex-col gap-2 p-5">
                    <span className="hidden lg:block text-gray-400 font-light my-4">
                      
                    </span>
                    <h1 className=" decoration-sky-500-black  text-2xl mb-3">EdConnect</h1>
                {i.items.map((item)=>(
                    <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 text-base">
                        <span>{item.icon}</span>
                    
                        <span>{item.label}</span>
                    </Link>
                ))}
                </div>
        ))}
    </div>
  )
}

export default NavBar