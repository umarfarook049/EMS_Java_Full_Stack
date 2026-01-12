import React, { useEffect, useState } from 'react'
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'  // Import the back arrow icon

const EmployeeComponent = ({ isView }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const { id } = useParams()

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  const navigator = useNavigate()

  useEffect(() => {
    if (id) {
      getEmployee(id).then((response) => {
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setEmail(response.data.email)
      }).catch(error => {
        console.error(error)
      })
    }
  }, [id])

  function saveOrUpdateEmployee(e) {
    e.preventDefault()

    if (validateForm()) {
      const employee = { firstName, lastName, email }
      if (id) {
        updateEmployee(id, employee).then((response) => {
          console.log(response.data)
          navigator('/employees')
        }).catch(error => {
          console.error(error)
        })
      } else {
        createEmployee(employee).then((response) => {
          console.log(response.data)
          navigator('/employees')
        }).catch(error => {
          console.error(error)
        })
      }
    }
  }

  function validateForm() {
    let valid = true
    const errorsCopy = { ...errors }

    if (firstName.trim()) {
      errorsCopy.firstName = ''
    } else {
      errorsCopy.firstName = 'First name is required'
      valid = false
    }

    if (lastName.trim()) {
      errorsCopy.lastName = ''
    } else {
      errorsCopy.lastName = 'Last name is required'
      valid = false
    }

    if (email.trim()) {
      errorsCopy.email = ''
    } else {
      errorsCopy.email = 'Email is required'
      valid = false
    }

    setErrors(errorsCopy)
    return valid
  }

  function pageTitle() {
    if (id) {
      return isView ? <h2 className='text-center mt-2'>View Employee</h2> : <h2 className='text-center mt-2'>Update Employee</h2>
    } else {
      return <h2 className='text-center mt-2'>Add Employee</h2>
    }
  }

  return (
    <div className='container'>
      <br /><br /><br />
      <FaArrowLeft
              className='text-dark'
              style={{ cursor: 'pointer', marginRight: '10px' }}
              onClick={() => navigator('/employees')}  // Navigate back to the employee list
            />Back
      <div className='row'>
        <div className='card col-md-6 offset-md-3 offset-md-3'>
          <div className='d-flex align-items-center'>
            {pageTitle()}
          </div>
          <div className='card-body'>
            <form>
              <div className='form-group mb-2'>
                <label className='form-label'>First Name : </label>
                <input type='text'
                  placeholder='Enter Employee First Name'
                  name='firstName'
                  value={firstName}
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isView} // Disable if it's a view operation
                />
                {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
              </div>
              <div className='form-group mb-2'>
                <label className='form-label'>Last Name : </label>
                <input type='text'
                  placeholder='Enter Employee Last Name'
                  name='lastName'
                  value={lastName}
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isView} // Disable if it's a view operation
                />
                {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
              </div>
              <div className='form-group mb-2'>
                <label className='form-label'>Email : </label>
                <input type='text'
                  placeholder='Enter Employee Email'
                  name='email'
                  value={email}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isView} // Disable if it's a view operation
                />
                {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
              </div>
              {!isView && <button className='btn btn-dark mb-3 mt-2' onClick={saveOrUpdateEmployee}>Submit</button>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeComponent
