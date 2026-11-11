import React, { useEffect, useState } from "react";
import { deleteEmployee, listEmployees } from "../services/EmployeeService";
import { getSession } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaRegEye,
  FaMoneyBillWave,
  FaUserCircle,
} from "react-icons/fa";

const ListEmployeeComponent = () => {
  const [employees, setEmployees] = useState([]);
  const navigator = useNavigate();
  const session = getSession();

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

  const projectCount = new Set(
    employees.flatMap((e) => (e.projects || []).map((p) => p.projectCode)),
  ).size;

  const renderActions = (employee) => (
    <div className="action-icons d-flex gap-3 fs-5">
      <FaRegEye
        className="icon-view"
        title="View"
        onClick={() => navigator(`/view-employee/${employee.id}`)}
      />
      <FaRegEdit
        className="icon-edit"
        title="Edit"
        onClick={() => navigator(`/edit-employee/${employee.id}`)}
      />
      <FaMoneyBillWave
        className="icon-salary"
        title="Manage salary"
        onClick={() => navigator(`/payslip/${employee.id}`)}
      />
      <FaRegTrashAlt
        className="icon-delete"
        title="Delete"
        onClick={() => removeEmployee(employee)}
      />
    </div>
  );

  return (
    <div className="container-fluid px-3 px-md-5">
      <div className="d-flex justify-content-between align-items-center mt-4 mt-md-5 mb-4">
        <h2 className="page-title mb-0">Dashboard</h2>
        {session?.employeeId && (
          <button
            className="btn btn-brand"
            onClick={() => navigator(`/view-employee/${session.employeeId}`)}
          >
            <FaUserCircle className="me-2" />
            Profile
          </button>
        )}
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="stat-card">
          <h5>Employees</h5>
          <div className="stat-number text-brand">{employees.length}</div>
        </div>
        <div className="stat-card">
          <h5>Projects</h5>
          <div className="stat-number text-green">{projectCount}</div>
        </div>
      </div>

      <div className="records-card">
        <h4>Employee Records</h4>

        {employees.length === 0 && (
          <p className="text-center text-muted">No employees found.</p>
        )}

        {/* Desktop / tablet: table */}
        <div className="table-responsive d-none d-md-block">
          <table className="table records-table align-middle mb-0">
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
            <div className="border rounded p-3 mb-3" key={employee.id}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListEmployeeComponent;
