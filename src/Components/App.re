[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

let wrapperStyles =
  ReactDOMRe.Style.make(~display="flex", ~justifyContent="space-around", ());
let buttonStyles = ReactDOMRe.Style.make(~marginTop=".35rem", ());

type state = {
  visibleInputs: int,
  calculations: int,
  lastStartingPoint: string,
  lastDestination: string,
  totalDistance: float,
  lastDistanceAdded: float,
};

type calculation =
  | AmountToAdd(float)
  | AmountToSubtract(float);

type action('event) =
  | AddNewInput
  | RemoveInput(calculation)
  | CalculateDistance
  | UpdateLastStartingPoint(ReactEvent.synthetic('event))
  | UpdateLastDestination(ReactEvent.synthetic('event))
  | IncreaseTotalDistance(calculation);

let initialState = {
  visibleInputs: 1,
  calculations: 0,
  totalDistance: 0.0,
  lastDistanceAdded: 0.0,
  lastStartingPoint: "",
  lastDestination: "",
};

let reducer = (state, action) => {
  switch (action) {
  | AddNewInput => {...state, visibleInputs: state.visibleInputs + 1}
  | RemoveInput(AmountToSubtract(amount)) => {
      ...state,
      totalDistance: state.totalDistance -. amount,
    }
  | CalculateDistance => {...state, calculations: state.calculations + 1}
  | UpdateLastStartingPoint(event) => {
      ...state,
      lastStartingPoint: ReactEvent.Synthetic.target(event)##value,
    }
  | UpdateLastDestination(event) => {
      ...state,
      lastDestination: ReactEvent.Synthetic.target(event)##value,
    }
  | IncreaseTotalDistance(AmountToAdd(amount)) => {
      ...state,
      totalDistance: state.totalDistance +. amount,
    }
  | _ => state
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

let undoLastCalculation = (event, dispatch) => ();

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);

  React.useEffect1(
    () => {
      let corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
      let distanceMatrixBaseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?";
      let apiKey = "AIzaSyDYDdl-3dUk1H59jTBcFU9KAd3UesUR9qE";
      let distanceMatrixFullUrl =
        corsAnywhereUrl
        ++ distanceMatrixBaseUrl
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
             let constructIncreaseTotalDistance = x =>
               IncreaseTotalDistance(AmountToAdd(x));

             let distance: string = [%bs.raw
               {|
                 (jsonResponse.rows.length && jsonResponse.rows[0].elements[0].distance.text) || "0"
                |}
             ];

             // Increase the total distance by the computed result
             distance
             |> String.split_on_char(' ')
             |> List.hd
             |> float_of_string
             |> constructIncreaseTotalDistance
             |> dispatch;

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
             dispatch
             handleLastStartingPointChange
             handleLastDestinationChange
             undoLastCalculation
           />,
         ),
       )}
      <button
        style=buttonStyles
        onClick={event => {
          ReactEvent.Mouse.preventDefault(event);
          calculateDistanceThenCreateNewInput(dispatch);
        }}>
        {ReasonReact.string("Next destination")}
      </button>
    </form>
    <TotalDistance distance={string_of_float(state.totalDistance)} />
  </div>;
};