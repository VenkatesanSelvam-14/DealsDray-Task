import { useEffect, useState } from "react"
import React from 'react'
import './Styles.css'
const Edit = ({ employeeId }) => {
  console.log(employeeId);

  const [empDetails, setEmpDetails] = useState({});
  const [formData, setFormData] = useState({

    Employeeid: employeeId, EmployeeName: '', Email: '', MobileNo: '', Designation: '', Gender: '', Course: '', Image: null,

  });

  const [updateDetails, setUpdateDetails] = useState({});
  useEffect(() => {
    apiEmployeeList()
  }, [])

  useEffect(() => {
    apiUpdateEmployee()
  }, [updateDetails])

  const apiUpdateEmployee = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const parsedAccessToken = JSON.parse(accessToken);

    try {
      const updateResponce = await fetch("http://localhost:3008/api/editEmployee/", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': `Bearer ${parsedAccessToken.accesstoken} `
        },
        body: JSON.stringify(formData)
      })
      const result = await updateResponce.json()
      if (updateResponce.ok) {
        console.log(result);
        console.log("newfiled added");
        alert(' Employee Updated Successfully');
      }
    }
    catch (err) {
      console.log("Error :" + err);
      alert(' Something went wrong');
    }

  }

  //   const apiEmployeeList = async () => {
  //     try {

  //         const accessToken = sessionStorage.getItem('accessToken');
  //     const parsedAccessToken = JSON.parse(accessToken);
  // const emp = {Employeeid:employeeId}
  //         const employeeResponse = await fetch("http://localhost:3008/api/chooseEmployee", {
  //             method: 'GET',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 'authorization': `Bearer ${parsedAccessToken.accesstoken}`,
  //                 'Accept': 'application/json'
  //             },
  //             body:JSON.stringify(emp)
  //         });

  //         const parsedJson = await employeeResponse.json();
  //         console.log(parsedJson);

  //         if (employeeResponse.ok) {
  //             // setCount(parsedJson.count);
  //             // setTableRows(parsedJson.rows);
  //             setEmpDetails(parsedJson.findEmployee)
  //             console.log(parsedJson.findEmployee);

  //         } 
  //         if (!employeeResponse.ok) {
  //             console.error('Failed to fetch employee . Status:', employeeResponse.status);
  //             alert('Failed to fetch employee .');
  //             return;
  //         }
  //     } catch (error) {
  //         console.error('Error fetching employee :', error);
  //     }
  // };

  const apiEmployeeList = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const parsedAccessToken = JSON.parse(accessToken);

      const employeeResponse = await fetch(`http://localhost:3008/api/chooseEmployee/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${parsedAccessToken.accesstoken}`,
          'Accept': 'application/json',
        },
      });

      const parsedJson = await employeeResponse.json();
      if (employeeResponse.ok) {
        setEmpDetails(parsedJson.findEmployee);
        setFormData({
          Employeeid: employeeId,
          EmployeeName: parsedJson.findEmployee.f_Name,
          Email: parsedJson.findEmployee.f_Email,
          MobileNo: parsedJson.findEmployee.f_Mobile,
          Designation: parsedJson.findEmployee.f_Designation,
          Gender: parsedJson.findEmployee.f_Gender,
          Course: parsedJson.findEmployee.f_Course,
          Image: null,
        });
      } else {
        console.error('Failed to fetch employee. Status:', employeeResponse.status);
        alert('Failed to fetch employee.');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, files, checked } = event.target;

    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0]
      }));
    } else if (type === 'radio') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? value : ''
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const userConfirmed = window.confirm("Are you sure you want to Edit this Employee?");
    if (userConfirmed) {
      console.log(formData);
      setUpdateDetails(formData)

      // Reset the form fields
      e.target.reset();
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} >
        <h1>Edit Employee</h1>

        <label for="EmployeeName">Name
          <input type="text" id="name" name="EmployeeName" value={empDetails.f_Name||""} required onChange={handleChange} />
        </label>

        <label for="Email">Email
          <input type="email" id="email" name="Email" value={empDetails.f_Email||""} required onChange={handleChange} />
        </label>

        <label for="MobileNo">Mobile No
          <input type="text" id="mobileNo" name="MobileNo" value={empDetails.f_Mobile||""} required onChange={handleChange} />
        </label>

        <label for="Designation">Designation
          <select id="designation" name="designation" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </label>

        <label>Gender
          <div>
            <input type="radio" id="male" name="Gender" value="Male" required onChange={handleChange} />
            <label for="male">Male</label>
          </div>
          <div>
            <input type="radio" id="female" name="Gender" value="Female" required onChange={handleChange} />
            <label for="female">Female</label>
          </div>
        </label>

        <label for="Course">Course
          <input type="text" id="course" name="Course" value={empDetails.f_Course||""} required onChange={handleChange} />
        </label>

        <label for="createDate">Create Date
          <input type="date" id="createDate" name="createDate" value={empDetails.f_CreateDate||""} required onChange={handleChange} />
        </label>

        <label for="Image">Image
          <input type="file" id="image" name="Image" value={empDetails.f_image} accept="image/*" onChange={handleChange} />
        </label>

        <button type="submit">
          Submit
        </button>
      </form>

    </div>
  )
}
export default Edit



