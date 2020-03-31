let wrapperStyles =
  ReactDOMRe.Style.make(
    ~display="flex",
    ~justifyContent="center",
    ~alignItems="flex-start",
    (),
  );

[@react.component]
let make = (~distance) => {
  <div style=wrapperStyles>
    <div style={ReactDOMRe.Style.make(~margin="1rem 0", ())}>
      {React.string("Total Distatnce: " ++ distance ++ " miles")}
    </div>
  </div>;
};