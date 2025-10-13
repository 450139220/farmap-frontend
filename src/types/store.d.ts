declare global {
    type Crop = {
        date: string;
        diseases: string;
        id: number;
        latitude: number;
        longitude: number;
        rate: number;
        size: number;
        url: string;
        yield: number;
    };
    type Location = {
        id: number;
        latitude: number;
        longitude: number;
    };
    type FarmState = {
        address: string;
        center: string;
        components: ("map" | "operations" | "weather" | "statistic")[];
        crops: Crop[];
        id: number;
        locations: Location[];
        name: string;
        // TODO: change this property every time adding a new farm type
        type: "citrus" | "plum";
        userId: number;
        username: UserState["username"];
        zoom: number;
    };

    type UserState = {
        username: string;
        role: "user" | "guest" | "admin" | "expert";
        farms: FarmState[];
        currentFarmId: number | undefined;
    };
    type UserAction = {
        login: (data: UserState) => void;
        logout: () => void;
        selectFarm: (id: number) => void;
    };
}

export {};
