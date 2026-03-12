/* global Office */

Office.onReady(() => {});

function action(event) {
  try {
    const item = Office.context.mailbox.item;

    // Make sure we're in compose and sendAsync exists.
    if (!item || typeof item.sendAsync !== "function") {
      Office.context.mailbox.item?.notificationMessages?.replaceAsync(
        "ActionPerformanceNotification",
        {
          type: Office.MailboxEnums.ItemNotificationMessageType.ErrorMessage,
          message: "This command can only send from a message compose window.",
        }
      );
      return;
    }

    // Optional toast (may be visible briefly).
    item.notificationMessages.replaceAsync("ActionPerformanceNotification", {
      type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
      message: "Sending email...",
      icon: "Icon.80x80",
      persistent: false,
    });

    // Trigger send. Don't depend on the callback.
    item.sendAsync();
  } finally {
    // IMPORTANT: complete immediately so Outlook doesn't kill the function.
    event.completed();
  }
}

Office.actions.associate("action", action);
