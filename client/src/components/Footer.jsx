import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (

        <footer className="bg-white shadow dark:bg-transparent">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <p className='lg:block hidden font-bold text-sm sm:text-xl  flex-wrap sm:mx-10'>
                        <span className='text-slate-500 dark:text-slate-400'>Home</span>
                        <span className='text-slate-700 dark:text-slate-500'>Connect</span>
                    </p>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-300 mr-10">
                        <li>
                            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:underline me-4 md:me-6">Home</Link>
                        </li>
                        <li>
                            <Link href="#" className="text-gray-500 dark:text-gray-400 hover:underline me-4 md:me-6">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link href="#" className="text-gray-500 dark:text-gray-400 hover:underline me-4 md:me-6">Licensing</Link>
                        </li>
                        <li>
                            <Link to="mailto:mdemamudin726@gmail.com" className="text-gray-500 dark:text-gray-400 hover:underline">Contact</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-600 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-300">© 2024 <span href="#" >HomeConnect™</span>. All Rights Reserved.</span>
            </div>
        </footer>

  )
}

export default Footer