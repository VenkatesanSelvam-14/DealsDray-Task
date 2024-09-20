import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Context/CreateContex';
import EmployeeList from '../EmployeeList/Index';
import DashBoard from '../DashBoard/Index';
import RefreshToken from './RefreshToken';
import './Styles.css'

const HomePage = () => {
    const [component, setComponent] = useState('DashBoard')
    const [logout, setLogout] = useState('')
    const { user } = useContext(UserContext);
    console.log(user);


    const navigate = useNavigate();

    useEffect(() => {
        if (logout === 'Logout') {
            logoutApiCall()
        }

    }, [logout])

    const logoutApiCall = async () => {
        const accessToken = sessionStorage.getItem('accessToken');
        const parsedAccessToken = JSON.parse(accessToken);
        try {
            const logout = await fetch("http://localhost:3008/api/logout", {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${parsedAccessToken.accesstoken}`
                }

            });

            if (logout.ok) {
                sessionStorage.clear();
                navigate('/')

            }
            else {
                alert("Something went wrong");
            }

        }
        catch (error) {
            console.error('Error logout :', error);
        }
    }

    return (
        <div>
            <div className='navbar'>
                <nav className='nav' >
                    <div className='logo'>Logo</div>
                    <div className='list'>
                        <ul>
                            <li>
                                <a href="#" onClick={() => setComponent('DashBoard')} >Home</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => setComponent('EmployeeDetails')} >Employee</a>
                            </li>
                            <li>
                                <span>{user + " - "}</span><a href="#" onClick={() => setLogout('Logout')} >Logout</a>
                            </li>
                        </ul>
                    </div>

                </nav>

            </div>

            <div>
                {component === 'DashBoard' && <DashBoard />}
                {component === 'EmployeeDetails' && <EmployeeList />}
                {/* {component && component ==='DashBoard'( <DashBoard/>)}
            {component && component ==='EmployeeDetails'( <EmployeeList/>)} */}
            </div>
            <RefreshToken />
        </div>
    )
}

export default HomePage
