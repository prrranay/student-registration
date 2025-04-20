import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CourseTypes from './pages/CourseTypes';
import Courses from './pages/Courses';
import CourseOfferings from './pages/CourseOfferings';
import Registrations     from './pages/Registrations';
import Home     from './pages/Home';

function App() {
  return (
    <Router>
      <nav className='p-5 bg-gray-100 flex gap-4'>
        <Link className='text-blue-500 underline' to="/course-types" >Course Types</Link>
        <Link className='text-blue-500 underline' to="/courses" >Courses</Link>
        <Link className='text-blue-500 underline' to="/offerings">Course Offerings</Link>
        <Link className='text-blue-500 underline' to="/registrations">Registrations</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-types" element={<CourseTypes />} />
        <Route path="/courses"      element={<Courses />} />
        <Route path="/offerings"    element={<CourseOfferings />} />
        <Route path="/registrations" element={<Registrations />} />
      </Routes>
    </Router>
  );
}

export default App;
