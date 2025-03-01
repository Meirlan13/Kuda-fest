// import { Routes, Route } from "react-router-dom";
// import { useState } from 'react';
// import "./App.css";
// import Navbar from "./componets/Navbar";
// import Contacts from "./componets/Contacts";
// import Bookings from "./componets/Bookings";
// import Auth from "./componets/Auth";
// import BookingPage from "./componets/BookingPage";
// import TrackBooking from "./componets/TrackBooking";
// import Home from "./componets/Home"
// import AuthModal from "./componets/AuthModal";

// function App() {
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/contact" element={<Contacts />} />
//           <Route path="/bookings" element={<Bookings />} />
//           <Route path="/booking/:restaurantId" element={<BookingPage />} />
//           <Route path="/login" element={<Auth />} />
//           <Route path="/track-order/:reservationToken" element={<TrackBooking />} />
//         </Routes>
//       </div>
//       <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
//     </>
//   );
// }

//<Route path="/track-order/:reservationToken" element={<TrackBooking />} />

// export default App;

import { Routes, Route } from "react-router-dom";
import { useState } from 'react';
import "./App.css";
import "./Modal.css";
import Navbar from "./componets/Navbar";
import Contacts from "./componets/Contacts";
import Bookings from "./componets/Bookings";
// import Auth from "./componets/Auth";
import Comments from "./componets/Comments";
import BookingPage from "./componets/BookingPage";
import TrackBooking from "./componets/TrackBooking";
import Home from "./componets/Home"
import AuthModal from "./componets/AuthModal";
import AdminPage from "./componets/AdminPage";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user")) || null);

  return (
    <>
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-restaurant/:restaurantId" element={<AdminPage />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/booking/:restaurantId" element={<BookingPage />} />
          <Route path="/track-order/:reservationToken" element={<TrackBooking />} />
          <Route path="/restaurant/:restaurantId/comments" element={<Comments user={user} onLoginClick={() => setIsAuthModalOpen(true)} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
