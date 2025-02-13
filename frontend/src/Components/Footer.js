import React from 'react'

const Footer = () => {
  return (
    <footer className="container d-flex flex-wrap justify-content-between align-items-center pt-2 mt-5 py-3 my-4 border-top">
    <div className="col-md-4 d-flex align-items-center">
      <a
        href="/"
        className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
      >
        Elite Market
      </a>
      <span className="text-muted">© 2025 Company, Inc</span>
    </div>

    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
      <li className="ms-3">
      <a className="text-muted" href="#">
          <i className="fa-brands fa-facebook fa-2xl"></i>
        </a>
      </li>
      <li className="ms-3">
      <a className="text-muted" href="#">
          <i className="fa-brands fa-instagram fa-2xl"></i>
        </a>
      </li>
      <li className="ms-3">
        <a className="text-muted" href="#">
          <i className="fa-brands fa-twitter fa-2xl"></i>
        </a>
      </li>
    </ul>
  </footer>
  )
}

export default Footer