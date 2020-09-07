import React, { forwardRef, useContext, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "components/AuthContext";
import Dropdown from "components/Dropdown";
import useSWR from "swr";

function ChoresWidget() {
  const {
    data: { chores, investments },
  } = useSWR("/chores?include=investment");

  const investmentById = useMemo(() => {
    const object = {};
    investments.forEach((investment) => {
      object[investment.id] = investment;
    });
    return object;
  }, [investments]);

  return (
    <Dropdown title={<>Chores ({chores.length})</>}>
      {chores.length === 0 && <span>No chores</span>}
      <div className="w-64 overflow-auto" style={{ maxHeight: "500px" }}>
        {chores.map((chore) => (
          <div key={chore.id}>
            Missing field on {investmentById[chore.investmentId].name}
          </div>
        ))}
      </div>
    </Dropdown>
  );
}

function RemindersWidget() {
  const {
    data: { reminders, investments },
  } = useSWR("/reminders?include=investment");

  const investmentById = useMemo(() => {
    const object = {};
    investments.forEach((investment) => {
      object[investment.id] = investment;
    });
    return object;
  }, [investments]);

  return (
    <Dropdown title={<>Reminders ({reminders.length})</>}>
      {reminders.length === 0 && <span>No reminders</span>}
      <div className="w-64 overflow-auto" style={{ maxHeight: "500px" }}>
        {reminders.map((reminder) => (
          <div key={reminder.id}>
            {investmentById[reminder.investmentId].name} will expire at{" "}
            {investmentById[reminder.investmentId].expirationDate}.
          </div>
        ))}
      </div>
    </Dropdown>
  );
}

function CompaniesWidget() {
  const {
    data: { companies },
  } = useSWR("/companies");

  return (
    <Dropdown title="Companies">
      {companies.length === 0 && <span>No companies</span>}
      <div className="w-64 overflow-auto" style={{ maxHeight: "500px" }}>
        {companies.map((company) => (
          <div key={company.id}>
            Valuation of {company.name} is {company.valuation}
          </div>
        ))}
      </div>
    </Dropdown>
  );
}

function NavBar(_props, ref) {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed py-4 px-8 bg-white w-full z-50" ref={ref}>
      <div className="flex">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-indigo-800 underline mr-4">
            Home
          </Link>
          <Link
            to="/new-investment"
            className="font-bold text-indigo-800 underline"
          >
            New Investment
          </Link>
        </div>
        <div className="flex items-center ml-auto">
          <ChoresWidget />
          <RemindersWidget />
          <CompaniesWidget />
          <Button variant="secondary" onClick={handleLogout} className="ml-16">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(NavBar);
