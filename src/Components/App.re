[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

let wrapperStyles =
  ReactDOMRe.Style.make(~display="flex", ~justifyContent="space-around", ());

type state = {
  visibleInputs: int,
  calculations: int,
  lastStartingPoint: string,
  lastDestination: string,
};
type action('a) =
  | AddNewInput
  | RemoveInput
  | CalculateDistance
  | UpdateLastStartingPoint(ReactEvent.synthetic('a))
  | UpdateLastDestination(ReactEvent.synthetic('a));

let initialState = {
  visibleInputs: 1,
  calculations: 0,
  lastStartingPoint: "",
  lastDestination: "",
};

let reducer = (state, action) => {
  switch (action) {
  | AddNewInput => {...state, visibleInputs: state.visibleInputs + 1}
  | RemoveInput => state
  | CalculateDistance => {...state, calculations: state.calculations + 1}
  | UpdateLastStartingPoint(event) => {
      ...state,
      lastStartingPoint: ReactEvent.Synthetic.target(event)##value,
    }
  | UpdateLastDestination(event) => {
      ...state,
      lastDestination: ReactEvent.Synthetic.target(event)##value,
    }
  };
};

let calculateDistanceThenCreateNewInput = dispatch => {
  dispatch(AddNewInput);
  dispatch(CalculateDistance);
};

let handleLastStartingPointChange = (event, dispatch) => {
  ReactEvent.Synthetic.persist(event);
  dispatch(UpdateLastStartingPoint(event));
};

let handleLastDestinationChange = (event, dispatch) => {
  ReactEvent.Synthetic.persist(event);
  dispatch(UpdateLastDestination(event));
};

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);

  React.useEffect1(
    () => {
      let distanceMatrixBaseUrl = "http://maps.googleapis.com/maps/api/distancematrix/json?";
      let apiKey = "AIzaSyDYDdl-3dUk1H59jTBcFU9KAd3UesUR9qE";
      let distanceMatrixFullUrl =
        distanceMatrixBaseUrl
        ++ "origins="
        ++ state.lastStartingPoint
        ++ "&destinations="
        ++ state.lastDestination
        ++ "&units=imperial"
        ++ "&key="
        ++ apiKey;

      Js.Promise.(
        fetch(distanceMatrixFullUrl)
        |> then_(response => response##json())
        |> then_(jsonResponse => {
             //  setState(_previousState => LoadedDogs(jsonResponse##message));
             Js.log(jsonResponse);
             Js.Promise.resolve();
           })
        |> catch(_err => {
             //  setState(_previousState => ErrorFetchingDogs);
             Js.log(_err);
             Js.Promise.resolve();
           })
        |> ignore
      );

      None;
    },
    [|state.calculations|],
  );

  <div style=wrapperStyles>
    <form>
      {ReasonReact.array(
         Array.make(
           state.visibleInputs,
           <DestinationInputs
             handleLastStartingPointChange
             handleLastDestinationChange
             dispatch
           />,
         ),
       )}
      <button
        onClick={event => {
          ReactEvent.Mouse.preventDefault(event);
          calculateDistanceThenCreateNewInput(dispatch);
        }}>
        {ReasonReact.string("Next destination")}
      </button>
    </form>
    <TotalDistance totalDistance="0" />
  </div>;
};