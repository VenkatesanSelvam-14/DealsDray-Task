import React, { useState,useContext ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Context/CreateContex';
import './Styles.css'


const LoginPage = () => {
    const [login, setLogin] = useState({});
    const [userName , setUserName] = useState('')
    const [password , setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const{setUser}=useContext(UserContext)
    useEffect(() => {
        if (Object.keys(login).length > 0) {
            loginApiCall()
        }

    }, [login])

    const loginApiCall = async () => {
        try { 
            const loginResponse = await fetch("http://localhost:3008/api/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            });
            let parsedJson = await loginResponse.json();

            console.log(parsedJson)
            const loginSession = JSON.stringify(parsedJson);
            if (loginResponse.ok) {
                setUser(userName)
                sessionStorage.setItem('accessToken', loginSession)
                navigate('/home');
            }

            else {
                console.log("Login failed");
                alert('Login failed.');
            }
        }

        catch (error) {
            console.error('Error login :', error);
        }
    }
    
    const handleSubmit= (e) => {
        e.preventDefault();

        setPasswordError('');
        // if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        //     setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character (@$!%*?&), and be at least 8 characters long');
        //     return;
        // }

         if (!password.match(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/)) {
            setPasswordError('Password must contain at least one digit, one special character (@$!%*?&), and be at least 8 characters long');
            return;
        }
        const loginDetails = {
            username: userName,
            password: password
        }

        if (loginDetails !== null && typeof loginDetails === 'object') {
            console.log(loginDetails);
            setLogin(loginDetails)
            
        }
    };

    return (
        <div className='login'>
 <form onSubmit={handleSubmit}  className='login_form'>
      <h1>Login</h1>

      <label htmlFor="email" >
        UserName:
        <input
          type="email"
          id="email"
          name="email"
          required
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your email"
          
        />
      </label>
      {/* {emailError && <div className="errormessage">{emailError}</div>} */}

      <label htmlFor="password" >
        Password:
        <input
          type="password"
          id="password"
          name="password"
          pattern="^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$"
        //   pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character (@$!%*?&), and be at least 8 characters long"
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
         
        />
      </label>
      {passwordError && <div className="errormessage">{passwordError}</div>}

      <button type="submit">
        Submit
      </button>
    </form>

        </div>
    )
}

export default LoginPage