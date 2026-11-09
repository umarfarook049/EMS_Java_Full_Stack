import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaFileDownload } from "react-icons/fa";
import {
  createEmployee,
  getEmployee,
  updateEmployee,
  getRecentPayslips,
  downloadPayslip,
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

// ---------- field configuration ----------
const RE = {
  code: [/^\d{6}$/, "Must be a 6 digit number"],
  pin: [/^\d{6}$/, "Pin code must be a 6 digit number"],
  mobile: [/^\d{10}$/, "Must be a 10 digit number"],
  phone: [/^\d{8,12}$/, "Must be 8 to 12 digits"],
  email: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
  amount: [/^\d+(\.\d{1,2})?$/, "Enter a valid amount"],
  manager: [
    /^(\d{6}|[^\s@]+@[^\s@]+\.[^\s@]+)$/,
    "Enter a 6 digit employee code or a valid email",
  ],
};

const f = (key, label, extra = {}) => ({ key, label, type: "text", ...extra });

const SECTIONS = [
  {
    title: "Personal Details",
    fields: [
      f("employeeCode", "Employment Code", {
        pattern: RE.code,
        locked: true,
        maxLength: 6,
      }),
      f("firstName", "First Name"),
      f("lastName", "Last Name"),
      f("dateOfBirth", "Date of Birth", { type: "date", locked: true }),
      f("gender", "Gender", {
        type: "select",
        options: ["Male", "Female", "Other"],
        locked: true,
      }),
      f("age", "Age", {
        type: "number",
        pattern: [
          /^[1-9]\d{0,2}$/,
          "Age must be a positive number of up to 3 digits",
        ],
      }),
      f("mobile", "Mobile", { pattern: RE.mobile, maxLength: 10 }),
      f("personalEmail", "Personal Email", { pattern: RE.email }),
      f("emergencyContactName", "Emergency Contact Name"),
      f("emergencyContactMobile", "Emergency Contact Mobile", {
        pattern: RE.mobile,
        maxLength: 10,
      }),
      f("currentAddressLine1", "Current Address Line 1"),
      f("currentAddressLine2", "Current Address Line 2"),
      f("currentCity", "Current City"),
      f("currentPinCode", "Current Pin Code", {
        pattern: RE.pin,
        maxLength: 6,
      }),
      f("permanentAddressLine1", "Permanent Address Line 1"),
      f("permanentAddressLine2", "Permanent Address Line 2"),
      f("permanentCity", "Permanent City"),
      f("permanentPinCode", "Permanent Pin Code", {
        pattern: RE.pin,
        maxLength: 6,
      }),
    ],
  },
  {
    title: "Professional Details",
    fields: [
      f("email", "Company Email", { pattern: RE.email, locked: true }),
      f("officePhone", "Office Phone", { pattern: RE.phone, maxLength: 12 }),
      f("officeCity", "Office City"),
      f("officeAddressLine1", "Office Address Line 1"),
      f("officeAddressLine2", "Office Address Line 2"),
      f("officePinCode", "Office Pin Code", { pattern: RE.pin, maxLength: 6 }),
      f("reportingManager", "Reporting Manager (employee code / email)", {
        pattern: RE.manager,
      }),
      f("hrName", "HR Name"),
      f("dateOfJoining", "Date of Joining", { type: "date", locked: true }),
    ],
    list: "employmentHistory",
  },
  { title: "Project Details", fields: [], list: "projects" },
  {
    title: "Finance",
    fields: [
      f("panNumber", "PAN Card", {
        pattern: [
          /^[A-Z]{5}[0-9]{4}[A-Z]$/,
          "Enter a valid PAN (e.g. ABCDE1234F)",
        ],
        uppercase: true,
        maxLength: 10,
      }),
      f("aadharNumber", "Aadhar Card", {
        pattern: [/^\d{12}$/, "Aadhar must be a 12 digit number"],
        maxLength: 12,
      }),
      f("bankName", "Bank Name"),
      f("branch", "Branch"),
      f("ifscCode", "IFSC Code", {
        pattern: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code"],
        uppercase: true,
        maxLength: 11,
      }),
      f("annualCtc", "Annual CTC", { type: "number", pattern: RE.amount }),
      f("ctcBasic", "CTC Breakup - Basic (annual)", {
        type: "number",
        pattern: RE.amount,
      }),
      f("ctcHra", "CTC Breakup - HRA (annual)", {
        type: "number",
        pattern: RE.amount,
      }),
      f("ctcAllowances", "CTC Breakup - Allowances (annual)", {
        type: "number",
        pattern: RE.amount,
      }),
    ],
    payslips: true,
  },
];

const ACCOUNT_FIELD = f("password", "Initial Password", {
  type: "password",
  onlyCreate: true,
  pattern: [/^.{6,}$/, "Password must be at least 6 characters"],
});

const LISTS = {
  employmentHistory: {
    title: "Employment History (previous companies)",
    emptyText: "No previous employment added.",
    addLabel: "+ Add Company",
    columns: [
      { key: "companyName", label: "Company Name", type: "text" },
      { key: "joiningDate", label: "Joining Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date" },
    ],
    range: ["joiningDate", "endDate"],
    empty: { companyName: "", joiningDate: "", endDate: "" },
  },
  projects: {
    title: "Current and Previous Projects (optional)",
    emptyText: "No projects assigned.",
    addLabel: "+ Add Project",
    columns: [
      { key: "projectCode", label: "Project Code", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date", optional: true },
      {
        key: "clientProjectName",
        label: "Client / Project Name",
        type: "text",
      },
      {
        key: "reportingManager",
        label: "Reporting Manager (code / email)",
        type: "text",
        pattern: RE.manager,
      },
    ],
    range: ["startDate", "endDate"],
    empty: {
      projectCode: "",
      startDate: "",
      endDate: "",
      clientProjectName: "",
      reportingManager: "",
    },
  },
};

const ALL_FIELDS = [...SECTIONS.flatMap((s) => s.fields), ACCOUNT_FIELD];

const EMPTY = {
  ...Object.fromEntries(ALL_FIELDS.map((d) => [d.key, ""])),
  employmentHistory: [],
  projects: [],
};

// ---------- validation ----------
function validate(form, isEdit) {
  const errs = {};

  const check = (key, def, value) => {
    const v = String(value ?? "").trim();
    if (v === "") {
      if (!def.optional) errs[key] = "This field is required";
      return;
    }
    if (def.pattern && !def.pattern[0].test(v)) errs[key] = def.pattern[1];
  };

  ALL_FIELDS.forEach((def) => {
    if (def.onlyCreate && isEdit) return;
    check(def.key, def, form[def.key]);
  });

  Object.entries(LISTS).forEach(([listKey, list]) => {
    (form[listKey] || []).forEach((item, i) => {
      list.columns.forEach((col) =>
        check(`${listKey}[${i}].${col.key}`, col, item[col.key]),
      );
      const [from, to] = list.range;
      if (item[from] && item[to] && item[to] < item[from]) {
        errs[`${listKey}[${i}].${to}`] =
          "End date cannot be before the start date";
      }
    });
  });

  return errs;
}

const netPay = (p) =>
  (
    Number(p.basic) +
    Number(p.hra) +
    Number(p.allowances) -
    Number(p.providentFund) -
    Number(p.tax)
  ).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// ---------- component ----------
const EmployeeComponent = ({ isView }) => {
  const { id } = useParams();
  const navigator = useNavigate();
  const admin = isAdmin();
  const isEdit = !!id;

  const [form, setForm] = useState(EMPTY);
  const [original, setOriginal] = useState({});
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    if (!id) return;
    getEmployee(id)
      .then((res) => {
        const data = { ...EMPTY, ...res.data };
        ALL_FIELDS.forEach((d) => {
          if (data[d.key] == null) data[d.key] = "";
        });
        data.employmentHistory = res.data.employmentHistory || [];
        data.projects = (res.data.projects || []).map((p) => ({
          ...p,
          endDate: p.endDate ?? "",
        }));
        setForm(data);
        setOriginal(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // employees (not admin) see their last 6 payslips in the Finance section
  useEffect(() => {
    if (id && isView && !admin) {
      getRecentPayslips(id)
        .then((res) => setPayslips(res.data))
        .catch(() => {});
    }
  }, [id, isView, admin]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setItem = (listKey, index, key, value) =>
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((it, i) =>
        i === index ? { ...it, [key]: value } : it,
      ),
    }));

  const addItem = (listKey) =>
    setForm((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { ...LISTS[listKey].empty }],
    }));

  const removeItem = (listKey, index) =>
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));

  function handleSubmit(e) {
    e.preventDefault();

    const errs = validate(form, isEdit);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setNotice({
        type: "danger",
        text: "Please correct the highlighted fields",
      });
      window.scrollTo(0, 0);
      return;
    }

    const payload = {
      ...form,
      projects: form.projects.map((p) => ({
        ...p,
        endDate: p.endDate || null,
      })),
    };
    delete payload.managerName;
    delete payload.currentProjectName;
    if (isEdit) delete payload.password;

    const request = isEdit
      ? updateEmployee(id, payload)
      : createEmployee(payload);
    request
      .then(() => navigator("/employees"))
      .catch((err) => {
        const data = err.response?.data;
        setErrors(data?.fieldErrors || {});
        setNotice({
          type: "danger",
          text: data?.message || "Failed to save employee",
        });
        window.scrollTo(0, 0);
      });
  }

  function handleDownload(month, year) {
    downloadPayslip(id, month, year)
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payslip_${year}_${String(month).padStart(2, "0")}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() =>
        setNotice({
          type: "danger",
          text: "Could not download the payslip. Please try again.",
        }),
      );
  }

  // ---------- renderers ----------
  const inputClass = (key, base) =>
    `${base} ${errors[key] ? "is-invalid" : ""}`;

  function renderField(def) {
    const disabled = isView || (isEdit && def.locked && !!original[def.key]);
    return (
      <div className="col-md-6 mb-2" key={def.key}>
        <label className="form-label">{def.label} :</label>
        {def.type === "select" ? (
          <select
            className={inputClass(def.key, "form-select")}
            value={form[def.key]}
            disabled={disabled}
            onChange={(e) => setField(def.key, e.target.value)}
          >
            <option value="">-- Select --</option>
            {def.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={def.type}
            className={inputClass(def.key, "form-control")}
            value={form[def.key] ?? ""}
            disabled={disabled}
            maxLength={def.maxLength}
            min={def.type === "number" ? 0 : undefined}
            onChange={(e) =>
              setField(
                def.key,
                def.uppercase ? e.target.value.toUpperCase() : e.target.value,
              )
            }
          />
        )}
        {errors[def.key] && (
          <div className="invalid-feedback">{errors[def.key]}</div>
        )}
        {isView && def.key === "reportingManager" && form.managerName && (
          <div className="form-text">Manager: {form.managerName}</div>
        )}
      </div>
    );
  }

  function renderList(listKey) {
    const list = LISTS[listKey];
    const items = form[listKey] || [];

    return (
      <div className="mt-3">
        <h6>{list.title}</h6>
        {items.length === 0 && <p className="text-muted">{list.emptyText}</p>}

        {items.map((item, i) => (
          <div className="row border rounded p-2 mb-2 mx-0" key={i}>
            {list.columns.map((col) => {
              const errKey = `${listKey}[${i}].${col.key}`;
              return (
                <div className="col-md mb-2" key={col.key}>
                  <label className="form-label small">
                    {col.label}
                    {col.optional && !isView ? " (blank = current)" : ""}
                  </label>
                  <input
                    type={col.type}
                    className={inputClass(errKey, "form-control")}
                    value={item[col.key] ?? ""}
                    disabled={isView}
                    onChange={(e) =>
                      setItem(listKey, i, col.key, e.target.value)
                    }
                  />
                  {errors[errKey] && (
                    <div className="invalid-feedback">{errors[errKey]}</div>
                  )}
                </div>
              );
            })}
            {listKey === "projects" && !item.endDate && (
              <div className="col-md-auto mb-2 d-flex align-items-end">
                <span className="badge bg-success">Current</span>
              </div>
            )}
            {!isView && (
              <div className="col-md-auto mb-2 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeItem(listKey, i)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}

        {!isView && (
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={() => addItem(listKey)}
          >
            {list.addLabel}
          </button>
        )}
      </div>
    );
  }

  function renderPayslips() {
    if (!(isView && !admin)) return null; // not shown for admin
    return (
      <div className="mt-4">
        <h6>Payslips (last 6 months)</h6>
        {payslips.length === 0 ? (
          <p className="text-muted">No payslips available yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Net Pay (Rs.)</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((p) => (
                  <tr key={`${p.year}-${p.month}`}>
                    <td>
                      {MONTHS[p.month - 1]} {p.year}
                    </td>
                    <td>{netPay(p)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleDownload(p.month, p.year)}
                      >
                        <FaFileDownload style={{ marginRight: "6px" }} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function pageTitle() {
    if (id) {
      return (
        <h2 className="text-center mt-2">
          {isView ? "Employee Details" : "Update Employee"}
        </h2>
      );
    }
    return <h2 className="text-center mt-2">Add Employee</h2>;
  }

  return (
    <div className="container">
      <br />
      <br />
      <br />
      {admin && (
        <>
          <FaArrowLeft
            className="text-dark"
            style={{ cursor: "pointer", marginRight: "10px" }}
            onClick={() => navigator("/employees")}
          />
          Back
        </>
      )}

      <div className="row">
        <div className="col-md-10 offset-md-1">
          {pageTitle()}

          {notice && (
            <div className={`alert alert-${notice.type} mt-2`}>
              {notice.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {SECTIONS.map((section) => (
              <div className="card mb-4" key={section.title}>
                <div className="card-header fw-bold">{section.title}</div>
                <div className="card-body">
                  {section.fields.length > 0 && (
                    <div className="row">{section.fields.map(renderField)}</div>
                  )}
                  {section.list && renderList(section.list)}
                  {section.payslips && renderPayslips()}
                </div>
              </div>
            ))}

            {!isEdit && !isView && (
              <div className="card mb-4">
                <div className="card-header fw-bold">Login Account</div>
                <div className="card-body">
                  <div className="row">{renderField(ACCOUNT_FIELD)}</div>
                  <div className="form-text">
                    The employee logs in with the company email or employment
                    code and this password.
                  </div>
                </div>
              </div>
            )}

            {!isView && (
              <div className="d-grid d-md-block mb-4">
                <button className="btn btn-dark" type="submit">
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeComponent;
