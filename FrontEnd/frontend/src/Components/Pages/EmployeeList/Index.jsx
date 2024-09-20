
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Edit from '../EditEmployee/Index';
import Create from '../CreateEmpolyee/Index';
import './Styles.css'

const EmployeeList = () => {
    const [tableRows, setTableRows] = useState([]);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [deleteCount, setDeleteCount] = useState(0);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [edit, setEdit] = useState(false);
    const [create, setCreate] = useState(false);
    const navigate = useNavigate();
    console.log(searchValue);

    useEffect(() => {
        apiEmployeeList();
    }, []);
    useEffect(() => {
        if (searchValue.trim === '')
            apiEmployeeList();
    }, [searchValue]);
    useEffect(() => {
        apiEmployeeList();
    }, [deleteCount]);

    useEffect(() => {
        apiEmployeeSearch();
    }, [search]);

    const apiEmployeeSearch = async () => {
        try {

            const accessToken = sessionStorage.getItem('accessToken');
            const parsedAccessToken = JSON.parse(accessToken);

            const employeeResponse = await fetch(`http://localhost:3008/api/searchEmployee?search=${searchValue}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${parsedAccessToken.accesstoken}`,
                    'Accept': 'application/json'
                }
            });

            const parsedJson = await employeeResponse.json();
            console.log(parsedJson);

            if (employeeResponse.ok) {
                setTableRows(parsedJson)
            }
            if (!employeeResponse.ok) {
                console.error('Failed to fetch employee . Status:', employeeResponse.status);
                alert('Employe Doesnot exists.');
                return;
            }
        } catch (error) {
            console.error('Error fetching employee :', error);
        }
    };

    const apiEmployeeList = async () => {
        try {

            const accessToken = sessionStorage.getItem('accessToken');
            const parsedAccessToken = JSON.parse(accessToken);

            const employeeResponse = await fetch("http://localhost:3008/api/showAllEmployee", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${parsedAccessToken.accesstoken}`,
                    'Accept': 'application/json'
                }
            });

            const parsedJson = await employeeResponse.json();
            console.log(parsedJson);

            if (employeeResponse.ok) {
                setCount(parsedJson.count);
                setTableRows(parsedJson.rows);
            }
            if (!employeeResponse.ok) {
                console.error('Failed to fetch employee list. Status:', employeeResponse.status);
                alert('Failed to fetch employee list.');
                return;
            }
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };

    const handleDelete = async (employeeId) => {


        const isConfirmed = window.confirm('Are you sure you want to delete this employee?');


        if (isConfirmed) {
            try {
                const employee = { Employeeid: employeeId };
                const accessToken = sessionStorage.getItem('accessToken');
                const parsedAccessToken = JSON.parse(accessToken);

                const deleteEmployeeResponse = await fetch("http://localhost:3008/api/deleteEmployee", {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${parsedAccessToken.accesstoken}`,
                        'Accept': 'application/json',

                    },

                    body: JSON.stringify(employee)
                });

                const parsedJson = await deleteEmployeeResponse.json();
                console.log(parsedJson);

                if (deleteEmployeeResponse.ok) {

                    alert('Employee deleted successfully');
                    setDeleteCount((prevCount) => prevCount + 1);


                } else {

                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Failed to delete employee'}`);
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('An error occurred while deleting the employee');
            }
        } else {

            alert('Employee deletion canceled');
        }
    };

    const handleEdit = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setEdit(true);
    };

    const handleCreate = () => {
        setCreate(true);
    };

    const handleSearch = () => {
        setSearch((prevCount) => prevCount + 1);
    }
    const handleInputChange = (e) => {
        setSearchValue(e.target.value); // Update search query when the user types
    };
    return (
        <div className='employeelist'>
            <div className='employeelist_count'> <h4>Total Count - <span>{count}</span></h4>
                <button onClick={handleCreate}>Create Employee</button>
                <label for="SearchEmployee">Name
                    <input type="text" id="name" name="SearchEmployee" placeholder='Search by ID/NAME/EMAIL/DATE' required onChange={handleInputChange} />
                </label>
                <button onClick={handleSearch}>Search</button></div>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Unique Id</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th>Create Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((item) => (
                        <tr key={item.f_id}>
                            <td>{item.f_id}</td>
                            <td><img src="image_url" alt="User Image" width="50" /></td>
                            <td>{item.f_Name}</td>
                            <td>{item.f_Email}</td>
                            <td>{item.f_Mobile}</td>
                            <td>{item.f_Designation}</td>
                            <td>{item.f_gender}</td>
                            <td>{item.f_Course}</td>
                            <td>{item.f_CreateDate}</td>
                            <td>
                                <button onClick={() => handleEdit(item.f_id)}>Edit</button>
                                <button onClick={() => handleDelete(item.f_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {edit && (<div className='edit'> <Edit employeeId={selectedEmployeeId} />
                <button onClick={() => setEdit(false)}>Cancle</button></div>)}
            {create && (<div className='create'><Create />
                <button onClick={() => {
                    setCreate(false);
                    setDeleteCount((prevCount) => prevCount + 1);
                }}>
                    Cancel
                </button>
            </div>)}

        </div>
    );
};

export default EmployeeList;
