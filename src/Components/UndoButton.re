let undoButtonStyles =
  ReactDOMRe.Style.make(
    ~color="white",
    ~backgroundColor="#cc3227",
    ~boxShadow="none",
    ~border="1px solid black",
    (),
  );

[@react.component]
let make = (~undoLastCalculation) => {
  <button style=undoButtonStyles> {ReasonReact.string("Undo")} </button>;
};