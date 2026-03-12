Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    console.log("Outlook add-in is ready.");
  }
});

function action(event) {
  Office.context.mailbox.item.body.setAsync(
    "<p>Hello from the add-in!</p>",
    { coercionType: Office.CoercionType.Html },
    function (result) {
      event.completed();
    }
  );
}

Office.actions.associate("action", action);
