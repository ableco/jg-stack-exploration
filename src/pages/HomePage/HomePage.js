import React, { createElement } from "react";
import Section from "components/Section";
import useSWR from "swr";
import Title from "components/Title";
import numbro from "numbro";

function TableCell({ children, as = "td" }) {
  return createElement(as, { className: "p-2", children });
}

function HomePage() {
  const { data: companies } = useSWR("/companies");
  const { data: investments } = useSWR("/investments");

  return (
    <>
      <Section>
        <Title>Companies</Title>
        <ul className="flex flex-row flex-wrap mt-4">
          {companies.map(({ id, name }) => (
            <li key={id} className="p-2 bg-indigo-800 text-white mr-2">
              {name}
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <Title>Investments</Title>
        <table className="table-auto">
          <thead>
            <tr>
              <TableCell as="th">Name</TableCell>
              <TableCell as="th">Invested</TableCell>
              <TableCell as="th">Expiration Date</TableCell>
              <TableCell as="th">Optional Field</TableCell>
            </tr>
          </thead>
          <tbody>
            {investments.map(
              ({ id, name, invested, expirationDate, optionalField }) => (
                <tr key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{numbro(invested).formatCurrency()}</TableCell>
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
