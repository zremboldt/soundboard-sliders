import { ControlSet } from "./control-set";

export default function App() {
  const lightColor = {
    green: "green-light",
    orange: "orange-light",
  };

  return (
    <div className="board">
      <ControlSet
        startingPosition={40}
        title={"Threshold"}
        increments={[54, 45, 36, 27, 18, 9, 0]}
        lightColor={lightColor.green}
      />
      <ControlSet
        startingPosition={90}
        title={"Range"}
        increments={[18, 15, 12, 9, 6, 3, 0]}
        lightColor={lightColor.orange}
      />
    </div>
  );
}
