import { useUser } from "@/store";

function Map() {
  const farmList = useUser((state) => state.farms);
  const currentFarmId = useUser((state) => state.currentFarmId);

  return (
    <>
      <div>hello:world</div>
      <div>current farm: {farmList.find((f) => f.id === currentFarmId)?.name}</div>
    </>
  );
}

export default Map;
