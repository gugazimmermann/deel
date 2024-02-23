import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as AppContext from "../context/AppContext";
import { contractsAll, contractById } from "../services";
import Contracts from "../pages/Contracts";

const mockContext = { state: { profileID: "123" } };
jest.mock("../services", () => ({
  contractsAll: jest.fn(),
  contractById: jest.fn(),
}));

describe("Contracts", () => {
  beforeEach(() => {
    jest.spyOn(AppContext, "useApp").mockImplementation(() => mockContext);
    contractsAll.mockClear();
    contractById.mockClear();
  });

  test("should list all contracts", async () => {
    contractsAll.mockResolvedValue([
      {
        id: "1",
        terms: "Test Term",
        createdAt: "2024-01-01T00:00:00Z",
        ContractorId: "2",
        ClientId: "3",
      },
    ]);
    render(<Contracts />);
    fireEvent.click(screen.getByTestId("button-get-contracts"));
    expect(contractsAll).toHaveBeenCalledWith("123");
    await waitFor(() => {
      expect(screen.getByText("Test Term")).toBeInTheDocument();
    });
  });

  test("should show alert when get contracts not found", async () => {
    contractsAll.mockResolvedValue({ error: "Not Found" });
    render(<Contracts />);
    fireEvent.click(screen.getByTestId("button-get-contracts"));
    expect(contractsAll).toHaveBeenCalledWith("123");
    await waitFor(() => {
      expect(screen.getByText("Not Found")).toBeInTheDocument();
    });
  });

  test("should show contract by id", async () => {
    contractById.mockResolvedValue({
      id: "1",
      terms: "Test Term",
      createdAt: "2024-01-01T00:00:00Z",
      ContractorId: "2",
      ClientId: "3",
    });
    render(<Contracts />);
    fireEvent.change(screen.getByTestId("button-search-contract"), { target: { value: "1" } });
    fireEvent.click(screen.getByTestId("search-contract-submit"));
    expect(contractById).toHaveBeenCalledWith("123", "1");
    await waitFor(() => {
      expect(screen.getByText("Test Term")).toBeInTheDocument();
    });
  });

  test("should show alert when get contract not found", async () => {
    contractById.mockResolvedValue({ error: "Not Found" });
    render(<Contracts />);
    fireEvent.change(screen.getByTestId("button-search-contract"), { target: { value: "1" } });
    fireEvent.click(screen.getByTestId("search-contract-submit"));
    expect(contractById).toHaveBeenCalledWith("123", "1");
    await waitFor(() => {
      expect(screen.getByText("Not Found")).toBeInTheDocument();
    });
  });
});
