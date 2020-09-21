import React, { forwardRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "components/AuthContext";
import Dropdown from "components/Dropdown";
import useSWR from "swr";
import { gql } from "lib/useGraphqlClient";

const CHORES_QUERY = gql`
  {
    chores {
      id
      investment {
        name
      }
    }
  }
`;

function ChoresWidget() {
  const {
    data: { chores },
  } = useSWR(CHORES_QUERY);

  return (
    <Dropdown title={<>Chores ({chores.length})</>}>
      {chores.length === 0 && <span>No chores</span>}
      <div className="w-64 overflow-auto" style={{ maxHeight: "500px" }}>
        {chores.map((chore) => (
          <div key={chore.id}>Missing field on {chore.investment.name}</div>
        ))}
      </div>
    </Dropdown>
  );
}

const REMINDERS_QUERY = gql`
  {
    reminders {
      id
      investment {
        name
        expirationDate
      }
    }
  }
`;

function RemindersWidget() {
  const {
    data: { reminders },
  } = useSWR(REMINDERS_QUERY);

  return (
    <Dropdown title={<>Reminders ({reminders.length})</>}>
      {reminders.length === 0 && <span>No reminders</span>}
      <div className="w-64 overflow-auto" style={{ maxHeight: "500px" }}>
        {reminders.map((reminder) => (
          <div key={reminder.id}>
            {reminder.investment.name} will expire at{" "}
            {reminder.investment.expirationDate}.
          </div>
        ))}
      </div>
    </Dropdown>
  );
}

const NAVBAR_COMPANIES_QUERY = gql`
  {
    companies {
      id
      name
      value
    }
  }
`;

function CompaniesWidget() {
  const {
    data: { companies },
  } = useSWR(NAVBAR_COMPANIES_QUERY);

  return (
    <Dropdown title="Companies">
      {companies.length === 0 && <span>No companies</span>}
      <div className="w-64 overflow-auto" style={{ maxHeight: "500px" }}>
        {companies.map((company) => (
          <div key={company.id}>
            Valuation of {company.name} is {company.value}
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
export { CHORES_QUERY, REMINDERS_QUERY, NAVBAR_COMPANIES_QUERY };
