import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as AppContext from "../context/AppContext";
import { balancesDeposit } from "../services";
import Balances from "../pages/Balances";

const mockContext = { state: { profileID: "123" } };
jest.mock("../services", () => ({
  balancesDeposit: jest.fn(),
}));

describe("Balances", () => {
  beforeEach(() => {
    jest.spyOn(AppContext, "useApp").mockImplementation(() => mockContext);
    balancesDeposit.mockClear();
  });

  test("should add amount to balance", async () => {
    balancesDeposit.mockResolvedValue({newBalance: 1000});
    render(<Balances />);
    fireEvent.change(screen.getByTestId("balances-user-id"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("balances-amount"), { target: { value: "100" } });
    fireEvent.click(screen.getByTestId("balances-submit"));
    expect(balancesDeposit).toHaveBeenCalledWith("123", "1", "100");
    await waitFor(() => {
      expect(screen.getByText("$1,000.00")).toBeInTheDocument();
    });
  });

  test("should show alert when missing amount", async () => {
    balancesDeposit.mockResolvedValue({ error: "Missing Amount" });
    render(<Balances />);
    fireEvent.change(screen.getByTestId("balances-user-id"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("balances-amount"), { target: { value: null } });
    fireEvent.click(screen.getByTestId("balances-submit"));
    expect(balancesDeposit).toHaveBeenCalledWith( "123", "1", "");
    await waitFor(() => {
      expect(screen.getByText("Missing Amount")).toBeInTheDocument();
    });
  });
});
