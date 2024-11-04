import Link from "next/link";
import './404.css';
const NotFound = () => {
  return (
     <>
      
     <div className="not-found">
      <div className="not-found-image">
        <img src="/dist/img/dribbble_1.gif" alt="404 animation" />
      </div>
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">We are sorry, but the page you requested was not found.</p>
        <Link href="/backoffice" className="not-found-link">Take me home</Link>
      </div>
    </div>
     
    </>
  );
};
export default NotFound;