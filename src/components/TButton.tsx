import React from 'react'


export default function TButton(props) {
  
  return (
    <button
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer"
      onClick={props.onClick}>
      {props.children}
    </button>
  )
}
