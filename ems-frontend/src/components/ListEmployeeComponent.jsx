import React, { useEffect, useState } from 'react'
import { deleteEmployee, listEmployees } from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'
import { FaRegEdit, FaRegTrashAlt, FaRegEye } from 'react-icons/fa' // Importing the outlined icons

const ListEmployeeComponent = () => {

    const [Employees, setEmployees] = useState([])
    const navigator = useNavigate()

    useEffect(() => {
        getAllEmployees();
    }, [])

    function getAllEmployees() {
        listEmployees().then((response) => {
            setEmployees(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    function addNewEmployee() {
        navigator('/add-employee')
    }

    function updateEmployee(id) {
        navigator(`/edit-employee/${id}`)
    }

    function removeEmployee(id) {
        deleteEmployee(id).then((response) => {
            getAllEmployees();
        }).catch(error => {
            console.error(error);
        })
    }

    function viewEmployee(id) {
        navigator(`/view-employee/${id}`) // Navigate to a new route to view the employee details
    }

    return (
        <div className='container'>
            <h2 className='text-center mt-5'>List of Employees</h2>
            <button className='btn btn-dark mb-3 mt-2' onClick={addNewEmployee}>Add Employee</button>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Employee First Name</th>
                        <th>Employee Last Name</th>
                        <th>Employee Email Id</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Employees.map(employee =>
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.firstName}</td>
                                <td>{employee.lastName}</td>
                                <td>{employee.email}</td>
                                <td>
                                    <FaRegEye 
                                        className="text-primary" 
                                        style={{ cursor: 'pointer', marginRight: '15px' }} 
                                        onClick={() => viewEmployee(employee.id)} 
                                    /> {/* View Icon */}
                                    <FaRegEdit 
                                        className="text-info" 
                                        style={{ cursor: 'pointer', marginRight: '15px' }} 
                                        onClick={() => updateEmployee(employee.id)} 
                                    /> {/* Edit Icon */}
                                    <FaRegTrashAlt 
                                        className="text-danger" 
                                        style={{ cursor: 'pointer' }} 
                                        onClick={() => removeEmployee(employee.id)} 
                                    /> {/* Delete Icon */}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ListEmployeeComponent
