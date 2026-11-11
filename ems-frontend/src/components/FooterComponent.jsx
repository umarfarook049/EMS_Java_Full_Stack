import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <footer className="app-footer mt-auto">
      <div className="container text-center">
        <span>
          Copyright &#169; {new Date().getFullYear()}{" "}
          <a
            href="https://umarsportfolio.com"
            className="app-footer-link fw-bold"
          >
            ems.com
          </a>{" "}
          | All rights reserved
        </span>

        <div className="app-footer-social mt-3">
          <a href="https://github.com/umarfarook049" aria-label="GitHub">
            <FaGithub size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/umar-farook-68b78a248/"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={22} />
          </a>
          <a href="https://twitter.com/username" aria-label="Twitter">
            <FaTwitter size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
