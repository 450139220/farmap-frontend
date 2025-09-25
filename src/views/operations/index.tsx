import { useCount } from "@/store";

const Operations = () => {
  const count = useCount((state) => state.count);
  return (
    <>
      <div>operations</div>
      <div>{count}</div>{" "}
    </>
  );
};

export default Operations;
