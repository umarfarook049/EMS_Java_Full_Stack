import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  getEmployee,
  getSalary,
  getLatestSalary,
  saveSalary,
} from "../services/EmployeeService";
import { isAdmin } from "../services/AuthService";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SALARY_FIELDS = [
  { key: "basic", label: "Basic Salary" },
  { key: "hra", label: "HRA" },
  { key: "allowances", label: "Allowances" },
  { key: "providentFund", label: "Provident Fund (deduction)" },
  { key: "tax", label: "Income Tax (deduction)" },
];

const EMPTY = {
  basic: "",
  hra: "",
  allowances: "",
  providentFund: "",
  tax: "",
};

const PayslipComponent = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const admin = isAdmin();

  const today = new Date();
  const [employeeName, setEmployeeName] = useState("");
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [salary, setSalary] = useState(EMPTY);
  // 'saved' = record exists for this month, 'prefilled' = copied from latest (not saved), 'none'
  const [source, setSource] = useState("none");
  const [message, setMessage] = useState(null);

  const periodLabel = `${MONTHS[month - 1]} ${year}`;

  useEffect(() => {
    getEmployee(id)
      .then((res) =>
        setEmployeeName(`${res.data.firstName} ${res.data.lastName}`),
      )
      .catch((err) => console.error(err));
  }, [id]);

  // Load the selected month's salary whenever employee, month or year changes
  useEffect(() => {
    if (year < 2000 || year > 2100) return;

    setMessage(null);
    getSalary(id, month, year)
      .then((res) => {
        setSalary(toFields(res.data));
        setSource("saved");
      })
      .catch(() => {
        setSalary(EMPTY);
        setSource("none");
        if (admin) {
          // convenience: pre-fill from the most recent saved month
          getLatestSalary(id)
            .then((res) => {
              setSalary(toFields(res.data));
              setSource("prefilled");
            })
            .catch(() => {});
        }
      });
  }, [id, month, year, admin]);

  function toFields(s) {
    return {
      basic: s.basic ?? "",
      hra: s.hra ?? "",
      allowances: s.allowances ?? "",
      providentFund: s.providentFund ?? "",
      tax: s.tax ?? "",
    };
  }

  function handleChange(key, value) {
    setSalary((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e) {
    e.preventDefault();

    const payload = { month, year };
    for (const { key, label } of SALARY_FIELDS) {
      const num = salary[key] === "" ? 0 : Number(salary[key]);
      if (Number.isNaN(num) || num < 0) {
        setMessage({
          type: "danger",
          text: `${label} must be a valid non-negative number`,
        });
        return;
      }
      payload[key] = num;
    }

    saveSalary(id, payload)
      .then(() => {
        setSource("saved");
        setMessage({
          type: "success",
          text: `Salary saved for ${periodLabel}`,
        });
      })
      .catch(() =>
        setMessage({ type: "danger", text: "Failed to save salary" }),
      );
  }

  return (
    <div className="container">
      <br />
      <br />
      <br />
      <FaArrowLeft
        className="text-dark"
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={() => navigator(admin ? "/employees" : `/view-employee/${id}`)}
      />
      Back
      <div className="row">
        <div className="card col-md-6 offset-md-3">
          <h2 className="text-center mt-2">Manage Salary</h2>
          <p className="text-center text-muted">{employeeName}</p>

          <div className="card-body">
            {message && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            <h5>Pay Period</h5>
            <div className="row mb-3">
              <div className="col">
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {MONTHS.map((name, i) => (
                    <option key={name} value={i + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            </div>

            <h5>Salary Details - {periodLabel}</h5>

            {source === "prefilled" && (
              <div className="alert alert-info py-2">
                No salary saved for {periodLabel}. Values are copied from the
                latest saved month. Adjust them if needed and click Save to
                store them for {periodLabel}.
              </div>
            )}
            {source === "none" && !admin && (
              <div className="alert alert-warning py-2">
                No payslip data is available for {periodLabel}.
              </div>
            )}
            {source === "none" && admin && (
              <div className="alert alert-warning py-2">
                No salary saved for {periodLabel}. Enter the details and click
                Save.
              </div>
            )}

            <form onSubmit={handleSave}>
              {SALARY_FIELDS.map(({ key, label }) => (
                <div className="form-group mb-2" key={key}>
                  <label className="form-label">{label} : </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    placeholder={`Enter ${label}`}
                    value={salary[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    disabled={!admin}
                  />
                </div>
              ))}
              {admin && (
                <button type="submit" className="btn btn-dark mb-3 mt-2">
                  Save Salary for {periodLabel}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipComponent;
