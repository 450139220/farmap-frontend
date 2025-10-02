import { useUser } from "@/store";

import MapContainer from "./Map";
import Slider from "./Slider";
import InfoWindow from "./InfoWindow";
import Upload from "./Upload";

function Map() {
  const farmList = useUser((state) => state.farms);
  const currentFarmId = useUser((state) => state.currentFarmId);

  return (
    <>
      <MapContainer />
      <Slider />
      <InfoWindow />
      <Upload />
    </>
  );
}

export default Map;
