import React, {useState } from 'react'
import Login from './Login'
import Home from './Home'
import Navbar from './Navbar'
import "./styles.css"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import About from './About'
import Gallery from './Gallery'

const App:React.FC = () => {
  const [IsAunthenticated, setlsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const validUser = {email: "emilio@edu.do", password : "12345", name: "Administrator"};

  const HandleLogin = (email: string, password: string) => {
    if (email === validUser.email&&password===validUser.password){
      setlsAuthenticated(true);
      setUserName(validUser.name);
    } else  {
      alert("User or password is wrong.")
    }
  }

  const HandleLogut = () => {
    setlsAuthenticated(false);
    setUserName("");
  }

  return (
    <Router>
      {IsAunthenticated && <Navbar onLogout={HandleLogut} userName= {userName} />}

      <div className="content-container">
        <div className='content'>
          <Routes>
            {!IsAunthenticated? (
              <Route path="/*" element= {<Login onLogin= {HandleLogin}/>}/>
            ): (
              <>
              <Route path="/" element={<Home userName= {userName}/>}></Route>
              <Route path='/about' element = {<About/>}></Route>
              <Route path='/gallery' element = {<Gallery/>}></Route>
              <Route path='/' element = {<Navigate to="/"/>}></Route>
              </>
            )}
          </Routes>
        </div>
      </div>

    </Router>
  )

};

export default App;