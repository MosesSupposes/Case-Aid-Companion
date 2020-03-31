[@react.component]
let make =
    (~handleLastStartingPointChange, ~handleLastDestinationChange, ~dispatch) => {
  <div>
    <label>
      {ReasonReact.string("From:")}
      <input
        type_="text"
        className="from"
        onChange={event => handleLastStartingPointChange(event, dispatch)}
      />
    </label>
    <label>
      {ReasonReact.string("To:")}
      <input
        type_="text"
        className="to"
        onChange={event => handleLastDestinationChange(event, dispatch)}
      />
    </label>
  </div>;
};