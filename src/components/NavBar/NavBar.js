import React, { forwardRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "components/Button";
import AuthContext from "components/AuthContext";
import Dropdown from "components/Dropdown";
import useSWR from "swr";
import { gql } from "lib/useGraphqlClient";

const NAVBAR_QUERY = gql`
  {
    navbar {
      chores {
        id
        investment {
          id
          name
        }
      }

      reminders {
        id
        investment {
          id
          name
          expirationDate
        }
      }

      companies {
        id
        name
        value
      }
    }
  }
`;

function ChoresWidget({ chores }) {
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

function RemindersWidget({ reminders }) {
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

function CompaniesWidget({ companies }) {
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

  const {
    data: {
      navbar: { companies, chores, reminders },
    },
  } = useSWR(NAVBAR_QUERY);

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
          <ChoresWidget chores={chores} />
          <RemindersWidget reminders={reminders} />
          <CompaniesWidget companies={companies} />
          <Button variant="secondary" onClick={handleLogout} className="ml-16">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(NavBar);
export { NAVBAR_QUERY };
