import React from "react";
import Section from "components/Section";
import Title from "components/Title";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import Button from "components/Button";
import { useNavigate } from "react-router-dom";
import useGraphqlClient, { gql } from "lib/useGraphqlClient";
import {
  CHORES_QUERY,
  NAVBAR_COMPANIES_QUERY,
  REMINDERS_QUERY,
} from "components/NavBar/NavBar";

const COMPANIES_QUERY = gql`
  {
    companies {
      id
      name
    }
  }
`;

const CREATE_INVESTMENT_MUTATION = gql`
  mutation(
    $name: String!
    $companyId: ID!
    $invested: Float!
    $initialValuation: Float!
    $expirationDate: ISO8601Date
    $optionalField: String
  ) {
    createInvestment(
      input: {
        name: $name
        companyId: $companyId
        invested: $invested
        initialValuation: $initialValuation
        expirationDate: $expirationDate
        optionalField: $optionalField
      }
    ) {
      investment {
        id
      }
    }
  }
`;

function NewInvestmentPage() {
  const {
    data: { companies },
  } = useSWR(COMPANIES_QUERY);

  const { register, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const graphqlClient = useGraphqlClient();

  const onSubmit = async (attributes) => {
    await graphqlClient.request(CREATE_INVESTMENT_MUTATION, {
      ...attributes,
      invested: Number(attributes.invested),
      initialValuation: Number(attributes.initialValuation),
      expirationDate: attributes.expirationDate || null,
    });
    mutate(CHORES_QUERY);
    mutate(REMINDERS_QUERY);
    mutate(NAVBAR_COMPANIES_QUERY);
    navigate("/");
  };

  return (
    <Section>
      <Title>New Investment</Title>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            id="name"
            name="name"
            defaultValue="Series A"
            className="border p-2 w-64"
            placeholder="e.g. Series A, Series B, Loan, etc"
            ref={register({ required: true })}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="companyId"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Company:
          </label>
          <select
            className="border p-2 w-48"
            id="companyId"
            name="companyId"
            ref={register({ required: true })}
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="invested"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Invested:
          </label>
          <input
            id="invested"
            name="invested"
            type="number"
            defaultValue="1000"
            className="border p-2 w-48"
            placeholder="e.g. 1000"
            ref={register({ required: true })}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="initialValuation"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Initial Valuation:
          </label>
          <input
            id="initialValuation"
            name="initialValuation"
            type="number"
            defaultValue="3000"
            className="border p-2 w-48"
            placeholder="e.g. 5000"
            ref={register({ required: true })}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="expirationDate"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Expiration Date:
          </label>
          <input
            id="expirationDate"
            name="expirationDate"
            type="date"
            defaultValue=""
            className="border p-2 w-48"
            ref={register}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="optionalField"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Optional Field:
            <em className="block font-normal text-xs">
              Leaving this blank will create a chore
            </em>
          </label>
          <input
            id="optionalField"
            name="optionalField"
            defaultValue=""
            className="border p-2 w-48"
            ref={register}
          />
        </div>
        <div>
          <Button type="submit" variant="primary" disabled={!formState.isValid}>
            Create
          </Button>
        </div>
      </form>
    </Section>
  );
}

export default NewInvestmentPage;
