[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

type state = {
  visibleInputs: int,
  calculating: bool,
  lastStartingPoint: string,
  lastDestination: string,
};
type action =
  | AddNewInput
  | RemoveInput
  | CalculateDistance;

let initialState = {
  visibleInputs: 1,
  calculating: false,
  lastStartingPoint: "",
  lastDestination: "",
};

let reducer = (state, action) => {
  switch (action) {
  | AddNewInput => {...state, visibleInputs: state.visibleInputs + 1}
  | RemoveInput => state
  | CalculateDistance => {...state, calculating: !state.calculating}
  };
};

let calculateDistanceThenCreateNewInput = dispatch => {
  dispatch(AddNewInput);
  dispatch(CalculateDistance);
};

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);

  React.useEffect1(
    () => {
      let allStartingPoints: array('a) = [%bs.raw
        {|
          document.querySelectorAll(".from")
        |}
      ];

      let allDestinations: array('a) = [%bs.raw
        {|
          document.querySelectorAll(".to")
        |}
      ];
      let lastStartingPoint = allStartingPoints[Array.length(
                                                  allStartingPoints,
                                                )
                                                - 1];
      let lastDestination = allDestinations[Array.length(allDestinations) - 1];

      Js.log(lastStartingPoint);
      Js.log(lastDestination);

      let distanceMatrixBaseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?";
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
        fetch("https://dog.ceo/api/breeds/image/random/3")
        |> then_(response => response##json())
        |> then_(jsonResponse => {
             //  setState(_previousState => LoadedDogs(jsonResponse##message));
             Js.Promise.resolve()
           })
        |> catch(_err => {
             //  setState(_previousState => ErrorFetchingDogs);
             Js.Promise.resolve()
           })
        |> ignore
      );

      None;
    },
    [|state.calculating|],
  );

  <form>
    {ReasonReact.array(
       Array.make(
         state.visibleInputs,
         <div>
           <label>
             {ReasonReact.string("From:")}
             <input type_="text" className="from" />
           </label>
           <label>
             {ReasonReact.string("To:")}
             <input type_="text" className="to" />
           </label>
         </div>,
       ),
     )}
    <button
      onClick={event => {
        ReactEvent.Mouse.preventDefault(event);
        calculateDistanceThenCreateNewInput(dispatch);
      }}>
      {ReasonReact.string("Next destination")}
    </button>
  </form>;
};