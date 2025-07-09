import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import logo from '../../../assets/svg/logo.svg'
import { IoClose } from "react-icons/io5";
import Button from '../Input/Button';
import { ModeToggle } from '../mode-toggle';

type MenuItem = {
  label: string;
  path: string;
};

function Header() {
  const [menuVisible, setMenuVisible] = useState(false);

  const [menu] = useState<MenuItem[]>([
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Industry', path: '/industry' },
    // { label: 'Blog', path: '/blog' },
    // { label: 'Product', path: '/product' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ]);

  return (
    <div className='bg-white flex flex-row justify-between items-center  px-5 py-2 md:py-4 relative'>
      <div className='flex items-center gap-5'>
        <img src={logo} alt='Agency Logo' className='w-25 object-contain' />
      </div>

      <ul className='hidden md:flex flex-row justify-between gap-10 items-center'>
      {menu.map((item, index) => (
        <li key={index} className='relative group'>
          <NavLink
            to={item.path} 
            className={({ isActive }) =>
              `text-lg ${
                isActive ? 'text-[#6ab48d] border-b-3 border-b-[#6ab48d]' : 'text-black'
              } hover:text-[#6ab48d] ease-in transform duration-100`
            }
          >
            {item.label}
          </NavLink>
          <span
            className='absolute left-0 bottom-0 h-0.5 w-full transform scale-x-0 origin-left group-hover:scale-x-100 group-hover:bg-[#6ab48d] transition-transform duration-500 ease-in-out'
          ></span>
        </li>
      ))}
    </ul>

    <div className='md:flex gap-2 hidden'>
        <Button
          label='LOGIN'
          path='/login'
          className='bg-gradient-to-r from-[#23aa70] to-[#0e854f] text-gray-50 px-5 py-2 text-md hover:bg-gradient-to-r hover:from-[#2cc984] hover:to-[#169c60]' children={undefined}    /> 
          <ModeToggle />

    </div>
 

      {/* Mobile view */}
      <div className='flex md:hidden' onClick={() => setMenuVisible(!menuVisible)}>
        <IoMdMenu size={25} />
      </div>

     <ul
  className={`md:hidden transform transition-all duration-400 ease-in-out flex flex-col gap-5 w-full bg-black text-gray-50 p-4 absolute top-0 left-0 z-50 ${
    menuVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
  }`}
>

  <div
    className='absolute right-0 top-0 mt-10 mr-5'
    onClick={() => setMenuVisible(false)}
  >
    <IoClose size={25} />

  </div>

  <div
    className='absolute left-0 top-0 mt-10 ml-5'
    onClick={() => setMenuVisible(false)}
  >
    <ModeToggle />


  </div>
    <div className='flex flex-col mt-10'>
      {menu.map((item, index) => (
    
        <Link to={item.path} key={index}
        className='border-b w-full border-gray-500 p-2 mt-5 hover:text-[#23aa70] last:border-b-0'  onClick={() => setMenuVisible(false)}>
          {item.label}
        </Link>
    ))}
    </div>
   <div >
       <Button
            label='LOGIN'
            path='/login'
            onClick={() => setMenuVisible(false)}
            className='bg-gradient-to-r from-[#23aa70] to-[#0e854f] text-gray-50 px-5 py-2 text-md hover:bg-gradient-to-r hover:from-[#2cc984] hover:to-[#169c60]' children={undefined}/>
    </div>
</ul>

    </div>
  );
}

export default Header;
