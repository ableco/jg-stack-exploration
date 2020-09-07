import React, { createElement, useMemo } from "react";
import Section from "components/Section";
import useSWR from "swr";
import Title from "components/Title";
import numbro from "numbro";

function TableCell({ children, as = "td" }) {
  return createElement(as, { className: "p-2", children });
}

function HomePage() {
  const {
    data: { investments, companies },
  } = useSWR("/investments?include=company");

  const companyById = useMemo(() => {
    const object = {};
    companies.forEach((company) => {
      object[company.id] = company;
    });
    return object;
  }, [companies]);

  return (
    <>
      <Section>
        <Title>Investments</Title>
        <table className="table-auto">
          <thead>
            <tr>
              <TableCell as="th">Name</TableCell>
              <TableCell as="th">Company</TableCell>
              <TableCell as="th">Invested</TableCell>
              <TableCell as="th">Value</TableCell>
              <TableCell as="th">Expiration Date</TableCell>
              <TableCell as="th">Optional Field</TableCell>
            </tr>
          </thead>
          <tbody>
            {investments.map(
              ({
                id,
                companyId,
                name,
                invested,
                value,
                expirationDate,
                optionalField,
              }) => (
                <tr key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{companyById[companyId].name}</TableCell>
                  <TableCell>{numbro(invested).formatCurrency()}</TableCell>
                  <TableCell>{numbro(value).formatCurrency()}</TableCell>
                  <TableCell>{expirationDate}</TableCell>
                  <TableCell>
                    {optionalField ? (
                      optionalField
                    ) : (
                      <span className="text-gray-400">none</span>
                    )}
                  </TableCell>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Section>
    </>
  );
}

export default HomePage;
