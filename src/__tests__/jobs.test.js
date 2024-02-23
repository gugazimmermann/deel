import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as AppContext from "../context/AppContext";
import { jobsUnpaid, jobsPay } from "../services";
import Jobs from "../pages/Jobs";

const mockContext = { state: { profileID: "123" } };
jest.mock("../services", () => ({
  jobsUnpaid: jest.fn(),
  jobsPay: jest.fn(),
}));

describe("Jobs", () => {
  beforeEach(() => {
    jest.spyOn(AppContext, "useApp").mockImplementation(() => mockContext);
    jobsUnpaid.mockClear();
    jobsPay.mockClear();
  });

  test("should list all unpaid jobs", async () => {
    jobsUnpaid.mockResolvedValue([
      {
        id: 1,
        description: "Test Description",
        price: 999,
        paid: false,
        createdAt: "2025-01-01T12:00:00.000Z",
        ContractId: 1,
      },
    ]);
    render(<Jobs />);
    fireEvent.click(screen.getByTestId("button-jobs-unpaid"));
    expect(jobsUnpaid).toHaveBeenCalledWith("123");
    await waitFor(() => {
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  test("should show alert when unpaid job not found", async () => {
    jobsUnpaid.mockResolvedValue({ error: "Not Found" });
    render(<Jobs />);
    fireEvent.click(screen.getByTestId("button-jobs-unpaid"));
    expect(jobsUnpaid).toHaveBeenCalledWith("123");
    await waitFor(() => {
      expect(screen.getByText("Not Found")).toBeInTheDocument();
    });
  });

  test("should pay a job", async () => {
    jobsPay.mockResolvedValue({message: "Job Paid"});
    render(<Jobs />);
    fireEvent.change(screen.getByTestId("pay-job-id"), { target: { value: "1" } });
    fireEvent.click(screen.getByTestId("pay-job-submit"));
    expect(jobsPay).toHaveBeenCalledWith("123", "1");
    await waitFor(() => {
      expect(screen.getByText("Job Paid")).toBeInTheDocument();
    });
  });

  test("should show alert when job not found", async () => {
    jobsPay.mockResolvedValue({ error: "Not Found" });
    render(<Jobs />);
    fireEvent.change(screen.getByTestId("pay-job-id"), { target: { value: "1" } });
    fireEvent.click(screen.getByTestId("pay-job-submit"));
    expect(jobsPay).toHaveBeenCalledWith("123", "1");
    await waitFor(() => {
      expect(screen.getByText("Not Found")).toBeInTheDocument();
    });
  });
});
