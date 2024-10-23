import React from 'react'

const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => {
  return (
    <>
      <h3 className="h3-bold text-dark-600">{title}</h3>
      {subtitle && <p className="p-16-regular mt-4">{subtitle}</p>}
    </>
  )
}

export default Header