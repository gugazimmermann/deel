import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { adminBestClients, adminBestProfession } from "../services";
import Admin from "../pages/Admin";

const bestClients = [
  {
    id: "1",
    fullName: "Cliente Name 1",
    paid: 100,
  },
  {
    id: "2",
    fullName: "Cliente Name 2",
    paid: 90,
  },
  {
    id: "3",
    fullName: "Cliente Name 3",
    paid: 80,
  },
];

jest.mock("../services", () => ({
  adminBestClients: jest.fn(),
  adminBestProfession: jest.fn(),
}));

describe("Admin", () => {
  beforeEach(() => {
    adminBestClients.mockClear();
    adminBestProfession.mockClear();
  });

  test("should show error without start date", async () => {
    adminBestClients.mockResolvedValue(bestClients);
    render(<Admin />);
    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: "20240707" },
    });
    fireEvent.click(screen.getByTestId("button-best-clients"));
    expect(adminBestClients).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText("Must have start and end date")
      ).toBeInTheDocument();
    });
  });

  test("should show error without end date", async () => {
    adminBestClients.mockResolvedValue(bestClients);
    render(<Admin />);
    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: "20240707" },
    });
    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByTestId("button-best-clients"));
    expect(adminBestClients).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText("Must have start and end date")
      ).toBeInTheDocument();
    });
  });

  test("should list all contracts without limit", async () => {
    adminBestClients.mockResolvedValue([bestClients[0], bestClients[1]]);
    render(<Admin />);
    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: "20240101" },
    });
    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: "20240707" },
    });
    fireEvent.click(screen.getByTestId("button-best-clients"));
    expect(adminBestClients).toHaveBeenCalledWith(
      "2024-01-01",
      "2024-07-07",
      ""
    );
    await waitFor(() => {
      expect(screen.getByText("Cliente Name 2")).toBeInTheDocument();
    });
  });

  test("should list all contracts", async () => {
    adminBestClients.mockResolvedValue(bestClients);
    render(<Admin />);
    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: "20240101" },
    });
    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: "20240707" },
    });
    fireEvent.change(screen.getByTestId("limit"), { target: { value: "3" } });
    fireEvent.click(screen.getByTestId("button-best-clients"));
    expect(adminBestClients).toHaveBeenCalledWith(
      "2024-01-01",
      "2024-07-07",
      "3"
    );
    await waitFor(() => {
      expect(screen.getByText("Cliente Name 3")).toBeInTheDocument();
    });
  });

  test("should list get best orofession", async () => {
    adminBestProfession.mockResolvedValue({
      profession: "Full Stack",
      total: 999,
    });
    render(<Admin />);
    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: "20240101" },
    });
    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: "20240707" },
    });
    fireEvent.click(screen.getByTestId("button-best-profession"));
    expect(adminBestProfession).toHaveBeenCalledWith(
      "2024-01-01",
      "2024-07-07"
    );
    await waitFor(() => {
      expect(screen.getByText("$999.00")).toBeInTheDocument();
    });
  });
});
