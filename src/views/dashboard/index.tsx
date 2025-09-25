import { useCount } from "@/store";
import { Link } from "react-router";

function App() {
  const count = useCount((state) => state.count);
  const increaseCount = useCount((state) => state.increase);

  return (
    <>
      <div>hello:world</div>
      <div>zustand: {count}</div>
      <button onClick={increaseCount}>increase count</button>
      <Link to={"operations"}>operations</Link>
    </>
  );
}

export default App;
