import React, { useState, useEffect } from 'react'
//import './Styles.css'

const Create = () => {

  const [formData, setFormData] = useState({

    EmployeeName: '', Email: '', MobileNo: '', Designation: '', Gender: '', Course: '', Image: null,

  });

  const [register, setRegister] = useState({})


  useEffect(() => {
    if (Object.keys(register).length > 0) {
      employeeRegister()
    }
  }, [register])


  const employeeRegister = async () => {
    const access_Token = sessionStorage.getItem('accessToken');
    const sessionObject = JSON.parse(access_Token);
    console.log(sessionObject);
    try {
      const RegisterResponse = await fetch("http://localhost:3008/api/createEmployee", {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${sessionObject.accesstoken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(register)
      });
      let parsedJson = await RegisterResponse.json();

      console.log(parsedJson)

      if (RegisterResponse.ok) {
        alert("Employee Registered Successfully")
      }

      else {
        console.log("Error in Employee Register");
        alert('Error in Employee Register');
      }
    }

    catch (error) {
      console.error('Error Employee Register :', error);
    }
  }


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
    const userConfirmed = window.confirm("Are you sure you want to Register this Employee?");
    if (userConfirmed) {
      console.log(formData);
      setRegister(formData)

      // Reset the form fields
      e.target.reset();
    }

    return;

  };
  return (

    <div>
      <form onSubmit={handleSubmit} >
        <h1>Create Employee</h1>


        <label for="name">Name
          <input type="text" id="name" name="EmployeeName" onChange={handleChange} required />
        </label>

        <label for="email">Email
          <input type="email" id="email" name="Email" onChange={handleChange} required />
        </label>

        <label for="mobileNo">Mobile No
          <input type="text" id="mobileNo" name="MobileNo" onChange={handleChange} required />
        </label>


        <label for="designation">Designation
          <select id="designation" name="Designation" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </label>

        <label>Gender
          <div>
            <input type="radio" id="male" name="Gender" value="Male" onChange={handleChange} required />
            <label for="male">Male</label>
          </div>
          <div>
            <input type="radio" id="female" name="Gender" value="Female" onChange={handleChange} required />
            <label for="female">Female</label>
          </div>
        </label>

        <label for="course">Course
          <input type="text" id="course" name="Course" onChange={handleChange} required />
        </label>

        {/* <label for="createDate">Create Date
      <input type="date" id="createDate" name="createDate"  onChange={handleChange}  required />
      </label> */}

        <label for="image">Image
          <input type="file" id="image" name="Image" accept="image/*" onChange={handleChange} />
        </label>

        <button type="submit">
          Submit
        </button>

      </form>

    </div>
  )
}

export default Create


