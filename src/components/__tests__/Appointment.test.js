import React from "react";
import { render, act } from "@testing-library/react";
import Appointment from "components/Application";

describe("Appointment", () => {
  it("renders without crashing", async () => {
    await act( async () => {
      render(<Appointment />);
    })
  });
});