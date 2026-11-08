import React, { useEffect, useState } from "react";
import { deleteEmployee, listEmployees } from "../services/EmployeeService";
import { useNavigate } from "react-router-dom";
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaRegEye,
  FaMoneyBillWave,
} from "react-icons/fa";

const ListEmployeeComponent = () => {
  const [employees, setEmployees] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    getAllEmployees();
  }, []);

  function getAllEmployees() {
    listEmployees()
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error(error));
  }

  function removeEmployee(employee) {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`))
      return;

    deleteEmployee(employee.id)
      .then(() => getAllEmployees())
      .catch((error) => {
        window.alert(
          error.response?.data?.message || "Failed to delete employee",
        );
      });
  }

  return (
    <div className="container">
      <h2 className="text-center mt-5">List of Employees</h2>

      <button
        className="btn btn-dark mb-3 mt-2"
        onClick={() => navigator("/add-employee")}
      >
        Add Employee
      </button>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Employment Code</th>
            <th>Name</th>
            <th>Company Email</th>
            <th>Manager Name</th>
            <th>Current Project</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.employeeCode || "-"}</td>
              <td>
                {employee.firstName} {employee.lastName}
              </td>
              <td>{employee.email}</td>
              <td>{employee.managerName || "-"}</td>
              <td>{employee.currentProjectName || "-"}</td>
              <td>
                <FaRegEye
                  className="text-primary"
                  style={{ cursor: "pointer", marginRight: "15px" }}
                  title="View"
                  onClick={() => navigator(`/view-employee/${employee.id}`)}
                />
                <FaRegEdit
                  className="text-info"
                  style={{ cursor: "pointer", marginRight: "15px" }}
                  title="Edit"
                  onClick={() => navigator(`/edit-employee/${employee.id}`)}
                />
                <FaMoneyBillWave
                  className="text-success"
                  style={{ cursor: "pointer", marginRight: "15px" }}
                  title="Manage salary"
                  onClick={() => navigator(`/payslip/${employee.id}`)}
                />
                <FaRegTrashAlt
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  title="Delete"
                  onClick={() => removeEmployee(employee)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListEmployeeComponent;
