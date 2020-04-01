let wrapperStyles = ReactDOMRe.Style.make(~margin=".75rem 0", ());
let inputStyles = ReactDOMRe.Style.make(~margin="0 .5rem", ());

[@react.component]
let make =
    (
      ~dispatch,
      ~handleLastStartingPointChange,
      ~handleLastDestinationChange,
      ~undoLastCalculation,
    ) => {
  <div style=wrapperStyles>
    <label>
      {ReasonReact.string("From:")}
      <input
        style=inputStyles
        type_="text"
        className="from"
        onChange={event => handleLastStartingPointChange(event, dispatch)}
      />
    </label>
    <label>
      {ReasonReact.string("To:")}
      <input
        style=inputStyles
        type_="text"
        className="to"
        onChange={event => handleLastDestinationChange(event, dispatch)}
      />
    </label>
  </div>;
};