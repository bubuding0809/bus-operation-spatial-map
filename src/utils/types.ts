export type FilterConfiguration = {
  selected: "eventFilter" | "driverFilter";
  eventFilter: {
    [key: string]: boolean;
  };
  driverFilter: {
    [key: string]: boolean;
  };
};
