import React from "react";
import Section from "components/Section";
import Title from "components/Title";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Button from "components/Button";
import { useNavigate } from "react-router-dom";

function NewInvestmentPage() {
  const { data: companies } = useSWR("/companies");
  const { register, handleSubmit, formState } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();

  const onSubmit = async (attributes) => {
    await fetch("/investments", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "investments",
          attributes,
        },
      }),
    });
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
