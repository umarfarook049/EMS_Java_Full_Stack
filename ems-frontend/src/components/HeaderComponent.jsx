import React from 'react'

const HeaderComponent = () => {
  return (
    <div>
      <header>
        <nav className='navbar navbar-expand-lg navbar-dark bg-black shadow'>
          <div className='container'>
            <a className='navbar-brand' href="#" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              <i className='fas fa-users' style={{ marginRight: '10px' }}></i> {/* Optional icon */}
              Employee Management System
            </a>
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse justify-content-end' id='navbarNav'>
              <ul className='navbar-nav'>
                <li className='nav-item'>
                  <a className='nav-link' href='#' style={{ marginRight: '20px' }}>Home</a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' href='#' style={{ marginRight: '20px' }}>About</a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' href='#'>Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default HeaderComponent
