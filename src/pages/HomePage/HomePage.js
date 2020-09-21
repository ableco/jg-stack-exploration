import React, { createElement } from "react";
import Section from "components/Section";
import useSWR from "swr";
import Title from "components/Title";
import numbro from "numbro";
import { gql } from "lib/useGraphqlClient";

function TableCell({ children, as = "td" }) {
  return createElement(as, { className: "p-2", children });
}

const INVESTMENTS_QUERY = gql`
  {
    investments {
      id
      name
      invested
      value
      expirationDate
      optionalField
      company {
        name
      }
    }
  }
`;

function HomePage() {
  const {
    data: { investments },
  } = useSWR(INVESTMENTS_QUERY);

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
                name,
                company,
                invested,
                value,
                expirationDate,
                optionalField,
              }) => {
                return (
                  <tr key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{company.name}</TableCell>
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
                );
              }
            )}
          </tbody>
        </table>
      </Section>
    </>
  );
}

export default HomePage;
