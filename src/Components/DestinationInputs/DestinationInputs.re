type state = {
  visibleInputs: int,
  calculating: bool,
};
type action =
  | AddNewInput
  | RemoveInput
  | CalculateDistance;

let initialState = {visibleInputs: 1, calculating: false};

let reducer = (state, action) => {
  switch (action) {
  | AddNewInput => {...state, visibleInputs: state.visibleInputs + 1}
  | RemoveInput => state
  | CalculateDistance => state
  };
};

let createInput = dispatch => dispatch(AddNewInput);

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);

  <form>
    {ReasonReact.array(
       Array.make(state.visibleInputs, <input type_="text" />),
     )}
    <button
      onClick={event => {
        ReactEvent.Mouse.preventDefault(event);
        createInput(dispatch);
      }}>
      {ReasonReact.string("Next destination")}
    </button>
    <button role="submit">
      {ReasonReact.string("Calculate Distance")}
    </button>
  </form>;
};