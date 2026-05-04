import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("renders its children", () => {
    render(
      <Card>
        <span>hello world</span>
      </Card>,
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("applies the default classes", () => {
    const { container } = render(<Card>x</Card>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("rounded-2xl");
    expect(div.className).toContain("bg-white");
  });

  it("appends a custom className", () => {
    const { container } = render(<Card className="extra-class">x</Card>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("extra-class");
  });
});
