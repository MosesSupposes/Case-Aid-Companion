/**
 * =============== Imports ===============
 *  */
[@bs.val]
external fetch: string => Js.Promise.t('a) = "fetch";

/**
 * =============== Styles ===============
 *  */

let wrapperStyles =
  ReactDOMRe.Style.make(
    ~display="flex",
    ~justifyContent="space-around",
    ~flexWrap="wrap",
    (),
  );
let nextDestinationButtonStyles =
  ReactDOMRe.Style.make(~marginTop=".35rem", ());
let undoButtonStyles = ReactDOMRe.Style.make(~flexBasis="100%", ());
let rightSideOfPageStyles =
  ReactDOMRe.Style.make(
    ~display="flex",
    ~flexDirection="column",
    ~alignItems="flex-end",
    (),
  );

/**
 * =============== Types ===============
 *  */

type state = {
  visibleInputs: int,
  calculations: int,
  lastStartingPoint: string,
  lastDestination: string,
  totalDistance: float,
  everyCalculation: Stack.t(float),
  lastDistanceSubtracted: option(float),
};

type calculation =
  | AmountToAdd(float)
  | AmountToSubtract(float);

type action('event) =
  | AddNewInput
  // TODO: rename this to RemoveInputAndSubtractCalculation
  | RemoveInput(calculation)
  | CalculateDistance
  | UpdateLastStartingPoint(ReactEvent.synthetic('event))
  | UpdateLastDestination(ReactEvent.synthetic('event))
  | IncreaseTotalDistance(calculation);

/**
 * =============== State / State Management ===============
 */

let initialState = {
  visibleInputs: 1,
  calculations: 0,
  totalDistance: 0.0,
  lastStartingPoint: "",
  lastDestination: "",
  everyCalculation: Stack.create(),
  lastDistanceSubtracted: None,
};

let reducer = (state, action) => {
  switch (action) {
  | AddNewInput => {...state, visibleInputs: state.visibleInputs + 1}
  | RemoveInput(AmountToSubtract(amount)) => {
      ...state,
      totalDistance: state.totalDistance -. amount,
      lastDistanceSubtracted: Some(amount),
      visibleInputs:
        state.visibleInputs > 0
          ? state.visibleInputs - 1 : state.visibleInputs,
    }

  /*  This triggers the useEffect to run, which, in turn, reads from the last
      starting point and the last destination, and calculates the distance between
      the two.
      */
  | CalculateDistance =>
    /* This variable determines whether or not we should calculate the next distance.
       The only case when we should not calculate the next distance is when the last
       amount subtracted is equal to the last item on the stack of every calculation.
       When this is the case, this means that the next time the user presses "Next Destination",
       the last amount that was subtracted will be added onto the total distance.
       */
    let shouldCalculate =
      switch (state.lastDistanceSubtracted) {
      | Some(value) when value == Stack.top(state.everyCalculation) => false
      | Some(_) => true
      | None => true
      };
    ();

    Js.log(Stack.top(state.everyCalculation));
    Js.log(state.lastDistanceSubtracted);
    shouldCalculate
      ? {...state, calculations: state.calculations + 1} : state;

  | UpdateLastStartingPoint(event) => {
      ...state,
      lastStartingPoint: ReactEvent.Synthetic.target(event)##value,
    }
  | UpdateLastDestination(event) => {
      ...state,
      lastDestination: ReactEvent.Synthetic.target(event)##value,
    }
  | IncreaseTotalDistance(AmountToAdd(amount)) =>
    Stack.push(amount, state.everyCalculation);
    {...state, totalDistance: state.totalDistance +. amount};
  | _ => state
  };
};

/**
 * =============== Helpers ===============
 */

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

let undoLastCalculation = (event, dispatch, state) => {
  let lastItemOnStack =
    Stack.is_empty(state.everyCalculation)
      ? None : Some(Stack.top(state.everyCalculation));

  // push 0.0 onto the stack if it's emptyy
  if (lastItemOnStack == None) {
    Stack.push(0.0, state.everyCalculation);
    ();
  };

  Stack.pop(state.everyCalculation)
  |> (x => AmountToSubtract(x))
  |> (x => RemoveInput(x))
  |> dispatch;
};

/**
 * =============== Main ===============
 */

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
             |> (x => IncreaseTotalDistance(AmountToAdd(x)))
             |> dispatch;

             Js.Promise.resolve();
           })
        |> catch(_err => {
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
           />,
         ),
       )}
      <button
        style=nextDestinationButtonStyles
        onClick={event => {
          ReactEvent.Mouse.preventDefault(event);
          calculateDistanceThenCreateNewInput(dispatch);
        }}>
        {ReasonReact.string("Next destination")}
      </button>
    </form>
    <div style=rightSideOfPageStyles>
      <TotalDistance distance={string_of_float(state.totalDistance)} />
      <UndoButton
        undoLastCalculation={event =>
          undoLastCalculation(event, dispatch, state)
        }
      />
    </div>
  </div>;
};