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
    ~display="grid",
    ~gridTemplateColumns="2fr 1fr 1fr",
    ~gridTemplateRows="4fr 1fr",
    (),
  );
let nextDestinationButtonStyles =
  ReactDOMRe.Style.make(~gridRowStart="2", ~marginTop=".35rem", ());
let leftSideOfPageStyles = ReactDOMRe.Style.make(~gridColumnStart="1", ());
let middleOfPageStyles = ReactDOMRe.Style.make(~gridColumnStart="2", ());
let rightSideOfPageStyles =
  ReactDOMRe.Style.make(
    ~gridColumnStart="3",
    ~display="flex",
    ~flexDirection="column",
    ~justifyContent="space-between",
    ~alignItems="center",
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
};

type calculation =
  | AmountToAdd(float)
  | AmountToSubtract(float);

type action('event) =
  | AddNewInput
  | RemoveInputAndSubtractFromTotalDistance(calculation)
  | CalculateDistance
  | UpdateLastStartingPoint(ReactEvent.synthetic('event))
  | UpdateLastDestination(ReactEvent.synthetic('event))
  | IncreaseTotalDistance(calculation)
  | Reset;

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
};

let reducer = (state, action) => {
  switch (action) {
  | AddNewInput => {...state, visibleInputs: state.visibleInputs + 1}
  | RemoveInputAndSubtractFromTotalDistance(AmountToSubtract(amount)) => {
      ...state,
      totalDistance: state.totalDistance -. amount,
      visibleInputs:
        state.visibleInputs > 0
          ? state.visibleInputs - 1 : state.visibleInputs,
    }

  /*  This triggers the useEffect to run, which, in turn, reads from the last
      starting point and the last destination, and calculates the distance between
      the two.
      */
  | CalculateDistance => {...state, calculations: state.calculations + 1}
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
  | Reset => initialState
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
  |> (x => RemoveInputAndSubtractFromTotalDistance(x))
  |> dispatch;
};

let renderEachCalculation = (stack: Stack.t(float)) => {
  let arr = ref([||]);
  Stack.iter(x => {arr := Belt.Array.concat([|x|], arr^)}, stack);

  // Shift each index of the array down one. This is done to keep
  // the displayed calculation on the same level as the inputs it's
  // attached to.
  arr :=
    Belt.Array.mapWithIndex(arr^, (i, value) =>
      if (i == Array.length(arr^) - 1) {
        0.0;
      } else {
        arr^[i + 1];
      }
    );

  ReasonReact.array(
    Array.map(
      c =>
        <div
          style={ReactDOMRe.Style.make(
            ~position="relative",
            ~top="12.5px",
            ~marginBottom="13px",
            (),
          )}>
          {ReasonReact.string(Js.Float.toString(c) ++ " mi.")}
        </div>,
      arr.contents,
    ),
  );
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
                  (jsonResponse.rows.length && jsonResponse.rows[0].elements[0].distance.text) || "0.0"
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
    <form style=leftSideOfPageStyles>
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
    // <div style=middleOfPageStyles>
    //   {renderEachCalculation(state.everyCalculation)}
    // </div>
    <div style=rightSideOfPageStyles>
      <TotalDistance
        // distance={Js.Float.toString(Js.Float.toFixed(state.totalDistance))}
        // distance={Js.Float.toFixed(state.totalDistance)}
        distance={Js.Float.toFixedWithPrecision(
          state.totalDistance,
          ~digits=2,
        )}
      />
      <UndoButton
        undoLastCalculation={event =>
          undoLastCalculation(event, dispatch, state)
        }
      />
    </div>
  </div>;
};