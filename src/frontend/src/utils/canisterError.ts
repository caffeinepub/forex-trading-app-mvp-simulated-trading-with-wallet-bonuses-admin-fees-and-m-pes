/**
 * Extracts user-friendly error messages from canister/actor errors.
 * Handles trap messages and other error formats from the Internet Computer.
 */
export function extractCanisterError(error: unknown): string {
  if (!error) return "An unknown error occurred";

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message;

    // Extract trap messages (format: "Call was rejected: ... Reject text: ...")
    const trapMatch = message.match(/Reject text:\s*(.+?)(?:\n|$)/i);
    if (trapMatch?.[1]) {
      return trapMatch[1].trim();
    }

    // Extract other common patterns
    const callRejectedMatch = message.match(
      /Call was rejected:\s*(.+?)(?:\n|$)/i,
    );
    if (callRejectedMatch?.[1]) {
      return callRejectedMatch[1].trim();
    }

    // Return the full message if no pattern matched
    return message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle objects with message property
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return "An unexpected error occurred";
}

/**
 * Normalizes canister errors into user-friendly messages for specific contexts.
 */
export function normalizeTradeError(error: unknown): string {
  const rawMessage = extractCanisterError(error);

  // Map common backend errors to user-friendly messages
  if (rawMessage.includes("Insufficient balance")) {
    return "Insufficient balance for this trade. Please reduce the margin or deposit more funds.";
  }

  if (rawMessage.includes("Invalid forex pair")) {
    return "This trading pair is not supported. Please select a different instrument.";
  }

  if (rawMessage.includes("Unauthorized")) {
    return "You are not authorized to perform this action.";
  }

  if (rawMessage.includes("Trade does not exist")) {
    return "This trade no longer exists or has already been closed.";
  }

  if (rawMessage.includes("Trade already closed")) {
    return "This trade has already been closed.";
  }

  // Return the extracted message if no specific mapping
  return rawMessage;
}

/**
 * Normalizes quote polling errors into user-friendly messages.
 */
export function normalizeQuoteError(error: unknown): string {
  const rawMessage = extractCanisterError(error);

  if (rawMessage.includes("Invalid") || rawMessage.includes("unsupported")) {
    return "Quote unavailable for this instrument";
  }

  if (rawMessage.includes("Unauthorized")) {
    return "Authentication required to fetch quotes";
  }

  return "Unable to fetch current price";
}
