import { render, screen } from "@testing-library/react";
import { ChatMessage } from "../chat-message";
import type { Message } from "../chat-message";

describe("ChatMessage", () => {
  const mockMessage: Message = {
    content: "Hello, this is a test message",
    role: "user" as const,
    timestamp: "2024-03-20T12:00:00Z",
    status: "delivered" as const,
    attachments: [
      {
        type: "image" as const,
        url: "/test-image.jpg",
        name: "Test Image",
      },
    ],
  };

  it("renders user message correctly", () => {
    render(<ChatMessage message={mockMessage} />);
    expect(
      screen.getByText("Hello, this is a test message"),
    ).toBeInTheDocument();
    expect(screen.getByAltText("User")).toBeInTheDocument();
  });

  it("renders assistant message correctly", () => {
    const assistantMessage: Message = {
      ...mockMessage,
      role: "assistant" as const,
    };
    render(<ChatMessage message={assistantMessage} />);
    expect(
      screen.getByText("Hello, this is a test message"),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Sgt. Ken")).toBeInTheDocument();
  });

  it("displays message timestamp", () => {
    render(<ChatMessage message={mockMessage} />);
    const timestamp = new Date(mockMessage.timestamp).toLocaleTimeString();
    expect(screen.getByText(timestamp)).toBeInTheDocument();
  });

  it("renders attachments correctly", () => {
    render(<ChatMessage message={mockMessage} />);
    expect(screen.getByAltText("Test Image")).toBeInTheDocument();
  });
});
