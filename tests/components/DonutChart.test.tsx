import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DonutChart } from "@/components/ui/DonutChart";
import type { Budget } from "@/lib/types";

const budgets: Budget[] = [
  { category: "A", maximum: 100, spent: 50, theme: "green" },
  { category: "B", maximum: 100, spent: 50, theme: "yellow" },
];

describe("DonutChart", () => {
  it("renders an svg with the configured size", () => {
    const { container } = render(<DonutChart budgets={budgets} size={200} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("width")).toBe("200");
    expect(svg?.getAttribute("height")).toBe("200");
  });

  it("renders one background circle plus a circle per non-zero budget", () => {
    const { container } = render(<DonutChart budgets={budgets} />);
    expect(container.querySelectorAll("circle")).toHaveLength(3);
  });

  it("skips segments with zero spend", () => {
    const { container } = render(
      <DonutChart
        budgets={[
          { category: "A", maximum: 100, spent: 0, theme: "green" },
          { category: "B", maximum: 100, spent: 100, theme: "yellow" },
        ]}
      />,
    );
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("renders just the background circle when there is no spend", () => {
    const { container } = render(<DonutChart budgets={[]} />);
    expect(container.querySelectorAll("circle")).toHaveLength(1);
  });
});
