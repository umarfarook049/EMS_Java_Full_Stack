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

  const renderActions = (employee) => (
    <div className="d-flex gap-3 fs-5">
      <FaRegEye
        className="text-primary"
        style={{ cursor: "pointer" }}
        title="View"
        onClick={() => navigator(`/view-employee/${employee.id}`)}
      />
      <FaRegEdit
        className="text-info"
        style={{ cursor: "pointer" }}
        title="Edit"
        onClick={() => navigator(`/edit-employee/${employee.id}`)}
      />
      <FaMoneyBillWave
        className="text-success"
        style={{ cursor: "pointer" }}
        title="Manage salary"
        onClick={() => navigator(`/payslip/${employee.id}`)}
      />
      <FaRegTrashAlt
        className="text-danger"
        style={{ cursor: "pointer" }}
        title="Delete"
        onClick={() => removeEmployee(employee)}
      />
    </div>
  );

  return (
    <div className="container">
      <h2 className="text-center mt-4 mt-md-5">List of Employees</h2>

      <div className="d-grid d-md-block mb-3 mt-2">
        <button
          className="btn btn-dark"
          onClick={() => navigator("/add-employee")}
        >
          Add Employee
        </button>
      </div>

      {employees.length === 0 && (
        <p className="text-center text-muted">No employees found.</p>
      )}

      {/* Desktop / tablet: table */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped table-bordered align-middle">
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
                <td>{renderActions(employee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: one card per employee */}
      <div className="d-md-none">
        {employees.map((employee) => (
          <div className="card mb-3" key={employee.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-0">
                    {employee.firstName} {employee.lastName}
                  </h6>
                  <small className="text-muted">
                    Code: {employee.employeeCode || "-"}
                  </small>
                </div>
                {renderActions(employee)}
              </div>
              <hr className="my-2" />
              <div className="small text-break">
                <span className="text-muted">Email: </span>
                {employee.email}
              </div>
              <div className="small">
                <span className="text-muted">Manager: </span>
                {employee.managerName || "-"}
              </div>
              <div className="small">
                <span className="text-muted">Project: </span>
                {employee.currentProjectName || "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListEmployeeComponent;
